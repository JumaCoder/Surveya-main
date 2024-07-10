/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
13 December 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 13 December 2016
 Title   		: 30_schema_2016.12.1.1
 Purpose  		: 
 Instructions 	: Run after 29_schema_2016.11.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='30'
WHERE SettingName = 'DBVersion'
GO

CREATE TABLE CompanyPackageHistory
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	CompanyPackageID UNIQUEIDENTIFIER NOT NULL,
	CompanyID UNIQUEIDENTIFIER NOT NULL,
	DateCreated DATETIME NOT NULL,
	CreatedBy UNIQUEIDENTIFIER NOT NULL,
	[Message] VARCHAR(MAX) NOT NULL,
)
GO