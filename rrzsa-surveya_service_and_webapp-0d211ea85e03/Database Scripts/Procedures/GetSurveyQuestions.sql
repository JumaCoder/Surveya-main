/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	12 April 2017			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	12 April 2017
	Title			:	GetSurveyQuestions
	Purpose			:	Get all questions in survey excluding questions in tables
	Instructions	:	

-------------------------------------------------------------------------------------------------*/


IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetSurveyQuestions')
BEGIN
	DROP PROCEDURE GetSurveyQuestions
END
GO

CREATE PROCEDURE [dbo].[GetSurveyQuestions]
@surveyID UNIQUEIDENTIFIER
AS
SELECT	q.[ID], q.[QuestionText], q.[QuestionType], q.[GroupID]
  FROM	[Surveya_Dev].[dbo].[Question] q
  JOIN	[QuestionGroups] qG
  ON	q.[GroupID] = qG.[ID]
  WHERE	qG.[SurveyID] = @surveyID
  AND	qG.GroupType != 'Table'
GO
  -- exec GetSurveyQuestions '8107dbd7-3c88-41cf-87e9-29114443e8c7'