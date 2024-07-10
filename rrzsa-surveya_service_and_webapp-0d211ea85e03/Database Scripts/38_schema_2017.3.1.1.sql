/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
23 March 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 23 March 2017
 Title   		: 37_schema_2017.3.1.1
 Purpose  		: 
 Instructions 	: Run after 37_schema_2017.1.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='38'
WHERE SettingName = 'DBVersion'
GO

CREATE TABLE AuditedResponses
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	
	DateCreated DATETIME NOT NULL,
	CreatedBy UNIQUEIDENTIFIER NOT NULL,
	DateUpdated DATETIME NULL,
	UpdatedBy UNIQUEIDENTIFIER NULL,

	--  Response table
	SurveyID UNIQUEIDENTIFIER NOT NULL,

	ResponseID UNIQUEIDENTIFIER NOT NULL,
	ResponseCreatedBy UNIQUEIDENTIFIER NOT NULL,
	ResponseDateCreated DATETIME NOT NULL,
	
	--ResponseQuestions table
	ResponseQuestionID UNIQUEIDENTIFIER NOT NULL,
	QuestionText VARCHAR(MAX) NOT NULL,
	
	-- ResponseValues table
	ResponseValueID UNIQUEIDENTIFIER NOT NULL,
	Value VARCHAR(MAX) NOT NULL

)
GO

ALTER TABLE Responses
DROP COLUMN
IsDeleted,
DateDeleted,
DeletedBy,
DateUpdated,
UpdatedBy
GO 

ALTER TABLE ResponseQuestions
DROP COLUMN
IsAuditedRecord,
AuditedRecordID,
IsDeleted,
DateDeleted,
DeletedBy,
DateUpdated,
UpdatedBy
GO

ALTER TABLE ResponseValues
DROP COLUMN
IsAuditedRecord,
AuditedRecordID,
IsDeleted,
DateDeleted,
DeletedBy,
DateUpdated,
UpdatedBy
GO

ALTER TABLE ResponseQuestions
ADD PRIMARY Key(ID)
GO


ALTER TABLE ResponseValues
ADD PRIMARY Key(ID)
GO