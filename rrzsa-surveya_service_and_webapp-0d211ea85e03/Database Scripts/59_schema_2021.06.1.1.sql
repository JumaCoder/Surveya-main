/*-------------------------------------------------------------------------------------------------
 Date Edited	Developer		Description
---------------------------------------------------------------------------------------------------
24 June 2021	Zolani Zweni	Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 24 June 2021
 Title   		: 59_schema_2021.06.1.1
 Purpose  		: Update CRMTrader table
 Instructions 	: Run after 58_schema_2021.05.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='59'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE [dbo].[CRMTrader]
ADD
	[ResponseID] [uniqueidentifier] NULL

GO



INSERT INTO [dbo].[Application_Rights]
           ([ID]
           ,[Name]
           ,[Description]
           ,[RightGroup]
           ,[FriendlyName])
     VALUES
		   (newid()
           ,'TraderAssignEnumerator'
           ,'Can Assign Enumerator to Trader record'
           ,'CRM'
           ,'Assign Enumerator to Trader')
GO
