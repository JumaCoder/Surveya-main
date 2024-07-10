/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
20 Jan 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 Jan 2017
 Title   		: 34_schema_2017.1.1.1
 Purpose  		: Purchase Order Number
 Instructions 	: Run after 33_schema_2017.1.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='34'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE CompanyPackage
ADD 
PurchaseOrderNumber VARCHAR(256) NULL
GO

ALTER TABLE Invoice
ADD
PurchaseOrderNumber VARCHAR(256) NULL
GO