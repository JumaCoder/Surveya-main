/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
20 November 2019   Zolani Zweni   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 November 2019
 Title   		: NumOfUploadedResponses
 Purpose  		: Gets Nummber Of Uploaded Responses
 Instructions 	: Run  with other procedures

-------------------------------------------------------------------------------------------------*/


IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'NumOfUploadedResponses')
BEGIN
	DROP PROCEDURE NumOfUploadedResponses
END
GO

CREATE PROCEDURE NumOfUploadedResponses
@SurveyID UNIQUEIDENTIFIER
AS
	SELECT COUNT(DISTINCT r.ID)
	FROM Responses r
	WHERE r.SurveyID = @SurveyID
GO