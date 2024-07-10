using Newtonsoft.Json.Linq;
using RRZTools;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SurveyaPayment
{
    public partial class RRZPaymentStatus : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //if its the first time the page is loading
            if (!Page.IsPostBack)
            {
                string transactionStatus = Request.Form["TRANSACTION_STATUS"];
                string payRequestID = Request.Form["PAY_REQUEST_ID"];

                Helper.LogMessage("TRANSACTION_STATUS :" + Request.Form["TRANSACTION_STATUS"]);
                Helper.LogMessage("AUTH_CODE :" + Request.Form["PAY_REQUEST_ID"]);

                string paymentMsg = "";
                /* 
                TRANSACTION_STATUS
                0   Not Done
                1   Approved
                2   Declined
                3   Cancelled
                4   User Cancelled
                 */
                if (transactionStatus.Equals("0"))
                {
                    paymentMsg = "Payment Failed";
                }
                else if (transactionStatus.Equals("1"))
                {
                    paymentMsg = "Payment Successful";
                }
                else if (transactionStatus.Equals("2"))
                {
                    paymentMsg = "Payment Declined";
                }
                else if (transactionStatus.Equals("3"))
                {
                    paymentMsg = "Payment Cancelled";
                }
                else if (transactionStatus.Equals("4"))
                {
                    paymentMsg = "Payment Cancelled";
                }

                lblStatus.Text = paymentMsg;

                using (Surveya_DevEntities entity = new Surveya_DevEntities())
                {
                    Helper.LogMessage("Checking information");
                    var curPayment = (from p in entity.PaymentHistories
                                      where p.PayRequestID == payRequestID
                                      select p).FirstOrDefault();

                    if (curPayment == null)
                    {
                        lblStatus.Text = "Payment record could not be found";
                        return;
                    }
                    Helper.LogMessage("Got the payment history");

                    DateTime CurDate = DateTime.Now;

                    //update the payment
                    curPayment.TransactionStatus = transactionStatus;
                    curPayment.DateCompleted = CurDate;
                    curPayment.PaymentStatus = paymentMsg;
                    entity.PaymentHistories.Add(curPayment);
                    entity.Entry(curPayment).State = EntityState.Modified;

                    Helper.LogMessage("Updated the payment history details");

                    //update the package appropriately
                    var curPackage = (from p in entity.CompanyPackages
                                      where p.ID == curPayment.CompanyPackageID
                                      select p).FirstOrDefault();

                    if (curPackage != null)
                    {
                        Helper.LogMessage("There is a package");
                        curPackage.DateUpdated = CurDate;

                        if (transactionStatus.Equals("1"))
                        {
                            curPackage.PaymentStatus = "Payment Successful";
                            curPackage.PaymentErrorStatus = "Payment Successful";
                            curPackage.PaymentPending = false;
                            curPackage.IsActive = true;
                            curPackage.DateActivated = CurDate;
                            curPackage.DateUpdated = CurDate;

                            //get the cart for the users package, this cart contains all optional features selected by the user
                            var curCart = (from c in entity.CompanyCarts
                                           where c.CompanyPackageID == curPayment.CompanyPackageID
                                           select c).ToList();

                            //remove the details from the cart,if there are any
                            if (curCart != null && curCart.Count > 0)
                            {
                                entity.CompanyCarts.RemoveRange(curCart);
                            }

                            //get the company details needed for the receipt
                            var curDetails = (from c in entity.Companies
                                              where c.ID == curPackage.CompanyID
                                              select new
                                              {
                                                  c.CompanyName
                                              }).FirstOrDefault();

                            if (curDetails != null)
                            {
                                //create a receipt for the buyer and email to them
                                var newReceipt = new ReceiptHistory();
                                Guid ReceiptID = Guid.NewGuid();
                                newReceipt.ID = ReceiptID;
                                newReceipt.PaymentID = curPayment.ID;
                                newReceipt.CompanyPackageID = curPackage.ID;
                                newReceipt.ReceiptDate = CurDate;
                                newReceipt.ReceiptDescription = "Payment Successful";
                                newReceipt.PackageName = curPackage.PackageName;
                                newReceipt.CompanyID = curPackage.CompanyID;
                                newReceipt.CompanyName = curDetails.CompanyName;
                                newReceipt.EmailedTo = curPayment.PaymentEmail;
                                newReceipt.AmountPaid = curPayment.AmountPaid;
                                entity.ReceiptHistories.Add(newReceipt);

                                //get the company's logo
                                string surveyaThumbLogo = ConfigurationManager.AppSettings["defaultThumbLogoPath"].ToString();

                                //setup details based on which email is being sent
                                string baseEmail = Helper.RetrieveMailTemplate("EmailTemplate.html");
                                string contentEmail = Helper.RetrieveMailTemplate("Receipt.html");

                                baseEmail = baseEmail.Replace("[HeaderText]", "Receipt ");
                                baseEmail = baseEmail.Replace("[Content]", contentEmail);
                                baseEmail = baseEmail.Replace("[EmailAddress]", curPayment.PaymentEmail);
                                baseEmail = baseEmail.Replace("[CompanyName]", curDetails.CompanyName);
                                baseEmail = baseEmail.Replace("[SurveyaLogo]", surveyaThumbLogo);

                                //receipt info
                                baseEmail = baseEmail.Replace("[ReceiptDate]", CurDate.ToString("dd MMMM yyyy"));
                                baseEmail = baseEmail.Replace("[PurchaseAmount]", curPayment.AmountPaid + "");
                                baseEmail = baseEmail.Replace("[ReceiptID]", ReceiptID + "");
                                baseEmail = baseEmail.Replace("[PackageName]", curPackage.PackageName);

                                string sendmail = Helper.SendMail(curPayment.PaymentEmail, "Surveya Receipt", baseEmail, true);

                                if (Utils.IsError(sendmail))
                                {
                                    // return sendmail;
                                    Helper.LogMessage("Receipt " + ReceiptID + " could not be sent to " + curPayment.PaymentEmail);
                                }

                                string res2 = SystemAddCompanyPackageHistory(curPackage.ID + "", curPackage.CompanyID + "", "Payment made by " + curDetails.CompanyName + ". Payment via CC. Amount: " + curPayment.AmountPaid + " on " + CurDate.ToString("dd MMMM yyyy"));


                                string res = SystemAddCompanyPackageHistory(curPackage.ID + "", curPackage.CompanyID + "", curDetails.CompanyName + "'s package was activated on " + CurDate.ToString("dd MMMM yyyy") + ". Reason: Payment made via CC");

                                //CreateDefaultProject(secretKey, LoggedInUserID, curPackage.CompanyID);
                            }
                            else
                            {
                                Helper.LogMessage("Could not find bid and listing");
                            }
                        }
                        else
                        {
                            curPackage.PaymentStatus = "Pending Payment";
                            curPackage.PaymentErrorStatus = "Pending Payment";
                            curPackage.IsActive = false;
                            curPackage.DateUpdated = CurDate;
                        }
                        entity.CompanyPackages.Add(curPackage);
                        entity.Entry(curPackage).State = EntityState.Modified;
                    }

                    entity.SaveChanges();
                }
            }

        }

        //log the action performed on the company's package
        private string SystemAddCompanyPackageHistory(string companyPackageID, string companyID, string message)
        {
            try
            {
                //remove any extra whitespaces
                companyPackageID = TrimIfNotNull(companyPackageID);
                companyID = TrimIfNotNull(companyID);
                message = TrimIfNotNull(message);

                Guid CompanyPackageID;
                if (!Guid.TryParse(companyPackageID, out CompanyPackageID))
                {
                    return Utils.WrapError("Company Package ID is not in the correct format");
                }

                Guid CompanyID;
                if (!Guid.TryParse(companyID, out CompanyID))
                {
                    return Utils.WrapError("Company ID is not in the correct format");
                }

                if (string.IsNullOrWhiteSpace(message))
                {
                    return Utils.WrapError("Please ensure that you enter a message to log");
                }

                using (Surveya_DevEntities entity = new Surveya_DevEntities())
                {

                    var curCompany = (from c in entity.Companies
                                      where c.ID == CompanyID
                                      select c).FirstOrDefault();

                    if (curCompany == null)
                    {
                        return Utils.WrapError("The Company you are trying to log for cannot be found");
                    }

                    var curCompanyPackage = (from c in entity.CompanyPackages
                                             where c.ID == CompanyPackageID
                                             select c).FirstOrDefault();

                    if (curCompanyPackage == null)
                    {
                        return Utils.WrapError("The Company Package you are trying to log for cannot be found");
                    }

                    var newLog = new CompanyPackageHistory();
                    newLog.ID = Guid.NewGuid();
                    newLog.CompanyPackageID = CompanyPackageID;
                    newLog.CompanyID = CompanyID;
                    newLog.DateCreated = DateTime.Now;
                    newLog.Message = message;
                    entity.CompanyPackageHistories.Add(newLog);
                    entity.SaveChanges();
                }

                dynamic returnItem = new JObject();
                returnItem.Status = "Success";
                return returnItem.ToString();

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


        private string CreateDefaultProject(string secretKey, Guid LoggedInUserID, Guid CompanyID)
        {
            //call the method to validate the payment
            string baseAddress = ConfigurationManager.AppSettings["ServiceAddress"].ToString() + "/CreateDefaultProject";
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(baseAddress);
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.Timeout = 30000;

            string json = "{\"secretKey\": \"" + secretKey + "\",\"LoggedInUserID\":\"" + LoggedInUserID  + "\",\"CompanyID\":\"" + CompanyID + "\"}";

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
                        return Utils.WrapError("");
                    }
                }
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

        //trim the extra whitespaces if the value is not null
        private string TrimIfNotNull(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return value;
            }
            return value.Trim();
        }

        protected void btnClose_Click(object sender, EventArgs e)
        {
            string SurveyaURL = ConfigurationManager.AppSettings["ReturnToSurveyaURL"].ToString();
            Helper.LogMessage("Surveya URL " + SurveyaURL);
            Response.Redirect(SurveyaURL);
            return;
        }


    }
}