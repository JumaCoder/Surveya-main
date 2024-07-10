/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
 23 August 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 23 August 2016
 Title   		: 08_schema_2016.08.1.1
 Purpose  		: create tables for questions
 Instructions 	: run after 07_schema_2016.08.1.1

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue='08'
WHERE SettingName = 'DBVersion'
GO

Update Application_Rights
SET Name = 'GetGroupsAndQuestionsForSurvey',
Description = 'View all groups and questions for the survey',
FriendlyName = 'View Groups and Questions'
WHERE ID = 'AF65CBEA-EFA1-4ACC-96A9-10286E383FF5'
GO

Update Application_Rights
SET Name = 'GetSpecificQuestion',
Description = 'View the details of specific questions',
FriendlyName = 'View Specific Questions'
WHERE ID = '9B53B634-0986-48D0-BCF9-39E715049FF7'
GO

Update Application_Rights
SET Name = 'MoveQuestionGroup',
Description = 'Reorder the groups of questions in a survey',
FriendlyName = 'Move Question Groups'
WHERE ID = 'F729E67A-DAAE-4574-88F0-E39FB35F08C5'
GO

INSERT INTO Application_Rights (ID, RightGroup, Name, FriendlyName, Description)
VALUES('0E794106-A1AB-4E87-8E44-6CC7627AE7F1', 'Survey', 'MoveQuestion','Move Questions', 'Reorder the questions in a survey')
GO

INSERT INTO ApplicationRightsInRoles(ID, RoleID, ApplicationRightID, DateAssigned, UserAssigned, DateUpdated, LastUserUpdated)
VALUES (newid(),'8FF17FF3-56D6-4D5B-A8D0-9DC0D473CDDC','0E794106-A1AB-4E87-8E44-6CC7627AE7F1','07/11/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25','07/11/2016','82359D8E-2FB6-4B92-A39B-3B54BBD3DD25')
GO

CREATE TABLE QuestionGroups
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	GroupType VARCHAR(256) NOT NULL,											-- Table/Tab/Normal
	GroupName VARCHAR(256) NOT NULL,
	CreatedBy UNIQUEIDENTIFIER NOT NULL,
	DateCreated DATETIME NOT NULL,
	UpdatedBy UNIQUEIDENTIFIER  NULL,
	DateUpdated DATETIME NULL,
	Position BIGINT NOT NULL,
	SurveyID UNIQUEIDENTIFIER NOT NULL,
	ParentGroupID UNIQUEIDENTIFIER NULL
)
GO

-- the type of the question i.e. radio button / ddl / check box / etc
CREATE TABLE QuestionType
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	Type VARCHAR(MAX) NOT NULL,
	FriendlyName VARCHAR(256) NOT NULL,
	Description VARCHAR(MAX) NOT NULL
)
GO

-- regex patterns for the questions 
CREATE TABLE QuestionRegex
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	Pattern VARCHAR(MAX) NOT NULL,
	FriendlyName VARCHAR(256) NOT NULL,
	Description VARCHAR(MAX) NOT NULL,
	QuestionTypeID UNIQUEIDENTIFIER NOT NULL
)
GO

CREATE TABLE Question
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	QuestionText VARCHAR(MAX) NOT NULL,
	QuestionType UNIQUEIDENTIFIER,					-- radio button / ddl / checkbox / multiselect ddl
	Position BIGINT NOT NULL,
	GroupID UNIQUEIDENTIFIER NOT NULL,
	UpdatedBy UNIQUEIDENTIFIER  NULL,
	DateUpdated DATETIME NULL,
	CreatedBy UNIQUEIDENTIFIER  NOT NULL,
	DateCreated DATETIME NOT NULL,

	--validations
	RegexPattern VARCHAR(MAX),
	MinimumValue VARCHAR(256) NULL,
	MaximumValue VARCHAR(256) NULL,
	RequiredQuestion BIT NOT NULL,
	ContainsValue VARCHAR(256) NULL,
	EqualsValue VARCHAR(256) NULL,
	NotEqualsValue VARCHAR(256) NULL,
	StartsWithValue VARCHAR(256) NULL,
	EndsWithValue VARCHAR(256) NULL,
	LengthValue VARCHAR(256) NULL
)
GO

