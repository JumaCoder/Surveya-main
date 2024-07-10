--

--
IF EXISTS (SELECT name FROM sys.indexes  
			WHERE name = N'IX_Responses_SurveyID')   
	DROP INDEX IX_Responses_SurveyID ON Synigence_Dev.dbo.Responses;   
GO  
-- Create a nonclustered index called IX_AuditedResponses_SurveyID   
-- on the Synigence_Dev.AuditedResponses table using the SurveyID column.   
CREATE NONCLUSTERED INDEX IX_Responses_SurveyID   
	ON Synigence_Dev.dbo.Responses (SurveyID);   
GO
-- Find an existing index named IX_AuditedResponses_ResponseID and delete it if found.   
IF EXISTS (SELECT name FROM sys.indexes  
			WHERE name = N'IX_AuditedResponses_ResponseID')   
	DROP INDEX IX_AuditedResponses_ResponseID ON Synigence_Dev.dbo.AuditedResponses;   
GO  
-- Create a nonclustered index called IX_AuditedResponses_ResponseID   
-- on the Synigence_Dev.AuditedResponses table using the ResponseID column.   
CREATE NONCLUSTERED INDEX IX_AuditedResponses_ResponseID   
	ON Synigence_Dev.dbo.AuditedResponses (ResponseID);   
GO

IF EXISTS (SELECT name FROM sys.indexes  
			WHERE name = N'IX_ResponseValues_ResponseID')   
	DROP INDEX IX_ResponseValues_ResponseID ON Synigence_Dev.dbo.ResponseValues;   
GO  
-- Create a nonclustered index called IX_ResponseValues_ResponseID   
-- on the Synigence_Dev.ResponseValues table using the ResponseID column.   
CREATE NONCLUSTERED INDEX IX_ResponseValues_ResponseID  
	ON Synigence_Dev.dbo.ResponseValues (ResponseID);   
GO

IF EXISTS (SELECT name FROM sys.indexes  
			WHERE name = N'IX_Responses_SurveyID')   
	DROP INDEX IX_Responses_SurveyID ON Synigence_Dev.dbo.Responses;   
GO  
-- Create a nonclustered index called IX_Responses_SurveyID   
-- on the Synigence_Dev.Responses table using the SurveyID column.   
CREATE NONCLUSTERED INDEX IX_Responses_SurveyID   
	ON Synigence_Dev.dbo.Responses (SurveyID);   
GO