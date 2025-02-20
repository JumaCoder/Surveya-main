DECLARE @filterCount bigint;
DECLARE @sqlString nvarchar(max) = N'SELECT @filterCount = COUNT(ar.ID)
FROM [dbo].[AuditedResponses] ar
WHERE SurveyID = ''8107dbd7-3c88-41cf-87e9-29114443e8c7''
and ar.[ResponseValueQuestionID]=''04eab5d9-4fab-4d05-a949-43d069e40908''
and ar.[ResponseValue]>1;'
DECLARE @ParmDefinition nvarchar(500) = N'@filterCount bigint OUTPUT'; 
EXECUTE sp_executesql @sqlString, @ParmDefinition, @filterCount OUTPUT;  
SELECT @filterCount;