CREATE TABLE QuestionValues
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	QuestionID UNIQUEIDENTIFIER NOT NULL,
	Name VARCHAR(256) NOT NULL,
	Value VARCHAR(256) NOT NULL,
	IsDefault BIT NOT NULL
)
GO

INSERT INTO QuestionType (ID, Type, FriendlyName, Description)
VALUES 
('47C41586-CBCE-428B-942D-508CEE462C2D','checkbox','Check Boxes','Select more than one option'),
('8ABDC140-A41E-46DD-B0DC-A5A0E29103DD','radio','Radio Buttons','Select one option from a range'),
('6502B9E8-C756-4FFB-BEE8-27DD0B0B7BF4','ddl','Dropdown List','Select a option in a dropdown list'),	-- dropdownlist
('051F6215-123E-4FFE-9F56-ADB7BA3A5020','location','Location','Get the current location'),			-- location / gps
('FB10AC75-1604-4CEF-92A6-F71E6733CA29','signature','Signature','Sign'),			-- signature
('239AC857-BFB9-480A-8A96-C31C4BA7E882','file','Image','Browse for an image'),		-- image (browse for an image)
('A4DCCA9E-5FF7-4FCC-86B4-C91200441978','camera','Camera','Take a picture'),				-- image (take a picture)
('316E3A95-C1CC-4EDF-B7B4-32ACCAA2ADBF','text','Textbox','Any text'),  
('85826014-C25C-4223-A9BF-28413A402718','textarea','Multi-line Textbox','Essay'),
('921B8333-8651-4911-960B-4100876774D5','date','Date','Select the date'),			-- date
('525D9A3A-99A5-46B4-B5B3-958A2A723989','calculation','Calculation','Perform a calculation'),			-- calculations
('B74BE861-00F2-4F48-A0B6-BAFFDC3C964E','ddlMultiple','Dropdown List Multiple Options','Select multiple options in a dropdown list')			-- multi select dropdowns
GO


INSERT INTO QuestionRegex(ID, Pattern, FriendlyName, Description, QuestionTypeID)
VALUES 
--textarea
('697997A2-E0DA-4EEB-9D97-FDE2074E322E','[0-9]{[Placeholder]}','x Number of digits','a specified number of digits','85826014-C25C-4223-A9BF-28413A402718'),
('26B9AF14-8427-48CD-A7D4-0D16867AEB65','(\w+\s?)+','Words','Words and spaces only','85826014-C25C-4223-A9BF-28413A402718'),
('57B44474-5265-4C9A-BDF6-6258DE1406B6','\d+\.{1}\d+','Decimal Number','Number with a point','85826014-C25C-4223-A9BF-28413A402718'),
('7DB11C21-0DA5-4B8D-AFB0-8219C275E64B','[A-Z]+','Uppercase letters','only uppercase letters','85826014-C25C-4223-A9BF-28413A402718'),
('2259099A-91FF-431A-B777-C40BEDF9AECA','[a-z]+','Lowercase letters','only lowercase letters','85826014-C25C-4223-A9BF-28413A402718'),
--text
('60653035-91B1-4660-89EA-35BBEBC469AA','[0-9]{[Placeholder]}','x Number of digits','a specified number of digits','316E3A95-C1CC-4EDF-B7B4-32ACCAA2ADBF'),
('63B0BC99-2D78-4079-983E-22A76974C852','(\w+\s?)+','Words','Words and spaces only','316E3A95-C1CC-4EDF-B7B4-32ACCAA2ADBF'),
('961E2051-E448-47E7-B69E-1343E268868E','\d+\.{1}\d+','Decimal Number','Number with a point','316E3A95-C1CC-4EDF-B7B4-32ACCAA2ADBF'),
('CD6B88D0-90D0-498F-8A45-1A80C755E3B5','[A-Z]+','Uppercase letters','only uppercase letters','316E3A95-C1CC-4EDF-B7B4-32ACCAA2ADBF'),
('687F6C6D-501A-43EE-A3B2-F0F0C68D5A86','[a-z]+','Lowercase letters','only lowercase letters','316E3A95-C1CC-4EDF-B7B4-32ACCAA2ADBF')
GO