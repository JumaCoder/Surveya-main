/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
07 December 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 07 December 2016
 Title   		: 29_schema_2016.12.1.1
 Purpose  		: 
 Instructions 	: Run after 28_schema_2016.11.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='29'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE QuestionPiping
ALTER COLUMN PipingConditions VARCHAR(MAX) NOT NULL
GO

ALTER TABLE Question
ADD CalculationValue VARCHAR(MAX) NULL
GO

ALTER TABLE Question
ADD HasSum BIT NULL
GO