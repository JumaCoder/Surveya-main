/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
30 November 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 30 November 2016
 Title   		: 27_schema_2016.11.1.1
 Purpose  		: Add package start date
 Instructions 	: Run after 26_schema_2016.11.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='27'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE Package
ADD StartDate DATETIME NULL
GO

Update QuestionType
SET Description = 'Select the date'
WHERE ID = '921B8333-8651-4911-960B-4100876774D5'
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
(newid(),'Company','SignupForPackage','Signup for a new Package','Signup for a new package'),
(newid(),'Company','AddCompany','Add Company','Add a Company if the user does not have one')
GO
