
/*-------------------------------------------------------------------------------------------------
	Date Edited				Developer				Description
---------------------------------------------------------------------------------------------------
	09 December 2018		Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	09 December 2018
	Title			:	54_schema_2020.12.1.1
	Purpose			:	Add SurveyConclusion, IsPageView, SurveyTheme
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='54'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE Survey
ADD
    SurveyConclusion varchar(max),
	IsPageView BIT,
    SurveyTheme varchar(max)
GO