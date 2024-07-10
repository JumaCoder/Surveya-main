/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	06 October 2017			Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	06 October 2017
	Title			:	48_schema_2017.10.1.1
	Purpose			:	Add in new right
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue = '48'
WHERE SettingName = 'DBVersion'
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
('79CD332E-732D-4C26-90C1-E36537C0B3EF','Company','RecreateCompanyDirectories','Recreate Company Directories','Recreate the missing directories for the document manager')
GO

ALTER TABLE Responses
ADD SurveyTitle VARCHAR(MAX) NULL
GO

ALTER TABLE Survey
ALTER COLUMN SurveyTitle VARCHAR(MAX)
GO
