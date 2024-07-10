/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 19 January 2021   Zolani Zweni   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 19 January 2021
 Title   		: 56_schema_2021.01.1.1
 Purpose  		: add the Rating QuestionType
 Instructions 	: run after 55_schema_2021.01.1.1

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='56'
WHERE SettingName = 'DBVersion'
GO

INSERT INTO QuestionType (ID, Type, FriendlyName, Description)
VALUES 
('E4EEBC6E-39C6-4853-8C70-007B5C256EF2','rating','Rating','Rate in stars')			-- Rating
GO
