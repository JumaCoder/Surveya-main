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

namespace Surveya_Application
{
    public partial class _Default : Page
    {

        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected void LogIn(object sender, EventArgs e)
        {
        }
        /*
        public string getMyDocuments(string secretKey)
        {
            try
            {
                //remove any extra whitespaces
                secretKey = TrimIfNotNull(secretKey);
                //userID = TrimIfNotNull(userID);

                var username = CheckUserHasRight(secretKey, "ViewUserDocuments");
                if (Utils.IsError(username))
                {
                    return username;
                }

                #region Check if the logged in user is assuming a company

                //check if the user is assuming a company
                var assumeResult = CheckAssumeCompany(secretKey);
                if (Utils.IsError(assumeResult))
                {
                    return assumeResult;
                }

                //parse the company ID to a Guid
                Guid CompanyID = Guid.Empty;
                if (!Guid.TryParse(assumeResult, out CompanyID))
                {
                    return Utils.WrapError("The ID of the Company that you are trying to view is in the incorrect format");
                }

                #endregion

                Guid LoggedInUserID = (Guid)Membership.GetUser(username).ProviderUserKey;

                using (Surveya_DevEntities entity = new Surveya_DevEntities())
                {
                    var docs = (from d in entity.Documents
                                where d.UserID == LoggedInUserID
                                orderby d.ExpiryDate descending
                                select new
                                {
                                    d.ID,
                                    d.TypeNumber,
                                    d.Name,
                                    d.TypeDescription,
                                    d.Link,
                                    d.ExpiryDate,
                                    d.UserID,
                                    d.ProjectID
                                }).ToList();

                    if (docs == null || docs.Count <= 0)
                    {
                        return "[]";
                    }

                    return Helper.SerializeToJavascriptOject(docs);

                }
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
        */


    }
}