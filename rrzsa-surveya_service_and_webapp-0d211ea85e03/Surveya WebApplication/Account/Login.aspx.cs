using System;
using System.IO;
using System.Net;
using System.Web;
using System.Web.UI;
using Newtonsoft.Json.Linq;
using Surveya_Application.Models;
using System.Configuration;
using System.Web.Security;
using RRZTools;

namespace Surveya_Application.Account
{
    public partial class Login : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                errorLbl.Visible = false;
            }
        }

        protected void LogIn(object sender, EventArgs e)
        {
            if (IsValid)
            {
                try
                {
                    string response = AuthenticateUser(userEmail.Text, userPass.Text);
                    ProcessResponse(response);
                }
                catch (Exception ex)
                {
                    LogError(ex);
                    DisplayError("An error occurred while trying to log in. Please try again later.");
                }
            }
        }

        private string AuthenticateUser(string username, string password)
        {
            string baseAddress = ConfigurationManager.AppSettings["ServiceAddress"] + "/Login";
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(baseAddress);
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.Timeout = 30000;

            string json = $"{{\"username\":\"{username}\", \"password\":\"{password}\"}}";
            using (StreamWriter writer = new StreamWriter(request.GetRequestStream()))
            {
                writer.Write(json);
            }

            using (HttpWebResponse httpResponse = (HttpWebResponse)request.GetResponse())
            using (StreamReader reader = new StreamReader(httpResponse.GetResponseStream()))
            {
                return reader.ReadToEnd();
            }
        }

        private void ProcessResponse(string response)
        {
            var data = JObject.Parse(response);
            if (Utils.IsError(data["RRZResult"].ToString()))
            {
                DisplayError(Utils.CleanError(data["RRZResult"].ToString()));
            }
            else
            {
                HandleSuccessfulLogin(data);
            }
        }

        private void HandleSuccessfulLogin(JObject data)
        {
            var redirectURL = Request.QueryString["ReturnUrl"] ?? "/Administration/Projects";
            var userObj = JObject.Parse(data["RRZResult"].ToString());
            var secretKey = userObj["SecretKey"].ToString();
            var companyStr = userObj["Company"]?.ToString();
            var mustVerifyLogin = userObj["MustVerifyLogin"]?.ToString().ToLower() == "true";

            FormsAuthentication.SetAuthCookie(userEmail.Text, false);

            SetSessionAndCookies(secretKey, userObj, companyStr);

            if (mustVerifyLogin)
            {
                redirectURL = $"Verification?ReturnUrl={redirectURL}";
            }

            Response.Redirect(redirectURL, true);
        }

        private void SetSessionAndCookies(string secretKey, JObject userObj, string companyStr)
        {
            if (!string.IsNullOrWhiteSpace(companyStr))
            {
                Session["company"] = companyStr;
                Response.Cookies["company"].Value = companyStr;
            }

            Response.Cookies["secretKey"].Value = secretKey;
            Response.Cookies["userInfo"].Value = userObj.ToString();
            Session["secretKey"] = secretKey;
            Session["userInfo"] = userObj.ToString();
        }

        private void DisplayError(string message)
        {
            FailureText.Text = message;
            ErrorMessage.Visible = true;
        }

        private void LogError(Exception ex)
        {
            // Implement your logging logic here
        }
    }
}
