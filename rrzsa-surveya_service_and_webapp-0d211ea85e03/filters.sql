  --NON TABLE
  select count(distinct ar.responseid)
  FROM [dbo].[AuditedResponses] ar 
  JOIN [dbo].[ResponseValues] rs ON ar.[ResponseValueID] = rs.[ID] 
  JOIN [dbo].[Question] q ON ar.[ResponseValueQuestionID] = q.[ID] 
  JOIN [dbo].[QuestionGroups] qg ON q.[GroupID] = qg.[ID] 
  WHERE ar.[SurveyID]=N'721c9fd9-8423-489c-89d5-cc95c3a30100'  
  and ar.[ResponseValueQuestionID]=N'965e2488-c8bd-41c1-aaf8-3a15ecf8ba5d' 
  and ar.[ResponseValue]!='A1'
  and ar.ResponseID in
  (
	  SELECT ar.ResponseID 
	  FROM [dbo].[AuditedResponses] ar 
	  JOIN [dbo].[ResponseValues] rs ON ar.[ResponseValueID] = rs.[ID] 
	  JOIN [dbo].[Question] q ON ar.[ResponseValueQuestionID] = q.[ID] 
	  JOIN [dbo].[QuestionGroups] qg ON q.[GroupID] = qg.[ID] 
	  WHERE ar.[SurveyID]=N'721c9fd9-8423-489c-89d5-cc95c3a30100'  
		and ar.[ResponseValueQuestionID] = N'f767a7a3-6812-4876-8ebb-bf945ece62a8' 
		and CAST(ar.[ResponseValue] as bigint) >=26 

 )

 --TABLE
	SELECT Count(distinct rs.QuestionRowID)
	FROM [dbo].[AuditedResponses] ar 
	JOIN [dbo].[ResponseValues] rs ON ar.[ResponseValueID] = rs.[ID] 
	JOIN [dbo].[Question] q ON ar.[ResponseValueQuestionID] = q.[ID] 
	JOIN [dbo].[QuestionGroups] qg ON q.[GroupID] = qg.[ID] 
	WHERE ar.[SurveyID]=N'721c9fd9-8423-489c-89d5-cc95c3a30100' AND GroupType = 'Table' 
	and ar.[ResponseValueQuestionID] = N'f767a7a3-6812-4876-8ebb-bf945ece62a8' 
	and CAST(ar.[ResponseValue] as bigint) >=26 
	and rs.QuestionRowID in
	(
		SELECT rs.QuestionRowID 
		FROM [dbo].[AuditedResponses] ar 
		JOIN [dbo].[ResponseValues] rs ON ar.[ResponseValueID] = rs.[ID] 
		JOIN [dbo].[Question] q ON ar.[ResponseValueQuestionID] = q.[ID] 
		JOIN [dbo].[QuestionGroups] qg ON q.[GroupID] = qg.[ID] 
		WHERE ar.[SurveyID]=N'721c9fd9-8423-489c-89d5-cc95c3a30100' AND GroupType = 'Table' 
		and ar.[ResponseValueQuestionID] = N'f767a7a3-6812-4876-8ebb-bf945ece62a8' 
		and CAST(ar.[ResponseValue] as bigint) >=26
	)


select count(distinct rs.QuestionRowID)  
FROM [dbo].[AuditedResponses] ar 
JOIN [dbo].[ResponseValues] rs ON ar.[ResponseValueID] = rs.[ID] 
JOIN [dbo].[Question] q ON ar.[ResponseValueQuestionID] = q.[ID] 
JOIN [dbo].[QuestionGroups] qg ON q.[GroupID] = qg.[ID] 
WHERE  ar.[SurveyID]=N'697cdcbd-c8a9-4944-9c47-6a57e31b0775'  
AND GroupType = 'Table'  
and ar.[ResponseValueQuestionID]=N'8b26c93e-6138-4bfa-9713-54fb8620c7d5' 
and ar.[ResponseValue] = N'Male' 
and rs.QuestionRowID  in( 
	select rs.QuestionRowID  
	FROM [dbo].[AuditedResponses] ar 
	JOIN [dbo].[ResponseValues] rs ON ar.[ResponseValueID] = rs.[ID] 
	JOIN [dbo].[Question] q ON ar.[ResponseValueQuestionID] = q.[ID] 
	JOIN [dbo].[QuestionGroups] qg ON q.[GroupID] = qg.[ID] 
	WHERE  ar.[SurveyID]=N'697cdcbd-c8a9-4944-9c47-6a57e31b0775'  
	AND GroupType = 'Table'  
	and ar.[ResponseValueQuestionID]=N'2aaebd56-56ee-474d-870a-c7b0cf48fec9' 
	and CAST(ar.[ResponseValue] as bigint)>1
)