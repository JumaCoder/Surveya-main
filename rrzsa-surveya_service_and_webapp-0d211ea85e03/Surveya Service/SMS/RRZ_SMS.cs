using Newtonsoft.Json.Linq;
using RRZTools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data.Entity.Core.Objects;
using Surveya_Service;

namespace Surveya_Service.SMS
{

    public class RRZ_SMS
    {
        const int MaxSMSLength = 459; //max length allowed for SMS 
        SMSSettings _smsSettings;
        AppSettings _appSettings;

        public RRZ_SMS(
           

            /* SMS Settings */
            string smsApiBaseUrl, string smsApiSecret, string smsClientID, string smsCreditsEmail,
            string smsFooterText, bool includeSMSFooterAlways, bool includeSMSFooterIfSpace, bool smsTestMode,

            /* Email Settings*/
            string logFilePath, string emailTemplateBasePath, string overrideEmailAddress, string emailSenderName, string emailMailServer, int emailPort,
            string emailSender, string emailPassword, string bCCEmailAddress,

            /* App Settings*/
            string companyLogoURL, string appName
            )
        {
            

            //helper initialization
            /*
             Helper = new RRZ_Helper(logFilePath, emailTemplateBasePath, overrideEmailAddress, emailSenderName, emailMailServer, emailPort,
             emailSender, emailPassword, bCCEmailAddress);
            */

            //create instance of our settings class with the provided values
            _smsSettings = new SMSSettings();
            _smsSettings.APIBaseUrl = smsApiBaseUrl;
            _smsSettings.APISecret = smsApiSecret;
            _smsSettings.ClientID = smsClientID;
            _smsSettings.IncludeSMSFooterAlways = includeSMSFooterAlways;
            _smsSettings.IncludeSMSFooterIfSpace = includeSMSFooterIfSpace;
            _smsSettings.SMSCreditsEmail = smsCreditsEmail;
            _smsSettings.SMSFooterText = smsFooterText;
            _smsSettings.TestMode = smsTestMode;

            //save apps settings in class
            _appSettings = new AppSettings();
            _appSettings.CompanyLogo = companyLogoURL;
            _appSettings.AppName = appName;

        }




