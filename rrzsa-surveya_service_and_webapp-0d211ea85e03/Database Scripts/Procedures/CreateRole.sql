/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 20 January 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 January 2017
 Title   		: CreateRole
 Purpose  		: Create a role
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'CreateRole')
BEGIN
	DROP PROCEDURE CreateRole
END
GO
CREATE PROCEDURE [dbo].[CreateRole]
	@RoleID UNIQUEIDENTIFIER,
	@RoleName VARCHAR(256),
	@Description VARCHAR(MAX),
	@CompanyID UNIQUEIDENTIFIER = NULL,
	@IsSysRole BIT,
	@IsActive BIT,
	@result VARCHAR(MAX) OUT
AS

	IF EXISTS( SELECT * 
				FROM Roles
				WHERE Roles.RoleId = @RoleID)
	BEGIN
		SET @result = 'Role already exists in your company'
		RETURN
	END

	IF EXISTS( SELECT * 
				FROM Roles
				WHERE Roles.RoleName = @RoleName AND isnull(Roles.CompanyID, '-1') = isnull(CompanyID,'-1'))
	BEGIN
		SET @result =  'Role already exists in your company'
		RETURN
	END

	IF @CompanyID IS NOT NULL
	BEGIN
		IF NOT EXISTS( SELECT * 
						FROM Company
						WHERE Company.ID = @CompanyID)
		BEGIN
			SET @result =  'Company does not exist'
			RETURN
		END
	END

	INSERT INTO Roles(RoleId, RoleName, LoweredRoleName, Description, CompanyID, IsSysRole, IsActive)
	VALUES(@RoleID, @RoleName, LOWER(@RoleName), @Description, @CompanyID, @IsSysRole, @IsActive)

	SET @result = '1'
