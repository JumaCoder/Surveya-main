/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 31 October 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 21 October 2016
 Title   		: 21_schema_2016.06.1.1
 Purpose  		: Add more rights into the tables 
 Instructions 	: Run after 20_schema_2016.10.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='21'
WHERE SettingName = 'DBVersion'
GO

update [CompanyPackage]
set markasviewed = 0
GO

update CompanyPackage
set PaymentType = 'EFT'
GO

ALTER TABLE aspnet_Membership
add 
	postalCode varchar(256),
	city varchar(256)
GO

ALTER TABLE Company
ADD 
	billEmail varchar(256),
	alternateBillEmail varchar(256),
	postalCode varchar(256),
	city varchar(256),
	country varchar(256)
GO


delete from PackageFeatures
where packageid='1D2F5C8A-C310-4C4C-9D44-1A9B93E547F3' and featureid='A53BCF1A-40A8-451F-A97F-637ED1B6D418'
GO