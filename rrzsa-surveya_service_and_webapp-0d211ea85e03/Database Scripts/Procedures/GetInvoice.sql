/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 20 January 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 January 2017
 Title   		: GetInvoice
 Purpose  		: Get the invoice details
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetInvoice')
BEGIN
	DROP PROCEDURE GetInvoice
END
GO

CREATE PROCEDURE [dbo].[GetInvoice]
@InvoiceID UNIQUEIDENTIFIER
AS
	SELECT Invoice.ID, Invoice.InvoiceNumber, Invoice.InvoiceDate, Invoice.CompanyID, Invoice.CompanyName, 
	CASE WHEN Invoice.VatNumber IS NULL 
		THEN 'n/a' 
		ELSE Invoice.VatNumber 
	END AS VatNumber,
	Invoice.PhysicalAddress,Invoice.PackageID,Invoice.CompanyPackageID,
	CASE WHEN Invoice.PurchaseOrderNumber IS NULL 
		THEN 'n/a' 
		ELSE Invoice.PurchaseOrderNumber 
	END AS PurchaseOrderNumber
	FROM Invoice
	WHERE Invoice.ID = @InvoiceID