        public  string SendSMS(string cellNumber, string message, string relatedID, string type, string userid)
        {
            try
            {
                #region Validation

                if (string.IsNullOrWhiteSpace(cellNumber))
                {
                    return Utils.WrapError("Please ensure that you enter a valid cell number");
                }
                if (string.IsNullOrWhiteSpace(message))
                {
                    return Utils.WrapError("Please ensure that you enter a message");
                }
                Guid RelatedID = Guid.Empty;
                if (!Guid.TryParse(relatedID, out RelatedID))
                {
                    return Utils.WrapError("Related ID is not in the correct format");
                }

                Guid UserID = Guid.Empty;
                if (!Guid.TryParse(userid, out UserID))
                {
                    return Utils.WrapError("User ID is not in the correct format");
                }

                if (string.IsNullOrWhiteSpace(type) /*|| !Enum.IsDefined(typeof(SMSType), type)*/)
                {
                    //return Utils.WrapError("SMS Type is not correct");
                    return Utils.WrapError("SMS Type was not provided");
                }
                #endregion

                #region check sms credits and send email notification on credits running low
                //DELETED
                #endregion


                int creditsToUse = 0;

                bool sendEmail = false;
                Int64 numSuccess = 0;
                bool IsSent = false;
                Int64 creditsUsed = 0;
                string description = "";
                DateTime currentDate = DateTime.Now;

                    
                #region try send the sms
                SendSMS_SMSPortal_DTO smsResponse =  SendSMS_SMSPortal(cellNumber, message);
                if (smsResponse.IsError)
                {
                    Helper.LogError("SendSMS", smsResponse.Message);
                    description = smsResponse.Message;
                    sendEmail = true;
                }
                else
                {
                    numSuccess = smsResponse.Cost;
                    if (numSuccess > 0)
                    {
                        IsSent = true;
                        creditsUsed = smsResponse.Cost;
                        description = creditsUsed + (creditsUsed > 1 ? " Credits used" : " Credit used");

                        if (_smsSettings.TestMode)
                        {
                            description = description + ". TEST MODE ON - NO CREDITS USED";
                        }
                    }
                    else
                    {
                        description = "The SMS could not be sent";
                    }
                }

                #endregion

                #region add sms history
                //DELETED
                #endregion

                #region update number of sms's remaining
                //DELETED
                #endregion

                #region Email

                //if the email must be sent
                if (sendEmail)
                {

                    string companyLogo = _appSettings.CompanyLogo;
                    string appName = _appSettings.AppName;
                    string emailList = _smsSettings.SMSCreditsEmail;

                    //send the email
                    string baseEmail =  Helper.RetrieveMailTemplate("EmailTemplate.html");
                    string contentEmail =  Helper.RetrieveMailTemplate("SMSCreditsLow.html");
                    baseEmail = baseEmail.Replace("[CompanyLogo]", companyLogo);
                    baseEmail = baseEmail.Replace("[Content]", contentEmail);
                    baseEmail = baseEmail.Replace("[AppName]", appName);
                    baseEmail = baseEmail.Replace("[HeaderText]", "SMS Credits are running low");
                    baseEmail = baseEmail.Replace("[EmailAddress]", "");
                    baseEmail = baseEmail.Replace("[SMSCredits]", 0 + "");
                    baseEmail = baseEmail.Replace("[CopyrightYear]", DateTime.Now.Year + "");

                    string sendmail = Helper.SendMail(emailList, "SMS Credits are running low", baseEmail, true);
                    if (Utils.IsError(sendmail))
                    {
                        Helper.LogError("EMAIL ERROR", "SMS Credits are running low email could not be send to " + emailList);
                    }
                }


                #endregion

                dynamic returnItem = new JObject();
                returnItem.Status = IsSent ? "Success" : "Error";
                returnItem.Description = description;
                returnItem.IsSent = IsSent;
                returnItem.SmsCreditsRemaining = 999999;
                returnItem.TestMode = _smsSettings.TestMode;
                return returnItem.ToString();


            }
            catch (Exception e)
            {
                Helper.LogError(e.Message, e.StackTrace);
                if (e.InnerException != null)
                {
                    Helper.LogError(e.InnerException.ToString(), e.InnerException.Message + " " + e.InnerException.StackTrace);
                }
                //return Utils.WrapError(e.Message);
                return Utils.WrapError(e.Message + " " + (e.InnerException != null ? e.InnerException.Message + " " + e.InnerException.StackTrace : ""));
            }

        }

        //generate a token for SMS Portal, the token is valid for 24 hours
        private string GenerateToken_SMSPortal()
        {

            try
            {

                //encoded credentials to send through
                string encodedCredentials = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_smsSettings.ClientID + ":" + _smsSettings.APISecret));

                string baseAddress = _smsSettings.APIBaseUrl + "/Authentication";
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(baseAddress);
                request.Method = "GET";
                request.ContentType = "application/json";
                request.Timeout = 30000;
                request.Headers.Add("Authorization", "Basic " + encodedCredentials);

                var httpResponseRes =  request.GetResponse();
                var httpResponse = (HttpWebResponse)httpResponseRes;

