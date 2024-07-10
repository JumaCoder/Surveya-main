/*-------------------------------------------------------------------------------------------------
 Date Edited	Developer		Description
---------------------------------------------------------------------------------------------------
05 July 2021	Zolani Zweni	Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 05 July 2021
 Title   		: 60_schema_2021.07.1.1
 Purpose  		: 
 Instructions 	: Run after 59_schema_2021.06.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='60'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE [dbo].[CRMTrader]
ADD
	[Status] VARCHAR(128) NULL
GO


ALTER TABLE [dbo].[CRMTrader]
ADD
	NumberRescheduled INT NULL DEFAULT 0
GO

UPDATE CRMTrader
SET Status='New'
GO

UPDATE CRMTrader
SET Status='Assigned'
WHERE AssignedTo is not null
GO

UPDATE CRMTrader
SET Status='Scheduled'
WHERE isScheduled = 1
GO


UPDATE CRMTrader
SET Status='Started'
WHERE isSurveyed = 1
GO


UPDATE CRMTrader
SET Status='Complete'
WHERE isComplete = 1
GO