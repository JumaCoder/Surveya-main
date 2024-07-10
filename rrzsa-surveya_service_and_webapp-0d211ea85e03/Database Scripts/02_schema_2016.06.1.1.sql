/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 28 June 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 28 June 2016
 Title   		: 02_schema_2016.06.1.1
 Purpose  		: User / Project / Company / Package tables 
 Instructions 	: Run after 01_schema_2016.03.1.1.sql

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='02'
WHERE SettingName = 'DBVersion'
GO



/*************************
	ROLES
*************************/


ALTER TABLE ApplicationRightsInRoles
	DROP CONSTRAINT FK_ApplicationRightsInRoles_aspnet_Roles
GO

ALTER TABLE ApplicationRightsInRoles
	DROP COLUMN RoleID
GO

CREATE TABLE Roles
(
	--ApplicationId UNIQUEIDENTIFIER NOT NULL,
	RoleId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	RoleName VARCHAR(256) NOT NULL,
	LoweredRoleName VARCHAR(256) NOT NULL,
	Description VARCHAR(MAX),
	-- which company the role is for
	CompanyID UNIQUEIDENTIFIER NULL,
	-- is the role a default system role
	IsSysRole BIT,
	IsActive BIT
)
GO


ALTER TABLE Application_Rights
ADD 	
	RightGroup VARCHAR(256),
	FriendlyName VARCHAR(256)
GO

ALTER TABLE ApplicationRightsInRoles
	ADD 
	RoleID UNIQUEIDENTIFIER NULL
GO


USE [Surveya_Dev]
GO

/****** Object:  StoredProcedure [dbo].[CheckUserHasRight]    Script Date: 2016-07-18 04:22:34 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[CheckUserHasRight]
@userID UNIQUEIDENTIFIER,
@right VARCHAR(256)
AS
BEGIN
	SELECT uir.UserId, ar.* 
	FROM CompanyUsers uir
	INNER JOIN ApplicationRightsInRoles arir
		ON arir.RoleID = uir.RoleId
	INNER JOIN Application_Rights ar
		ON ar.ID = arir.ApplicationRightID
	WHERE 
		uir.UserId = @userID AND
		ar.Name = @right
END
GO

IF EXISTS(SELECT *
	FROM sys.procedures
	WHERE name = 'CreateRole')
BEGIN
	DROP PROCEDURE CreateRole
END
GO

CREATE PROCEDURE CreateRole
	@RoleID UNIQUEIDENTIFIER,
	@RoleName VARCHAR(256),
	@Description VARCHAR(MAX),
	@CompanyID UNIQUEIDENTIFIER = NULL,
	@IsSysRole BIT,
	@IsActive BIT,
	@result VARCHAR(MAX) OUT
AS

	IF EXISTS( SELECT * 
				FROM Roles
				WHERE Roles.RoleId = @RoleID)
	BEGIN
		SET @result = 'Role already exists in your company'
		RETURN
	END

	IF EXISTS( SELECT * 
				FROM Roles
				WHERE Roles.RoleName = @RoleName AND isnull(Roles.CompanyID, '-1') = isnull(CompanyID,'-1'))
	BEGIN
		SET @result =  'Role already exists in your company'
		RETURN
	END

	IF @CompanyID IS NOT NULL
	BEGIN
		IF NOT EXISTS( SELECT * 
						FROM Company
						WHERE Company.ID = @CompanyID)
		BEGIN
			SET @result =  'Company does not exist'
			RETURN
		END
	END

	INSERT INTO Roles(RoleId, RoleName, LoweredRoleName, Description, CompanyID, IsSysRole, IsActive)
	VALUES(@RoleID, @RoleName, LOWER(@RoleName), @Description, @CompanyID, @IsSysRole, @IsActive)

	SET @result = '1'
GO


IF EXISTS(SELECT *
	FROM sys.procedures
	WHERE name = 'GetRolesForUser')
BEGIN
	DROP PROCEDURE GetRolesForUser
END
GO

CREATE PROCEDURE GetRolesForUser
	@UserID UNIQUEIDENTIFIER
AS
	SELECT Roles.RoleId, Roles.RoleName
	FROM Roles
	JOIN CompanyUsers
	ON CompanyUsers.RoleID = Roles.RoleId
	WHERE CompanyUsers.UserID = @UserID

GO


/*************************
	Users / Docs / Vaccs / Package / Company / Project / Company Users / Project Team
*************************/




-- table for users
ALTER TABLE aspnet_Membership
ADD 
	-- basic user information
	ContactNumber VARCHAR(256),
	Country VARCHAR(MAX),
	PhysicalAddress VARCHAR(MAX),
	Photo VARBINARY(MAX),

	-- data required for the project
	PassportNumber VARCHAR(256),
	PassportExpiryDate DATETIME,
	MedicalAidName VARCHAR(256),
	MedicalAidNumber VARCHAR(256),
	MedicalAidContactNumber VARCHAR(256),
	BloodType VARCHAR(128),
	HasAllergy BIT,			-- Yes or No
	AllergyDescription  VARCHAR(MAX),
	SafetyBootsSize VARCHAR(128),
	HighVisibilityVestSize VARCHAR(128),
	AvailableFreeCompanies BIT
GO

