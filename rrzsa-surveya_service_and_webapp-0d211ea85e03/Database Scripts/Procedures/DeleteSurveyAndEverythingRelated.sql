IF EXISTS (SELECT NAME FROM SYSOBJECTS WHERE NAME = 'DeleteSurveyAndEverythingRelated')
BEGIN
	DROP PROCEDURE DeleteSurveyAndEverythingRelated
END
GO

--exec DeleteSurveyAndEverythingRelated '83f60e1c-472b-41dd-a4b3-2c834707bbb7'
CREATE PROCEDURE DeleteSurveyAndEverythingRelated
@SurveyID UNIQUEIDENTIFIER
AS
	DELETE RV
	  FROM [Surveya_Live].[dbo].[ResponseValues] RV
	  JOIN [Surveya_Live].[dbo].[Responses] R ON RV.ResponseID = R.ID
	  WHERE R.SurveyID = @SurveyID

	DELETE AR
	FROM [Surveya_Live].[dbo].[AuditedResponses] AR
	  WHERE AR.SurveyID = @SurveyID

	DELETE R
	  FROM [Surveya_Live].[dbo].[Responses] R
	  WHERE R.SurveyID = @SurveyID



	DELETE QV
	  FROM [Surveya_Live].[dbo].[QuestionValues] QV
	  JOIN Question Q on QV.QuestionID = Q.ID
	  JOIN QuestionGroups QG on Q.GroupID = QG.ID
	  WHERE QG.SurveyID = @SurveyID

	DELETE QP
	  FROM [Surveya_Live].[dbo].[QuestionPiping] QP
	  JOIN QuestionGroups QG on QP.GroupID = QG.ID
	  WHERE QG.SurveyID = @SurveyID

	DELETE QR
	  FROM [Surveya_Live].[dbo].[QuestionRows] QR
	  JOIN QuestionGroups QG on QR.GroupID = QG.ID
	  WHERE QG.SurveyID = @SurveyID

	DELETE QG
	  FROM QuestionGroups QG
	  WHERE QG.SurveyID = @SurveyID


	DELETE ST
	  FROM [Surveya_Live].[dbo].[SurveyTeam] ST
	  WHERE ST.SurveyID = @SurveyID

	DELETE S
	  FROM [Surveya_Live].[dbo].[Survey] S
	  WHERE S.ID = @SurveyID

GO