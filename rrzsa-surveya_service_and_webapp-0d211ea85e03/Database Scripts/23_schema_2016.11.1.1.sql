/*-------------------------------------------------------------------------------------------------
 Date Edited   Developer    Description
---------------------------------------------------------------------------------------------------
08 November 2016   Roxanne Rassool   Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 08 November 2016
 Title   		: 23_schema_2016.11.1.1
 Purpose  		: Add rows into tables
 Instructions 	: Run after 22_schema_2016.10.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='23'
WHERE SettingName = 'DBVersion'
GO

CREATE TABLE QuestionRows
(
	ID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	RowText VARCHAR(MAX) NOT NULL,
	Position BIGINT NOT NULL,
	GroupID UNIQUEIDENTIFIER NOT NULL,
	UpdatedBy UNIQUEIDENTIFIER NULL,
	DateUpdated DATETIME NULL,
	CreatedBy UNIQUEIDENTIFIER NOT NULL,
	DateCreated DATETIME NOT NULL
)
GO

INSERT INTO QuestionRows (ID, RowText, Position, GroupID, CreatedBy, DateCreated)
VALUES (newid(), 'Row 1', 1, 'F49399FD-C7B0-4192-8FA5-1B74FC327803', '82359D8E-2FB6-4B92-A39B-3B54BBD3DD25', '08-11-2016'),
(newid(), 'Row 2', 3, 'F49399FD-C7B0-4192-8FA5-1B74FC327803', '82359D8E-2FB6-4B92-A39B-3B54BBD3DD25', '08-11-2016'),
(newid(), 'Row 3', 2, 'F49399FD-C7B0-4192-8FA5-1B74FC327803', '82359D8E-2FB6-4B92-A39B-3B54BBD3DD25', '08-11-2016'),
(newid(), 'Row 4', 4, 'F49399FD-C7B0-4192-8FA5-1B74FC327803', '82359D8E-2FB6-4B92-A39B-3B54BBD3DD25', '08-11-2016')
GO

ALTER TABLE Project
ADD IsEmergencyContactOneRequired BIT,
IsEmergencyContactTwoRequired BIT
GO
