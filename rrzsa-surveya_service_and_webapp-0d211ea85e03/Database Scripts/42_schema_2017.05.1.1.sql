/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	05 May 2017			Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	05 May 2017
	Title			:	42_schema_2017.05.1.1
	Purpose			:	Add column to store the theme name for white labelling and is other for question values
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue = '42'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE Company
ADD MobileAppThemeName VARCHAR(MAX)
GO

ALTER TABLE QuestionValues
ADD IsOther BIT NULL
GO
