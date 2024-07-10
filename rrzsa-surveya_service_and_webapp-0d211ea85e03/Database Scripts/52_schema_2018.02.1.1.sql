
/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	27 February 2018			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	27 February 2018
	Title			:	52_schema_2018.02.1.1
	Purpose			:	Update right group to match 
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE SysInfo
SET SettingValue = '52'
WHERE SettingName = 'DBVersion'
GO

UPDATE Application_Rights
SET RightGroup ='Activity stream'
WHERE ID='6e6f3fb6-119c-4640-a1ef-1da5060c70d8'
GO

UPDATE Application_Rights
SET RightGroup ='Activity stream'
WHERE ID='de690439-1d00-484f-961f-c6580beb350b'
GO



UPDATE Application_Rights
SET RightGroup ='Mobile app'
WHERE RightGroup='Mobile App'
GO