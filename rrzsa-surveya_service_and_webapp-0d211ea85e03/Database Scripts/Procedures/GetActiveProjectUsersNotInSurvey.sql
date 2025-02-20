/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 20 January 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 January 2017
 Title   		: GetActiveProjectUsersNotInSurvey
 Purpose  		: Get the active project users not in the specified survey
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetActiveProjectUsersNotInSurvey')
BEGIN
	DROP PROCEDURE GetActiveProjectUsersNotInSurvey
END
GO
       
CREATE PROCEDURE [dbo].[GetActiveProjectUsersNotInSurvey]
	@companyID UNIQUEIDENTIFIER,
	@projectID UNIQUEIDENTIFIER,
	@surveyID UNIQUEIDENTIFIER
AS
	SELECT u.UserId, u.Firstnames, u.Lastname, u.Email
	from aspnet_Membership u
	join CompanyUsers c
	on u.UserId = c.UserID
	
	where c.CompanyID = @companyID 
	AND u.UserId IN 
	(
		SELECT t.UserID
		FROM ProjectTeam t
		WHERE t.ProjectID = @projectID AND t.IsActive = 1
	)
	AND u.UserId NOT IN 
	(
		SELECT t.UserID
		FROM SurveyTeam t
		WHERE t.SurveyID = @surveyID
	)
	order by u.Firstnames, u.Lastname
