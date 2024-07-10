/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 04 July 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 04 July 2016
 Title   		: 05_schema_2016.07.1.1
 Purpose  		: Create tables for the survey section (Questions)
 Instructions 	: Run after 04_schema_2016.07.1.1.sql

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='05'
WHERE SettingName = 'DBVersion'
GO

CREATE TABLE Survey
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	SurveyTitle VARCHAR(256) NOT NULL,
	ProjectID UNIQUEIDENTIFIER NOT NULL,
	DateCreated DATETIME NOT NULL,
	CreatedBy UNIQUEIDENTIFIER NOT NULL,
	StartDate DATETIME,
	EndDate DATETIME,
	StartedByUserID UNIQUEIDENTIFIER,
	EndedByUserID UNIQUEIDENTIFIER,
	UpdatedBy UNIQUEIDENTIFIER,
	DateUpdated DATETIME,
	Purpose VARCHAR(MAX),
	IsActive BIT
)
GO


CREATE TABLE SurveyTeam
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	UserID UNIQUEIDENTIFIER NOT NULL,
	SurveyID uniqueidentifier not null
)
GO

