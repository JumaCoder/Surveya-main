/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	11 April 2017			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	11 April 2017
	Title			:	ResponseSummaryPerQuestion
	Purpose			:	Gets a count of the responses in all the questions for a given survey
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

IF OBJECT_ID('tempdb..#ResponseCountTbl') IS NOT NULL DROP TABLE #ResponseCountTbl
GO

IF OBJECT_ID('tempdb..#ResponsePerValueCountTbl') IS NOT NULL DROP TABLE #ResponsePerValueCountTbl
GO

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'ResponseSummaryPerQuestion')
BEGIN
	DROP PROCEDURE ResponseSummaryPerQuestion
END
GO

CREATE PROCEDURE [dbo].[ResponseSummaryPerQuestion]
@surveyID UNIQUEIDENTIFIER,
@questionID UNIQUEIDENTIFIER
AS

 SELECT [ResponseValueQuestionID], [ResponseValueQuestionText], COUNT(*) AS TotalResponseCount
 INTO	#ResponseCountTbl
 FROM	Surveya_Dev.[dbo].[AuditedResponses]
 WHERE	[SurveyID] = @surveyID
 AND	[ResponseValueQuestionID] = @questionID
 GROUP BY [ResponseValueQuestionID], [ResponseValueQuestionText]

 --ISNULL(NULLIF(rtrim([ResponseValue]),''), 'No Response' ) as ResponseValue
 --NULLIF(rtrim([ResponseValue]),'') as ResponseValue
 SELECT [ResponseValueQuestionID], [ResponseValueQuestionText],  ISNULL(NULLIF(rtrim([ResponseValue]),''), 'Skipped' ) as ResponseValue, COUNT(*) AS ResponsePerValueCount
 INTO	#ResponsePerValueCountTbl
 FROM	Surveya_Dev.[dbo].[AuditedResponses]
 WHERE	[SurveyID] = @surveyID
 AND	[ResponseValueQuestionID] = @questionID
 GROUP BY [ResponseValueQuestionID], [ResponseValueQuestionText], ResponseValue

 SELECT perRep.[ResponseValueQuestionText] as Question, perRep.[ResponseValue] as Response, perRep.[ResponsePerValueCount], allRep.[TotalResponseCount]
 FROM	#ResponseCountTbl allRep
 JOIN	#ResponsePerValueCountTbl perRep
 ON		allRep.[ResponseValueQuestionID] = perRep.[ResponseValueQuestionID]


 /* Done with the temp tables */
DROP TABLE #ResponseCountTbl
DROP TABLE #ResponsePerValueCountTbl

/** / exec ResponseSummaryPerQuestion N'8107dbd7-3c88-41cf-87e9-29114443e8c7'	/ **/