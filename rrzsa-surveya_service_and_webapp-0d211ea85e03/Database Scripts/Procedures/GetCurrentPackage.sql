/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 06 Feb 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 06 Feb 2017
 Title   		: GetCompanyCurrentPackage
 Purpose  		: Get the current package for the company
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetCompanyCurrentPackage')
BEGIN
	DROP PROCEDURE GetCompanyCurrentPackage
END
GO

CREATE PROCEDURE GetCompanyCurrentPackage
@CompanyID UNIQUEIDENTIFIER,
@StartDate DATETIME
AS

/*DECLARE @StartDate DATETIMEs
SET @StartDate = '06 Jul 2017'*/

--get any packages that have a date range that today falls into
select cp.*
from  CompanyPackage cp
where cp.CompanyID = @CompanyID 
and @StartDate >= cp.DateStart 
and (cp.DateExpires IS NULL or @StartDate < DATEADD(day, 1 , cp.DateExpires) )
and cp.IsActive = 1 
order by cp.DateExpires asc
GO
