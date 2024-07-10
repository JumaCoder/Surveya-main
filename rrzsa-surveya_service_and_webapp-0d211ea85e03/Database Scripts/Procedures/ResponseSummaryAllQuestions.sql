/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	11 April 2017			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	11 April 2017
	Title			:	ResponseSummaryAllQuestions
	Purpose			:	Gets a count of the responses in all the questions for a given survey
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

IF OBJECT_ID('tempdb..#ResponseCountTbl') IS NOT NULL DROP TABLE #ResponseCountTbl
GO

IF OBJECT_ID('tempdb..#ResponsePerValueCountTbl') IS NOT NULL DROP TABLE #ResponsePerValueCountTbl
GO

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'ResponseSummaryAllQuestions')
BEGIN
	DROP PROCEDURE ResponseSummaryAllQuestions
END
GO

CREATE PROCEDURE [dbo].[ResponseSummaryAllQuestions]
@surveyID UNIQUEIDENTIFIER
AS
BEGIN
SET NOCOUNT ON
  SELECT au.[ResponseValueQuestionID] as QuestionID, au.[ResponseValueQuestionText] as Question, ISNULL(NULLIF(rtrim(au.[ResponseValue]),''), 'Skipped' ) AS Response, COUNT(*) AS ResponsePerValueCount, 
  (SELECT COUNT(*)
	FROM	Surveya_Dev.[dbo].[AuditedResponses] au2
	WHERE	[SurveyID] = @surveyID AND au.[ResponseValueQuestionID] = au2.[ResponseValueQuestionID]
  ) AS TotalResponseCount
 FROM	Surveya_Dev.[dbo].[AuditedResponses] au
 WHERE	[SurveyID] = @surveyID
 GROUP BY [ResponseValueQuestionID], [ResponseValueQuestionText], ResponseValue;

 END
 --ISNULL(NULLIF(rtrim([ResponseValue]),''), 'No Response' ) as ResponseValue
 --NULLIF(rtrim([ResponseValue]),'') as ResponseValue
 /*SELECT [ResponseValueQuestionID], [ResponseValueQuestionText], ISNULL(NULLIF(rtrim([ResponseValue]),''), 'Skipped' ) as ResponseValue, COUNT(*) AS ResponsePerValueCount, ISNULL(NULLIF(rtrim([ResponseValue]),''), 'Skipped' ) as TotalResponseCount
 --INTO	#ResponsePerValueCountTbl
 FROM	Surveya_Dev.[dbo].[AuditedResponses]
 WHERE	[SurveyID] = @surveyID
 GROUP BY [ResponseValueQuestionID], [ResponseValueQuestionText], ResponseValue;

 SELECT perRep.[ResponseValueQuestionID] as QuestionID, perRep.[ResponseValueQuestionText] as Question, perRep.[ResponseValue] as Response, perRep.[ResponsePerValueCount], allRep.[TotalResponseCount]
 FROM	#ResponseCountTbl allRep
 JOIN	#ResponsePerValueCountTbl perRep
 ON		allRep.[ResponseValueQuestionID] = perRep.[ResponseValueQuestionID];


 /* Done with the temp tables */
DROP TABLE #ResponseCountTbl
DROP TABLE #ResponsePerValueCountTbl
*/

/** / exec ResponseSummaryAllQuestions N'8107dbd7-3c88-41cf-87e9-29114443e8c7'	/ **/