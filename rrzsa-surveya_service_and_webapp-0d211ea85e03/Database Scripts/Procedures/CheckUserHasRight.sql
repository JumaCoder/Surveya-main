/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 20 January 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 January 2017
 Title   		: CheckUserHasRight
 Purpose  		: Check if the user has the specified right
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'CheckUserHasRight')
BEGIN
	DROP PROCEDURE CheckUserHasRight
END
GO

CREATE PROCEDURE [dbo].[CheckUserHasRight]
@userID UNIQUEIDENTIFIER,
@right VARCHAR(256)
AS
BEGIN
	SELECT uir.UserId, ar.* 
	FROM CompanyUsers uir
	INNER JOIN ApplicationRightsInRoles arir
		ON arir.RoleID = uir.RoleId
	INNER JOIN Application_Rights ar
		ON ar.ID = arir.ApplicationRightID
	WHERE 
		uir.UserId = @userID AND
		ar.Name = @right
END
