/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 20 January 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 January 2017
 Title   		: GetCompanyUsersInProject
 Purpose  		: Get the company users in the specified project
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetCompanyUsersInProject')
BEGIN
	DROP PROCEDURE GetCompanyUsersInProject
END
GO
  
CREATE PROCEDURE [dbo].[GetCompanyUsersInProject]
	@companyID UNIQUEIDENTIFIER,
	@projectID UNIQUEIDENTIFIER
AS
	SELECT u.UserId, u.Firstnames, u.Lastname, u.Email, u.ContactNumber, u.Country, c.CompanyID, c.RoleID, r.RoleName, u.IsLockedOut ^ 1 as IsActive
	from aspnet_Membership u
	join CompanyUsers c
	on u.UserId = c.UserID
	join Roles r
	on c.RoleID = r.RoleId
	where c.CompanyID = @companyID AND u.IsLockedOut = 0 
	AND u.UserId NOT IN 
	(
		SELECT t.UserID
		FROM ProjectTeam t
		WHERE t.ProjectID = @ProjectID
	)
	order by u.Firstnames, u.Lastname
