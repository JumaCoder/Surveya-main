using Newtonsoft.Json.Linq;
using RRZTools;
using Surveya_Application.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Configuration;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Surveya_Application.Administration
{
    public partial class DocumentViewer : System.Web.UI.Page
    {
        string _root { get; set; }
        string DocumentManagerPath { get; set; }
        ReportEntities rm;

        protected string validate()
        {
            if (Session["userInfo"] == null)
            {
                string redirectURL = "~/Account/Login?ReturnUrl=" + Request.Path.ToString() + "?" + Request.QueryString.ToString();
                Response.Redirect(redirectURL, true);
                return Utils.WrapError("Authentication Failed.");
            }

            dynamic user;
            //errorText.Text = Session["userInfo"] == null ? "Nothing" : Session["userInfo"].ToString();
            string uInfo = Session["userInfo"].ToString();

            if (Session["userInfo"] != null)
            {
                user = JObject.Parse(uInfo);
                string key = user.SecretKey.ToString();
                if (key == null)
                {
                    return Utils.WrapError("Authentication failed, invalid secret key.");
                }

                string validationResult = Helper.ValidateKey(key);

                if (Utils.IsError(validationResult))
                {
                    return validationResult;
                }
                else
                {
                    string[] userInformation = validationResult.Split(new string[] { "</>" }, StringSplitOptions.None);
                    if (userInformation.Length == 3)
                    {
                        if (Membership.ValidateUser(userInformation[1], userInformation[2]))
                        {
                            MembershipUser theUser = Membership.GetUser(userInformation[1] + "");
                            Guid LoggedInUserID = (Guid)theUser.ProviderUserKey;
                            userID.Value = LoggedInUserID.ToString();

                            return LoggedInUserID.ToString();
                        }
                        else
                        {
                            return Utils.WrapError("Authentication Failed.");
                        }
                    }
                    return Utils.WrapError("Invalid user info.");
                }
            }
            else
            {
                return Utils.WrapError("Authentication failed, invalid secret key.");
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {

            errorLabel2.Text = "";
            if (!IsCallback && !IsPostBack)
            {
                string docID = Request.QueryString.Get("DocID");
                if (!string.IsNullOrWhiteSpace(docID))
                {
                    getDocumentDetails(docID);
                }
            }
        }

        private void getDocumentDetails(string docID)
        {
            string userGuid = validate();
            if (Utils.IsError(userGuid))
            {
                errorDiv.Visible = true;
                errorText.Text = Utils.CleanError(userGuid);
            }
            else
            {
                errorDiv.Visible = false;
                errorText.Text = "";
            }

            Guid UserID = Guid.Empty;

            Guid documentID = Guid.Empty;
            if (!Guid.TryParse(docID, out documentID))
            {
                errorDiv.Visible = true;
                errorText.Text = "Document ID is not in the correct format";
                return;
            }

            if (!Guid.TryParse(userGuid, out UserID))
            {
                errorDiv.Visible = true;
                errorText.Text = "User ID is not in the correct format";
                return;
            }

            DocumentManagerPath = ConfigurationManager.AppSettings["DocumentManagerPath"].ToString();

            using (rm = new ReportEntities())
            {

                var thisDoc = rm.Documents.FirstOrDefault(d => d.ID == documentID);

                if (thisDoc == null)
                {
                    errorDiv.Visible = true;
                    errorText.Text = "No document was found with the provided ID";
                    return;
                }

                string actualPath = DocumentManagerPath + "\\" + thisDoc.Link;
                fullPath.Value = actualPath;

                userID.Value = thisDoc.UserID.ToString();

                docName.Text = thisDoc.Name;
                docTypeNum.SelectedItem.Selected = false;
                docTypeNum.Items.FindByValue(thisDoc.TypeNumber.ToString()).Selected = true;
                docTypeDesc.Text = thisDoc.TypeDescription;

                string file = "file";
                if (!String.IsNullOrWhiteSpace(thisDoc.FileExtension))
                {
                    file = thisDoc.FileExtension.ToLower();
                }
                docTypeImage.ImageUrl = "~/Content/Images/filetypes/"+file+".png";

                if (thisDoc.ExpiryDate != null)
                {
                    DateTime date = (DateTime)thisDoc.ExpiryDate;
                    docExpiryDate.Text = date.ToShortDateString();
                }

                var compUser = (from cu in rm.CompanyUsers
                                where cu.UserID == UserID
                                select cu).FirstOrDefault();

                if (compUser == null)
                {
                    errorDiv.Visible = true;
                    errorText.Text = "No company found for user";
                    return;
                }

                List<Project> compProjects = rm.Projects
                    .Where(pr => pr.ProjectCompany == compUser.CompanyID)
                    .OrderBy(pro => pro.ProjectName)
                    .ToList();

                //companyProjects
                ListItem item;
                foreach (Project pro in compProjects)
                {
                    item = new ListItem(pro.ProjectName, pro.ID.ToString());
                    companyProjects.Items.Add(item);
                }

                bool isProj = thisDoc.IsProjectSpecific == null ? false : (bool)thisDoc.IsProjectSpecific;
                if (isProj)
                {
                    docIsProjectSpecific.Checked = isProj;
                    if (thisDoc.ProjectID != null)
                    {
                        companyProjects.SelectedItem.Selected = false;
                        companyProjects.Items.FindByValue(thisDoc.ProjectID.ToString()).Selected = true;
                    }
                }

                if (!isProj)
                {
                    backLink.NavigateUrl = "Profile";
                    backLink.Text = "<i class='fa fa-arrow-left'></i>&nbsp;&nbsp;Go back to '/Profile'";
                }
                else
                {
                    string projectID = Request.QueryString.Get("projectID");
                    if (!string.IsNullOrWhiteSpace(projectID))
                    {
                        backLink.NavigateUrl = "DocumentManager?projectID=" + projectID;
                        backLink.Text = "<i class='fa fa-arrow-left'></i>&nbsp;&nbsp;Go back to '/DocumentManager'";
                    }
                    else
                    {
                        orLbl.Visible = false;
                    }
                }

                var dir = Request.QueryString.Get("dir");
                if (!string.IsNullOrWhiteSpace(dir))
                {
                    docFolder.Text = dir;
                }
            }
        }

        protected bool saveDocumentToDB(string docName, string link, string typeNum, string typeDesc, string expDate, bool isProject, Guid projID, Guid userID)
        {
            try
            {
                using (rm = new ReportEntities())
                {
                    var newDoc = new Document();

                    newDoc.ID = Guid.NewGuid();
                    newDoc.Name = docName;
                    newDoc.Link = link;

                    long typeN;
                    if (long.TryParse(typeNum, out typeN))
                    {
                        newDoc.TypeNumber = typeN;
                    }

                    newDoc.TypeDescription = typeDesc;

                    DateTime date;
                    if (DateTime.TryParse(expDate, out date))
                    {
                        newDoc.ExpiryDate = date;
                    }

                    if (isProject)
                    {
                        newDoc.IsProjectSpecific = isProject;
                        newDoc.ProjectID = projID;
                    }

                    if (!userID.Equals(Guid.Empty))
                    {
                        newDoc.UserID = userID;
                    }

                    rm.Documents.Add(newDoc);
                    rm.SaveChanges();
                    return true;
                }
            }
            catch (Exception ee)
            {
                Helper.LogError(ee.Message, ee.StackTrace);
                return false;
            }
        }

        protected void downloadDocument_Click(object sender, EventArgs e)
        {
            string urlStr = fullPath.Value;
            FileInfo fileInfo = new FileInfo(urlStr);

            if (fileInfo.Exists)
            {
                Response.Clear();
                Response.AddHeader("Content-Disposition", "attachment; filename=" + fileInfo.Name);
                Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                Response.ContentType = "application/octet-stream";
                Response.Flush();
                Response.TransmitFile(fileInfo.FullName);
                Response.End();
            }
            else
            {
                errorLabel2.Text = "File not found!";
                AddCssClass(errorLabel2, "autoHideMe");
            }
        }

        protected void updateDocDetailsBtn_Click(object sender, EventArgs e)
        {
            try
            {
                bool hasError = true;
                string docID = Request.QueryString.Get("DocID");
                if (!string.IsNullOrWhiteSpace(docID))
                {
                    errorDiv.Visible = true;
                    errorText.Text = "No document id provided";
                }

                Guid documentID = Guid.Empty;

                hasError = (string.IsNullOrWhiteSpace(docName.Text) || !Guid.TryParse(docID, out documentID));


                if (!hasError)
                {
                    using (rm = new ReportEntities())
                    {
                        var docDets = rm.Documents.FirstOrDefault(d => d.ID == documentID);

                        docDets.Name = docName.Text;

                        long typeN;
                        if (long.TryParse(docTypeNum.SelectedValue, out typeN))
                        {
                            docDets.TypeNumber = typeN;
                        }

                        docDets.TypeDescription = docTypeDesc.Text;

                        DateTime date;
                        if (DateTime.TryParse(docExpiryDate.Text, out date))
                        {
                            docDets.ExpiryDate = date;
                        }


                        bool isProject = docIsProjectSpecific.Checked;
                        Guid ProjID = Guid.Empty;
                        if (isProject)
                        {
                            string prID = companyProjects.SelectedValue;
                            Guid.TryParse(prID, out ProjID);

                            docDets.IsProjectSpecific = isProject;
                            if (!ProjID.Equals(Guid.Empty))
                            {
                                docDets.ProjectID = ProjID;
                            }
                        }
                        else
                        {
                            docDets.IsProjectSpecific = false;
                            docDets.ProjectID = null;
                        }

                        rm.Entry(docDets).State = EntityState.Modified;
                        rm.SaveChanges();
                        errorDiv.Visible = false;
                        errorText.Text = "";
                    }
                }
                else
                {
                    if (!Guid.TryParse(docID, out documentID))
                    {
                        errorDiv.Visible = true;
                        errorText.Text = "Invalid document id provided";
                    }
                    if (string.IsNullOrWhiteSpace(docName.Text))
                    {
                        errorDiv.Visible = true;
                        errorText.Text = "Document name required";
                    }
                }
            }
            catch (Exception ee)
            {
                Helper.LogError(ee.Message, ee.StackTrace);
                errorDiv.Visible = true;
                errorText.Text = ee.Message;
            }
        }

        protected void deleteDocDetailsBtn_Click(object sender, EventArgs e)
        {

            try
            {
                bool hasError = true;
                string docID = Request.QueryString.Get("DocID");
                if (!string.IsNullOrWhiteSpace(docID))
                {
                    errorDiv.Visible = true;
                    errorText.Text = "No document id provided";
                }

                Guid documentID = Guid.Empty;

                hasError = (string.IsNullOrWhiteSpace(docName.Text) || !Guid.TryParse(docID, out documentID));

                DocumentManagerPath = ConfigurationManager.AppSettings["DocumentManagerPath"].ToString();

                if (!hasError)
                {
                    using (rm = new ReportEntities())
                    {
                        var docDets = rm.Documents.FirstOrDefault(d => d.ID == documentID);

                        string fileLocation = DocumentManagerPath + "\\" + docDets.Link;

                        if (File.Exists(fileLocation))
                        {
                            File.SetAttributes(fileLocation, FileAttributes.Normal);
                            File.Delete(fileLocation);

                            rm.Documents.Remove(docDets);
                            rm.Entry(docDets).State = EntityState.Deleted;
                            rm.SaveChanges();
                        }
                        else
                        {
                            errorDiv.Visible = true;
                            errorText.Text = "Could not find document to delete";
                        }
                    }
                }
            }
            catch (Exception ee)
            {
                Helper.LogError(ee.Message, ee.StackTrace);
                errorDiv.Visible = true;
                errorText.Text = ee.Message;
            }
        }

        public void AddCssClass(WebControl controlInstance, String css)
        {
            controlInstance.CssClass = controlInstance.CssClass + " " + css;
        }
        public void RemoveCssClass(WebControl controlInstance, String css)
        {
            controlInstance.CssClass = String.Join(" ", controlInstance.CssClass.Split(' ').Where(x => x != css).ToArray());
        }
    }
}