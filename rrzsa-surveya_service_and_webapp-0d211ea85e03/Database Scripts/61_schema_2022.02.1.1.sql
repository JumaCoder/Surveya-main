/*-------------------------------------------------------------------------------------------------
 Date Edited	Developer		Description
---------------------------------------------------------------------------------------------------
07 Feb 2022		Zolani Zweni	Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 07 Feb 2022
 Title   		: 61_schema_2022.02.1.1
 Purpose  		: 
 Instructions 	: Run after 60_schema_2021.07.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='61'
WHERE SettingName = 'DBVersion'
GO


INSERT INTO [dbo].[QuestionRegex]
           ([ID]
           ,[Pattern]
           ,[FriendlyName]
           ,[Description]
           ,[QuestionTypeID])
     VALUES
           (NEWID()
           ,'^\W*(?:\w+\b\W*){_MinimumPlaceholder_,_MaximumPlaceholder_}$'
           ,'Number of words'
           ,'Number of words must be between _MinimumPlaceholder_ and _MaximumPlaceholder_'
           ,'316E3A95-C1CC-4EDF-B7B4-32ACCAA2ADBF'),
		   (NEWID()
           ,'^\W*(?:\w+\b\W*){_MinimumPlaceholder_,_MaximumPlaceholder_}$'
           ,'Number of words'
           ,'Number of words must be between _MinimumPlaceholder_ and _MaximumPlaceholder_'
           ,'85826014-C25C-4223-A9BF-28413A402718'),
		   (NEWID()
           ,'^.{_MinimumPlaceholder_,_MaximumPlaceholder_}$'
           ,'Number of characters'
           ,'Number of characters must be between _MinimumPlaceholder_ and _MaximumPlaceholder_'
           ,'316E3A95-C1CC-4EDF-B7B4-32ACCAA2ADBF'),
		   (NEWID()
           ,'^.{_MinimumPlaceholder_,_MaximumPlaceholder_}$'
           ,'Number of characters'
           ,'Number of characters must be between _MinimumPlaceholder_ and _MaximumPlaceholder_'
           ,'85826014-C25C-4223-A9BF-28413A402718')
GO


ALTER TABLE [dbo].[Question]
	ADD [RegexPatternError] [varchar](max) NULL,
	[MinimumLength] [varchar](256) NULL,
	[MaximumLength] [varchar](256) NULL
GO