-- emergency contacts
ALTER TABLE aspnet_Membership
ADD
	EmergencyContact1Fullname VARCHAR(256),
	EmergencyContact1ContactNumber VARCHAR(256),
	EmergencyContact1Relationship VARCHAR(256),
	EmergencyContact2Fullname VARCHAR(256),
	EmergencyContact2ContactNumber VARCHAR(256),
	EmergencyContact2Relationship VARCHAR(256)
GO

CREATE TABLE Documents
(
	ID UniqueIdentifier NOT NULL PRIMARY KEY,
	DocType VARCHAR(256) NOT NULL,														-- PDF / PNG / JPG / MP4 / etc
	Classification VARCHAR(MAX) NOT NULL,												-- Passport / ETicket / Visa / Accommodation / Vaccination / Drivers License / Customs Clearance / etc
	Link VARCHAR(MAX) NOT NULL,															-- Dropbox link to the file
	UserID UNIQUEIDENTIFIER NULL,														-- who the document is associated with / belongs to
	ProjectID UNIQUEIDENTIFIER NULL,													-- which project the document belongs to
	UploadedBy UNIQUEIDENTIFIER NOT NULL,												-- the user that uploaded the document
	DateUploaded DATETIME NOT NULL,
	IsActive BIT																		-- true if doc is current, false if deleted
)
GO


CREATE TABLE Vaccination
(
	ID UniqueIdentifier NOT NULL PRIMARY KEY,
	VaccinationName VARCHAR(256) NOT NULL,
	VaccinationExpiryDate DATETIME NOT NULL,
	UserID uniqueidentifier not null 
)
GO

CREATE TABLE Package
(
	ID UniqueIdentifier NOT NULL PRIMARY KEY,
	PackageName VARCHAR(256) NOT NULL,
	NumberOfSurveys INT NOT NULL,
	NumberOfQuestions INT NOT NULL,
	NumberOfUsers INT NOT NULL,
	NumberOfResponses INT NOT NULL,
	Piping BIT NOT NULL,
	Photographs BIT NOT NULL,
	Signatures BIT NOT NULL,
	GeoMapping BIT NOT NULL,
	UniqueID BIT NOT NULL,
	PDF BIT NOT NULL,
	CSV BIT NOT NULL,
	Excel BIT NOT NULL,
	ReportingBasic BIT NOT NULL,
	ReportingAdvanced BIT NOT NULL,
	Branding BIT NOT NULL
)
GO

CREATE TABLE Company
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	CompanyName VARCHAR(256) NOT NULL,
	RegistrationNumber VARCHAR(256),
	VatNumber VARCHAR(128),
	Logo VARBINARY(MAX),
	PackageID UniqueIdentifier not null 
)
GO

ALTER TABLE Company
ADD
	IsActive BIT,
	DateCreated DATETIME,
	CreatedBy UNIQUEIDENTIFIER,
	DateUpdated DATETIME,
	UpdatedBy UNIQUEIDENTIFIER
GO

CREATE TABLE Project
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	ProjectName VARCHAR(256) NOT NULL,
	ProjectDescription VARCHAR(MAX),
	ProjectCountry VARCHAR(256),
	NumberOfMembers INT NOT NULL,

	-- primary contact
	UserID UNIQUEIDENTIFIER NOT NULL,

	-- timeline
	StartDate DATETIME,
	EndDate DATETIME,
	ActualStartDate DATETIME,
	ActualEndDate DATETIME,
	StartedByUserID UNIQUEIDENTIFIER,
	EndedByUserID UNIQUEIDENTIFIER,

	-- what data is required for the project
	IsPassportNumberRequired BIT NOT NULL,
	IsPassportExpiryDateRequired BIT,
	IsMedicalAidNameRequired BIT,
	IsMedicalAidNumberRequired BIT,
	IsMedicalAidContactNumberRequired BIT,
	IsBloodTypeRequired BIT,
	IsAllergiesRequired BIT,
	IsAllergiesDescriptionRequired BIT,
	IsVaccinationsRequired BIT,
	IsSafetyBootsRequired BIT,
	IsVestRequired BIT,
	
	-- what files are required to upload
	IsPassportDocRequired BIT,
	IsETicketDocRequired BIT,
	IsVisaDocRequired BIT,
	IsAccommodationDocRequired BIT,
	IsVaccinationDocRequired BIT,
	IsDriversLicenseDocRequired BIT,
	IsCustomsClearanceDocRequired BIT,

	-- company id the project belongs to
	ProjectCompany UNIQUEIDENTIFIER NOT NULL,

	DateCreated DATETIME NOT NULL,
	CreatedBy UNIQUEIDENTIFIER NOT NULL,
	UpdatedBy UNIQUEIDENTIFIER NULL,
	DateUpdated DATETIME NULL
)
GO


ALTER TABLE Project
ADD
	IsActive BIT,
	OtherInfoRequired VARCHAR(MAX)
GO


CREATE TABLE CompanyUsers
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	CompanyID UNIQUEIDENTIFIER NULL,
	UserID UNIQUEIDENTIFIER NOT NULL,
	RoleID uniqueidentifier not null
)
GO

CREATE TABLE ProjectTeam
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	ProjectID UNIQUEIDENTIFIER NOT NULL,
	UserID UNIQUEIDENTIFIER NOT NULL,
	RoleID uniqueidentifier not null,
	CompletedRegistration BIT NOT NULL
)
GO