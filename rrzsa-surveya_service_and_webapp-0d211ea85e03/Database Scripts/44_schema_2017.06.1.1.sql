/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	14 June 2017			Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	14 June 2017
	Title			:	44_schema_2017.06.1.1
	Purpose			:	Add in new right for preview surveys
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue = '44'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE ResponseValues
ADD
QuestionRowID UNIQUEIDENTIFIER NULL
GO