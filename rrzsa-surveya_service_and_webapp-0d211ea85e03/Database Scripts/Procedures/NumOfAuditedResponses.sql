/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
20 November 2019   Zolani Zweni   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 November 2019
 Title   		: NumOfAuditedResponses
 Purpose  		: Gets Nummber Of Uploaded Responses
 Instructions 	: Run  with other procedures

-------------------------------------------------------------------------------------------------*/


IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'NumOfAuditedResponses')
BEGIN
	DROP PROCEDURE NumOfAuditedResponses
END
GO

CREATE PROCEDURE NumOfAuditedResponses
@SurveyID UNIQUEIDENTIFIER
AS
	SELECT COUNT(DISTINCT ar.ResponseID)
	FROM AuditedResponses ar
	WHERE ar.SurveyID = @SurveyID
GO