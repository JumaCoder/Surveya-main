/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 06 Feb 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 06 Feb 2017
 Title   		: GetResponseSyncNumbers
 Purpose  		: Get the number of responses synced for the user
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetResponseSyncNumbers')
BEGIN
	DROP PROCEDURE GetResponseSyncNumbers
END
GO

CREATE PROCEDURE GetResponseSyncNumbers
@UserID UNIQUEIDENTIFIER
AS

	/*DECLARE @UserID UNIQUEIDENTIFIER 
	SET @UserID = '64298CA8-6CFA-4716-B223-69634C8136C0'*/

	SELECT s.SurveyID, SUM(s.NumberSynced) as NumberSynced
	FROM SyncRequest s
    WHERE s.UserID = @UserID
	GROUP BY s.SurveyID
GO