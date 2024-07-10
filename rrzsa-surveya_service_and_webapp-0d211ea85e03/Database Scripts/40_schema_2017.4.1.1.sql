/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
20 April 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 April 2017
 Title   		: 39_schema_2017.3.1.1
 Purpose  		: Question values add column for order
 Instructions 	: Run after 39_schema_2017.3.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='40'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE QuestionValues
ADD Position BIGINT NULL
GO