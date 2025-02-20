/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	06 October 2017		Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	06 October 2017
	Title			:	GetResponses
	Purpose			:	Get the original responses
	Instructions	:	Run with other procedures

-------------------------------------------------------------------------------------------------*/


IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetResponses')
BEGIN
	DROP PROCEDURE GetResponses
END
GO

--exec GetResponses '9a79597f-14ce-4f0f-a031-4d2dbece6b3a'
CREATE PROCEDURE [dbo].[GetResponses]
@SurveyID UNIQUEIDENTIFIER
AS
	SELECT 
        R.ID as ResponseID,
		R.DateCreated as ResponseDateCreated,
		( CASE WHEN (U.Firstnames IS NULL ) 
			THEN U.Email 
			ELSE U.Firstnames + ' ' + U.Lastname + ' ('+U.Email + ') ' 
		END) AS CreatedByName,
		ResponseSurveyTitle = R.SurveyTitle
	FROM Responses R
	INNER JOIN aspnet_Membership U
			ON R.CreatedBy = U.UserId
	WHERE R.SurveyID = @SurveyID
	ORDER BY R.DateCreated

GO