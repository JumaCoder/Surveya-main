/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 20 October 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 October 2016
 Title   		: 18_schema_2016.06.1.1
 Purpose  		: Add more rights into the tables 
 Instructions 	: Run after 17_schema_2016.10.1.1.sql

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='18'
WHERE SettingName = 'DBVersion'
GO


ALTER TABLE aspnet_Membership
ADD 
DateActivated DATETIME NULL,
IsActive BIT NULL
GO

Update aspnet_Membership
SET IsActive = 1, DateActivated = GETDATE()
WHERE IsActive is null
GO