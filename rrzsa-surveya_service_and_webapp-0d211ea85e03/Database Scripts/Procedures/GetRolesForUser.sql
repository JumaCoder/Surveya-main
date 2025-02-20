/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 20 January 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 January 2017
 Title   		: GetRolesForUser
 Purpose  		: The the roles for the specified user
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetRolesForUser')
BEGIN
	DROP PROCEDURE GetRolesForUser
END
GO

CREATE PROCEDURE [dbo].[GetRolesForUser]
	@UserID UNIQUEIDENTIFIER
AS
	SELECT Roles.RoleId, Roles.RoleName
	FROM Roles
	JOIN CompanyUsers
	ON CompanyUsers.RoleID = Roles.RoleId
	WHERE CompanyUsers.UserID = @UserID

