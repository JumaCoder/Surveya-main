/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 06 Feb 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 06 Feb 2017
 Title   		: GetCompanyFuturePackages
 Purpose  		: Get the future package that the company signed up for
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetCompanyFuturePackages')
BEGIN
	DROP PROCEDURE GetCompanyFuturePackages
END
GO

CREATE PROCEDURE GetCompanyFuturePackages
@CompanyID UNIQUEIDENTIFIER,
@StartDate DATETIME,
@CurrentCompanyPackageID UNIQUEIDENTIFIER
AS

/*DECLARE @StartDate DATETIME
DECLARE @CompanyID UNIQUEIDENTIFIER 
DECLARE @CurrentCompanyPackageID UNIQUEIDENTIFIER

SET @StartDate = '06 Jul 2017'
SET @CompanyID = 'D0035300-A2BB-4FEA-833D-25C4AEAB4086'
SET @CurrentCompanyPackageID = 'C59406A0-5352-4619-BEB1-270B54779606'*/


--get any packages that have a date range that today falls into
select cp.*
from  CompanyPackage cp
where cp.CompanyID = @CompanyID 
and cp.DateStart > @StartDate
and cp.IsCompleted = 1
and cp.ID != @CurrentCompanyPackageID
order by cp.DateExpires asc
GO

