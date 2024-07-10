/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 23 August 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 23 August 2016
 Title   		: 09_schema_2016.09.1.1
 Purpose  		: alter tables for questions
 Instructions 	: run after 08_schema_2016.08.1.1

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='09'
WHERE SettingName = 'DBVersion'
GO


ALTER TABLE QuestionType
ADD HasOptions BIT
GO

UPDATE QuestionType
SET HasOptions = 0
GO

UPDATE QuestionType
SET HasOptions = 1
WHERE Type = 'ddl' OR Type = 'ddlMultiple'
GO

DELETE FROM QuestionType
WHERE Type = 'file'
GO