using Newtonsoft.Json.Linq;
using RRZTools;
using Surveya_Application.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
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
    public partial class DocumentUploader : System.Web.UI.Page
    {
        string _root { get; set; }
        string DocumentManagerPath { get; set; }
        ReportEntities rm;
        string[] audio = { "amr", "mp3", "m4a", "oga", "webma", "wav" };
        string[] video = { "avi", "mp4", "mpeg", "mpg", "ogg", "webm" };
        string[] image = { "bmp", "gif", "jpeg", "jpg", "png", "svg", "tiff" };
        string[] document = { "doc", "docx", "pdf", "ppt", "pptx", "rtf", "txt", "xls", "xlsx" };

        string[] banned = { "ade", "adp", "aru", "bat", "chm", "class", "cmd", "com", "cpl", "dll", "exe", "exe1", "exe2", "exe3", "hta", 
                              "ins", "isp", "jar", "js", "jse", "lib", "lnk", "mde", "msc", 
                              "msi", "msp", "mst", "nsh", "pif", "scr", "sct", "shb", "sys", 
                              "vb", "vbe", "vbs", "vxd", "wsc", "wsf", "wsh" };
        protected string validate()
        {
            if (Session["userInfo"] == null)
            {
                string redirectURL = "~/Account/Login?ReturnUrl=" + Request.Path.ToString() + "?" + Request.QueryString.ToString();
                Response.Redirect(redirectURL, true);
                return Utils.WrapError("Authentication Failed.");
            }

            dynamic user;
            errorText.Text = Session["userInfo"] == null ? "Nothing" : Session["userInfo"].ToString();
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
            if (!IsCallback && !IsPostBack)
            {
                string dir = Request.QueryString.Get("dir");
                if (!string.IsNullOrWhiteSpace(dir))
                {
                    // The fake folder to show
                    docFolder.Text = Server.HtmlDecode(dir);
                }

                string project = Request.QueryString.Get("projectID");
                if (string.IsNullOrWhiteSpace(project))
                {
                    userRoot();
                }
                else
                {
                    projectRoot(project);
                }
            }
        }
        /// <summary>
        /// Formats the size of the file.
        /// </summary>
        /// <param name="Bytes">The bytes.</param>
        /// <returns>string</returns>
        protected string FormatFileSize(long Bytes)
        {
            Decimal size = 0;
            string result;

            if (Bytes >= 1073741824)
            {
                size = Decimal.Divide(Bytes, 1073741824);
                result =
                    String.Format(
                        CultureInfo.InvariantCulture,
                        "{0:##.##} gb",
                        size);
            }
            else if (Bytes >= 1048576)
            {
                size = Decimal.Divide(Bytes, 1048576);
                result =
                    String.Format(
                        CultureInfo.InvariantCulture,
                        "{0:##.##} mb",
                        size);
            }
            else if (Bytes >= 1024)
            {
                size = Decimal.Divide(Bytes, 1024);
                result =
                    String.Format(
                        CultureInfo.InvariantCulture,
                        "{0:##.##} kb",
                        size);
            }
            else if (Bytes > 0 & Bytes < 1024)
            {
                size = Bytes;
                result =
                    String.Format(
                        CultureInfo.InvariantCulture,
                        "{0:##.##} bytes",
                        size);
            }
            else
            {
                result = "0 bytes";
            }

            return result;
        }

        protected void showProjSurDocsDir(Guid projectID)
        {
            DocumentManagerPath = ConfigurationManager.AppSettings["DocumentManagerPath"].ToString();

            Project project = null;
            List<Project> compProjects = null;
            using (rm = new ReportEntities())
            {
                project = rm.Projects.FirstOrDefault(pr => pr.ID == projectID);

                if (project != null)
                {
                    // The actual path to save to
                    string actualPath = "";

                    string CompanyID = project.ProjectCompany.ToString();

                    string projectPath = DocumentManagerPath + "\\" + CompanyID + "\\Projects\\" + projectID.ToString();
                    DirectoryInfo di = new DirectoryInfo(projectPath);

                    string surID = Request.QueryString.Get("sur");
                    if (!string.IsNullOrWhiteSpace(surID))
                    {
                        //Survey misc document are saved in "SurveyDocs" folder
                        actualPath = projectPath + "\\Surveys\\" + surID + "\\SurveyDocs";
                    }
                    else
                    {
                        //Project misc document are saved in "ProjectDocs" folder
                        actualPath = projectPath + "\\ProjectDocs";
                    }

                    fullPath.Value = actualPath;

                    compProjects = rm.Projects.Where(pr => pr.ProjectCompany == project.ProjectCompany).ToList();

                    //companyProjects
                    ListItem item;
                    foreach (Project pro in compProjects)
                    {
                        item = new ListItem(pro.ProjectName, pro.ID.ToString());
                        companyProjects.Items.Add(item);
                    }
                    companyProjects.Items.FindByValue(projectID.ToString()).Selected = true;
                    companyProjects.Enabled = false;

                    docIsProjectSpecific.Checked = true;
                    docIsProjectSpecific.Enabled = false;
                }
            }
        }

        private void projectRoot(string projIDStr)
        {
            string userID = validate();
            if (Utils.IsError(userID))
            {
                errorDiv.Visible = true;
                errorText.Text = Utils.CleanError(userID);
            }
            else
            {
                errorDiv.Visible = false;
                errorText.Text = "";
            }

            if (!Page.IsPostBack)
            {
                if (!string.IsNullOrWhiteSpace(projIDStr))
                {
                    Guid projID;
                    if (Guid.TryParse(projIDStr, out projID))
                    {
                        backLink.NavigateUrl = "DocumentManager?projectID=" + projIDStr;
                        backLink.Text = "<i class='fa fa-arrow-left'></i>&nbsp;&nbsp;Go back to '/DocumentManager'";
                        uploadProjSurBtn.Visible = true;
                        showProjSurDocsDir(projID);
                    }
                }
            }
        }

        protected void uploadProjSurBtn_Click(object sender, EventArgs e)
        {
            bool hasError = true;

            hasError = (!fileUploader.HasFile || string.IsNullOrWhiteSpace(docName.Text));

            string[] badChars = { " ", "/", "\\", ":", "*", "?", "\"", ">", "<", "|" };

            if (!hasError)
            {
                string docRootPath = fullPath.Value;

                TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;

                // check if misc docs folder
                if (docRootPath.Contains("SurveyDocs") || docRootPath.Contains("ProjectDocs"))
                {
                    string fileName = docName.Text;
                    //fileName = textInfo.ToTitleCase(fileName);
                    foreach (string item in badChars)
                    {
                        fileName = fileName.Replace(item, "");
                    }


                    int lastPos = fileUploader.PostedFile.FileName.LastIndexOf(".");
                    string extension = fileUploader.PostedFile.FileName.Substring(lastPos);
                    string fileLocation = docRootPath + "\\" + fileName + extension;

                    if (File.Exists(fileLocation))
                    {
                        File.SetAttributes(fileLocation, FileAttributes.Normal);
                        File.Delete(fileLocation);
                    }

                    fileUploader.SaveAs(fileLocation);

                    string DocumentManagerPath = ConfigurationManager.AppSettings["DocumentManagerPath"].ToString();
                    int last = DocumentManagerPath.Length;

                    var name = docName.Text;
                    string link = fileLocation.Substring(last);
                    string typeNum = docTypeNum.SelectedValue;
                    string docDescr = docTypeDesc.Text;
                    string expDate = docExpiryDate.Text;

                    bool isProject = docIsProjectSpecific.Checked;
                    Guid ProjID = Guid.Empty;
                    Guid UserID = Guid.Empty;

                    if (isProject)
                    {
                        string prID = companyProjects.SelectedValue;
                        Guid.TryParse(prID, out ProjID);
                    }

                    string uID = userID.Value;
                    Guid.TryParse(uID, out UserID);
                    extension = extension.Substring(1);
                    if (saveDocumentToDB(name, link, typeNum, docDescr, expDate, isProject, ProjID, UserID, extension.Replace(".", "")))
                    {
                        hasError = false;
                        string projIDStr = Request.QueryString.Get("projectID");
                        if (!string.IsNullOrWhiteSpace(projIDStr))
                        {
                            Response.Redirect("DocumentManager?projectID=" + projIDStr, true);
                        }
                    }
                    else
                    {
                        uploadErrorLbl.Text = "Document uploaded but could not be saved to database";
                        uploadErrorLbl.Visible = true;

                        errorText.Text = "Document uploaded but could not be saved to database";
                        errorText.Visible = true;
                        hasError = true;
                    }
                }
                else
                {
                    uploadErrorLbl.Text = "You can only upload to 'ProjectDocs' or 'SurveyDocs'";
                    uploadErrorLbl.Visible = true;

                    errorText.Text = "You can only upload to 'ProjectDocs' or 'SurveyDocs'";
                    errorText.Visible = true;
                    hasError = true;
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(docName.Text))
                {
                    uploadErrorLbl.Text = "Document name is required";
                    uploadErrorLbl.Visible = true;

                    errorText.Text = "Document name is required";
                    errorText.Visible = true;
                    hasError = true;
                }
                if (!fileUploader.HasFile)
                {
                    uploadErrorLbl.Text = "No document provided";
                    uploadErrorLbl.Visible = true;

                    errorText.Text = "No document provided";
                    errorText.Visible = true;
                    hasError = true;
                }
            }
        }

        private void userRoot()
        {
            string userID = validate();
            if (Utils.IsError(userID))
            {
                errorDiv.Visible = true;
                errorText.Text = Utils.CleanError(userID);
            }
            else
            {
                errorDiv.Visible = false;
                errorText.Text = "";
            }

            Guid UserID = Guid.Empty;

            if (!Guid.TryParse(userID, out UserID))
            {
                errorDiv.Visible = true;
                errorText.Text = "User ID is not in the correct format";
                return;
            }

            backLink.NavigateUrl = "Profile";
            backLink.Text = "<i class='fa fa-arrow-left'></i>&nbsp;&nbsp;Go back to '/Profile";
            uploadUserBtn.Visible = true;
                        
            DocumentManagerPath = ConfigurationManager.AppSettings["DocumentManagerPath"].ToString();

            using (rm = new ReportEntities())
            {
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

                //folder directory
                string actualPath = DocumentManagerPath + "\\" + compUser.CompanyID + "\\Users\\" + UserID.ToString();
                
                fullPath.Value = actualPath;
            }
        }

        protected void uploadUserBtn_Click(object sender, EventArgs e)
        {
            bool hasError = true;

            hasError = (!fileUploader.HasFile || string.IsNullOrWhiteSpace(docName.Text));

            string[] badChars = { " ", "/", "\\", ":", "*", "?", "\"", ">", "<", "|" };

            if (!hasError)
            {
                string docRootPath = fullPath.Value;

                TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
                DirectoryInfo di = new DirectoryInfo(docRootPath);


                // check if user docs folder exists
                if (di.Exists)
                {
                    string fileName = docName.Text;
                    //fileName = textInfo.ToTitleCase(fileName);
                    foreach (string item in badChars)
                    {
                        fileName = fileName.Replace(item, "");
                    }


                    int lastPos = fileUploader.PostedFile.FileName.LastIndexOf(".");
                    string extension = fileUploader.PostedFile.FileName.Substring(lastPos);
                    string fileLocation = docRootPath + "\\" + fileName + extension;

                    string extToCheck = extension.Substring(1);
                    if (banned.Contains(extToCheck.ToLower()))
                    {
                        //Blocked for security reasons!
                        uploadErrorLbl.Text = "Documents of this type are blocked for security reasons!";
                        uploadErrorLbl.Visible = true;

                        errorText.Text = "Documents of this type are blocked for security reasons!";
                        errorText.Visible = true;

                        hasError = true;
                    }
                    else
                    {
                        docTypeDesc.Text = fileName + extension;

                        if (File.Exists(fileLocation))
                        {
                            File.SetAttributes(fileLocation, FileAttributes.Normal);
                            File.Delete(fileLocation);
                        }

                        fileUploader.SaveAs(fileLocation);

                        string DocumentManagerPath = ConfigurationManager.AppSettings["DocumentManagerPath"].ToString();
                        int last = DocumentManagerPath.Length;
                        Helper.LogMessage("DocPath: " + DocumentManagerPath);


                        var name = docName.Text;
                        string link = fileLocation.Substring(last);
                        Helper.LogMessage("link: " + link);
                        string typeNum = docTypeNum.SelectedValue;
                        string docDescr = docTypeDesc.Text;
                        string expDate = docExpiryDate.Text;

                        bool isProject = docIsProjectSpecific.Checked;
                        Guid ProjID = Guid.Empty;
                        Guid UserID = Guid.Empty;

                        if (isProject)
                        {
                            string prID = companyProjects.SelectedValue;
                            Guid.TryParse(prID, out ProjID);
                        }

                        string uID = userID.Value;
                        Guid.TryParse(uID, out UserID);

                        if (saveDocumentToDB(name, link, typeNum, docDescr, expDate, isProject, ProjID, UserID, extension.Replace(".", "")))
                        {
                            hasError = false;
                            Response.Redirect("Profile", true);
                        }
                        else
                        {
                            uploadErrorLbl.Text = "Document uploaded but could not be saved to database";
                            uploadErrorLbl.Visible = true;

                            errorText.Text = "Document uploaded but could not be saved to database";
                            errorText.Visible = true;
                            hasError = true;
                        }
                    }
                }
                else
                {
                    uploadErrorLbl.Text = "Could not find the location to save document";
                    uploadErrorLbl.Visible = true;

                    errorText.Text = "Could not find the location to save document";
                    errorText.Visible = true;
                    hasError = true;
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(docName.Text))
                {
                    uploadErrorLbl.Text = "Document name is required";
                    uploadErrorLbl.Visible = true;

                    errorText.Text = "Document name is required";
                    errorText.Visible = true;
                    hasError = true;
                }
                if (!fileUploader.HasFile)
                {
                    uploadErrorLbl.Text = "No document provided";
                    uploadErrorLbl.Visible = true;

                    errorText.Text = "No document provided";
                    errorText.Visible = true;
                    hasError = true;
                }
            }
        }

        protected bool saveDocumentToDB(string docName, string link, string typeNum, string typeDesc, string expDate, bool isProject, Guid projID, Guid userID, string extension)
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
                    if(DateTime.TryParse(expDate, out date))
                    {
                        newDoc.ExpiryDate = date;
                    }

                    if (isProject)
                    {
                        newDoc.IsProjectSpecific = isProject;
                        if (!projID.Equals(Guid.Empty))
                        {
                            newDoc.ProjectID = projID;
                        }
                    }

                    if (!userID.Equals(Guid.Empty))
                    {
                        newDoc.UserID = userID;
                    }

                    if (!string.IsNullOrWhiteSpace(extension))
                    {
                        newDoc.FileExtension = extension;
                    }

                    rm.Documents.Add(newDoc);
                    //rm.SaveChanges();

                    Guid companyID = Guid.Empty;
                    string projectName = null;
                    string performedUserName = null;

                    if ((projID != null && !projID.Equals(Guid.Empty)) || (userID != null && !userID.Equals(Guid.Empty)))
                    {
                        if(projID != null && !projID.Equals(Guid.Empty))
                        {
                            var thisProj = rm.Projects.FirstOrDefault(p => p.ID == projID);
                            if (thisProj != null)
                            {
                                companyID = thisProj.ProjectCompany;
                                projectName = thisProj.ProjectName;
                            }
                        }
                        
                        if (userID != null && !userID.Equals(Guid.Empty))
                        {
                            Helper.LogMessage("userID = " + userID);
                            if (companyID.Equals(Guid.Empty))
                            {
                                var compUser = rm.CompanyUsers.FirstOrDefault(cu => cu.UserID == userID);
                                if (compUser != null)
                                {
                                    companyID = (Guid)compUser.CompanyID;
                                    Helper.LogMessage("companyID = " + companyID);
                                }
                            }

                            Helper.LogMessage("user = rm.aspnet_Membership.FirstOrDefault(m => m.UserId == userID);");
                            var user = rm.aspnet_Membership.FirstOrDefault(m => m.UserId == userID);
                            if (user != null)
                            {
                                performedUserName = user.Firstnames + " " + user.Lastname;
                                Helper.LogMessage("performedUserName = user.Firstnames  + user.Lastname;");
                                Helper.LogMessage("performedUserName = " + user.Firstnames + " " + user.Lastname);
                            }
                        }
                    }

                    var newActivity = new ActivityStream();
                    newActivity.ID = Guid.NewGuid();
                    if (!companyID.Equals(Guid.Empty))
                    {
                        newActivity.CompanyID = companyID;
                    }

                    if (userID != null && !userID.Equals(Guid.Empty))
                    {
                        newActivity.PerformedByUserID = userID;
                        newActivity.PerformedByUserFullName = performedUserName;
                        Helper.LogMessage("newActivity.PerformedByUserFullName = performedUserName");
                        Helper.LogMessage("newActivity.PerformedByUserFullName = " + performedUserName);
                    }
                    if (projID != null && !projID.Equals(Guid.Empty))
                    {
                        newActivity.ProjectID = projID;
                        newActivity.ProjectName = projectName;
                    }

                    //string docLink = "DocumentViewer?DocID=" + newActivity.ID;
                    newActivity.link = link.Replace("\\","\\\\");

                    if (string.IsNullOrWhiteSpace(extension))
                    {

                        Helper.LogMessage("extension empty: " + extension);
                        newActivity.ActivityType = "File";
                        newActivity.ActivityMessage = "uploaded a file";
                    }
                    else
                    {

                        Helper.LogMessage("extension check: " + extension);
                        if (audio.Contains(extension.ToLower()))
                        {
                            newActivity.ActivityType = "Audio";
                            newActivity.ActivityMessage = "uploaded an audio file";
                        }
                        else if (video.Contains(extension.ToLower()))
                        {
                            newActivity.ActivityType = "Video";
                            newActivity.ActivityMessage = "uploaded a video";
                        }
                        else if (image.Contains(extension.ToLower()))
                        {
                            newActivity.ActivityType = "Image";
                            newActivity.ActivityMessage = "uploaded an image";
                        }
                        else if (document.Contains(extension.ToLower()))
                        {
                            newActivity.ActivityType = "Document";
                            newActivity.ActivityMessage = "uploaded a document";
                        }
                        else
                        {
                            newActivity.ActivityType = "File";
                            newActivity.ActivityMessage = "uploaded a file";
                        }
                    }
                    newActivity.ActivityDate = DateTime.Now;
                    newActivity.DocumentID = newDoc.ID;


                    rm.ActivityStreams.Add(newActivity);
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
    }
}