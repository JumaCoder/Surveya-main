/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	11 October 2017			Roxanne Rassool			Fixed joins to ensure that question row data pulls through
---------------------------------------------------------------------------------------------------
	10 October 2017		Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	10 October 2017
	Title			:	GetSurveyQuestionStats
	Purpose			:	Get the stats for the questions in a specific survey - for the general report (static)
	Instructions	:	Run with other procedures

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetSurveyQuestionStats')
BEGIN
	DROP PROCEDURE GetSurveyQuestionStats
END
GO

--exec GetSurveyQuestionStats '9A79597F-14CE-4F0F-A031-4D2DBECE6B3A'	
CREATE PROCEDURE [dbo].[GetSurveyQuestionStats]
@SurveyID UNIQUEIDENTIFIER--,
--@UserID UNIQUEIDENTIFIER = NULL
AS

--declare @SurveyID UNIQUEIDENTIFIER = '9A79597F-14CE-4F0F-A031-4D2DBECE6B3A'
--select sum(NumberAnswers) from (
	SELECT DISTINCT
        QG2.GroupName AS PageName,
        QG.GroupName AS GroupName,
        QG.GroupType,
        ISNULL(QR.RowText, '') AS RowName,
        AR.ResponseValueQuestionText,
		AR.ResponseValueQuestionID,
        CASE WHEN QT.Type = 'signature' OR QT.Type = 'camera'
        THEN
				CASE WHEN AR.ResponseValue = '' or AR.ResponseValue IS NULL
					THEN ''
					ELSE /*'IMAGE / SIGNATURE UPLOADED'*/ 'http://surveya.rrzdev.co.za/Administration/ViewResponseImage?AuditedResponseID='+CONVERT(VARCHAR(MAX),AR.ID)   
				END
        ELSE
                AR.ResponseValue        
        END AS ResponseValue,
        QG2.Position AS PagePosition,
        QG.Position AS GroupPosition,
        Q.Position AS QuestionPosition,
        CASE WHEN QR.Position IS NULL 
                THEN
                        0
                ELSE
                        QR.Position
        END AS RowPosition,
		QR.ID AS QuestionRowID,

		COUNT(AR.ResponseID) AS 'NumberAnswers'

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
		/*AND (
				(@UserID IS NOT NULL AND AR.CreatedBy = @UserID)
				OR 
				(@UserID IS NULL)
			)*/
			

	GROUP BY AR.ID, AR.ResponseValueQuestionText, AR.ResponseValueQuestionID, AR.ResponseValue, QG2.GroupName, QG.GroupName, QG.GroupType, QG2.Position, QG.Position, QR.RowText,QR.Position, QR.ID, QT.Type, Q.Position
	--) as t
	ORDER BY PagePosition, GroupPosition, RowPosition, QuestionPosition
GO


-- 1746 but should give 1752