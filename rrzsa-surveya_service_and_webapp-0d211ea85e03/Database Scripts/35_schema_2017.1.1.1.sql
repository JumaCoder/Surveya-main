/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
20 Jan 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 Jan 2017
 Title   		: 35_schema_2017.1.1.1
 Purpose  		: Table for Storing which admin is assuming which company
 Instructions 	: Run after 34_schema_2017.1.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='35'
WHERE SettingName = 'DBVersion'
GO

CREATE TABLE AssumeCompanyHistory
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	UserID UNIQUEIDENTIFIER NOT NULL,
	CompanyID UNIQUEIDENTIFIER NOT NULL,
	CurrentSession BIT NOT NULL,
	DateStarted DATETIME NOT NULL,
	DateCompleted DATETIME NULL
)
GO