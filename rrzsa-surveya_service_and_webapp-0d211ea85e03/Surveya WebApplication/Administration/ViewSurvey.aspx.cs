using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
namespace Surveya_Application.Administration
{
    public partial class ViewSurvey : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsCallback)
            {
                excelLbl.Text = "";
            }
        }

        protected void uploadResponse_Click(object sender, EventArgs e)
        {
            string baseAddress = @ConfigurationManager.AppSettings["ServiceAddress"] + "/BulkUpdateAuditedResponses";


            var surveyStr = Request.QueryString["id"];
            Guid surveyID;

            if (!string.IsNullOrWhiteSpace(surveyStr) && Guid.TryParse(surveyStr, out surveyID))
            {

                string docRootPath = @ConfigurationManager.AppSettings["BulkAuditedResponsesPath"];
                //Request.PhysicalApplicationPath + @"\Documents\";
                //string docRootPath = @"C:\Temp\"; // Server.MapPath("~/");
                lblError.Visible = true;
                if (excelfileUpload.HasFile)
                {
                    if (excelfileUpload.PostedFile.ContentLength > 20971520)    //20mb = 2 * 1024 * 1024
                    {
                        excelLbl.Text = "Provided file is to large, max size is 20MB";
                        excelLbl.CssClass = "text-red";
                    }
                    else
                    {

                        string fileType = excelfileUpload.PostedFile.ContentType;
                        var now = DateTime.Now;

                        string fileName = (surveyID + "_" + now.ToShortDateString() + now.ToLongTimeString()).Replace(':', '-').Replace('/', '-').Replace('\\', '-');

                        int lastPos = excelfileUpload.PostedFile.FileName.LastIndexOf(".");
                        string extension = excelfileUpload.PostedFile.FileName.Substring(lastPos);
                        if (!string.IsNullOrWhiteSpace(extension))
                        {
                            extension = extension.ToLower();
                        }

                        string fileTempLocation = docRootPath + fileName + extension;

                        if (extension == ".xls" || extension == ".xlsx")
                        {
                            excelfileUpload.SaveAs(fileTempLocation);

                            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(baseAddress);
                            request.Method = "POST";
                            request.ContentType = "application/json; charset=utf-8";
                            request.Timeout = 300000;
                            string secretKey = Session["secretKey"] != null ? Session["secretKey"].ToString() : "";

                            dynamic data = new JObject();
                            data.secretKey = secretKey;
                            data.surveyID = surveyID.ToString();
                            data.filename = fileName + extension;

                            string json = data.ToString();

                            StreamWriter serverStream = new StreamWriter(request.GetRequestStream());
                            serverStream.Write(json);
                            serverStream.Close();
                            try
                            {
                                var httpResponse = (HttpWebResponse)request.GetResponse();
                                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                                {
                                    var result = streamReader.ReadToEnd();
                                    SortedList<string, object> myResult = new SortedList<string, object>();
                                    JavaScriptSerializer js = new JavaScriptSerializer();
                                    myResult = js.Deserialize<SortedList<string, object>>(result);
                                    if (myResult["RRZResult"] != null)
                                    {
                                        var res = myResult["RRZResult"].ToString();
                                        if (res.StartsWith("{") || res.StartsWith("["))
                                        {
                                            var errorJOb = js.Deserialize<ErrorResponse>(res);

                                            if (errorJOb != null && errorJOb.HasErrors)
                                            {
                                                //excelLbl.CssClass = "errorBlock";
                                                //excelLbl.Text = errorJOb.Errors.Replace("\n", "").Replace("\r", "<br/>");
                                                string errStr = errorJOb.Errors.Replace("\n", "").Replace("\r", "&");
                                                var errArray = errStr.Split('&');
                                                ListItem li;
                                                for (int i = 0; i < errArray.Length; i++)
                                                {
                                                    li = new ListItem(errArray[i]);
                                                    ErrorList.Items.Add(li);
                                                }
                                                ScriptManager.RegisterStartupScript(this, this.GetType(), "LaunchServerSide2", "$(function() { $('#uploadResponsesModal').modal('show'); });", true);
                                            }
                                            else
                                            {
                                                excelLbl.Text = "Upload status: <strong>File uploaded!</strong>";
                                                excelLbl.CssClass = "text-green";
                                                // UpdatePanel1.Update();
                                                // Response.Redirect(Request.RawUrl + "#bulkProducts");
                                            }
                                        }
                                        else
                                        {
                                            if (Helper.IsError(res))
                                            {
                                                res = Helper.CleanError(res);
                                            }
                                            excelLbl.CssClass = "text-red";
                                            excelLbl.Text = res;
                                            // UpdatePanel1.Update();
                                            // Response.Redirect(Request.RawUrl + "#gProducts");
                                        }
                                    }
                                }
                            }
                            catch (Exception ee)
                            {
                                excelLbl.Text = ee.Message;
                                excelLbl.CssClass = "text-red";
                                // UpdatePanel1.Update();
                                // Response.Redirect(Request.RawUrl + "#gProducts");
                            }
                        }
                        else
                        {
                            // #gProducts
                            excelLbl.Text = "Please only upload an Excel file";
                            excelLbl.CssClass = "text-red";
                            // UpdatePanel1.Update();
                            // Response.Redirect(Request.RawUrl + "#gProducts");
                        }
                    }
                }
                else
                {
                    // #gProducts
                    excelLbl.Text = "Please select an Excel file";
                    excelLbl.CssClass = "text-red";
                    // UpdatePanel1.Update();
                    // Response.Redirect(Request.RawUrl + "#gProducts");
                }
            }
            else
            {
                // #gProducts
                excelLbl.Text = "Invalid survey ID provided";
                excelLbl.CssClass = "text-red";
                // UpdatePanel1.Update();
                // Response.Redirect(Request.RawUrl + "#gProducts");
            }
        }
    }


    public class ErrorResponse
    {
        private String fileName;
        private Boolean hasErrors;
        private String errors;

        public ErrorResponse()
        {
            FileName = null;
            HasErrors = false;
            Errors = null;
        }
        public ErrorResponse(String fileName, Boolean hasErrors, String errors)
        {
            FileName = fileName;
            HasErrors = hasErrors;
            Errors = errors;
        }

        public String FileName
        {
            get { return fileName; }
            set { fileName = value; }
        }
        public Boolean HasErrors
        {
            get { return hasErrors; }
            set { hasErrors = value; }
        }
        public String Errors
        {
            get { return errors; }
            set { errors = value; }
        }
    }
}