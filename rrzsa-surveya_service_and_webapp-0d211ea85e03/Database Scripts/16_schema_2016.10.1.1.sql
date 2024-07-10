/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 14 October 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 14 October 2016
 Title   		: 16_schema_2016.06.1.1
 Purpose  		: Add more rights into the tables 
 Instructions 	: Run after 15_schema_2016.10.1.1.sql

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='16'
WHERE SettingName = 'DBVersion'
GO

CREATE TABLE ResetPasswordRequests
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	UserID UNIQUEIDENTIFIER NOT NULL,
	DateRequested DATETIME NOT NULL,
	IsDeleted BIT NOT NULL
)
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
('C51C6EF9-683C-4789-8906-8946E77374E1','Company','GetSpecificCompany','View Company Details','View the details of a company'),
('5A79F2DD-6CFB-4E96-98D7-853F2CE6DBCE','Invoice','ViewMyInvoice','View Company Invoices','View all invoices for my company'),
('59F3C46D-FDCF-459C-B15E-6C29B9BF6626','Payment','Payment','Generate an Invoice and Payment','Generate an Invoice and Payment')
GO

INSERT INTO ApplicationRightsInRoles(ID, RoleID, ApplicationRightID, DateAssigned, UserAssigned, DateUpdated, LastUserUpdated)
VALUES
(newid(),'8FF17FF3-56D6-4D5B-A8D0-9DC0D473CDDC','C51C6EF9-683C-4789-8906-8946E77374E1','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25'),
(newid(),'40EC673F-0AE7-41C4-8884-A9D7D308D6C6','C51C6EF9-683C-4789-8906-8946E77374E1','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25'),
(newid(),'8FF17FF3-56D6-4D5B-A8D0-9DC0D473CDDC','5A79F2DD-6CFB-4E96-98D7-853F2CE6DBCE','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25'),
(newid(),'40EC673F-0AE7-41C4-8884-A9D7D308D6C6','5A79F2DD-6CFB-4E96-98D7-853F2CE6DBCE','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25'),
(newid(),'8FF17FF3-56D6-4D5B-A8D0-9DC0D473CDDC','59F3C46D-FDCF-459C-B15E-6C29B9BF6626','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25'),
(newid(),'40EC673F-0AE7-41C4-8884-A9D7D308D6C6','59F3C46D-FDCF-459C-B15E-6C29B9BF6626','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','10/17/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25')
GO


CREATE PROCEDURE GetInvoice
@InvoiceID UNIQUEIDENTIFIER
AS
	SELECT Invoice.ID, Invoice.InvoiceNumber, Invoice.InvoiceDate, Invoice.CompanyID, Invoice.CompanyName, 
	CASE WHEN Invoice.VatNumber IS NULL THEN 'n/a' ELSE Invoice.VatNumber END AS VatNumber ,Invoice.PhysicalAddress,Invoice.PackageID,Invoice.CompanyPackageID
	FROM Invoice
	WHERE Invoice.ID = @InvoiceID
GO

CREATE PROCEDURE GetInvoiceLineItem
@InvoiceID UNIQUEIDENTIFIER
AS
	SELECT *,(Price*Quantity) as Total, (Price*Quantity) * 14/114 as VATAmount
	FROM InvoiceLineItem
	WHERE InvoiceLineItem.InvoiceID = @InvoiceID
GO

ALTER TABLE Invoice
ADD PackageName VARCHAR(256) 
GO