/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
06 Feb 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 06 Feb 2017
 Title   		: 36_schema_2017.1.1.1
 Purpose  		: 
 Instructions 	: Run after 35_schema_2017.1.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='36'
WHERE SettingName = 'DBVersion'
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
('4DAF7582-58B6-4E47-ACDA-E9363E14E0BF','Mobile App','MarkResponsesAsComplete','Mark Responses as Complete','Mark Responses as Complete')
GO




CREATE TABLE SyncRequest
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	SurveyID UNIQUEIDENTIFIER NOT NULL,
	NumberSynced BIGINT NOT NULL DEFAULT 0,
	IsComplete BIT NOT NULL DEFAULT 0,
	DateStarted DATETIME NOT NULL,
	DateCompleted DATETIME NULL,
	UserID UNIQUEIDENTIFIER NOT NULL
)
GO

