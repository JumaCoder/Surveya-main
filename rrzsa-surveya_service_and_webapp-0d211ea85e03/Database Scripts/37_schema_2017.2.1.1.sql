/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
16 Feb 2017   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 16 Feb 2017
 Title   		: 37_schema_2017.2.1.1
 Purpose  		: 
 Instructions 	: Run after 36_schema_2017.1.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='37'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE ProjectTeam
ADD 
	HasUploadedPassport BIT DEFAULT 0,
	HasUploadedVisa BIT DEFAULT 0,
	HasUploadedVaccinationCertificates BIT DEFAULT 0,
	HasUploadedCustomsClearanceCertificates BIT DEFAULT 0,
	HasUploadedETickets BIT DEFAULT 0,
	HasUploadedAccommodationConfirmation BIT DEFAULT 0,
	HasUploadedDriversLicense BIT DEFAULT 0
GO

DROP TABLE Documents
GO

CREATE TABLE Documents
(
	ID UNIQUEIDENTIFIER NOT NULL,
	Name VARCHAR(256) NULL,
	Link VARCHAR(256) NOT NULL,
	/* 
	1. Passport
	2. Visa
	3. Vaccination Certificates
	4. Customs Clearance Certificates
	5. ETickets
	6. Accommodation Confirmation
	7. Drivers License
	*/
	[TypeNumber] BIGINT NOT NULL,				 
	TypeDescription VARCHAR(MAX) NULL,
	ExpiryDate DATETIME NULL,
	IsProjectSpecific BIT NULL,
	ProjectID UNIQUEIDENTIFIER NULL
)
GO

ALTER TABLE Documents
ADD PRIMARY KEY(ID)
GO 

ALTER TABLE Documents
ADD UserID UNIQUEIDENTIFIER NULL,
FileExtension VARCHAR(32) NULL
GO

UPDATE Features
SET [FriendlyName] = 'Branding'
WHERE [Name] = 'WhiteLabelling'
GO

ALTER TABLE ActivityStream
ADD DocumentID UNIQUEIDENTIFIER NULL
GO