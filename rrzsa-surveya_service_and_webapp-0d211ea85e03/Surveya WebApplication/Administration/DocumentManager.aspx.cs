using Newtonsoft.Json.Linq;
using RRZTools;
using Surveya_Application.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web;
using System.Web.Configuration;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Surveya_Application.Administration
{
    public partial class DocumentManager : System.Web.UI.Page
    {
        string _root { get; set; }
        string DocumentManagerPath { get; set; }

        TreeNode projectNode;
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
            errorLabel.Text = "";
            if (!IsCallback && !IsPostBack)
            {
                //RegisterAsyncTask(new PageAsyncTask(projectRoot));
                projectRoot();
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

        protected void loadProjectDocuments(Guid projectID)
        {
            DocumentManagerPath = ConfigurationManager.AppSettings["DocumentManagerPath"].ToString();

            Project project = null;
            using (rm = new ReportEntities())
            {
                project = rm.Projects.FirstOrDefault(pr => pr.ID == projectID);

                if (project != null)
                {
                    string CompanyID = project.ProjectCompany.ToString();

                    string projectPath = DocumentManagerPath + "\\" + CompanyID + "\\Projects\\" + projectID.ToString();
                    DirectoryInfo di = new DirectoryInfo(projectPath);

                    //TODO recreate folders that did not get created
                    recreateCompanyFolders(CompanyID);

                    if (di.Exists)
                    {
                        DirectoryInfo[] folders = di.GetDirectories();
                        FileInfo[] files = di.GetFiles();


                        projectNode = new TreeNode(project.ProjectName, di.FullName);
                        FolderTreeView.Nodes.Clear();

                        List<Survey> survs = null;
                        List<aspnet_Membership> team = null;

                        survs = rm.Surveys.Where(su => su.ProjectID == projectID).ToList();
                        team = (from m in rm.aspnet_Membership
                                join pt in rm.ProjectTeams
                                on m.UserId equals pt.UserID
                                where pt.ProjectID == projectID
                                select m).ToList();

                        FolderTreeView.Nodes.Add(projectNode);
                        addChildNodesToFolder(projectNode, projectID, survs, team);

                        TreeNode toSelect = FolderTreeView.Nodes[0];
                        if (toSelect != null)
                        {
                            toSelect.Select();
                        }
                        updateFolderList();
                        FolderTreeView.ExpandAll();
                    }
                }
            }
        }

        private bool recreateCompanyFolders(string companyID)
        {
            // Validate the user password
            string baseAddress = ConfigurationManager.AppSettings["ServiceAddress"].ToString() + "/RecreateCompanyDirectories";
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(baseAddress);
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.Timeout = 30000;

            string secretKey = Session["secretKey"].ToString();

            string json = "{\"secretKey\":\"" + secretKey + "\", \"companyID\":\"" + companyID + "\"}";
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
                    var response = (string)data["RRZResult"];
                    if (Utils.IsError(response))
                    {
                        errorLabel.Text = Utils.CleanError(response);
                        ErrorUpdatePanel.Visible = true;
                        AddCssClass(errorLabel, "autoHideMe");
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }
            }
            catch (Exception ee)
            {
                var error = ee.Message;
                errorLabel.Text = Utils.CleanError(error);
                ErrorUpdatePanel.Visible = true;
                AddCssClass(errorLabel, "autoHideMe");
                return false;
            }
        }

        protected void addChildNodesToFolder(TreeNode node, Guid projectID, List<Survey> survs, List<aspnet_Membership> team)
        {
            string Name = null;

            //Surveys;
            //ProjUsers;

            DirectoryInfo di = new DirectoryInfo(node.Value);
            if (di.Exists)
            {
                node.ChildNodes.Clear();
                DirectoryInfo[] folders = di.GetDirectories();

                TreeNode newNode;
                foreach (DirectoryInfo dir in folders)
                {
                    Name = null;
                    Guid guidName;
                    //Guid folders to be shown as the user name or survey title
                    if(Guid.TryParse(dir.Name, out guidName))
                    {
                        var sur = survs.FirstOrDefault(s => s.ID == guidName);
                        if (sur!=null) { Name = sur.SurveyTitle; }

                        var user = team.FirstOrDefault(u => u.UserId == guidName);
                        if (user != null) { Name = user.Firstnames + " " + user.Lastname; }
                    }

                    if (string.IsNullOrWhiteSpace(Name)) { Name = dir.Name; }   //Use the folder name if not provided

                    newNode = new TreeNode(Name, dir.FullName);
                    addChildNodesToFolder(newNode, projectID, survs, team);
                    node.ChildNodes.Add(newNode);
                }
                /*
                FileInfo[] files = di.GetFiles();
                foreach (FileInfo fil in files)
                {
                    newNode = new TreeNode(fil.Name);
                    node.ChildNodes.Add(newNode);
                }
                */
            }
        }


        protected void ShowFolderDirectory(object sender, EventArgs e)
        {
            updateFolderList();
        }

        protected void updateFolderList()
        {
            TreeNode rootNode = FolderTreeView.Nodes[0];
            Guid projID;
            string projIDStr = Request.QueryString.Get("projectID");

            string folder = "\"";
            TreeNode thisNode = FolderTreeView.SelectedNode;
            while (thisNode != null)
            {
                folder = "/" + thisNode.Text + folder;
                thisNode = thisNode.Parent;
            }
            docFolder.Value = "\"" + folder;
            

            if (!string.IsNullOrWhiteSpace(projIDStr))
            {
                if (Guid.TryParse(projIDStr, out projID))
                {
                    string selectedFolderFile = FolderTreeView.SelectedNode.Value;
                    DirectoryInfo di = new DirectoryInfo(selectedFolderFile);
                    FileInfo fi = new FileInfo(selectedFolderFile);

                    if (fi.Exists)
                    {
                        // selected a file
                        /*
                        downloadSelectedFileBtn.Enabled = true;
                        RemoveCssClass(downloadSelectedFileBtn, "disabled");
                        */

                        RemoveCssClass(downloadSelectedFileBtn, "btn-default");
                        AddCssClass(downloadSelectedFileBtn, "btn-info");

                        RemoveCssClass(deleteSelectedFileBtn, "btn-default");
                        AddCssClass(deleteSelectedFileBtn, "btn-info");

                        deleteHead.Text = "Are you sure you want to delete <strong>" + fi.Name + "</strong>?";
                        deleteSubHead.Text = "This action can not be undone.";
                        deleteFileBtn.Enabled = true;
                        deleteFileBtn.Visible = true;

                    }
                    else if (di.Exists)
                    {
                        /*
                        downloadSelectedFileBtn.Enabled = false;
                        AddCssClass(downloadSelectedFileBtn, "disabled");
                        */

                        RemoveCssClass(downloadSelectedFileBtn, "btn-info");
                        AddCssClass(downloadSelectedFileBtn, "btn-default");

                        RemoveCssClass(deleteSelectedFileBtn, "btn-info");
                        AddCssClass(deleteSelectedFileBtn, "btn-default");


                        deleteHead.Text = "No document selected!";
                        deleteSubHead.Text = "Please select a document to delete.";
                        deleteFileBtn.Enabled = false;
                        deleteFileBtn.Visible = false;

                    }

                    if (di.Exists)
                    {
                        DirectoryInfo[] folders = di.GetDirectories();
                        FileInfo[] files = di.GetFiles();

                        List<FileList> FolderFiles = new List<FileList>();

                        List<Survey> survs = null;
                        List<aspnet_Membership> team = null;

                        using (rm = new ReportEntities())
                        {
                            survs = rm.Surveys.Where(su => su.ProjectID == projID).ToList();
                            team = (from m in rm.aspnet_Membership
                                    join pt in rm.ProjectTeams
                                    on m.UserId equals pt.UserID
                                    where pt.ProjectID == projID
                                    select m).ToList();
                        }

                        string Name, Value, SizeString, DateString;
                        DateTime Date;
                        long Size;

                        /*
                        if (thisNode != rootNode)
                        {
                            FileList upfolder = new FileList()
                            {
                                Name = "...",
                                Value = di.Parent.FullName
                            };
                            FolderFiles.Add(upfolder);
                        }
                        */

                        foreach (DirectoryInfo dir in folders)
                        {
                            Name = "";
                            Value = "";
                            SizeString = "";
                            Size = 0;
                            DateString = "";
                            Date = DateTime.Today;

                            Guid guidName;
                            //Guid folders to be shown as the user name or survey title
                            if (Guid.TryParse(dir.Name, out guidName))
                            {
                                var sur = survs.FirstOrDefault(s => s.ID == guidName);
                                if (sur != null) { Name = sur.SurveyTitle; }

                                var user = team.FirstOrDefault(u => u.UserId == guidName);
                                if (user != null) { Name = user.Firstnames + " " + user.Lastname; }
                            }

                            if (string.IsNullOrWhiteSpace(Name)) { Name = dir.Name; }   //Use the folder name if not provided

                            Value = dir.FullName;
                            Date = dir.LastAccessTimeUtc;
                            DateString = Date.ToLongDateString();

                            FolderFiles.Add(new FileList()
                            {
                                Name = Name,
                                Value = Value,
                                Size = Size,
                                SizeString = SizeString,
                                ModifiedDate = Date,
                                ModifiedDateString = DateString
                            });
                        }

                        foreach (FileInfo fil in files)
                        {
                            Name = fil.Name;
                            Value = fil.FullName;
                            Size = fil.Length;
                            Date = fil.LastAccessTimeUtc;
                            DateString = Date.ToLongDateString();
                            SizeString = FormatFileSize(Size);

                            FolderFiles.Add(new FileList()
                            {
                                Name = Name,
                                Value = Value,
                                Size = Size,
                                SizeString = SizeString,
                                ModifiedDate = Date,
                                ModifiedDateString = DateString
                            });
                        }

                        FolderFile.DataSource = FolderFiles;
                        FolderFile.DataBind();
                    }
                    else
                    {
                        TreeNode parentNode = FolderTreeView.SelectedNode.Parent;

                        List<FileList> FolderFiles = new List<FileList>();
                        DirectoryInfo parent = new DirectoryInfo(parentNode.Value);

                        FileInfo[] files = parent.GetFiles();

                        string Name, Value, SizeString, DateString;
                        DateTime Date;
                        long Size;
                        int i=0,selectRow = 0;

                        foreach (FileInfo fil in files)
                        {
                            Name = fil.Name;
                            Value = fil.FullName;
                            Size = fil.Length;
                            Date = fil.LastAccessTimeUtc;
                            DateString = Date.ToLongDateString();
                            SizeString = FormatFileSize(Size);

                            if (fil.Name == selectedFolderFile)
                            {
                                selectRow = i;
                            }

                            FolderFiles.Add(new FileList()
                            {
                                Name = Name,
                                Value = Value,
                                Size = Size,
                                SizeString = SizeString,
                                ModifiedDate = Date,
                                ModifiedDateString = DateString
                            });
                            i += 1;
                        }

                        FolderFile.DataSource = FolderFiles;
                        FolderFile.DataBind();
                    }
                }
            }
        }

        protected void FolderTreeView_SelectedNodeChanged(object sender, EventArgs e)
        {
            updateFolderList();
        }

        protected void OnRowDataBound(object sender, System.Web.UI.WebControls.GridViewRowEventArgs e)
        {
            if (e.Row.RowType == DataControlRowType.DataRow)
            {
                e.Row.Attributes["onclick"] = Page.ClientScript.GetPostBackClientHyperlink(FolderFile, "Select$" + e.Row.RowIndex);
                e.Row.ToolTip = "Click to select this row.";
            }
        }

        protected void FolderFile_SelectedIndexChanged(object sender, EventArgs e)
        {
            string folder = FolderTreeView.SelectedNode.Value;
            string file = FolderFile.SelectedDataKey.Value.ToString();
            DirectoryInfo di = new DirectoryInfo(folder);
            FileInfo fi = new FileInfo(file);

            if (fi.Exists)
            {
                // selected a file
                /*
                downloadSelectedFileBtn.Enabled = true;
                RemoveCssClass(deleteSelectedFileBtn, "disabled");
                */

                RemoveCssClass(downloadSelectedFileBtn, "btn-default");
                AddCssClass(downloadSelectedFileBtn, "btn-info");

                RemoveCssClass(deleteSelectedFileBtn, "btn-default");
                AddCssClass(deleteSelectedFileBtn, "btn-info");

                deleteHead.Text = "Are you sure you want to delete <strong>" + fi.Name+ "</strong>?";
                deleteSubHead.Text = "This action can not be undone.";
                deleteFileBtn.Enabled = true;
                deleteFileBtn.Visible = true;
            }
            else if (di.Exists)
            {
                /*
                downloadSelectedFileBtn.Enabled = false;
                AddCssClass(downloadSelectedFileBtn, "disabled");
                */

                RemoveCssClass(downloadSelectedFileBtn, "btn-info");
                AddCssClass(downloadSelectedFileBtn, "btn-default");

                RemoveCssClass(deleteSelectedFileBtn, "btn-info");
                AddCssClass(deleteSelectedFileBtn, "btn-default");

                deleteHead.Text = "No document selected!";
                deleteSubHead.Text = "Please select a document to delete.";
                deleteFileBtn.Enabled = false;
                deleteFileBtn.Visible = false;
            }
            else
            {
                deleteHead.Text = "No document selected!";
                deleteSubHead.Text = "Please select a document to delete.";
                deleteFileBtn.Enabled = false;
                deleteFileBtn.Visible = false;
            }

            foreach (GridViewRow row in FolderFile.Rows)
            {
                if (row.RowIndex == FolderFile.SelectedIndex)
                {
                    string urlStr = FolderFile.SelectedDataKey.Value.ToString();
                    TreeNode parentNode = null;
                    if (fi.Exists) { parentNode = FolderTreeView.SelectedNode.Parent; }
                    else { parentNode = FolderTreeView.SelectedNode; }

                    var children = parentNode.ChildNodes;
                    foreach (TreeNode chi in children)
                    {
                        if (urlStr.EndsWith(chi.Value))
                        {
                            chi.Select();
                            updateFolderList();
                            return;
                        }
                    }
                }
            }

        }

        protected void rootBtn_Click(object sender, EventArgs e)
        {
            TreeNode rootNode = FolderTreeView.Nodes[0];
            rootNode.Select();
            updateFolderList();
        }

        private void projectRoot()
        {
            string userID = validate();
            if (Utils.IsError(userID))
            {
                //errorDiv.Visible = true;
                /*
                errorText.Text = Utils.CleanError(userID);
                await Task.Delay(5000);
                errorText.Text = "";
                */
                errorLabel.Text = Utils.CleanError(userID);
                AddCssClass(errorLabel, "autoHideMe");
            }
            else
            {
                //errorDiv.Visible = false;
                errorLabel.Text = "";

                if (!Page.IsPostBack)
                {
                    string projIDStr = Request.QueryString.Get("projectID");
                    if (!string.IsNullOrWhiteSpace(projIDStr))
                    {
                        Guid projID;
                        if (Guid.TryParse(projIDStr, out projID))
                        {
                            loadProjectDocuments(projID);
                            return;
                        }
                    }
                }
            }
        }

        protected void refreshBtn_Click(object sender, EventArgs e)
        {
            TreeNode rootNode = FolderTreeView.SelectedNode;
            rootNode.Select();
            updateFolderList();
        }
        /*
        protected void uploadBtn_Click(object sender, EventArgs e)
        {
            bool hasError = true;

            hasError = (!fileUploader.HasFile || string.IsNullOrWhiteSpace(docName.Text));

            string[] badChars = { " ","/", "\\", ":", "*", "?", "\"", ">", "<", "|" };

            if(!hasError)
            {
                string docRootPath = FolderTreeView.SelectedNode.Value;
                
                TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;

                string documentUrl = docFolder.Text;

                // check if misc docs folder
                if (documentUrl.EndsWith("SurveyDocs") || documentUrl.EndsWith("SurveyDocs\"") || documentUrl.EndsWith("ProjectDocs") || documentUrl.EndsWith("ProjectDocs\""))
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

                    docTypeDesc.Text = fileName + extension;

                    if(File.Exists(fileLocation)){
                        File.SetAttributes(fileLocation, FileAttributes.Normal);
                        File.Delete(fileLocation);
                    }

                    fileUploader.SaveAs(fileLocation);


                    hasError = false;
                    string projIDStr = Request.QueryString.Get("projectID");
                    if (!string.IsNullOrWhiteSpace(projIDStr))
                    {
                        Guid projID;
                        if (Guid.TryParse(projIDStr, out projID))
                        {
                            loadProjectDocuments(projID);
                            return;
                        }
                    }

                }
                else
                {
                    uploadErrorLbl.Text = "You can only upload to 'ProjectDocs' or 'SurveyDocs'";
                    uploadErrorLbl.Visible = true;
                    hasError = true;
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(docName.Text))
                {
                    uploadErrorLbl.Text = "Document name is required";
                    hasError = true;
                }
                if (!fileUploader.HasFile)
                {
                    uploadErrorLbl.Text = "No document provided";
                    hasError = true;
                }
                uploadErrorLbl.Visible = true;
            }

            /*
            var nameValues = HttpUtility.ParseQueryString(Request.QueryString.ToString());
            if (hasError)
            {
                nameValues.Set("haserror", "upload");
            }
            else
            {
                UpdateQueryString("haserror", "");
            }
            string url = Request.Url.AbsolutePath;
            Response.Redirect(url + "?" + nameValues); // ToString() is called implicitly
            * /
            if (hasError) { UpdateQueryString("haserror", "upload"); }
            else{ UpdateQueryString("haserror", ""); }
        }
        */
        private void UpdateQueryString(string queryString, string value)
        {
            PropertyInfo isreadonly = typeof(System.Collections.Specialized.NameValueCollection).GetProperty("IsReadOnly", BindingFlags.Instance | BindingFlags.NonPublic);
            isreadonly.SetValue(this.Request.QueryString, false, null);
            if (string.IsNullOrWhiteSpace(value))
            {
                this.Request.QueryString.Remove(queryString);
            }
            else
            {
                this.Request.QueryString.Set(queryString, value);
            }
            isreadonly.SetValue(this.Request.QueryString, true, null);
        }

        protected void downloadBtn_Click(object sender, EventArgs e)
        {
            GridViewRow selected = FolderFile.SelectedRow;
            if (selected != null)
            {
                string urlStr = FolderFile.SelectedDataKey.Value.ToString();
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
                    errorLabel.Text = "Could not find the document specified";
                    AddCssClass(errorLabel, "autoHideMe");
                }
            }
            else
            {
                /*
                errorText.Text = "No document is selected";
                await Task.Delay(5000);
                errorText.Text = "";
                */
                errorLabel.Text = "No document is selected";
                AddCssClass(errorLabel, "autoHideMe");
            }
        }

        protected void rootFolderBtn_Click(object sender, EventArgs e)
        {
            TreeNode rootNode = FolderTreeView.Nodes[0];
            rootNode.Select();
            updateFolderList();
        }

        protected void refreshFolderBtn_Click(object sender, EventArgs e)
        {
            TreeNode rootNode = FolderTreeView.SelectedNode;
            rootNode.Select();
            updateFolderList();
        }

        protected void downloadSelectedFileBtn_Click(object sender, EventArgs e)
        {
            if(FolderFile.SelectedIndex!=-1 & FolderFile.SelectedRow !=null)
            {
                GridViewRow selected = FolderFile.SelectedRow;
                string urlStr = FolderFile.SelectedDataKey.Value.ToString();
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
                    errorLabel.Text = "Could not find the selected file for download.";
                    AddCssClass(errorLabel, "autoHideMe");
                }
            }
            else
            {
                errorLabel.Text = "Please select a file to download.";
                AddCssClass(errorLabel, "autoHideMe");
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


        protected void uploadSelectedFileBtn_Click(object sender, EventArgs e)
        {
            string documentUrl = docFolder.Value;

            bool con1 = documentUrl.Contains("SurveyDocs");
            bool con2 = documentUrl.Contains("SurveyDocs\\");
            bool con3 = documentUrl.Contains("ProjectDocs");
            bool con4 = documentUrl.Contains("ProjectDocs\\");
                // check if misc docs folder
            if (documentUrl.Contains("SurveyDocs") || documentUrl.Contains("SurveyDocs\\") || documentUrl.Contains("ProjectDocs") || documentUrl.Contains("ProjectDocs\\"))
            {

                string more = "";
                if (documentUrl.Contains("SurveyDocs") || documentUrl.Contains("SurveyDocs\""))
                {
                    //get the folder with a guid name
                    string url = FolderTreeView.SelectedValue;

                    string folderName = url.Split('\\').LastOrDefault(n=>(!n.Contains('.') && n.Contains('-')));
                    more = "&sur=" + folderName;
                }

                string projIDStr = Request.QueryString.Get("projectID");
                Response.Redirect("DocumentUploader?projectID=" + projIDStr + "&dir=" + documentUrl + more, true);
            }
            else
            {
                /*
                errorText.Text = "You can only upload to 'ProjectDocs' or 'SurveyDocs'";
                await Task.Delay(5000);
                errorText.Text = "";
                */
                errorLabel.Text = "You can only upload to 'ProjectDocs' or 'SurveyDocs'";
                AddCssClass(errorLabel, "autoHideMe");
            }

        }

        protected void deleteFileBtn_Click(object sender, EventArgs e)
        {

            GridViewRow selected = FolderFile.SelectedRow;
            if (selected != null)
            {
                string fileLocation = FolderFile.SelectedDataKey.Value.ToString();

                if (File.Exists(fileLocation))
                {
                    File.SetAttributes(fileLocation, FileAttributes.Normal);
                    File.Delete(fileLocation);
                    updateFolderList();
                }
            }
        }

    }
    public class FileList
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public string SizeString { get; set; }
        public long Size { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ModifiedDateString { get; set; }
    }
}