/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 21 October 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 21 October 2016
 Title   		: 19_schema_2016.06.1.1
 Purpose  		: Add more rights into the tables 
 Instructions 	: Run after 18_schema_2016.10.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='19'
WHERE SettingName = 'DBVersion'
GO



delete from ApplicationRightsInRoles
where ApplicationRightID in 
('6F93C76C-F45C-46E8-AC51-C66889EFF7FE',
'0B1CE05A-6AC1-4D55-91EC-B4B980FF520E'
)
GO

delete from application_Rights
where ID in 
('6F93C76C-F45C-46E8-AC51-C66889EFF7FE',
'0B1CE05A-6AC1-4D55-91EC-B4B980FF520E'
)
GO

ALTER TABLE CompanyPackage
ADD PaymentType VARCHAR(256)
GO

CREATE TABLE Payments
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	DatePaid DATETIME NOT NULL,
	AmountPaid DECIMAL(18,2) NOT NULL,
	InvoiceID UNIQUEIDENTIFIER NOT NULL
)
GO



ALTER TABLE CompanyPackage
DROP COLUMN DatePaid
GO

