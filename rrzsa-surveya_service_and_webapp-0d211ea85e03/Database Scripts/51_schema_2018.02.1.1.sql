/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	22 Feb 2018			Roxanne Rassool			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Roxanne Rassool
	Date Created	:	22 Feb 2018
	Title			:	51_schema_2018.2.1.1
	Purpose			:	Add new fields for surveya bank details
	Instructions	:	Run after script 50

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue = '51'
WHERE SettingName = 'DBVersion'
GO

ALTER TABLE SurveyaDetails
ADD
	BankAccountName VARCHAR(256),
	BankName VARCHAR(256),
	BankAccountNumber VARCHAR(256),
	BankBranchName VARCHAR(256),
	BankBranchCode VARCHAR(256)
GO

UPDATE SurveyaDetails
SET BankAccountName = 'Surveya Global',
BankName = 'First National Bank',
BankAccountNumber = '62609777646',
BankBranchName = 'Newton Park',
BankBranchCode = '250655'
GO