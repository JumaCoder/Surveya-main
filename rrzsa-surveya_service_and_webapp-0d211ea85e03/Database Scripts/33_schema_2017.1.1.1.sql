/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
18 Jan 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 18 Jan 2017
 Title   		: 33_schema_2017.1.1.1
 Purpose  		: Changes to Responses
 Instructions 	: Run after 32_schema_2017.1.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='33'
WHERE SettingName = 'DBVersion'
GO

DROP TABLE ResponseValues
GO

CREATE TABLE ResponseQuestions
(
	ID UNIQUEIDENTIFIER NOT NULL,
	QuestionID UNIQUEIDENTIFIER NOT NULL,
	QuestionText VARCHAR(MAX) NOT NULL,
	ResponseID UNIQUEIDENTIFIER NOT NULL,
	IsAuditedRecord BIT NOT NULL,
	AuditedRecordID UNIQUEIDENTIFIER NULL,
	DateCreated DATETIME NOT NULL,
	CreatedBy UNIQUEIDENTIFIER NOT NULL,
	DateUpdated DATETIME NULL,
	UpdatedBy UNIQUEIDENTIFIER NULL,
	IsDeleted BIT NOT NULL,
	DateDeleted DATETIME NULL,
	DeletedBy UNIQUEIDENTIFIER NULL
)
GO

CREATE TABLE ResponseValues
(
	ID UNIQUEIDENTIFIER NOT NULL,
	ResponseQuestionID UNIQUEIDENTIFIER NOT NULL,
	QuestionValueID UNIQUEIDENTIFIER NULL, -- link to the id of the original value selected
	Value VARCHAR(MAX) NOT NULL,
	IsAuditedRecord BIT NOT NULL,
	AuditedRecordID UNIQUEIDENTIFIER NULL,
	DateCreated DATETIME NOT NULL,
	CreatedBy UNIQUEIDENTIFIER NOT NULL,
	DateUpdated DATETIME NULL,
	UpdatedBy UNIQUEIDENTIFIER NULL,
	IsDeleted BIT NOT NULL,
	DateDeleted DATETIME NULL,
	DeletedBy UNIQUEIDENTIFIER NULL
)
GO

