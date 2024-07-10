/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	21 April 2017			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	21 April 2017
	Title			:	Normalize rights
	Purpose			:	Normalize rights friendly names and descriptions
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

UPDATE [Application_Rights]
SET [FriendlyName]=UPPER(LEFT([FriendlyName],1))+LOWER(SUBSTRING([FriendlyName],2,LEN([FriendlyName]))),
	[Description]=UPPER(LEFT([Description],1))+LOWER(SUBSTRING([Description],2,LEN([Description])));