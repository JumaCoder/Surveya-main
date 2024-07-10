/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 5 August 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 5 August 2016
 Title   		: 07_schema_2016.08.1.1
 Purpose  		: 
 Instructions 	: Run after 06_schema_2016.07.1.1.sql

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='07'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE Company
ADD PhysicalAddress VARCHAR(MAX) NULL
GO

ALTER TABLE ProjectTeam
ADD IsActive BIT
GO

ALTER TABLE SurveyTeam
ADD IsActive BIT
GO


-- table to store the activity stream 
/*CREATE TABLE ActivityStream
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	ProjectID UNIQUEIDENTIFIER,													-- project that was affected
	PerformedByUserID UNIQUEIDENTIFIER,											-- user that performed the activity
	AffectedUserID UNIQUEIDENTIFIER,											-- user that was affected by the activity
	SurveyID UNIQUEIDENTIFIER,													-- survey that was affected														-- link to relevant file
	ActivityMessage VARCHAR(MAX),												-- the activity that was performed
	ActivityDate DATETIME,														-- the date the activity occurred
	ActivityType VARCHAR(256),													-- the type of the action that occurred
	PackageID UNIQUEIDENTIFIER,
	RoleID UNIQUEIDENTIFIER,
	DocumentID UNIQUEIDENTIFIER,
	QuestionID UNIQUEIDENTIFIER,
	QuestionGroupID UNIQUEIDENTIFIER,
	CompanyID UNIQUEIDENTIFIER
)
GO*/

CREATE TABLE ActivityStream
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	

	CompanyID UNIQUEIDENTIFIER,

	-- user that was affected by the change
	AffectedUserID UNIQUEIDENTIFIER,												-- project / user  / survey  / package / role / document  / question  / questiongroup / company that was affected 
	AffectedUserFullName VARCHAR(256),

	
	-- user that performed the activity
	PerformedByUserID UNIQUEIDENTIFIER,													
	PerformedByUserFullName VARCHAR(256),


	-- link to any document uploaded
	link VARCHAR(MAX),

	-- project that was affected
	ProjectID UNIQUEIDENTIFIER,
	ProjectName VARCHAR(256),

	-- survey that was affected
	SurveyID UNIQUEIDENTIFIER,
	SurveyName VARCHAR(256),


	-- the activity that was performed and its details
	ActivityMessage VARCHAR(MAX),												
	ActivityDate DATETIME,													-- the date the activity occurred
	ActivityType VARCHAR(256)												-- the group that the activity falls under (project / user  / survey  / package / role / document  / question  / questiongroup / company)
)
GO


CREATE PROCEDURE GetActiveCompanyUsersNotInProject
	@companyID UNIQUEIDENTIFIER,
	@projectID UNIQUEIDENTIFIER
AS
	SELECT u.UserId, u.Firstnames, u.Lastname, u.Email, u.ContactNumber, u.Country, c.CompanyID, c.RoleID, r.RoleName, u.IsLockedOut ^ 1 as IsActive
	from aspnet_Membership u
	join CompanyUsers c
	on u.UserId = c.UserID
	join Roles r
	on c.RoleID = r.RoleId
	where c.CompanyID = @companyID AND u.IsLockedOut = 0 
	AND u.UserId NOT IN 
	(
		SELECT t.UserID
		FROM ProjectTeam t
		WHERE t.ProjectID = @projectID
	)
	order by u.Firstnames, u.Lastname
GO
       
CREATE PROCEDURE GetActiveProjectUsersNotInSurvey
	@companyID UNIQUEIDENTIFIER,
	@projectID UNIQUEIDENTIFIER,
	@surveyID UNIQUEIDENTIFIER
AS
	SELECT u.UserId, u.Firstnames, u.Lastname, u.Email
	from aspnet_Membership u
	join CompanyUsers c
	on u.UserId = c.UserID
	
	where c.CompanyID = @companyID 
	AND u.UserId IN 
	(
		SELECT t.UserID
		FROM ProjectTeam t
		WHERE t.ProjectID = @projectID AND t.IsActive = 1
	)
	AND u.UserId NOT IN 
	(
		SELECT t.UserID
		FROM SurveyTeam t
		WHERE t.SurveyID = @surveyID
	)
	order by u.Firstnames, u.Lastname
GO
  
CREATE PROCEDURE GetCompanyUsersInProject
	@companyID UNIQUEIDENTIFIER,
	@projectID UNIQUEIDENTIFIER
