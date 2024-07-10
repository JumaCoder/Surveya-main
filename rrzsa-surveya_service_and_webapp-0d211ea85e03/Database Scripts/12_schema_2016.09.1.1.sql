/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	15 Sep 2016			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	15 Sep 2016
	Title			:	12_schema_2016.09.1.1
	Purpose			:	Update question types
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='12'
WHERE SettingName = 'DBVersion'
GO

INSERT INTO [dbo].[QuestionType]
           ([ID]
           ,[Type]
           ,[FriendlyName]
           ,[Description]
           ,[HasOptions])
     VALUES
           ('2296589d-f6a9-4cad-ac36-d83414cd9429'
           ,'Numerical'
           ,'Number'
           ,'Number input field'
           ,0)
GO


