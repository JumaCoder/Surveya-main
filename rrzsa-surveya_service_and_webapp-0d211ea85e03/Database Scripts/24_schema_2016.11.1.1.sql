/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
09 November 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 09 November 2016
 Title   		: 24_schema_2016.11.1.1
 Purpose  		: Add rows into tables
 Instructions 	: Run after 23_schema_2016.10.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='24'
WHERE SettingName = 'DBVersion'
GO

CREATE TABLE GlobalSettings
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	SettingName VARCHAR(256) NOT NULL UNIQUE,
	SettingValue VARCHAR(256) NOT NULL,
	IsEnabled BIT NOT NULL
)
GO

INSERT INTO GlobalSettings
VALUES (newid(), '12 Months Package Discount', '15', 1),
(newid(), '6 Months Package Discount', '0', 1)
GO

CREATE TABLE VerifyEmailRequests
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	DateRequested DATETIME NOT NULL,
	UserID UNIQUEIDENTIFIER NOT NULL,
	IsDeleted BIT NOT NULL
)
GO