                //if the response was successful
                if (httpResponse.StatusCode == HttpStatusCode.OK)
                {
                    using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                    {
                        var result =  streamReader.ReadToEnd();
                        dynamic RetrievedItem = JObject.Parse(result);
                        string token = RetrievedItem.token;

                        return token;
                    }
                }
                else
                {
                    Helper.LogError($"GenerateToken_SMSPortal - Authentication Token for SMS Portal could not be retrieved.", "Status Code = {httpResponse.StatusCode}. Status Description: {httpResponse.StatusDescription}");
                    return Utils.WrapError("Authentication Token could not be retrieved");
                }

            }
            catch (Exception e)
            {
                Helper.LogError("GenerateToken_SMSPortal - " + e.Message, e.StackTrace);
                if (e.InnerException != null)
                {
                    Helper.LogError(e.InnerException.ToString(), e.InnerException.Message + " " + e.InnerException.StackTrace);
                }
                return Utils.WrapError(e.Message);
            }




        }

        //get the users balance
        private GetBalance_SMSPortal_DTO GetBalance_SMSPortal()
        {
            GetBalance_SMSPortal_DTO smsResponse = new GetBalance_SMSPortal_DTO();

            //generate a SMS Portal token 
            string token =  GenerateToken_SMSPortal();
            if (Utils.IsError(token))
            {
                return smsResponse.CreateError(token);
            }


            try
            {

                //API call to SMS Portal
                string baseAddress = _smsSettings.APIBaseUrl + "/Balance";
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(baseAddress);
                request.Method = "GET";
                request.ContentType = "application/json";
                request.Timeout = 30000;
                request.Headers.Add("Authorization", "Bearer " + token);

                var httpResponseRes =  request.GetResponse();
                var httpResponse = (HttpWebResponse)httpResponseRes;


                //if the response was successful
                if (httpResponse.StatusCode == HttpStatusCode.OK)
                {
                    using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                    {
                        var result =  streamReader.ReadToEnd();
                        dynamic RetrievedItem = JObject.Parse(result);


                        var Balance = RetrievedItem.balance;

                        //create return item
                        smsResponse.Balance = Balance;
                        smsResponse.Token = token;
                        return smsResponse;
                    }
                }
                else
                {
                    Helper.LogError($"GetBalance_SMSPortal - Could not retrieve the SMS Portal Account Balance.", "Status Code = {httpResponse.StatusCode}. Status Description: {httpResponse.StatusDescription}");
                    return smsResponse.CreateError($"Could not retrieve the SMS Portal Account Balance");
                }

            }
            catch (Exception e)
            {
                Helper.LogError("GetBalance_SMSPortal - " + e.Message, e.StackTrace);
                if (e.InnerException != null)
                {
                    Helper.LogError(e.InnerException.ToString(), e.InnerException.Message + " " + e.InnerException.StackTrace);
                }
                return smsResponse.CreateError(e.Message);
            }



        }

        //send a sms through SMS Portal
        private SendSMS_SMSPortal_DTO SendSMS_SMSPortal(string cellNumber, string messageText)
        {

            SendSMS_SMSPortal_DTO smsReponse = new SendSMS_SMSPortal_DTO();
            //get the balance
            GetBalance_SMSPortal_DTO balanceCheck =  GetBalance_SMSPortal();
            if (balanceCheck.IsError)
            {
                return smsReponse.CreateError(balanceCheck.Message);
            }

            //ensure that there is enough balance to send SMS's
            if (balanceCheck.Balance <= 0)
            {
                return smsReponse.CreateError("You do not have enough credits to send the _smsSettings. Please contact your provider to purchase more credits");
            }

            string token = balanceCheck.Token;
            //if no token is provided, generate a new one
            if (string.IsNullOrWhiteSpace(token))
            {
                //generate a SMS Portal token 
                token = GenerateToken_SMSPortal();
                if (Utils.IsError(token))
                {
                    return smsReponse.CreateError(token);
                }
            }

            try
            {

                string baseAddress = _smsSettings.APIBaseUrl + "/bulkmessages";
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(baseAddress);
                request.Method = "POST";
                request.ContentType = "application/json";
                request.Timeout = 30000;
                request.Headers.Add("Authorization", "Bearer " + token);


                //Send Options 
                dynamic sendOptionsObject = new JObject();
                sendOptionsObject.TestMode = _smsSettings.TestMode;

                //Messages Object
                dynamic messageObject = new JObject();
                messageObject.Content = messageText;
                messageObject.Destination = cellNumber;


                //json data object to send
                dynamic jsonObject = new JObject();
                jsonObject.SendOptions = JToken.FromObject(sendOptionsObject);
                jsonObject.Messages = new JArray() { JToken.FromObject(messageObject) };

                //send data
                StreamWriter serverStream = new StreamWriter(request.GetRequestStream());
                serverStream.Write(jsonObject);
                serverStream.Close();

                var httpResponseRes =  request.GetResponse();
                var httpResponse = (HttpWebResponse)httpResponseRes;

                if (httpResponse.StatusCode == HttpStatusCode.Forbidden)
                {
                    Helper.LogError($"SendSMS_SMSPortal - Could not send SMS Portal SMS to {cellNumber}.", "Status Code = {httpResponse.StatusCode}. Status Description: {httpResponse.StatusDescription}");
                    return smsReponse.CreateError($"Could not send SMS Portal SMS to {cellNumber}. Please ensure that you have enough credits on your account");
                }
                //if the response was successful
                else if (httpResponse.StatusCode == HttpStatusCode.OK)
                {
                    using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                    {
                        var result =  streamReader.ReadToEnd();
                        dynamic RetrievedItem = JObject.Parse(result);


                        var cost = RetrievedItem.cost;

                        var costBreakdown = RetrievedItem.costBreakdown;
                        Int64 costBreakdownQuantity = 0;
                        Int64 costBreakdownCost = 0;
                        string costBreakdownNetwork = "";

                        if (costBreakdown != null)
                        {
                            var costBreakdownItem = costBreakdown[0];
                            costBreakdownNetwork = costBreakdownItem.network;
                            costBreakdownCost = costBreakdownItem.cost;
                            costBreakdownQuantity = costBreakdownItem.quantity;
                        }

                        dynamic errorReport = RetrievedItem.errorReport;
                        Int64 errorReportNoNetwork = 0;
                        Int64 errorReportNoContents = 0;
                        Int64 errorReportDuplicates = 0;
                        Int64 errorReportOptedOuts = 0;
                        string errorReportFaults = null;

                        if (errorReport != null)
                        {
                            errorReportNoNetwork = errorReport.noNetwork;
                            errorReportNoContents = errorReport.noContents;
                            errorReportDuplicates = errorReport.duplicates;
                            errorReportOptedOuts = errorReport.optedOuts;
                            //errorReportFaults = errorReport.faults;
                        }
                        Int64 eventId = RetrievedItem.eventId;
                        Int64 messages = RetrievedItem.messages;
                        Int64 parts = RetrievedItem.parts;
                        Int64 remainingBalance = RetrievedItem.remainingBalance;
                        string sample = RetrievedItem.sample;


                        smsReponse.Cost = cost; // number sms credits used
                        smsReponse.CostBreakdown_Network = costBreakdownNetwork;
                        smsReponse.CostBreakdown_Cost = costBreakdownCost;
                        smsReponse.CostBreakdown_Quantity = costBreakdownQuantity;
                        smsReponse.ErrorReport_NoNetwork = errorReportNoNetwork;
                        smsReponse.ErrorReport_NoContents = errorReportNoContents;
                        smsReponse.ErrorReport_Duplicates = errorReportDuplicates;
                        smsReponse.ErrorReport_OptedOuts = errorReportOptedOuts;
                        smsReponse.ErrorReport_Faults = errorReportFaults;
                        smsReponse.EventID = eventId;
                        smsReponse.Messages = messages;
                        smsReponse.Parts = parts;
                        smsReponse.RemainingBalance = remainingBalance;
                        smsReponse.Sample = sample;
                        smsReponse.Token = token;


                        return smsReponse;
                    }
                }
                else
                {
                    Helper.LogError($"SendSMS_SMSPortal - Could not send SMS Portal SMS to {cellNumber}.", "Status Code = {httpResponse.StatusCode}. Status Description: {httpResponse.StatusDescription}");
                    return smsReponse.CreateError($"Could not send SMS Portal SMS to {cellNumber}");
                }

            }
            catch (Exception e)
            {
                Helper.LogError($"SendSMS_SMSPortal - Could not send SMS Portal SMS to {cellNumber}.", "Status Code = {httpResponse.StatusCode}. Status Description: {httpResponse.StatusDescription}");
                if (e.InnerException != null)
                {
                    Helper.LogError(e.InnerException.ToString(), e.InnerException.Message + " " + e.InnerException.StackTrace);
                }
                return smsReponse.CreateError($"Could not send SMS Portal SMS to {cellNumber}. Please ensure that you have enough credits on your account");

            }





        }
    }


}
