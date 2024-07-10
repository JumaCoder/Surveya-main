/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	11 October 2017			Roxanne Rassool			Fixed joins to ensure that question row data pulls through
---------------------------------------------------------------------------------------------------
	24  Mar 2017			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	24  Mar 2017
	Title			:	GetAuditedResponses
	Purpose			:	Get the responses for auditing
	Instructions	:	

-------------------------------------------------------------------------------------------------*/


IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetAuditedResponses')
BEGIN
	DROP PROCEDURE GetAuditedResponses
END
GO

--exec GetAuditedResponses '9A79597F-14CE-4F0F-A031-4D2DBECE6B3A'	

CREATE PROCEDURE [dbo].[GetAuditedResponses]
@SurveyID UNIQUEIDENTIFIER
AS
	
	--declare @SurveyID UNIQUEIDENTIFIER = 'a6c46b29-84fd-4fac-91b5-d76fbbd7ff6b'	
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
	ORDER BY AR.ResponseDateCreated, AR.ResponseID, PagePosition, GroupPosition, RowPosition, QuestionPosition
GO