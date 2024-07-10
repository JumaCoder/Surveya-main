/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	31 Jan 2018			Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	31 Jan 2018
	Title			:	49_schema_2018.1.1.1
	Purpose			:	Add new fields for survey emailing
	Instructions	:	Run after script 48

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue = '49'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE Survey
ADD
	IsEmailed BIT NULL,
	EmailedUserIDForResponses UNIQUEIDENTIFIER NULL,
	EmailedSurveyLink VARCHAR(256) NULL
GO


ALTER TABLE Survey
ADD
	EmailedUniqueID UNIQUEIDENTIFIER
GO