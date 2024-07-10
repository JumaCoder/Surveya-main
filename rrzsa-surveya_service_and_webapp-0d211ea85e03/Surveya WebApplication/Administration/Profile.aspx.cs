using Newtonsoft.Json.Linq;
using RRZTools;
using Surveya_Application.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Surveya_Application.Administration
{
    public partial class Profile : System.Web.UI.Page
    {
        public static string[] TypeList = 
        { 
            "Other", "Passport", "Visa",
            "Vaccination Certificates", 
            "Customs Clearance Certificates", 
            "ETickets", "Accommodation Confirmation", 
            "Drivers License" 
        };
        List<Document> docList;
        ReportEntities rm;
        protected string validate(string secretKey)
        {
            if (secretKey == null)
            {
                return Utils.WrapError("Authentication failed, invalid secret key.");
            }

            string validationResult = Helper.ValidateKey(secretKey);

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

        protected void Page_Load(object sender, EventArgs e)
        {
            //string userID = validate();
            //if (Utils.IsError(userID))
            //{
            //    errorText.Visible = true;
            //    errorText.Text = Utils.CleanError(userID);
            //}
            //else
            //{
            //    errorText.Visible = false;
            //    errorText.Text = "";

            //    if (!Page.IsPostBack)
            //    {
            //        docList = getDocumentList(userID);
            //        UserDocList.DataSource = docList;
            //        UserDocList.DataBind();
            //    }
            //}
        }

        private List<Document> getDocumentList(string userID)
        {
            List<Document> docList = null;
            Guid uID;

            if (Guid.TryParse(userID, out uID))
            {
                using (rm = new ReportEntities())
                {
                    docList = rm.Documents.Where(d => d.UserID == uID).ToList();
                }
            }
            return docList;
        }

        protected void EditDocument(object sender, ListViewEditEventArgs e)
        {
            //UserDocList.EditIndex = e.NewEditIndex;
        }

        protected void EditCheck(object sender, ListViewUpdateEventArgs e)
        {
            /*
            HiddenField DocID = UserDocList.Items[e.ItemIndex].FindControl("DocID") as HiddenField;
            TextBox NameEdit = UserDocList.Items[e.ItemIndex].FindControl("NameEdit") as TextBox;
            DropDownList TypeEdit = UserDocList.Items[e.ItemIndex].FindControl("TypeEdit") as DropDownList;

            int id = int.Parse(DocID.Value);
            int typeNumber = int.Parse(TypeEdit.SelectedValue);
            
            foreach (var docItem in docList.Where(d => d.ID = id))
            { 
                docItem.DocumentName = NameEdit.Text;
                docItem.TypeNumber = typeNumber;
            }
            */
        }

        protected void OnRowDataBound(object sender, GridViewRowEventArgs e)
        {
            if (e.Row.RowType == DataControlRowType.DataRow)
            {
                string item = e.Row.Cells[0].Text;
                foreach (LinkButton button in e.Row.Cells[2].Controls.OfType<LinkButton>())
                {
                    if (button.CommandName == "Delete")
                    {
                        button.Attributes["onclick"] = "if(!confirm('Do you want to delete " + item + "?')){ return false; };";
                    }
                }
            }
        }

        protected void DeleteDocument(object sender, GridViewDeleteEventArgs e)
        {
            //errorText.Text = e.Keys.ToString();
        }

        [WebMethod]
        public string getMyDocuments(string secretKey)
        {
            string userID = validate(secretKey);
            if (Utils.IsError(userID))
            {
                return Utils.CleanError(userID);
            }
            else
            {
                Guid uID;
                if (Guid.TryParse(userID, out uID))
                {
                    using (rm = new ReportEntities())
                    {
                        docList = rm.Documents.Where(d => d.UserID == uID).ToList();
                        return Helper.SerializeToJavascriptOject(docList);
                    }
                }
                return Helper.SerializeToJavascriptOject("[]");
            }
        }
    }
}