/*-------------------------------------------------------------------------------------------------
 Date Edited	Developer		Description
---------------------------------------------------------------------------------------------------
19 May 2021		Zolani Zweni	Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 19 May 2021
 Title   		: 57_schema_2021.05.1.1
 Purpose  		: Create AuthorizeLogin table
 Instructions 	: Run after 56_schema_2021.01.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='57'
WHERE SettingName = 'DBVersion'
GO

CREATE TABLE [Surveya_Live].[dbo].[AuthorizeLogin]
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	DateRequested DATETIME NOT NULL,
	UserID UNIQUEIDENTIFIER NOT NULL,
	IPAdress NVARCHAR(32) NOT NULL,
	Code NVARCHAR(8) NOT NULL,
	IsAuthorized BIT NULL,
	IsDeleted BIT NULL
)
GO