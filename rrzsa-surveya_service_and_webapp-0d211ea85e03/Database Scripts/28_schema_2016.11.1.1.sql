/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
30 November 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 30 November 2016
 Title   		: 28_schema_2016.11.1.1
 Purpose  		: Add package start date
 Instructions 	: Run after 27_schema_2016.11.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='28'
WHERE SettingName = 'DBVersion'
GO


/*CREATE TABLE QuestionPiping
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	QuestionID UNIQUEIDENTIFIER NOT NULL, -- the question that causes the piping to occur
	GroupID UNIQUEIDENTIFIER NOT NULL, -- the group that should be hidden
	CompareValue VARCHAR(256) NOT NULL, -- the value to check the question against
	CompareOperator VARCHAR(256) NOT NULL, -- the operator to use in the checking either >,  <,  >=,  <=,  =
	Show BIT NOT NULL -- whether to show / hide the group
)
GO*/

CREATE TABLE QuestionPiping
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	GroupID UNIQUEIDENTIFIER NOT NULL, -- the group that should be hidden
	PipingConditions VARCHAR(256) NOT NULL,
	Show BIT NOT NULL -- whether to show / hide the group
)
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES
(newid(),'Question','UpdatePiping','Update Piping','Update Piping on questions'),
(newid(),'Question','DeletePiping','Delete Piping','Delete Piping on questions'),
(newid(),'Question','AddPiping','Add Piping','Add Piping on questions')
GO

ALTER PROCEDURE [dbo].[GetInvoiceLineItem]
@InvoiceID UNIQUEIDENTIFIER
AS
	SELECT *,(Price*Quantity) as Total, (Price*Quantity) * 14/114 as VATAmount
	FROM InvoiceLineItem
	WHERE InvoiceLineItem.InvoiceID = @InvoiceID
	ORDER BY Total desc
GO

CREATE TABLE SurveyaDetails
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	RegistrationNumber VARCHAR(256) NOT NULL,
	CompanyName VARCHAR(256) NOT NULL,
	Street VARCHAR(256) NOT NULL,
	Suburb VARCHAR(256) NOT NULL,
	City VARCHAR(256)  NOT NULL,
	Country VARCHAR(256) NULL,
	PostalCode VARCHAR(256) NOT NULL,
	VatNumber VARCHAR(256) NULL,
	InvoiceNote VARCHAR(MAX) NULL,
	InvoiceTerms VARCHAR(MAX) NULL,
)
GO

INSERT INTO SurveyaDetails(ID, RegistrationNumber, CompanyName, Street, Suburb, City, Country, PostalCode, InvoiceNote, InvoiceTerms, VatNumber)
VALUES(newid(), '2016/067991/07','Surveya Global Surveya Network', '19 Newcombe Avenue', 'Miramar','Port Elizabeth', 'South Africa', '6001', 'Thank you for your business','Due on Receipt', '1234567890')
GO

CREATE PROCEDURE GetSurveyaDetails
AS
	SELECT *
	FROM SurveyaDetails
GO