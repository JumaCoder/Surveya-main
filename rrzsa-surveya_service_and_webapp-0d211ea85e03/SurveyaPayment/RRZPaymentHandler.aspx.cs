using Newtonsoft.Json.Linq;
using RRZTools;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace SurveyaPayment
{
    public partial class RRZPaymentHandler : System.Web.UI.Page
    {
        
        protected void Page_Load(object sender, EventArgs e)
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11;
            if (!IsPostBack)
            {

                string secret, companyPackageID = ""; 
                secret = Request.QueryString["p1"] != null ? Request.QueryString["p1"].ToString() : "";
                companyPackageID = Request.QueryString["p2"] != null ? Request.QueryString["p2"].ToString() : "";

                secret = secret.Replace(" ", "+");

                if (String.IsNullOrWhiteSpace(secret) || String.IsNullOrWhiteSpace(companyPackageID))
                {
                    lblStatus.Text = "Error not all parameters were specified";
                    return;
                }

                Helper.LogMessage("Calling Validate " + secret + " : " + companyPackageID);

                //ensure that the package is valid
                string result = ValidatePayment(secret, companyPackageID);
                if (Utils.IsError(result))
                {
                    lblStatus.Text = result;
                    return;
                }

            }
        }

        private void InitiatePaygatePayment(string amount, string email, string locale, string country, string currency, string reference, string secret)
        {
            lblStatus.Text = "Initiating Payment";
            Helper.LogMessage("AMOUNT "+amount);

            //TODO - remove this line for LIVE environment
            //value must be secret when in testing environment
            secret = "secret";

            string paygateID = ConfigurationManager.AppSettings["PaygateID"].ToString(); // Merchant paygate id will be used.
            string retURL = ConfigurationManager.AppSettings["ReturnURL"].ToString();
            string transactionDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            string checksum = CalculateMD5Hash(paygateID + reference + amount + currency + retURL + transactionDate + locale + country + email + secret);

            Helper.LogMessage("Checksum " + checksum);
            string itemsToPost = "AMOUNT=" + amount;
            itemsToPost += "&CHECKSUM=" + checksum;
            itemsToPost += "&COUNTRY=" + country;
            itemsToPost += "&CURRENCY=" + currency;
            itemsToPost += "&EMAIL=" + email;
            itemsToPost += "&LOCALE=" + locale;
            itemsToPost += "&PAYGATE_ID=" + paygateID;
            itemsToPost += "&REFERENCE=" + reference;
            itemsToPost += "&RETURN_URL=" + retURL;
            itemsToPost += "&TRANSACTION_DATE=" + transactionDate;
            Helper.LogMessage("Items to post " + itemsToPost);

            string baseAddress = ConfigurationManager.AppSettings["PaygateInitiateBasePath"].ToString();
            Helper.LogMessage("Base add " + baseAddress);

            const string contentType = "application/x-www-form-urlencoded";
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(baseAddress);
            request.Method = "POST";
            request.ContentType = contentType;
            request.ContentLength = itemsToPost.Length;

            request.Timeout = 30000;

            StreamWriter serverStream = new StreamWriter(request.GetRequestStream());
            serverStream.Write(itemsToPost);
            serverStream.Close();
            try
            {
                Helper.LogMessage("AFTER STREAM");
                var httpResponse = (HttpWebResponse)request.GetResponse();
                Helper.LogMessage("RESPONSE " + httpResponse);
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    Helper.LogMessage("BEFORE RESULT");
                    var result = streamReader.ReadToEnd();

                    Helper.LogMessage("RESULT 1 " + result);
                    if (result.ToLower().StartsWith("error"))
                    {
                        lblStatus.Text = result;
                    }
                    else
                    {
                        Helper.LogMessage("RESULT " + result);

                        string payRequestID = "";
                        string payRequestChecksum = "";
                        lblStatus.Text = "Please wait while we direct you to the payment portal...";
                        string[] resultData = result.Split('&');
                        foreach (string s in resultData)
                        {
                            if (s.Trim().StartsWith("PAY_REQUEST_ID"))
                            {
                                payRequestID = s.Substring(s.IndexOf("=") + 1).Trim();
                            }
                            else if (s.Trim().StartsWith("CHECKSUM"))
                            {
                                payRequestChecksum = s.Substring(s.IndexOf("=") + 1).Trim();
                            }
                        }
                        if (String.IsNullOrWhiteSpace(payRequestID) || String.IsNullOrWhiteSpace(payRequestChecksum))
                        {
                            lblStatus.Text = "Unexpected payment response found, please try again.";
                        }
                        else
                        {

                            using (Surveya_DevEntities entity = new Surveya_DevEntities())
                            {
                                Guid PaymentID ;
                                if (!Guid.TryParse(reference, out PaymentID))
                                {
                                   lblStatus.Text = "Payment record could not be found";
                                    return;
                                }

                                var curPayment = (from p in entity.PaymentHistories
                                                  where p.ID == PaymentID
                                                  select p).FirstOrDefault();

                                if (curPayment == null)
                                {
                                    lblStatus.Text = "Payment record could not be found";
                                    return;
                                }

                                //update the payment
                                curPayment.PayRequestID = payRequestID;
                                entity.PaymentHistories.Add(curPayment);
                                entity.Entry(curPayment).State = EntityState.Modified;
                                entity.SaveChanges();

                            }

                            ProcessPayment(payRequestID, payRequestChecksum);
                        }
                    }
                }
            }
            catch (Exception ee)
            {
                var error = ee.Message;
                lblStatus.Text = error;
            }
        }

        private void ProcessPayment(string payRequestID, string checksum)
        {
            lblStatus.Text = "Processing Payment";
            SortedList ourData = new SortedList();
            ourData.Add("PAY_REQUEST_ID", payRequestID);
            ourData.Add("CHECKSUM", checksum);

            string path = ConfigurationManager.AppSettings["PaygateProcessBasePath"].ToString();

            string dataResult = PreparePOSTForm(path, ourData);
            Page.Controls.Add(new LiteralControl(dataResult));
        }

        private static String PreparePOSTForm(string url, SortedList data)
        {
            //Set a name for the form
            string formID = "PAYMENTFORMRRZ";
            //Build the form using the specified data to be posted.
            StringBuilder strForm = new StringBuilder();
            strForm.Append("<form id=\"" + formID + "\" name=\"" +
                           formID + "\" action=\"" + url +
                           "\" method=\"POST\">");

            foreach (string key in data.Keys)
            {
                strForm.Append("<input type=\"hidden\" name=\"" + key +
                               "\" value=\"" + data[key].ToString() + "\">");
            }

            strForm.Append("</form>");
            //Build the JavaScript which will do the Posting operation.
            StringBuilder strScript = new StringBuilder();
            strScript.Append("<script language='javascript'>");
            strScript.Append("var v" + formID + " = document." +
                             formID + ";");
            strScript.Append("v" + formID + ".submit();");
            strScript.Append("</script>");
            //Return the form and the script concatenated.
            //(The order is important, Form then JavaScript)
            return strForm.ToString() + strScript.ToString();
        }

        private string CalculateMD5Hash(string input)
        {
            // step 1, calculate MD5 hash from input
            MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] inputBytes = Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);

            // step 2, convert byte array to hex string
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString();
        }

        //verify the users secret key
        private string VerifyUser(string secret)
        {
            string baseAddress = ConfigurationManager.AppSettings["ServiceAddress"].ToString() + "/GetUser";
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(baseAddress);
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.Timeout = 30000;

            string json = "{\"secretKey\":\"" + secret + "\"}";
            StreamWriter serverStream = new StreamWriter(request.GetRequestStream());
            serverStream.Write(json);
            serverStream.Close();
            try
            {
                var httpResponse = (HttpWebResponse)request.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();
                    var data = JObject.Parse(result);
                    string username = (string)data["RRZResult"];
                    if (Utils.IsError(username))
                    {
                        lblStatus.Text = Utils.CleanError(username);
                        //ErrorMessage.Visible = true;
                    }
                    else
                    {
                        FormsAuthentication.SetAuthCookie(username, false);
                        //create a cookie for the secret key
                        HttpCookie newCookie = new HttpCookie("secretKey");
                        newCookie.Path = "/";

                        Response.Cookies.Add(newCookie);
                        Response.Cookies["secretKey"].Value = secret;
                        Session["secretKey"] = secret;
                        return username;
                    }
                }
                return Utils.WrapError("");
            }
            catch (DbEntityValidationException ex)
            {
                string errors = Helper.GetCleanEntityValidationErrors(ex);
                Helper.LogError(errors, ex.ToString());
                return Utils.WrapError(ex.ToString());
            }
            catch (Exception ee)
            {
                Helper.LogError(ee.Message, ee.StackTrace);
                return Utils.WrapError(ee.Message);
            }

        }

        //verify the package / secret key
        private string ValidatePayment(string secret, string companyPackageID)
        {
            Helper.LogMessage("Validating Payment");
            lblStatus.Text = "Validating Payment";

            //ensure that the users secret is valid
            string userID = VerifyUser(secret);
            if (Utils.IsError(userID))
            {
                return userID;
            }

            Guid UserID;
            if (!Guid.TryParse(userID, out UserID))
            {
                return Utils.WrapError("User ID is not in the correct format");
            }
    
            //call the method to validate the payment
            string baseAddress = ConfigurationManager.AppSettings["ServiceAddress"].ToString() + "/ValidatePayment";
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(baseAddress);
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.Timeout = 30000;

            string json = "{\"secretKey\": \"" + secret + "\",\"companyPackageID\":\"" + companyPackageID + "\"}";
    
            StreamWriter serverStream = new StreamWriter(request.GetRequestStream());
            serverStream.Write(json);
            serverStream.Close();
      
            try
            {
                var httpResponse = (HttpWebResponse)request.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    //get the result from validate payment
                    var result = streamReader.ReadToEnd();
                    var data = JObject.Parse(result);
                    string resultString = (string)data["RRZResult"];
           
                    //if the result is an error
                    if (Utils.IsError(resultString))
                    {
                        lblStatus.Text = Utils.CleanError(resultString);
                        return Utils.WrapError(Utils.CleanError(resultString));
                        //ErrorMessage.Visible = true;
                    }
                    else
                    {
                        //get details back from validate payment in the service
                        var EditingItem = JObject.Parse(resultString);
                        var PaymentStatus = EditingItem.GetValue("PaymentStatus").ToString();
           
                        //if the validation was successful
                        if (PaymentStatus.Equals("Payment Started"))
                        {
                            //get details back from validate payment in the service
                            var locale = EditingItem.GetValue("Locale").ToString();
                            var currency = EditingItem.GetValue("Currency").ToString();
                            var country = EditingItem.GetValue("Country").ToString();
                            var billEmail = EditingItem.GetValue("BillEmail").ToString();
                        
                            //process the valid payment
                            var processPurchaseResult = ProcessPurchase(userID, companyPackageID, billEmail);
                            if (Utils.IsError(processPurchaseResult))
                            {
                                return processPurchaseResult;
                            }
              
                            //get the payment details back from the valid payment method
                            var resultObj = JObject.Parse(processPurchaseResult);
                            string paymentID = resultObj.GetValue("PaymentID").ToString();
                            string paymentAmount = resultObj.GetValue("PaymentAmount").ToString();
                      
                            //initiate the payment with paygate
                            InitiatePaygatePayment(paymentAmount, billEmail, locale, country, currency, paymentID, secret);
                        }

                    }
                }
                return Utils.WrapError("");
            }
            catch (DbEntityValidationException ex)
            {
                string errors = Helper.GetCleanEntityValidationErrors(ex);
                Helper.LogError(errors, ex.ToString());
                return Utils.WrapError(ex.ToString());
            }
            catch (Exception ee)
            {
                Helper.LogError(ee.Message, ee.StackTrace);
                return Utils.WrapError(ee.Message);
            }

        }

        //process the payment
        private string ProcessPurchase(string userID, string companyPackageID, string billEmail)
        {
            try {

                lblStatus.Text = "Validating Payment";

                Guid UserID;
                if (!Guid.TryParse(userID, out UserID))
                {
                    return Utils.WrapError("User ID is not in the correct format");
                }

                Guid CompanyPackageID;
                if (!Guid.TryParse(companyPackageID, out CompanyPackageID))
                {
                    return Utils.WrapError("Company Package ID is not in the correct format");
                }
    
                using (Surveya_DevEntities entity = new Surveya_DevEntities())
                {
                    //retrieve the package
                    var curPackage = (from p in entity.CompanyPackages
                                      where p.ID == CompanyPackageID
                                       select p).FirstOrDefault();

                    if (curPackage == null)
                    {
                        return Utils.WrapError("The company package cannot be found");
                    }

                    var curInvoice = (from i in entity.Invoices
                                          where i.CompanyPackageID == CompanyPackageID
                                          select i).FirstOrDefault();

                    if (curInvoice == null)
                    {
                        return Utils.WrapError("The invoice for this package cannot be found");
                    }

                    //calculate the price to pay
                    decimal StartingPrice = curPackage.Price.Value;
                    decimal Discount = 0;
                    if (curPackage.HasDiscount.Value && curPackage.DiscountValue.Value > 0)
                    {
                        Discount = curPackage.DiscountValue.Value;
                    }
                    decimal FinalPrice = StartingPrice - Discount;

                    //check for any previous payments
                    var curPayments = (from p in entity.PaymentHistories
                                       where p.CompanyPackageID == CompanyPackageID && p.PaymentStatus == "Payment Successful"
                                       select p).ToList();

                    decimal curPaymentsAmount = 0;
                    if (curPayments != null && curPayments.Count() > 0)
                    {
                        foreach (var p in curPayments)
                        {
                            curPaymentsAmount += p.AmountPaid;
                        }
                    }

                    Helper.LogMessage("Already made payments value : " + curPaymentsAmount);

                    //deduct any payments from the final price
                    if (curPaymentsAmount > 0)
                    {
                        FinalPrice = FinalPrice - curPaymentsAmount;
                    }

                    //create a new payment
                    var newPay = new PaymentHistory();
                    Guid PaymentID = Guid.NewGuid();
                    newPay.ID = PaymentID;
                    newPay.CompanyPackageID = CompanyPackageID;
                    newPay.DateStarted = DateTime.Now;
                    newPay.AmountPaid = FinalPrice;
                    newPay.InvoiceID = curInvoice.ID;
                    newPay.PaymentEmail = billEmail;
                    newPay.PaymentType = "CC";
                    entity.PaymentHistories.Add(newPay);
                    entity.SaveChanges();

                    //return the purchase details
                    dynamic returnItem = new JObject();
                    returnItem.Status = "Success";
                    returnItem.PaymentID = PaymentID;

                    //return the amount in cents for paygate to process
                    returnItem.PaymentAmount = (FinalPrice * 100);
                    return returnItem.ToString();
                }
            }
            catch (DbEntityValidationException ex)
            {
                string errors = Helper.GetCleanEntityValidationErrors(ex);
                Helper.LogError(errors, ex.ToString());
                return Utils.WrapError(errors);
            }
            catch (Exception ee)
            {
                Helper.LogError(ee.Message, ee.StackTrace);
                return Utils.WrapError(ee.Message);
            }
        }
    }
}