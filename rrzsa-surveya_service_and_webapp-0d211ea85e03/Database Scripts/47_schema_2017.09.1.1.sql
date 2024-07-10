/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	14 September 2017			Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	14 September 2017
	Title			:	47_schema_2017.09.1.1
	Purpose			:	Add in column for question groups
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue = '47'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE QuestionGroups
ADD GroupHeading VARCHAR(MAX)
GO