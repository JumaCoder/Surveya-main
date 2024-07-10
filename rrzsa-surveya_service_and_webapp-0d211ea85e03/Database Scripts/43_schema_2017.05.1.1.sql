/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	29 May 2017			Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	29 May 2017
	Title			:	43_schema_2017.05.1.1
	Purpose			:	Add in new right for preview surveys
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue = '43'
WHERE SettingName = 'DBVersion'
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
('206CE225-285F-4CBF-BD6D-432A58041FF5','Survey','PreviewSurveys','Preview Surveys','Preview created surveys')
GO