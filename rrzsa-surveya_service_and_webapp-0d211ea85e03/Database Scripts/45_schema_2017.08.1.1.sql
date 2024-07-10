/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	21 August 2017			Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:		21 August 2017
	Title			:	45_schema_2017.08.1.1
	Purpose			:	Fix issue with features price not storing decimal values
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue = '45'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE PackageFeatures
Alter COLUMN OptionalPrice DECIMAL(18,2) NULL
GO