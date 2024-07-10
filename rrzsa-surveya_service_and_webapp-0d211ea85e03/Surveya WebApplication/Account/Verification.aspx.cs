using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using Surveya_Application.Models;
using System.Web.Security;
using System.Configuration;
using System.Net;
using System.IO;
using Newtonsoft.Json.Linq;
using RRZTools;

namespace Surveya_Application.Account
{
    public partial class Verification : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                errorLbl.Visible = false;
            }
            /*
            RegisterHyperLink.NavigateUrl = "Register";
            var returnUrl = HttpUtility.UrlEncode(Request.QueryString["ReturnUrl"]);
            if (!String.IsNullOrEmpty(returnUrl))
            {
                RegisterHyperLink.NavigateUrl += "?ReturnUrl=" + returnUrl;
            }
             */
        }

        protected void LogIn(object sender, EventArgs e)
        {
            var userObj = JObject.Parse(Session["userInfo2fa"].ToString());
            string secretKey = userObj.GetValue("SecretKey").ToString();
            if (IsValid && userObj.HasValues && !String.IsNullOrWhiteSpace(secretKey))
            {

                // Validate the user password
                string baseAddress = ConfigurationManager.AppSettings["ServiceAddress"].ToString() + "/AuthorizeLoginAttempt";
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(baseAddress);
                request.Method = "POST";
                request.ContentType = "application/json; charset=utf-8";
                request.Timeout = 30000;

                //string secretKey, string code
                string json = "{\"secretKey\":\"" + secretKey + "\", \"code\":\"" + userEmail.Text + "\"}";
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
                        JObject company = null;
                        string companyStr = null;
                        var response = (string)data["RRZResult"];
                        if (Utils.IsError(response))
                        {
                            FailureText.Text = Utils.CleanError(response);
                            ErrorMessage.Visible = true;
                        }
                        else
                        {
                            var redirectURL = Request.QueryString["ReturnUrl"];
                            if (String.IsNullOrWhiteSpace(redirectURL))
                            {
                                redirectURL = "/Administration/Projects";
                            }
                            FormsAuthentication.SetAuthCookie(userEmail.Text, false);
                            //create a cookie for the secret key
                            HttpCookie newCookie = new HttpCookie(userEmail.Text);
                            newCookie.Path = "/";

                            try
                            {
                                if (userObj.HasValues && !String.IsNullOrWhiteSpace(secretKey))
                                {
                                    Response.Cookies.Add(newCookie);

                                    companyStr = userObj.GetValue("Company").ToString();
                                    if (!string.IsNullOrWhiteSpace(companyStr))
                                    {
                                        company = JObject.Parse(companyStr);

                                        Response.Cookies["company"].Value = company.ToString();
                                        Response.Cookies["userInfo"].Value = userObj.ToString();
                                        Session["company"] = company.ToString();
                                        Session["userInfo"] = userObj.ToString();
                                    }

                                    Response.Cookies["secretKey"].Value = secretKey;
                                    Response.Cookies["userInfo"].Value = userObj.ToString();
                                    Session["secretKey"] = secretKey;
                                    Session["userInfo"] = userObj.ToString();
                                    Response.Redirect(redirectURL, true);
                                }
                                else
                                {
                                    FailureText.Text = "Session expired. It looks like you've taken too long to verify this login.";
                                    ErrorMessage.Visible = true;
                                }
                            }
                            catch (Exception ee)
                            {
                                var error = ee.Message;
                                FailureText.Text = ee.Message;
                                ErrorMessage.Visible = true;
                            }
                        }
                    }
                }
                catch (Exception ee)
                {
                    var error = ee.Message;
                    FailureText.Text = ee.Message;
                    ErrorMessage.Visible = true;
                }
            }
            else
            {
                FailureText.Text = "Session expired. It looks like you've taken too long to verify this login.";
                ErrorMessage.Visible = true;
            }
        }
    }
}