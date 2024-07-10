/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
24 March 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 24 March 2017
 Title   		: 39_schema_2017.3.1.1
 Purpose  		: 
 Instructions 	: Run after 38_schema_2017.3.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='39'
WHERE SettingName = 'DBVersion'
GO

DROP TABLE ResponseQuestions
GO

ALTER TABLE ResponseValues
ADD
QuestionID UNIQUEIDENTIFIER NULL,
QuestionText VARCHAR(MAX) NULL
GO

ALTER TABLE ResponseValues
DROP COLUMN QuestionValueID
GO

ALTER TABLE  ResponseValues
DROP COLUMN ResponseQuestionID
GO

ALTER TABLE  ResponseValues
ADD ResponseID UNIQUEIDENTIFIER 
GO

DROP TABLE AuditedResponses
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
	
	-- ResponseValues table
	ResponseValueID UNIQUEIDENTIFIER NOT NULL,
	ResponseValue VARCHAR(MAX) NOT NULL,
	ResponseValueQuestionID UNIQUEIDENTIFIER NOT NULL,
	ResponseValueQuestionText VARCHAR(MAX) NOT NULL

)
GO