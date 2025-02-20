/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 20 January 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 20 January 2017
 Title   		: GetInvoiceLineItem
 Purpose  		: Get the line items for the specified invoice
 Instructions 	: 

-------------------------------------------------------------------------------------------------*/

IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'GetInvoiceLineItem')
BEGIN
	DROP PROCEDURE GetInvoiceLineItem
END
GO
--exec getinvoicelineitem '17A56FDE-2BF3-47A0-97DD-033D512C263F'
CREATE PROCEDURE [dbo].[GetInvoiceLineItem]
@InvoiceID UNIQUEIDENTIFIER
AS
	SELECT *,(Price*Quantity) as Total, (((Price*Quantity) / 115) * 15) as VATAmount -- (Price*Quantity) * 14/114 as VATAmount
	FROM InvoiceLineItem
	WHERE InvoiceLineItem.InvoiceID = @InvoiceID
	ORDER BY Total desc
