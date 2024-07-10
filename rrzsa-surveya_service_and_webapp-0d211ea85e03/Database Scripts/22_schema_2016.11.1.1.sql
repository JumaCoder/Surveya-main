/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
08 November 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 08 November 2016
 Title   		: 22_schema_2016.11.1.1
 Purpose  		: Change "Tab" to "Page"
 Instructions 	: Run after 21_schema_2016.10.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='22'
WHERE SettingName = 'DBVersion'
GO

UPDATE QuestionGroups
SET GroupType = 'Page'
WHERE GroupType = 'Tab'
GO