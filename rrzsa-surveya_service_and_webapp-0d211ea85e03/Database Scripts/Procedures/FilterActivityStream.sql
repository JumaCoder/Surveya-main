/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 20 January 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 January 2017
 Title   		: FilterActivityStream
 Purpose  		: Filter the activity Stream by User, Project, Survey, activity date, companyId
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'FilterActivityStream')
BEGIN
	DROP PROCEDURE FilterActivityStream
END
GO

CREATE PROCEDURE [dbo].[FilterActivityStream]
	@UserID UNIQUEIDENTIFIER,
	@ProjectID UNIQUEIDENTIFIER,
	@SurveyID UNIQUEIDENTIFIER,
	@ActivityDate DATETIME,
	@CompanyID UNIQUEIDENTIFIER
AS
	--create a empty unique identifier to compare to
	DECLARE @EmptyID UNIQUEIDENTIFIER
	select @EmptyID = cast(cast(0 as binary) as uniqueidentifier)
	
	--declare required variables 
	DECLARE @ParamDefinition NVARCHAR(MAX)
	DECLARE @Statement NVARCHAR(MAX)

	-- create the params for the statement
	SET @ParamDefinition = 
	'@UserID UNIQUEIDENTIFIER,
	@ProjectID UNIQUEIDENTIFIER,
	@SurveyID UNIQUEIDENTIFIER,
	@ActivityDate DATETIME,
	@CompanyID UNIQUEIDENTIFIER'; 

	SET @Statement = 'SELECT TOP 20 
						a.ID,
                        a.CompanyID,
                        a.AffectedUserID,
                        a.AffectedUserFullName,
                        a.PerformedByUserID,
                        a.PerformedByUserFullName,
                        a.link,
                        a.ProjectID,
                        a.ProjectName,
                        a.SurveyID,
                        a.SurveyName,
                        a.ActivityMessage,
                        a.ActivityDate,
                        a.ActivityType,
                        a.DocumentID';

	SET @Statement = @Statement + ' FROM ActivityStream a' ;
	SET @Statement = @Statement + ' WHERE a.CompanyID = @CompanyID AND a.ActivityDate < @ActivityDate';
	
	--if there is a user id, add it to the where
	IF (@UserID <> @EmptyID) 
	BEGIN
		SET @Statement = @Statement + ' AND ( a.PerformedByUserID = @UserID OR a.AffectedUserID =  @UserID )';
	END
	
	--if there is a project id, add it to the where
	IF (@ProjectID <> @EmptyID) 
	BEGIN
		SET @Statement = @Statement + ' AND a.ProjectID =  @ProjectID';
	END
	
	--if there is a survey id, add it to the where
	IF (@SurveyID <> @EmptyID) 
	BEGIN
		SET @Statement = @Statement + ' AND a.SurveyID =  @SurveyID';
	END

	SET @Statement = @Statement + ' ORDER BY a.ActivityDate DESC';

	--execute the statement
	EXECUTE sp_executesql @Statement, @ParamDefinition,
	@UserID = @UserID,
	@ProjectID = @ProjectID,
	@SurveyID = @SurveyID,
	@CompanyID = @CompanyID,
	@ActivityDate = @ActivityDate;

