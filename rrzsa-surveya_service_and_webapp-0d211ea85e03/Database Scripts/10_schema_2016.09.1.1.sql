/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 13 September 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 13 September 2016
 Title   		: 10_schema_2016.09.1.1
 Purpose  		: rights for mobile app
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='10'
WHERE SettingName = 'DBVersion'
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
('3829DDF0-89CE-4C09-AF4F-B734706E657F','Responses','ViewResponses','View Responses','View the responses received from surveys'),
('2C3FBD2E-3034-4383-8786-E1C18DFBEFB9','Mobile App','UploadResponses','Upload Responses','User is allowed to upload responses on the mobile app'),
('D3FE0F0D-74A7-4F60-9674-3D86FB898B70','Responses','AuditResponse','Audit Response','Audit the responses received from surveys'),
('0E9EE6E8-2456-4397-B51A-07A1527D83A4','Mobile App','GetSurveysForUser','Get Surveys For User','Retrieve a list of all the surveys for the user'),
('E444D664-CF06-48C7-85CB-EA92A6924979','Mobile App','DownloadSurveys','Download Surveys','Download surveys on the mobile app'),
('C0B430F9-D316-42D6-9BB5-DCE7AE191D4C','Mobile App','AdminMobileUser','Admin Mobile User','User is an admin on the mobile app')
GO

CREATE TABLE Responses
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	SurveyID UNIQUEIDENTIFIER NOT NULL,
	CreatedBy UNIQUEIDENTIFIER NOT NULL,
	DateCreated DATETIME NOT NULL,
	IsCompleted BIT NOT NULL,
	IsDeleted BIT NOT NULL,

	-- tracking history - always change if the record is altered
	DateUpdated DATETIME NULL,
	UpdatedBy UNIQUEIDENTIFIER NULL,
	DateDeleted DATETIME NULL,
	DeletedBy UNIQUEIDENTIFIER NULL
)
GO

CREATE TABLE ResponseValues
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,

	-- original question
	QuestionID UNIQUEIDENTIFIER NOT NULL,
	QuestionText VARCHAR(MAX) NOT NULL,

	-- Users response
	ResponseID UNIQUEIDENTIFIER NOT NULL,
	Response NVARCHAR(MAX) NOT NULL,
	QuestionValueID UNIQUEIDENTIFIER NULL,

	-- Admin altered the response
	IsAuditedRecord BIT NOT NULL,	--is an audited record
	--audited record id
	AuditedRecordID UNIQUEIDENTIFIER NULL,		
	
	-- tracking history - only change these values on the audited record
	DateUpdated DATETIME NULL,
	UpdatedBy UNIQUEIDENTIFIER NULL,
	IsDeleted BIT NOT NULL,
	DateDeleted DATETIME NULL,
	DeletedBy UNIQUEIDENTIFIER NULL
)
GO


/*
if a record is changed / deleted, duplicate the record
add IsAudited and add tracking history to the Audited Record
add AuditedRecordID to the old record

*/