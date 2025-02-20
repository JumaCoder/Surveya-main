USE [Surveya_Live]
GO
/****** Object:  StoredProcedure [dbo].[GetAuditedResponsesForMatrix]    Script Date: 2019/11/11 10:09:03 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--exec GetAuditedResponsesForMatrix 'c023f072-8fb2-46d1-8d04-35dd9155a9ed'	

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetAuditedResponsesForMatrix')
BEGIN
	DROP PROCEDURE GetAuditedResponsesForMatrix
END
GO


CREATE PROCEDURE [dbo].[GetAuditedResponsesForMatrix]
@SurveyID UNIQUEIDENTIFIER
AS
	
	--declare @SurveyID UNIQUEIDENTIFIER = 'c023f072-8fb2-46d1-8d04-35dd9155a9ed'	

	SELECT
        @SurveyID as ID,
        @SurveyID as ResponseID,
        QG2.GroupName AS PageName,
        QG.GroupName AS GroupName,
        QG.GroupType,
        ISNULL(QR.RowText, '') AS RowName,
        Q.QuestionText as ResponseValueQuestionText,
		@SurveyID as ResponseValueQuestionID,
		'' as ResponseSurveyTitle,
        '' as ResponseValue,
        '1754-01-01 00:00:00.000' as ResponseDateCreated,
        QG2.Position AS PagePosition,
        QG.Position AS GroupPosition,
        Q.Position AS QuestionPosition,
        CASE WHEN QR.Position IS NULL 
                THEN
                        0
                ELSE
                        QR.Position
        END AS RowPosition,
        QT.FriendlyName AS ControlType,
		QR.ID AS QuestionRowID
	FROM Question Q
	LEFT JOIN QuestionGroups QG
			ON QG.ID = Q.GroupID
	LEFT JOIN QuestionRows QR
			ON QR.GroupID = QG.ID
	LEFT JOIN QuestionType QT
			ON QT.ID = Q.QuestionType
	LEFT JOIN QuestionGroups QG2
			ON QG2.ID = QG.ParentGroupID
					WHERE QG.SurveyID = @SurveyID


	UNION


	SELECT DISTINCT
        AR.ID,
        AR.ResponseID,
        QG2.GroupName AS PageName,
        QG.GroupName AS GroupName,
        QG.GroupType,
        ISNULL(QR.RowText, '') AS RowName,
        AR.ResponseValueQuestionText,
		AR.ResponseValueQuestionID,
		R.SurveyTitle as ResponseSurveyTitle,
        CASE WHEN QT.Type = 'signature' OR QT.Type = 'camera'
        THEN
                'http://surveya.rrzdev.co.za/Administration/ViewResponseImage?AuditedResponseID='+CONVERT(VARCHAR(MAX),ar.ID)   
		/*or multi-select options*/
		WHEN QT.FriendlyName = 'Check Boxes' 
		THEN
				SUBSTRING(
				(
					SELECT 
					CASE WHEN AR2.ResponseValue IS NOT NULL AND TRIM(AR2.ResponseValue) <> '' AND AR2.ResponseValue <> 'undefined'
						THEN ';' + AR2.ResponseValue
						ELSE ''
					END
					FROM AuditedResponses AR2
					WHERE AR2.SurveyID = @SurveyID AND AR.ResponseID = AR2.ResponseID AND AR.ResponseValueQuestionID = AR2.ResponseValueQuestionID
					FOR XML PATH('')
				), 2 , 9999)
        ELSE
                AR.ResponseValue        
        END AS ResponseValue,
        AR.ResponseDateCreated,
        QG2.Position AS PagePosition,
        QG.Position AS GroupPosition,
        Q.Position AS QuestionPosition,
        CASE WHEN QR.Position IS NULL 
                THEN
                        0
                ELSE
                        QR.Position
        END AS RowPosition,
        QT.FriendlyName AS ControlType,
		QR.ID AS QuestionRowID
	FROM AuditedResponses AR
	LEFT JOIN Responses R
			ON R.ID = AR.ResponseID
	LEFT JOIN ResponseValues RV
			ON RV.ID = AR.ResponseValueID
	LEFT JOIN QuestionRows QR
			ON QR.ID = RV.QuestionRowID
	LEFT JOIN Question Q
			ON Q.ID = RV.QuestionID
	LEFT JOIN QuestionType QT
			ON QT.ID = Q.QuestionType
	LEFT JOIN QuestionGroups QG
			ON QG.ID = Q.GroupID
	LEFT JOIN QuestionGroups QG2
			ON QG2.ID = QG.ParentGroupID
					WHERE AR.SurveyID = @SurveyID
	ORDER BY ResponseDateCreated, ResponseID, PagePosition, GroupPosition, RowPosition, QuestionPosition