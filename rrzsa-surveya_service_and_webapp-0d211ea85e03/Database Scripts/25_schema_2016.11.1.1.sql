/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
21 November 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 21 November 2016
 Title   		: 25_schema_2016.11.1.1
 Purpose  		: Add whitelabelling for companies
 Instructions 	: Run after 24_schema_2016.11.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='25'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE Company
ADD LogoSM VARBINARY(MAX) NULL,
SelectedSkin VARCHAR(MAX) NULL
GO


INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
(newid(),'ViewActivityStream','ViewActivityStream','View Activity Stream','View and filter the companies activity stream'),
(newid(),'Company','SaveWhiteLabelling','White-Labelling','Update Companies White-Labelling details')
GO

UPDATE Application_Rights
SET RightGroup = 'ActivityStream'
WHERE Name = 'ViewProjectActivityStream'
GO

CREATE PROCEDURE FilterActivityStream
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
                        a.ActivityType';

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

	--execute the statement
	EXECUTE sp_executesql @Statement, @ParamDefinition,
	@UserID = @UserID,
	@ProjectID = @ProjectID,
	@SurveyID = @SurveyID,
	@CompanyID = @CompanyID,
	@ActivityDate = @ActivityDate;

GO