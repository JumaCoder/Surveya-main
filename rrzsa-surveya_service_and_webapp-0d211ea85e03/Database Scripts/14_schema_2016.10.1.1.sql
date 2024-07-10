/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 05 October 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 05 October 2016
 Title   		: 14_schema_2016.06.1.1
 Purpose  		: Changes to packages and companies  
 Instructions 	: Run after 13_schema_2016.09.1.1.sql

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='14'
WHERE SettingName = 'DBVersion'
GO

-- drop unnecessary columns
ALTER TABLE Package
DROP COLUMN Piping ,Photographs ,Signatures ,GeoMapping ,UniqueID,PDF,CSV ,Excel ,ReportingBasic ,ReportingAdvanced,Branding 
GO

-- add new columns
ALTER TABLE Package
ADD Price DECIMAL(18,2) NULL, 
 [Description] VARCHAR(MAX) NULL,
 NumberOfProjects INT NULL
GO

CREATE TABLE Features
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	Name VARCHAR(256) NOT NULL,
	Description VARCHAR(MAX) NULL
)
GO

ALTER TABLE Features
ADD FriendlyName VARCHAR(256) NULL
GO

CREATE TABLE PackageFeatures
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	PackageID UNIQUEIDENTIFIER NOT NULL,
	FeatureID UNIQUEIDENTIFIER NOT NULL,
	OptionalFeature BIT NOT NULL,
	OptionalPrice DECIMAL(18,0) NULL
)
GO

--insert default packages
INSERT INTO Features (Id, FriendlyName, Name, Description)
VALUES
('DA97707E-899A-4AD8-B159-B476ED9866DD', 'Summing','Summing',''),
('4D47F7D7-2BDD-4D50-8C3E-693A21AFC3AD', 'Piping','Piping',''),
('BC91DB3B-C5D1-4274-90B4-EE04432C1A3E', 'Geo Services','GeoServices',''),
('7492F4A1-4F41-40E4-A55E-F038FE7F6A7A', 'Signatures','Signatures',''),
('433D2ADA-FA92-40FE-B0F9-D16B3A1CA5AA', 'Photo / Camera','PhotoCamera',''),
('6B28A3B7-7618-4146-8DAC-CD12C9ED9053', 'White Labelling','WhiteLabelling', ''),
('A76BC29B-CFDE-4AE5-80BD-59C7BC888467', 'PDF','PDF', 'Download files in PDF format'),
('A53BCF1A-40A8-451F-A97F-637ED1B6D418', 'CSV','CSV', 'Download files in CSV format'),
('407A4650-CC86-4B0E-BD80-1CE7232557B6', 'Excel','Excel', 'Download files in Excel format'),
('7C0B74B6-A09B-4418-96A0-E7E0EDD45EAC', 'Basic Reporting','BasicReporting',''),
('49FE9FF2-83FE-4474-968E-2329EB66BFF3', 'Advanced Reporting','AdvancedReporting',''),
('85A98396-EF36-481C-9020-F2F9C6E9E9A9', 'Unique ID','UniqueID','All Responses will have unique IDs')
GO

ALTER TABLE Company
DROP CONSTRAINT FK__Company__Package__6E8B6712
GO

ALTER TABLE Company
DROP COLUMN PackageID
GO

ALTER TABLE Package
ADD 
	NumberMonthsValidFor INT NULL,
	OrderNumber BIGINT NULL -- the order that the packages are displayed in
GO

CREATE TABLE CompanyPackage
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	CompanyID UNIQUEIDENTIFIER NOT NULL,
	DateSignedUp DATETIME NULL,
	DateExpires DATETIME NULL,
	NumberMonthsSignedUpFor INT NULL,
	IsActive BIT NOT NULL,
	IsCompleted BIT NOT NULL,
	Price DECIMAL(18,1) NULL,
	DatePaid DATETIME NULL,

	-- tracking changes
	DateUpdated DATETIME NULL,

	DateDeactivated DATETIME NULL,
	DeactivatedBy UNIQUEIDENTIFIER NULL,
	
	DateActivated DATETIME NULL,
	ActivatedBy UNIQUEIDENTIFIER NULL,

	-- package details
	PackageID UNIQUEIDENTIFIER NOT NULL,
	NumberOfSurveys INT NULL,
	NumberOfQuestions INT NULL,
	NumberOfUsers INT NULL,
	NumberOfResponses INT NULL,
	PackageName VARCHAR(256) NULL,
	Description VARCHAR(MAX) NULL,
	NumberOfProjects INT NULL,

	-- feature details
	BasicReporting BIT NULL,
	AdvancedReporting BIT NULL,
	Excel BIT NULL,
	PDF BIT NULL,
	CSV BIT NULL,
	Piping BIT NULL,
	Summing BIT NULL,
	WhiteLabelling BIT NULL,
	PhotoCamera BIT NULL,
	GeoServices BIT NULL,
	Signatures BIT NULL,
	UniqueID BIT NULL,
)
GO

CREATE TABLE CompanyCart
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	CompanyPackageID UNIQUEIDENTIFIER NOT NULL,
	FeatureID UNIQUEIDENTIFIER NOT NULL,
)
GO


Update Package
SET Price = '0',
NumberOfProjects = '1', 
OrderNumber = 1
WHERE ID = '1D2F5C8A-C310-4C4C-9D44-1A9B93E547F3'
GO
Update Package
SET Price = '50',
NumberOfProjects = '2',
OrderNumber = 2
WHERE ID = 'D9CF32CE-C646-47A0-BD7F-6F06D0CE6690'
GO
Update Package
SET Price = '75',
NumberOfProjects = '5',
OrderNumber = 3
WHERE ID = '9758FF8B-AAEF-4D88-88AA-8B5EDADF7F0E'
GO
Update Package
SET Price = '200',
NumberOfProjects = '9999999',
OrderNumber = 4
WHERE ID = '6AC61C3B-E4CC-4188-98F4-F1BE9B8CB7CA'
GO

Update Package
SET Description = ''
WHERE Description IS NULL
GO