AS
	SELECT u.UserId, u.Firstnames, u.Lastname, u.Email, u.ContactNumber, u.Country, c.CompanyID, c.RoleID, r.RoleName, u.IsLockedOut ^ 1 as IsActive
	from aspnet_Membership u
	join CompanyUsers c
	on u.UserId = c.UserID
	join Roles r
	on c.RoleID = r.RoleId
	where c.CompanyID = @companyID AND u.IsLockedOut = 0 
	AND u.UserId NOT IN 
	(
		SELECT t.UserID
		FROM ProjectTeam t
		WHERE t.ProjectID = @ProjectID
	)
	order by u.Firstnames, u.Lastname
GO                        


CREATE PROCEDURE GetProjectDetails
	@projectID UNIQUEIDENTIFIER
AS
	SELECT  p.ID, p.ProjectName, p.ProjectDescription, p.ProjectCountry, p.NumberOfMembers, p.StartDate, p.EndDate,
			PrimaryContact = p.UserID,  PrimaryContactName = m.Firstnames + ' ' + m.Lastname, PrimaryContactEmail = m.Email,
			p.ActualStartDate, p.ActualEndDate, p.IsPassportNumberRequired, p.IsPassportExpiryDateRequired, p.IsMedicalAidNameRequired,
			p.IsMedicalAidNumberRequired, p.IsMedicalAidContactNumberRequired, p.IsBloodTypeRequired, p.IsAllergiesRequired, p.IsAllergiesDescriptionRequired,
			p.IsVaccinationsRequired, p.IsSafetyBootsRequired, p.IsVestRequired, p.IsPassportDocRequired, p.IsETicketDocRequired, p.IsVisaDocRequired,
			p.IsAccommodationDocRequired, p.IsVaccinationDocRequired, p.IsDriversLicenseDocRequired, p.IsCustomsClearanceDocRequired,CompanyID = p.ProjectCompany,
			p.CreatedBy, p.DateCreated, p.UpdatedBy, p.DateUpdated, p.StartedByUserID, p.EndedByUserID, p.IsActive, OtherInformation = p.OtherInfoRequired,
			(SELECT COUNT(t.UserID) FROM ProjectTeam t WHERE t.ProjectID = @projectID) AS 'NumberOfProjectUsers',
			(SELECT COUNT(s.ID) FROM Survey s WHERE s.ProjectID = @projectID) AS 'NumberOfSurveys'
	FROM Project p
	JOIN aspnet_Membership m 
	on p.UserID = m.UserID
	WHERE p.ID = @projectID

GO

UPDATE Application_Rights
SET RightGroup = 'Project',
	Name = 'ViewProjectActivityStream',
	FriendlyName = 'View Project Activity Streams',
	Description = 'View the activity stream for a project'
WHERE ID = 'DE690439-1D00-484F-961F-C6580BEB350B'
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES 
('63E3D483-0F59-4B76-BA50-ADBEB4F46195','Survey','DuplicateSurvey','Duplicate a survey', 'Duplicate a survey, its team members and/or questions'),
('B47DBBD3-749E-475D-A89E-05CCB896D0E8','Survey','StartSurvey','Start a survey', 'Start a survey'),
('50E69B72-FABF-49CD-BE43-47D3A8B7222F','Survey','EndSurvey','End a survey', 'End a Survey'),
('415A665E-D41C-43D4-A2AA-B0541CB0D0B9','Survey','ActivateTeamMemberSurvey','Activate Users on a survey', 'Reactivate / Deactivate users on a survey')
GO


INSERT INTO ApplicationRightsInRoles(ID, RoleID, ApplicationRightID, DateAssigned, UserAssigned, DateUpdated, LastUserUpdated)
VALUES

(newid(),'8FF17FF3-56D6-4D5B-A8D0-9DC0D473CDDC','63E3D483-0F59-4B76-BA50-ADBEB4F46195','8/11/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','08/11/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25'),
(newid(),'8FF17FF3-56D6-4D5B-A8D0-9DC0D473CDDC','B47DBBD3-749E-475D-A89E-05CCB896D0E8','8/11/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','08/11/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25'),
(newid(),'8FF17FF3-56D6-4D5B-A8D0-9DC0D473CDDC','50E69B72-FABF-49CD-BE43-47D3A8B7222F','8/11/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','08/11/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25'),
(newid(),'8FF17FF3-56D6-4D5B-A8D0-9DC0D473CDDC','415A665E-D41C-43D4-A2AA-B0541CB0D0B9','8/11/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','08/11/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25')
GO

