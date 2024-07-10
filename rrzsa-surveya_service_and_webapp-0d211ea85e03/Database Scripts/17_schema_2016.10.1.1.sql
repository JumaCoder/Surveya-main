/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 14 October 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 14 October 2016
 Title   		: 16_schema_2016.06.1.1
 Purpose  		: Add more rights into the tables 
 Instructions 	: Run after 15_schema_2016.10.1.1.sql

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='17'
WHERE SettingName = 'DBVersion'
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
('0B1CE05A-6AC1-4D55-91EC-B4B980FF520E','Company','ViewSignup','View Companies that have signed up','View the details of a company, user and packages that have signed up'),
('6F93C76C-F45C-46E8-AC51-C66889EFF7FE','Payment','CapturePayment','Capture a payment','Capture a payment from a company')

GO

INSERT INTO ApplicationRightsInRoles(ID, RoleID, ApplicationRightID, DateAssigned, UserAssigned, DateUpdated, LastUserUpdated)
VALUES
(newid(),'8FF17FF3-56D6-4D5B-A8D0-9DC0D473CDDC','0B1CE05A-6AC1-4D55-91EC-B4B980FF520E','10/18/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25'),
(newid(),'40EC673F-0AE7-41C4-8884-A9D7D308D6C6','0B1CE05A-6AC1-4D55-91EC-B4B980FF520E','10/18/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25'),
(newid(),'8FF17FF3-56D6-4D5B-A8D0-9DC0D473CDDC','6F93C76C-F45C-46E8-AC51-C66889EFF7FE','10/18/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25'),
(newid(),'40EC673F-0AE7-41C4-8884-A9D7D308D6C6','6F93C76C-F45C-46E8-AC51-C66889EFF7FE','10/18/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25')
GO

ALTER TABLE CompanyPackage
ADD DateStart DATETIME NULL
GO

