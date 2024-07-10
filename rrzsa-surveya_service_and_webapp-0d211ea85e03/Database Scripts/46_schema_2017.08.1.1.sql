/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	24 August 2017			Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	24 August 2017
	Title			:	46_schema_2017.08.1.1
	Purpose			:	Add in new right for delete surveys
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue = '46'
WHERE SettingName = 'DBVersion'
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
(newid(),'Survey','DeleteSurvey','Delete Surveys','Delete Surveys')
GO