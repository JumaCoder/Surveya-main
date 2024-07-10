/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 30 June 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 30 June 2016
 Title   		: 03_schema_2016.06.1.1
 Purpose  		: Default Packages
 Instructions 	: Run after 02_schema_2016.06.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='03'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE Package
ADD
	IsActive BIT,
	CreatedBy UNIQUEIDENTIFIER,
	DateCreated DATETIME,
	UpdatedBy UNIQUEIDENTIFIER,
	DateUpdated DATETIME
GO

-- add the default packages
INSERT INTO Package(ID, PackageName, NumberOfSurveys,NumberOfQuestions,NumberOfUsers,NumberOfResponses,Piping,Photographs,Signatures,GeoMapping,UniqueID,PDF,CSV,Excel,ReportingBasic,ReportingAdvanced,Branding, IsActive,CreatedBy, DateCreated)
VALUES('1D2F5C8A-C310-4C4C-9D44-1A9B93E547F3', 'Free', 1, 25, 1, 50, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, '82359D8E-2FB6-4B92-A39B-3B54BBD3DD25', GETDATE()),
('D9CF32CE-C646-47A0-BD7F-6F06D0CE6690', 'Pro', 2, 5, 5, 150, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,1,'82359D8E-2FB6-4B92-A39B-3B54BBD3DD25',GETDATE()),
('9758FF8B-AAEF-4D88-88AA-8B5EDADF7F0E', 'Enterprise', 5, 150, 10, 500, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1,'82359D8E-2FB6-4B92-A39B-3B54BBD3DD25',GETDATE()),
('6AC61C3B-E4CC-4188-98F4-F1BE9B8CB7CA', 'Custom', 9999999,9999999,9999999,9999999, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,1,'82359D8E-2FB6-4B92-A39B-3B54BBD3DD25',GETDATE())
GO

