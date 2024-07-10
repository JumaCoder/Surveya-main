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
    public partial class LoginBack : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            RegisterHyperLink.NavigateUrl = "Register";
            var returnUrl = HttpUtility.UrlEncode(Request.QueryString["ReturnUrl"]);
            if (!String.IsNullOrEmpty(returnUrl))
            {
                RegisterHyperLink.NavigateUrl += "?ReturnUrl=" + returnUrl;
            }
        }

        protected void LogIn(object sender, EventArgs e)
        {
            if (IsValid)
            {
                
                // Validate the user password
                if(Membership.ValidateUser(UserName.Text, Password.Text))
                {
                    string baseAddress = ConfigurationManager.AppSettings["ServiceAddress"].ToString() + "/GetSecretKey";
                    HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(baseAddress);
                    request.Method = "POST";
                    request.ContentType = "application/json; charset=utf-8";
                    request.Timeout = 30000;

                    string json = "{\"username\":\"" + UserName.Text + "\", \"password\":\""+Password.Text+"\"}";
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
                            string secretKey = (string)data["GetSecretKeyResult"];
                            if (Utils.IsError(secretKey))
                            {
                                FailureText.Text = Utils.CleanError(secretKey);
                                ErrorMessage.Visible = true;
                            }
                            else
                            {
                                FormsAuthentication.SetAuthCookie(UserName.Text, false);
                                //create a cookie for the secret key
                                HttpCookie newCookie = new HttpCookie("secretKey");
                                newCookie.Path = "/";

                                Response.Cookies.Add(newCookie);
                                Response.Cookies["secretKey"].Value = secretKey;
                                Session["secretKey"] = secretKey;
                                IdentityHelper.RedirectToReturnUrl(Request.QueryString["ReturnUrl"], Response);
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
                    FailureText.Text = "Invalid username or password.";
                    ErrorMessage.Visible = true;
                }
            }
        }
    }
}