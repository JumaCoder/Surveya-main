/*
	Created By		: RRZ Innovations (PTY) LTD | www.rrzinnovations.com
    Lead Developer  : Zahed Rassool
	Date Created	: 01 March 2016
	Description		: The WCF Service.
    Instructions    : Just ensure that everything is serialized to be compatible with JSON.
    Modified By     : Roxanne Rassool
    Date Modified   : 28 June 2016
    Description     : Added Login and Register methods 
    Modified By     :
    Date Modified   :
    Description     :

	Copyright RRZ Innovations (Pty) Ltd 2016
	This file and all it's contents is the property of RRZ Innovations and the respective client and shall, under no circumstance, be copied, resditrubuted or ammended without explicit permission from RRZ Innovations / the owning client.

*/

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace Surveya_Service
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "ISurveya_Service" in both code and config file together.
    [ServiceContract]
    public interface ISurveya_Service
    {
        /// <summary>
        /// A test method
        /// </summary>
        /// <param name="ID">Pass in a random ID</param>
        /// <returns>A list of names that matches that id</returns>
        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetNames"
        )]
       // [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        List<string> GetNames(string ID);

        #region Document Manager

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "RecreateCompanyDirectories"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string RecreateCompanyDirectories(string secretKey, string companyID);

        #endregion

        #region  Web Application Normal User Methods

        #region Features

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllFeatures"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetAllFeatures();

        #endregion

        #region Packages and Features

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllPackages"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetAllPackages(string isActive);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetSpecificPackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetSpecificPackage(string secretKey, string packageID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetMyPackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetMyPackage(string secretKey, string packageID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "RemoveMyPackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string RemoveMyPackage(string secretKey, string companyPackageID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeactivateMyPackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeactivateMyPackage(string secretKey, string companyPackageID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetMyPackageHistory"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetMyPackageHistory(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetDiscounts"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetDiscounts(string numberOfMonths);

        #endregion

        #region Package Signups

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "NewUserSignup"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string NewUserSignup(
            //user details 
             string firstname, string lastname, string contactNumber, string emailAddress, string password, string physicalAddress, string postalCode, string city, string country,
            //company details
             string companyName, string registrationNumber, string isVatRegistered, string vatNumber, string companyPhysicalAddress, string companyPostalCode, string companyCity, string companyCountry, string billEmail, string alternateBillEmail,
            //package details
             string packageID, string features, string numOfMonths, string purchaseOrderNumber);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ValidateUserSignUp"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ValidateUserSignUp(string firstname, string lastname, string contactNumber, string emailAddress, string password, string physicalAddress, string postalCode, string city, string country);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ValidateCompanySignUp"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ValidateCompanySignUp(string companyName, string registrationNumber, string isVatRegistered, string vatNumber, string billEmail,
           string alternateBillEmail, string companyAddress, string companyPostal, string companyCity, string companyCountry, string purchaseOrderNumber);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ValidatePackageSignup"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ValidatePackageSignup(string packageID, string features);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "NewPackageSignup"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string NewPackageSignup(string secretKey, string packageID, string features, string purchaseOrderNumber);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SignupForPackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SignupForPackage(
            string secretKey,
            //package details
            string packageID, string features, string numOfMonths, string startDate, string purchaseOrderNumber);

        #endregion
        
        #region Company

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AddCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AddCompany(string secretKey, string companyName, string registrationNumber, string isVatRegistered,
            string vatNumber, string companyPhysicalAddress, string companyPostalCode, string companyCity, string companyCountry,
            string billEmail, string alternateBillEmail);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "EditCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string EditCompany(string secretKey, string companyName, string registrationNumber, string vatNumber, string logo, string physicalAddress);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetMyCompanyDetails"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetMyCompanyDetails(string secretKey);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetSpecificCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetSpecificCompany(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetCompanyUsers"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetCompanyUsers(string secretKey, string getAll);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetActiveCompanyUsersNotInProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetActiveCompanyUsersNotInProject(string secretKey, string projectID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetActiveProjectUsersNotInSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetActiveProjectUsersNotInSurvey(string secretKey, string projectID, string surveyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SaveWhiteLabelling"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SaveWhiteLabelling(string secretKey, string logoLG, string logoSM, string selectedSkin, string selectedTheme);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetCompanyPackageDetails"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetCompanyPackageDetails(string secretKey);

        #endregion

        #region Users

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ResendAddUserInvite"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ResendAddUserInvite(string secretKey, string userID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AddUser"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AddUser(string secretKey, string firstnames, string lastname, string contactNumber,
            string emailAddress, string password, string country, string physicalAddress, string role);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateUser"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdateUser(string secretKey, string userID, string firstnames, string lastname,
            string contactNumber, string photo, string country, string physicalAddress, string roleID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateMyDetails"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdateMyDetails(string secretKey, string firstnames, string lastname,
            string contactNumber, string photo, string country, string physicalAddress,
            string passportNumber, string passportExpiryDate, string medicalAidName, string medicalAidNumber, string medicalAidContactNumber,
            string bloodType, string hasAllergy, string allergyDescription, string safetyBootsSize, string highVisibilityVestSize,
            string vaccinations, string emergencyContact1Fullname, string emergencyContact1ContactNumber, string emergencyContact1Relationship,
            string emergencyContact2Fullname, string emergencyContact2ContactNumber, string emergencyContact2Relationship);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "Login"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string Login(string username, string password);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ReauthenticateUser"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ReauthenticateUser(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ChangeMyPassword"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ChangeMyPassword(string secretKey, string oldPassword, string newPassword);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ResetPassword"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ResetPassword(string secretKey, string emailAddress);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ForgotMyPassword"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ForgotMyPassword(string emailAddress);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ResetMyPassword"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ResetMyPassword(string resetID, string newPassword);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeactivateUser"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeactivateUser(string secretKey, string userID);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ReactivateUser"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ReactivateUser(string secretKey, string userID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetUserDetails"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetUserDetails(string secretKey, string theUserID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetMyDetails"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetMyDetails(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AuthorizeLoginAttempt"
        )]
        [return: MessageParameter(Name = "RRZResult")]
        string AuthorizeLoginAttempt(string secretKey, string code);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "VerifyEmailAddress"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string VerifyEmailAddress(string verifyID);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "RequestVerifyEmailAddress"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string RequestVerifyEmailAddress(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetUser"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetUser(string secretKey);

        #endregion

        #region Rights and Roles

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AddRole"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead. 
        string AddRole(string secretKey, string roleName, string roleDescription, string rights);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateRole"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdateRole(string secretKey, string roleID, string roleName, string roleDescription, string rights);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeactivateRole"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeactivateRole(string secretKey, string roleID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ReactivateRole"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ReactivateRole(string secretKey, string roleID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ReassignUserToRole"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ReassignUserToRole(string secretKey, string theUserID, string newRoleID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetUsersInRole"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetUsersInRole(string secretKey, string roleID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllRolesForCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetAllRolesForCompany(string secretKey, string getAll);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllSysRoles"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetAllSysRoles(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllRightsForRole"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetAllRightsForRole(string secretKey, string roleID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllRights"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        //view a list of all the available rights 
        string GetAllRights(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateUserRoleInCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead. 
        string UpdateUserRoleInCompany(string secretKey, string userID, string newRoleID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateUserRoleInProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead. 
        string UpdateUserRoleInProject(string secretKey, string userID, string projectID, string newRoleID);


        #endregion

        #region Projects

        /*[OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AdminCreateProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AdminCreateProject(string secretKey,
            //project information
           string projectName, string projectDescription, string projectCountry, string primaryContactID,
            //if this is 0 then the questiosn for which data and files are required should not be asked
           string numberOfMembers,
            //timeline
           string startDate, string endDate,
            //what data is required for the project - these should be received as true / false
           string isPassportNumberRequired, string isPassportExpiryDateRequired, string isMedicalAidNameRequired,
           string isMedicalAidNumberRequired, string isMedicalAidContactNumberRequired, string isBloodTypeRequired,
           string isAllergiesRequired, string isAllergiesDescriptionRequired, string isVaccinationsRequired,
           string isSafetyBootsRequired, string isVestRequired,
            //what files are required for upload - these should be received as true / false
           string isPassportDocRequired, string isETicketDocRequired, string isVisaDocRequired, string isAccommodationDocRequired,
           string isVaccinationDocRequired, string isDriversLicenseDocRequired, string isCustomsClearanceDocRequired,
            //the company the project is for
           string companyID);
        */

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "CreateProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string CreateProject(string secretKey,
            //project information
             string projectName, string projectDescription, string projectCountry, string primaryContactID,
            //if this is 0 then the questiosn for which data and files are required should not be asked
             string numberOfMembers,
            //timeline
             string startDate, string endDate,
            //what data is required for the project - these should be received as true / false
             string isPassportNumberRequired, string isPassportExpiryDateRequired, string isMedicalAidNameRequired,
             string isMedicalAidNumberRequired, string isMedicalAidContactNumberRequired, string isBloodTypeRequired,
             string isAllergiesRequired, string isAllergiesDescriptionRequired, string isVaccinationsRequired,
             string isSafetyBootsRequired, string isVestRequired,
            //what files are required for upload - these should be received as true / false
             string isPassportDocRequired, string isETicketDocRequired, string isVisaDocRequired, string isAccommodationDocRequired,
             string isVaccinationDocRequired, string isDriversLicenseDocRequired, string isCustomsClearanceDocRequired, string otherInformation,
             string isEmergencyContactOneRequired, string isEmergencyContactTwoRequired, string companyToAddTo
             );


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "CreateDefaultProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string CreateDefaultProject(string secretKey, Guid LoggedInUserID, Guid CompanyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateProjectPrimaryInfo"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdateProjectPrimaryInfo(string secretKey,  string projectID,
            //project information
            string projectName, string projectDescription, string projectCountry, string primaryContactID,
            //if this is 0 then the questiosn for which data and files are required should not be asked
            string numberOfMembers,
            //timeline
            string startDate, string endDate
            );

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateProjectRequiredInfo"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdateProjectRequiredInfo(string secretKey,  string projectID,
            //what data is required for the project - these should be received as true / false
            string isPassportNumberRequired, string isPassportExpiryDateRequired, string isMedicalAidNameRequired,
            string isMedicalAidNumberRequired, string isMedicalAidContactNumberRequired, string isBloodTypeRequired,
            string isAllergiesRequired, string isAllergiesDescriptionRequired, string isVaccinationsRequired,
            string isSafetyBootsRequired, string isVestRequired,
            //what files are required for upload - these should be received as true / false
            string isPassportDocRequired, string isETicketDocRequired, string isVisaDocRequired, string isAccommodationDocRequired,
            string isVaccinationDocRequired, string isDriversLicenseDocRequired, string isCustomsClearanceDocRequired,
            string otherInformation, string isEmergencyContactOneRequired, string isEmergencyContactTwoRequired);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeactivateProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeactivateProject(string secretKey, string projectID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ReactivateProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ReactivateProject(string secretKey, string projectID);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AddTeamMember"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AddTeamMember(string secretKey, string projectID, string emailAddress, string roleID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "RemoveTeamMember"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string RemoveTeamMember(string secretKey, string projectID, string userID);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeactivateTeamMember"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeactivateTeamMember(string secretKey, string projectID, string userID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ReactivateTeamMember"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ReactivateTeamMember(string secretKey, string projectID, string userID);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ResendTeamMemberInvite"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ResendTeamMemberInvite(string secretKey, string projectID, string userID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ImportProjectTeam"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ImportProjectTeam(string secretKey, string fromProjectID, string toProjectID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "RequestProjectDocuments"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string RequestProjectDocuments(string secretKey, string projectID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "WelcomeProjectTeamEmail"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string WelcomeProjectTeamEmail(string secretKey, string projectID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetTeamMembers"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetTeamMembers(string secretKey, string projectID, string getAll);

        /*[OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AdminImportTeam"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AdminImportTeam(string secretKey, string companyID, string fromProjectID, string toProjectID);
        */

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "StartProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string StartProject(string secretKey, string projectID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "EndProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string EndProject(string secretKey, string projectID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllProjectsForCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetAllProjectsForCompany(string secretKey, string getAll);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetSpecificProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetSpecificProject(string secretKey, string projectID);

        #endregion

        #region Documents

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "getMyDocuments"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string getMyDocuments(string secretKey);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "importUserDocsToProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string importUserDocsToProject(string secretKey, string projectID, string replaceFile);

        /*[OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ViewUserDocuments"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ViewUserDocuments(string secretKey, string companyID, string userID);*/

        /*[OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AddUserDocument"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AddUserDocument(string secretKey, string companyID, string userID, string docType, string classification, string link);*/

        /*[OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeleteUserDocument"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeleteUserDocument(string secretKey, string companyID, string documentID);
        */

        /*[OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ViewProjectDocuments"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ViewProjectDocuments(string secretKey, string companyID, string projectID);
        */
        /*[OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AddProjectDocument"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AddProjectDocument(string secretKey, string companyID, string projectID, string docType, string classification, string link);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "MoveProjectDocument"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string MoveProjectDocument(string secretKey, string companyID, string documentID, string link);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeleteProjectDocument"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeleteProjectDocument(string secretKey, string companyID, string documentID);
        */

        #endregion

        #region Surveys

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AddSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AddSurvey(string secretKey, string surveyTitle, string projectID, string purpose, string companyToAddTo, string affectedUserID, string conclusion, string isPageView, string theme);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdateSurvey(string secretKey, string surveyID, string surveyTitle, string purpose, string conclusion, string isPageView, string theme);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateSurveyView"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdateSurveyView(string secretKey, string surveyID, string isPageView);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllSurveysForProject"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetAllSurveysForProject(string secretKey, string projectID, string getAll);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllSurveysForMyCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetAllSurveysForMyCompany(string secretKey, string getAll);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetSpecificSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetSpecificSurvey(string secretKey, string surveyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeactivateSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeactivateSurvey(string secretKey, string surveyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ReactivateSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ReactivateSurvey(string secretKey, string surveyID);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AddTeamMemberToSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AddTeamMemberToSurvey(string secretKey,string surveyID, string userID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "RemoveTeamMemberFromSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string RemoveTeamMemberFromSurvey(string secretKey, string surveyID, string userID);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetTeamMembersForSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetTeamMembersForSurvey(string secretKey, string surveyID, string getAll);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeactivateTeamMemberForSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeactivateTeamMemberForSurvey(string secretKey, string surveyID, string userID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ReactivateTeamMemberForSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ReactivateTeamMemberForSurvey(string secretKey, string surveyID, string userID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DuplicateSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DuplicateSurvey(string secretKey, string fromSurveyID, string surveyTitle, string purpose, string conclusion, string isPageView, string theme);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "StartSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string StartSurvey(string secretKey,  string surveyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "EndSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string EndSurvey(string secretKey,string surveyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeleteSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeleteSurvey(string secretKey, string surveyID);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GenerateSurveyEmailLink"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GenerateSurveyEmailLink(string secretKey, string surveyID, string userID);

        #endregion

        #region QuestionGroups

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "CreateQuestionGroup"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        //string CreateQuestionGroup(string secretKey, string groupType, string groupName, string surveyID, string parentGroupID, string companyToAddTo, string affectedUserID);
        string CreateQuestionGroup(string secretKey, string groupType, string groupName, string surveyID, string parentGroupID, string companyToAddTo, string affectedUserID, string groupHeading);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "RemoveQuestionGroup"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string RemoveQuestionGroup(string secretKey, string groupID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "RemoveQuestionGroupAndQuestions"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string RemoveQuestionGroupAndQuestions(string secretKey, string groupID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateQuestionGroup"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        //string UpdateQuestionGroup(string secretKey,  string groupID, string groupName);
        string UpdateQuestionGroup(string secretKey, string groupID, string groupName, string groupHeading);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetGroupsAndQuestionsForSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetGroupsAndQuestionsForSurvey(string secretKey, string surveyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "MoveQuestionGroup"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string MoveQuestionGroup(string secretKey, string surveyID, string groupIDToMove, string groupIDBelow);

        #endregion

        #region Questions

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetQuestionTypes"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetQuestionTypes(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetQuestionRegex"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetQuestionRegex(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "CreateQuestion"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string CreateQuestion(string secretKey,  string questionText, string questionTypeID, string questionValues, string groupID,
            //validation
            string regexPattern, string regexError, string minimumValue, string maximumValue,
            string requiredQuestion, string containsValue, string equalsValue, string notEqualsValue,
            string startsWithValue, string endsWithValue, string lengthValue, string calculationValue, string hasSum);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "RemoveQuestion"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string RemoveQuestion(string secretKey, string questionID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetSpecificQuestion"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetSpecificQuestion(string secretKey, string questionID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateQuestion"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdateQuestion(string secretKey, string questionID, string questionText, string questionTypeID, string questionValues,
            //validation
           string regexPattern, string regexError, string minimumValue, string maximumValue,
           string requiredQuestion, string containsValue, string equalsValue, string notEqualsValue,
           string startsWithValue, string endsWithValue, string lengthValue, string minimumLength, string maximumLength, string calculationValue, string hasSum);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "MoveQuestion"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string MoveQuestion(string secretKey, string groupID, string questionIDToMove, string questionIDBelow);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllSurveyQuestions"
        )]
        [return: MessageParameter(Name = "RRZResult")]
        string GetAllSurveyQuestions(string secretKey, string surveyID);

        #endregion

        #region Question Group Rows

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "CreateQuestionRow"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string CreateQuestionRow(string secretKey, string groupID, string rowText);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "RemoveQuestionRow"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string RemoveQuestionRow(string secretKey, string questionRowID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateQuestionRow"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdateQuestionRow(string secretKey, string rowID, string rowText);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "MoveQuestionRow"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string MoveQuestionRow(string secretKey, string groupID, string rowIDToMove, string rowIDBelow);

        #endregion

        #region Question Group Piping

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AddPiping"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AddPiping(string secretKey, string surveyID, string groupID, string pipingConditions, string show);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeletePiping"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeletePiping(string secretKey, string surveyID, string pipingID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdatePiping"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdatePiping(string secretKey, string surveyID, string pipingID, string groupID, string pipingConditions, string show);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetGroupPiping"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetGroupPiping(string secretKey, string groupID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllPiping"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetAllPiping(string secretKey, string surveyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetSurveyQuestionNotInGroup"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetSurveyQuestionNotInGroup(string secretKey, string surveyID, string groupID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetSurveyQuestionNumerical"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetSurveyQuestionNumerical(string secretKey, string surveyID);

        #endregion

        #region Activity Stream

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ViewUserActivityStream"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ViewUserActivityStream(string secretKey, string dateToViewFrom);

        /*[OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ViewUserFullActivityStream"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ViewUserFullActivityStream(string secretKey, string dateToViewFrom);*/

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ViewProjectActivityStream"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ViewProjectActivityStream(string secretKey, string projectID, string dateToViewFrom);

        /*[OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "FilterUserActivityStream"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string FilterUserActivityStream(string secretKey, string dateToViewFrom, string type);*/


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetUsersFilter"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetUsersFilter(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetProjectsFilter"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetProjectsFilter(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetSurveysFilter"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetSurveysFilter(string secretKey);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "FilterActivityStream"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string FilterActivityStream(string secretKey, string dateToViewFrom, string userID, string projectID, string surveyID);

        #endregion

        #region Emails

        /*[OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetEmailImage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetEmailImage(string companyID);*/

        #endregion

        #region Payments and Invoices

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "CompletePurchase"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string CompletePurchase(string secretKey, string companyPackageID, string dateStart, string paymentMethod);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GenerateInvoice"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GenerateInvoice(string secretKey, string companyPackageID, string numberMonthsSignedUpFor);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ValidatePayment"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ValidatePayment(string secretKey, string companyPackageID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "CompletePurchaseOnPendingPackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string CompletePurchaseOnPendingPackage(string secretKey, string companyPackageID, string dateStart, string paymentMethod);

        #endregion

        #region Cart

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetMyCart"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetMyCart(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetMyCartDetails"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetMyCartDetails(string secretKey, string companyPackageID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ClearMyCart"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ClearMyCart(string secretKey);

        #endregion

        #region Responses

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetResponseStats"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetResponseStats(string secretKey, string surveyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "CopyResponsesToAudit"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string CopyResponsesToAudit(string secretKey, string surveyID);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "BulkUpdateAuditedResponses"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string BulkUpdateAuditedResponses(string secretKey, string surveyID, string filename);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAuditedResponseImage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetAuditedResponseImage(string secretKey, string auditedResponseID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetOriginalResponses"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetOriginalResponses(string secretKey, string surveyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetOriginalResponseImage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetOriginalResponseImage(string secretKey, string responseID);

        #endregion

        #region Reports

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "CreateDynamicReport"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string CreateDynamicReport(string secretKey, string ReportName, string surveyID, string companyToAddTo);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetDynamicReports"
        )]
        [return: MessageParameter(Name = "RRZResult")]
        string GetDynamicReports(string secretKey, string surveyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetSpecificDynamicReport"
        )]
        [return: MessageParameter(Name = "RRZResult")]
        string GetSpecificDynamicReport(string secretKey, string reportID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "CreateDynamicReportFilter"
        )]
        [return: MessageParameter(Name = "RRZResult")]
        string CreateDynamicReportFilter(string secretKey, string reportID, string surveyID, string filterName, string companyToAddTo,
            string questionID1, string questionCondition1, string questionCompareValue1,
            string questionID2, string questionCondition2, string questionCompareValue2,
            string questionID3, string questionCondition3, string questionCompareValue3,
            string questionID4, string questionCondition4, string questionCompareValue4,
            string questionID5, string questionCondition5, string questionCompareValue5,
            string questionID6, string questionCondition6, string questionCompareValue6);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateDynamicReportFilter"
        )]
        [return: MessageParameter(Name = "RRZResult")]
        string UpdateDynamicReportFilter(string secretKey, string filterID, string filterName, string companyToAddTo,
            string questionID1, string questionCondition1, string questionCompareValue1,
            string questionID2, string questionCondition2, string questionCompareValue2,
            string questionID3, string questionCondition3, string questionCompareValue3,
            string questionID4, string questionCondition4, string questionCompareValue4,
            string questionID5, string questionCondition5, string questionCompareValue5,
            string questionID6, string questionCondition6, string questionCompareValue6);

        #endregion

        #endregion

        #region Web Application Administrator Methods

        #region System Companies

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemCompanies"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemCompanies(string secretKey, string getActive);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemGetCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemGetCompany(string secretKey, string companyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemGetCompanyMainUser"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemGetCompanyMainUser(string secretKey, string companyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemGetCompanyPackages"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemGetCompanyPackages(string secretKey, string companyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemGetCompanyPackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemGetCompanyPackage(string secretKey, string companyPackageID);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemDeactivateCompanyPackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemDeactivateCompanyPackage(string secretKey, string companyPackageID, string reason);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemActivateCompanyPackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemActivateCompanyPackage(string secretKey, string companyPackageID, string reason);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemViewCompanyPackageHistory"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemViewCompanyPackageHistory(string secretKey, string companyPackageID, string companyID);

        #endregion

        #region System Signups

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemSignups"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemSignups(string secretKey, string filterType);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemSignupHide"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemSignupHide(string secretKey, string companyPackageID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemSignupViewPayments"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemSignupViewPayments(string secretKey, string invoiceID);

        #endregion

        #region Packages

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemAddPackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemAddPackage(string secretKey, string numberOfSurveys, string numberOfQuestions, string numberOfUsers,/* string startDate,*/
             string numberOfResponses, string packageName, string price, string description, string numberOfProjects, /*string numberOfMonthsValidFor,*/ string features);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemUpdatePackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemUpdatePackage(string secretKey, string packageID, string numberOfSurveys, string numberOfQuestions, string numberOfUsers, /* string startDate,*/
          string numberOfResponses, string packageName, string price, string description, string numberOfProjects, /*string numberOfMonthsValidFor,*/ string features);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemActivatePackage"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemActivatePackage(string secretKey, string packageID, string activate);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemViewExpiringPackages"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemViewExpiringPackages(string secretKey);


        #endregion

        #region Payments and Invoices

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "SystemCapturePayment"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string SystemCapturePayment(string secretKey, string invoiceID, string datePaid, string paymentAmount);
        //string SystemCapturePayment(string secretKey, string invoiceID, string datePaid, string paymentAmount, string dateStart);


        #endregion

        #region Global Settings

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateGlobalSetting"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdateGlobalSetting(string secretKey, string settingID, string settingValue, string isEnabled);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "EnableGlobalSetting"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string EnableGlobalSetting(string secretKey, string settingID, string isEnabled);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ViewGlobalSettings"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ViewGlobalSettings(string secretKey);

        #endregion

        #region Assume a Company

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "StartAssumeCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string StartAssumeCompany(string secretKey, string companyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "StopAssumeCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string StopAssumeCompany(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetCurrentAssumeCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetCurrentAssumeCompany(string secretKey);

        #endregion

        #region Rights and Roles

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AddSystemRole"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AddSystemRole(string secretKey, string roleName, string roleDescription, string rights);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UpdateSystemRole"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UpdateSystemRole(string secretKey, string roleID, string roleName, string roleDescription, string rights);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DeactivateSystemRole"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DeactivateSystemRole(string secretKey, string roleID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ReactivateSystemRole"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ReactivateSystemRole(string secretKey, string roleID);

        #endregion

        #endregion

        #region Mobile Application

        #region Surveys

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetSurveysForUser"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetSurveysForUser(string secretKey);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DownloadSurveys"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        //string DownloadSurveys(string secretKey, string surveyIDs);
        string DownloadSurveys(string secretKey, string surveyIDs, string preview);

        #endregion

        #region Users

        /*[OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "LoginMobileUser"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string LoginMobileUser(string username, string password);*/

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "LoginAdminMobileUser"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string LoginAdminMobileUser(string secretKey, string password);

        #endregion

        #region Responses

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "StartSync"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string StartSync(string secretKey, string surveyID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "StopSync"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string StopSync(string secretKey, string syncID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UploadResponse"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        //string UploadResponse(string secretKey, string syncID, string responseID, string dateCreated, string isCompleted, string responseQuestions, string version);
        string UploadResponse(string secretKey, string syncID, string responseID, string dateCreated, string isCompleted, string responseQuestions, string version, string surveyName);


        #endregion

        #endregion

        #region Emailed Surveys

        #region Surveys

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "VerifySurveyEmailLink"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string VerifySurveyEmailLink(string id);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "DownloadEmailedSurvey"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string DownloadEmailedSurvey(string id, string responseId);

        #endregion

        #region Responses

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "StartEmailedSurveySync"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string StartEmailedSurveySync(string id);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "StopEmailedSurveySync"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string StopEmailedSurveySync(string id, string syncID);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UploadEmailedSurveyResponse"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UploadEmailedSurveyResponse(string id, string syncID, string responseID, string dateCreated,
           string isCompleted, string responseQuestions, string version, string surveyName);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "UploadPartialSurveyResponse"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string UploadPartialSurveyResponse(string responseID, string dateCreated,
            string responseQuestions, string version, string surveyName);

        #endregion

        #endregion

        #region API Methods



        #endregion

        #region Coupons


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GenerateCoupon"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GenerateCoupon(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetAllCoupons"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetAllCoupons(string secretKey);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetUserCoupons"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetUserCoupons(string secretKey, string top);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetCouponCount"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetCouponCount(string secretKey);

        #endregion


        #region CRM for World Bank

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetTradersForEnumerator"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetTradersForEnumerator(string secretKey, string includeComplete, string getAll, string statusList);

        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetTraderTotals"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetTraderTotals(string secretKey);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ReassignTraderToUser"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ReassignTraderToUser(string secretKey, string traderId, string userId);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "ScheduleTraderCall"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string ScheduleTraderCall(string secretKey, string traderId, string scheduleDate);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "StartTraderCall"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string StartTraderCall(string secretKey, string traderId);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "RefuseTraderCall"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string RefuseTraderCall(string secretKey, string traderId);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "CompleteTraderCall"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string CompleteTraderCall(string secretKey, string traderId);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "AddNoteForTraderCall"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string AddNoteForTraderCall(string secretKey, string traderId, string text);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetHistoryForTraderCall"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetHistoryForTraderCall(string secretKey, string traderId);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "GetEnumeratorsForCompany"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string GetEnumeratorsForCompany(string secretKey, string getAll);


        [OperationContract]
        [WebInvoke(
                BodyStyle = WebMessageBodyStyle.Wrapped,
                Method = "POST",
                RequestFormat = WebMessageFormat.Json,
                ResponseFormat = WebMessageFormat.Json,
                UriTemplate = "NewCRMTrader"
        )]
        [return: MessageParameter(Name = "RRZResult")]//Remove this to have your results use the name of the method instead.
        string NewCRMTrader(string secretKey, string traderName, string participantName, string contactNumber, string email);

        #endregion

    }
}
