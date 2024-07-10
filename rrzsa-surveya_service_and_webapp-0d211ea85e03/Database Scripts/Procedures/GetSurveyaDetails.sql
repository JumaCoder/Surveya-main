/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 20 January 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 January 2017
 Title   		: GetSurveyaDetails
 Purpose  		: Get the details for Surveya
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetSurveyaDetails')
BEGIN
	DROP PROCEDURE GetSurveyaDetails
END
GO

CREATE PROCEDURE [dbo].[GetSurveyaDetails]
AS
	SELECT *
	FROM SurveyaDetails
