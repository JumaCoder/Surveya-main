/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
23 November 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 23 November 2016
 Title   		: 26_schema_2016.11.1.1
 Purpose  		: Add whitelabelling for companies
 Instructions 	: Run after 25_schema_2016.11.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='26'
WHERE SettingName = 'DBVersion'
GO

ALTER PROCEDURE [dbo].[GetProjectDetails]
	@projectID UNIQUEIDENTIFIER
AS
	SELECT  p.ID, p.ProjectName, p.ProjectDescription, p.ProjectCountry, p.NumberOfMembers, p.StartDate, p.EndDate,
			PrimaryContact = p.UserID,  PrimaryContactName = m.Firstnames + ' ' + m.Lastname, PrimaryContactEmail = m.Email,
			p.ActualStartDate, p.ActualEndDate, p.IsPassportNumberRequired, p.IsPassportExpiryDateRequired, p.IsMedicalAidNameRequired,
			p.IsMedicalAidNumberRequired, p.IsMedicalAidContactNumberRequired, p.IsBloodTypeRequired, p.IsAllergiesRequired, p.IsAllergiesDescriptionRequired,
			p.IsVaccinationsRequired, p.IsSafetyBootsRequired, p.IsVestRequired, p.IsPassportDocRequired, p.IsETicketDocRequired, p.IsVisaDocRequired,
			p.IsAccommodationDocRequired, p.IsVaccinationDocRequired, p.IsDriversLicenseDocRequired, p.IsCustomsClearanceDocRequired,CompanyID = p.ProjectCompany,
			p.IsEmergencyContactOneRequired, p.IsEmergencyContactTwoRequired,
			p.CreatedBy, p.DateCreated, p.UpdatedBy, p.DateUpdated, p.StartedByUserID, p.EndedByUserID, p.IsActive, OtherInformation = p.OtherInfoRequired,
			(SELECT COUNT(t.UserID) FROM ProjectTeam t WHERE t.ProjectID = @projectID) AS 'NumberOfProjectUsers',
			(SELECT COUNT(s.ID) FROM Survey s WHERE s.ProjectID = @projectID) AS 'NumberOfSurveys'
	FROM Project p
	JOIN aspnet_Membership m 
	on p.UserID = m.UserID
	WHERE p.ID = @projectID
GO

