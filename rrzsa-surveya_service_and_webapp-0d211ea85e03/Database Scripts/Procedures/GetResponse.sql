/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	11 October 2017			Roxanne Rassool			Fixed joins to ensure that question row data pulls through
---------------------------------------------------------------------------------------------------
	06 October 2017		Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	06 October 2017
	Title			:	GetResponse
	Purpose			:	Get a specific original response
	Instructions	:	Run with other procedures

-------------------------------------------------------------------------------------------------*/


IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetResponse')
BEGIN
	DROP PROCEDURE GetResponse
END
GO

--exec GetResponse 'EB3FC4D6-3A34-4704-B80D-E5041C65ACCD'
CREATE PROCEDURE [dbo].[GetResponse]
@ResponseID UNIQUEIDENTIFIER
AS
	SELECT R.* FROM (
		SELECT DISTINCT
			R.ID as ResponseID,
			QG2.GroupName AS PageName,
			QG.GroupName AS GroupName,
			QG.GroupType,
			ISNULL(QR.RowText, '') AS RowName,
			RV.QuestionText,
			CASE WHEN QT.Type = 'signature' OR QT.Type = 'camera'
			THEN
				   'http://surveya.rrzdev.co.za/Administration/ViewResponseImage?ResponseID='+CONVERT(VARCHAR(MAX),RV.ID)   
			ELSE
					RV.Value        
			END AS ResponseValue,
			R.DateCreated as ResponseDateCreated,
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
			QR.ID AS QuestionRowID,
			S.ID AS SurveyID,
			S.SurveyTitle,
			S.DateCreated,
			S.CreatedBy,
			S.Purpose,
			S.StartDate,
			S.EndDate,
			( CASE WHEN (U.Firstnames IS NULL ) 
				THEN U.Email 
				ELSE U.Firstnames + ' ' + U.Lastname + ' ('+U.Email + ') ' 
			END) AS CreatedByName,
			ResponseSurveyTitle = R.SurveyTitle
		FROM Responses R
		INNER JOIN Survey S
				ON R.SurveyID = S.ID
		INNER JOIN aspnet_Membership U
				ON R.CreatedBy = U.UserId
		LEFT JOIN ResponseValues RV
				ON RV.ResponseID = R.ID
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
						WHERE R.ID = @ResponseID
	) AS R
	WHERE LTRIM(R.ResponseValue) <> ''
	ORDER BY R.DateCreated, R.ResponseID, R.PagePosition, R.GroupPosition, R.RowPosition, R.QuestionPosition
GO