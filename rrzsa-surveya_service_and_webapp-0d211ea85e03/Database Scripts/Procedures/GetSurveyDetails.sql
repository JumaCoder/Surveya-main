/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 20 January 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 January 2017
 Title   		: GetSurveyDetails
 Purpose  		: Get the details for the specified survey
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetSurveyDetails')
BEGIN
	DROP PROCEDURE GetSurveyDetails 
END
GO

CREATE PROCEDURE [dbo].[GetSurveyDetails]
	@surveyID UNIQUEIDENTIFIER
AS
	SELECT s.ID, s.SurveyTitle, s.DateCreated, s.CreatedBy, s.Purpose,s.UpdatedBy,s.DateUpdated,s.StartDate,s.EndDate,
           s.StartedByUserID, s.EndedByUserID, s.SurveyConclusion, s.IsPageView, s.SurveyTheme,s.ProjectID,p.ProjectName,CompanyID = p.ProjectCompany,
		   (SELECT COUNT(t.UserID) FROM SurveyTeam t WHERE t.SurveyID = @surveyID) AS 'NumberOfSurveyUsers',
		   (SELECT COUNT(q.ID)
				FROM QuestionGroups qg
				JOIN Question q
				ON qg.ID = q.GroupID
				WHERE qg.SurveyID = @surveyID
		    ) AS 'NumberOfQuestions', 
		   (
			SELECT COUNT(r.ID)
			FROM Responses r
			WHERE r.SurveyID = @surveyID
		   ) AS 'NumberOfResponses',
		   s.IsEmailed,
		   s.EmailedUniqueID,
		   s.EmailedUserIDForResponses,
		   s.EmailedSurveyLink
	FROM Survey s
	JOIN Project p
	ON s.ProjectID = p.ID
	WHERE s.ID = @surveyID
