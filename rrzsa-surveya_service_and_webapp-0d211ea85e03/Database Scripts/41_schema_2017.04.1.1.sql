/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	28 April 2017			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	28 April 2017
	Title			:	41_schema_2017.04.1.1
	Purpose			:	Adds Dynamic Report tables
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[DynamicReport](
	[ID] [uniqueidentifier] NOT NULL,
	[CompanyID] [uniqueidentifier] NULL,
	[SurveyID] [uniqueidentifier] NULL,
	[ReportName] [varchar](max) NULL,
	[DateCreated] [datetime] NULL,
	[UserID] [uniqueidentifier] NULL,
	[UserFullName] [varchar](max) NULL
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

CREATE TABLE [dbo].[DynamicReportFilter](
	[ID] [uniqueidentifier] NOT NULL,
	[DynamicReportID] [uniqueidentifier] NULL,
	[FilterName] [varchar](max) NULL,
	[FilterCount] [bigint] NULL,
	[QuestionID1] [uniqueidentifier] NULL,
	[QuestionCondition1] [varchar](32) NULL,
	[QuestionCompareValue1] [varchar](256) NULL,
	[QuestionID2] [uniqueidentifier] NULL,
	[QuestionCondition2] [varchar](32) NULL,
	[QuestionCompareValue2] [varchar](256) NULL,
	[QuestionID3] [uniqueidentifier] NULL,
	[QuestionCondition3] [varchar](32) NULL,
	[QuestionCompareValue3] [varchar](256) NULL,
	[QuestionID4] [uniqueidentifier] NULL,
	[QuestionCondition4] [varchar](32) NULL,
	[QuestionCompareValue4] [varchar](256) NULL,
	[QuestionID5] [uniqueidentifier] NULL,
	[QuestionCondition5] [varchar](32) NULL,
	[QuestionCompareValue5] [varchar](256) NULL,
	[QuestionID6] [uniqueidentifier] NULL,
	[QuestionCondition6] [varchar](32) NULL,
	[QuestionCompareValue6] [varchar](256) NULL,
	[SqlString] [varchar] (max) NULL
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


