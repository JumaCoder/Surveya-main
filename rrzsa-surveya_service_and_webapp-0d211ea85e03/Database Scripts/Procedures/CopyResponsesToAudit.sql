/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
23 March 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------
Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
20 November 2019   Zolani Zweni   Edited
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 23 March 2017
 Title   		: GetResponsesToAudit
 Purpose  		: Copy the original responses to the audited responses table, if the response is not already a audited response
 Instructions 	: Run  with other procedures

-------------------------------------------------------------------------------------------------*/


IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'CopyResponsesToAudit')
BEGIN
	DROP PROCEDURE CopyResponsesToAudit
END
GO

CREATE PROCEDURE CopyResponsesToAudit
@SurveyID UNIQUEIDENTIFIER,
@UserID UNIQUEIDENTIFIER
AS

	INSERT INTO AuditedResponses (ID, DateCreated, CreatedBy, SurveyID, ResponseID, ResponseCreatedBy, ResponseDateCreated, 
								ResponseValueID, ResponseValue, ResponseValueQuestionID, ResponseValueQuestionText)
	SELECT newid(), GETDATE(), @UserID, r.SurveyID, r.ID, r.CreatedBy, r.DateCreated,
			rv.ID, rv.Value, rv.QuestionID, rv.QuestionText
	FROM Responses r
	JOIN ResponseValues rv
	ON rv.ResponseID = r.ID
	LEFT JOIN AuditedResponses ar
	ON ar.ResponseID = r.ID
	WHERE r.SurveyID = @SurveyID AND ar.ResponseID IS NULL
GO