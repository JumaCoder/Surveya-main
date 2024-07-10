/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
11 Jan 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 11 Jan 2017
 Title   		: 31_schema_2017.1.1.1
 Purpose  		: 
 Instructions 	: Run after 30_schema_2016.12.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='31'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE CompanyPackage
ADD
	PaymentStatus  VARCHAR(256) NULL,
	PaymentErrorStatus VARCHAR(MAX) NULL,
	PaymentPending BIT NULL,
	PaymentInitiateStart DATETIME NULL
GO

ALTER TABLE CompanyPackage
DROP COLUMN PaymentInitiateStart
GO

CREATE TABLE PaymentHistory
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,

	-- package details
	CompanyPackageID UNIQUEIDENTIFIER NOT NULL,
	DateStarted DATETIME NULL,
	DateCompleted DATETIME NULL,
	PaymentStatus VARCHAR(MAX) NULL,
	TransactionStatus VARCHAR(256) NULL,
	PayRequestID VARCHAR(256) NULL,

	-- invoice details
	InvoiceID UNIQUEIDENTIFIER NOT NULL,
	AmountPaid DECIMAL(18,2) NOT NULL
)
GO

ALTER TABLE PaymentHistory
ADD PaymentType VARCHAR(256) NULL
GO

ALTER TABLE PaymentHistory
ADD PaymentEmail VARCHAR(256) NOT NULL
GO

ALTER TABLE PaymentHistory
ADD
	CreatedBy UNIQUEIDENTIFIER NULL,
	DateCreated DATETIME NULL
GO


DROP TABLE Payments
GO

CREATE TABLE ReceiptHistory
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,

	-- payment info
	PaymentID UNIQUEIDENTIFIER NOT NULL,
	CompanyPackageID UNIQUEIDENTIFIER NOT NULL,

	--receipt info
	ReceiptDate DATETIME NOT NULL,
	ReceiptDescription VARCHAR(MAX) NOT NULL,

	--package info
	PackageName VARCHAR(256) NOT NULL,

	--company info
	CompanyID UNIQUEIDENTIFIER NOT NULL,
	CompanyName VARCHAR(256) NOT NULL,
	EmailedTo VARCHAR(256) NOT NULL
)
GO

ALTER TABLE ReceiptHistory
ADD
	AmountPaid DECIMAL(18,2) NOT NULL
GO

ALTER TABLE CompanyPackageHistory
ALTER COLUMN CreatedBy UNIQUEIDENTIFIER NULL
GO

UPDATE GlobalSettings
Set SettingName = 'Discount12MonthsSignup'
WHERE SettingName = '12 Months Package Discount'
GO

UPDATE GlobalSettings
Set SettingName = 'Discount6MonthsSignup'
WHERE SettingName = '6 Months Package Discount'
GO

ALTER TABLE CompanyPackage
ADD 
DiscountPercentage DECIMAL(18,2),
HasDiscount BIT NULL,
DiscountValue DECIMAL(18,2)
GO

ALTER TABLE CompanyPackage
ADD 
DiscountDescription VARCHAR(MAX)
GO

Update CompanyPackage
set DiscountPercentage =0 ,
HasDiscount =0, 
DiscountValue =0
GO

