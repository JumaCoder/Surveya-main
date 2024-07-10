/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 21 October 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 21 October 2016
 Title   		: 20_schema_2016.06.1.1
 Purpose  		: Add more rights into the tables 
 Instructions 	: Run after 19_schema_2016.10.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='20'
WHERE SettingName = 'DBVersion'
GO


ALTER TABLE CompanyPackage
ADD MarkAsViewed BIT
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
('7A214CC0-840C-487A-91A3-549C1DC89A9E','Company','NewPackageSignup','Signup for a new package','Signup for a new package')
GO

INSERT INTO ApplicationRightsInRoles(ID, RoleID, ApplicationRightID, DateAssigned, UserAssigned, DateUpdated, LastUserUpdated)
VALUES
(newid(),'8FF17FF3-56D6-4D5B-A8D0-9DC0D473CDDC','7A214CC0-840C-487A-91A3-549C1DC89A9E','10/18/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25')
GO
  