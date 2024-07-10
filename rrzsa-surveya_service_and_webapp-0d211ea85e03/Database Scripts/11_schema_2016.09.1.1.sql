/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	14 Sep 2016			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	14 Sep 2016
	Title			:	11_schema_2016.09.1.1
	Purpose			:	Update question types
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='11'
WHERE SettingName = 'DBVersion'
GO

UPDATE [dbo].[QuestionType]
   SET [HasOptions] = 1
 WHERE [Type]='checkbox' or [Type]='radio'
GO