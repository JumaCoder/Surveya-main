/*-------------------------------------------------------------------------------------------------
 Date Edited	Developer		Description
---------------------------------------------------------------------------------------------------
17 June 2021	Zolani Zweni	Created
---------------------------------------------------------------------------------------------------

 Created By  	: RRZ Innovations (PTY) LTD
 Date Created 	: 17 June 2021
 Title   		: 58_schema_2021.06.1.1
 Purpose  		: Create CRMTrader table
 Instructions 	: Run after 57_schema_2021.05.1.1.sql

-------------------------------------------------------------------------------------------------*/


UPDATE SysInfo
SET SettingValue='58'
WHERE SettingName = 'DBVersion'
GO

CREATE TABLE [dbo].[CRMTrader](
	[ID] [uniqueidentifier] NOT NULL,
	[isStateOwned] [bit] NULL,
	[isCrossBorderTrader] [bit] NULL,
	[isAgreedToParticipate] [bit] NULL,
	[CompanyType] [varchar](256) NOT NULL,
	[OwnedManagedBy] [varchar](256) NOT NULL,
	[BusinessLocation] [varchar](256) NOT NULL,
	[SizeOfBusiness] [varchar](256) NOT NULL,
	[ProductCategory] [varchar](1024) NOT NULL,
	[ParticipateFullName] [varchar](256) NOT NULL,
	[TraderName] [varchar](256) NOT NULL,
	[ParticipateEmailAddress] [varchar](256) NOT NULL,
	[ParticipatePhoneNumber] [varchar](256) NOT NULL,
	[CreatedBy] [uniqueidentifier] NULL,
	[AssignedTo] [uniqueidentifier] NULL,
	[DateCreated] [datetime] NOT NULL,
	[isScheduled] [bit] NULL,
	[ScheduledDate] [datetime] NULL,
	[ScheduledBy] [uniqueidentifier] NULL,
	[isSurveyed] [bit] NULL,
	[SurveyedDate] [datetime] NULL,
	[SurveyedBy] [uniqueidentifier] NULL,
	[isReScheduled] [bit] NULL,
	[ReScheduledDate] [datetime] NULL,
	[ReScheduledBy] [uniqueidentifier] NULL,
	[isComplete] [bit] NULL,
	[CompletedDate] [datetime] NULL,
	[CompletedBy] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

CREATE TABLE [dbo].[CRMTraderHistory](
	[ID] [uniqueidentifier] NOT NULL,
	[TraderID] [uniqueidentifier] NOT NULL,
	[Type] [varchar](512) NOT NULL,
	[Description] [varchar](max) NOT NULL,
	[DateCreated] [datetime] NOT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

CREATE TABLE [dbo].[CRMTraderNote](
	[ID] [uniqueidentifier] NOT NULL,
	[TraderID] [uniqueidentifier] NOT NULL,
	[Text] [varchar](max) NOT NULL,
	[DateCreated] [datetime] NOT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO


INSERT INTO [dbo].[Application_Rights]
           ([ID]
           ,[Name]
           ,[Description]
           ,[RightGroup]
           ,[FriendlyName])
     VALUES
           (newid()
           ,'GetTradersForEnumerator'
           ,'Get Traders For Enumerator'
           ,'CRM'
           ,'Get traders for enumerator'),
		   (newid()
           ,'TraderActionForEnumerator'
           ,'Enumerator can perfom action on Trader record'
           ,'CRM'
           ,'Trader action for enumerator')
GO
