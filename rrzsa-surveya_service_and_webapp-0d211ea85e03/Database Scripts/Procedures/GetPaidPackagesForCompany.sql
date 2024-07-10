/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 02 Feb 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 02 Feb 2017
 Title   		: GetPaidPackagesForCompany
 Purpose  		: Get the paid packages for the company
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetPaidPackagesForCompany')
BEGIN
	DROP PROCEDURE GetPaidPackagesForCompany 
END
GO

CREATE PROCEDURE [dbo].GetPaidPackagesForCompany
	@CompanyID UNIQUEIDENTIFIER
AS

SELECT p.ID, p.DateSignedUp, p.DateStart, p.PaymentType, p.Price, p.DateExpires, p.NumberMonthsSignedUpFor,
p.IsActive, p.IsCompleted,  p.NumberOfSurveys,  p.NumberOfQuestions, p.NumberOfUsers, p.NumberOfResponses, p.PackageName,
p.Description, p.NumberOfProjects, p.BasicReporting, p.AdvancedReporting, p.Excel, p.PDF, p.CSV, p.Piping, p.Summing, p.PaymentStatus,
p.WhiteLabelling, p.PhotoCamera, p.GeoServices, p.Signatures, p.UniqueID, p.PackageStartingPrice, p.OptionalFeaturesPrice, p.PurchaseOrderNumber, 

ISNULL(HasDiscount, 0) as HasDiscount,
ISNULL(DiscountDescription, '') as DiscountDescription,
ISNULL(DiscountPercentage, 0) as DiscountPercentage,
ISNULL(DiscountValue, 0)as DiscountValue,

(
	CASE WHEN p.Price IS NULL
		THEN 0
		ELSE
			p.Price - ISNULL(p.DiscountValue, 0)
	END 
) AS InvoiceAmount,

(
	SELECT SUM(ISNULL(i.AmountPaid,0)) 
	FROM PaymentHistory i
	WHERE i.CompanyPackageID = p.ID and i.PaymentStatus = 'Payment Successful' 
) AS AmountAlreadyPaid, 

--if invoice exists then give invoice details
( 
	SELECT ISNULL(i.ID, NULL)
	FROM Invoice i
	WHERE i.CompanyPackageID = p.ID 
) AS InvoiceID

FROM CompanyPackage p

where p.CompanyID = @CompanyID and p.PaymentStatus = 'Payment Successful'
order by p.DateStart desc

GO