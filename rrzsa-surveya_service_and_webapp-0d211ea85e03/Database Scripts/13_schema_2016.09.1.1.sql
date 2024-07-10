/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	23 Sep 2016			Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	23 Sep 2016
	Title			:	13_schema_2016.09.1.1
	Purpose			:	make a proc to get the survey details, include the survey stats #NumberOfSurveyUsers, #NumberOfQuestions, #NumberOfResponses
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='13'
WHERE SettingName = 'DBVersion'
GO

CREATE PROCEDURE [dbo].[GetSurveyDetails]
	@surveyID UNIQUEIDENTIFIER
AS
	SELECT s.ID, s.SurveyTitle, s.DateCreated, s.CreatedBy, s.Purpose,s.UpdatedBy,s.DateUpdated,s.StartDate,s.EndDate,
           s.StartedByUserID, s.EndedByUserID,s.ProjectID,p.ProjectName,CompanyID = p.ProjectCompany,
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
		   ) AS 'NumberOfResponses'
	FROM Survey s
	JOIN Project p
	ON s.ProjectID = p.ID
	WHERE s.ID = @surveyID
GO