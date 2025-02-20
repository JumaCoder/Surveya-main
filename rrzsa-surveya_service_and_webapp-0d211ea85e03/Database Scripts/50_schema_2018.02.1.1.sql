USE [Surveya_Dev]
GO
/****** Object:  Table [dbo].[QuestionType]    Script Date: 2018/02/12 10:15:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[QuestionType](
	[ID] [uniqueidentifier] NOT NULL,
	[Type] [varchar](max) NOT NULL,
	[FriendlyName] [varchar](256) NOT NULL,
	[Description] [varchar](max) NOT NULL,
	[HasOptions] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'b17754ca-ed3a-41c4-8a0a-21bd5beff666', N'email', N'Email', N'Email address', 0)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'6502b9e8-c756-4ffb-bee8-27dd0b0b7bf4', N'ddl', N'Dropdown List', N'Select a option in a dropdown list', 1)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'85826014-c25c-4223-a9bf-28413a402718', N'textarea', N'Multi-line Textbox', N'Essay', 0)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'316e3a95-c1cc-4edf-b7b4-32accaa2adbf', N'text', N'Textbox', N'Any text', 0)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'921b8333-8651-4911-960b-4100876774d5', N'date', N'Date', N'Select the date', 0)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'47c41586-cbce-428b-942d-508cee462c2d', N'checkbox', N'Check Boxes', N'Select more than one option', 1)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'525d9a3a-99a5-46b4-b5b3-958a2a723989', N'calculation', N'Calculation', N'Perform a calculation', 0)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'8abdc140-a41e-46dd-b0dc-a5a0e29103dd', N'radio', N'Radio Buttons', N'Select one option from a range', 1)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'051f6215-123e-4ffe-9f56-adb7ba3a5020', N'location', N'Location', N'Get the current location', 0)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'b74be861-00f2-4f48-a0b6-baffdc3c964e', N'ddlMultiple', N'Dropdown List Multiple Options', N'Select multiple options in a dropdown list', 1)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'a4dcca9e-5ff7-4fcc-86b4-c91200441978', N'camera', N'Camera', N'Take a picture', 0)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'2296589d-f6a9-4cad-ac36-d83414cd9429', N'Numerical', N'Number', N'Number input field', 0)
INSERT [dbo].[QuestionType] ([ID], [Type], [FriendlyName], [Description], [HasOptions]) VALUES (N'fb10ac75-1604-4cef-92a6-f71e6733ca29', N'signature', N'Signature', N'Sign', 0)
