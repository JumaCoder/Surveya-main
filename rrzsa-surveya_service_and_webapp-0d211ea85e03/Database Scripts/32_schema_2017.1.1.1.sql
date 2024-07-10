/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
13 Jan 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 13 Jan 2017
 Title   		: 32_schema_2017.1.1.1
 Purpose  		: Ensure that the company package table has got all required columns for storing the prices
 Instructions 	: Run after 31_schema_2017.1.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='32'
WHERE SettingName = 'DBVersion'
GO

-- COMPANY PACKAGE TABLE
-- PackageStartingPrice = starting price
-- OptionalFeaturesPrice = optional features price
-- [Price] = (package price + optional features price ) * number of months
-- [DiscountValue] = the value of the discount received
-- [DiscountPercentage] = the percentage of discount
-- [DiscountDescription] = description of discount
-- [HasDiscount] = if the company has received discount
-- [NumberMonthsSignedUpFor] = number of months signed up for

ALTER TABLE CompanyPackage
ADD
	PackageStartingPrice DECIMAL(18, 2) NULL,
	OptionalFeaturesPrice DECIMAL (18,2) NULL

GO
