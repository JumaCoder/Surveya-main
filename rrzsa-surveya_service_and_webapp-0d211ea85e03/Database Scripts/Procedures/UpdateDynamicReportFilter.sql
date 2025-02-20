/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	02 May 2017			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	02 May 2017
	Title			:	Update Dynamic Report Filter
	Purpose			:	Update the provided Dynamic Report Filter
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

CREATE PROCEDURE [dbo].[UpdateDynamicReportFilter]
    @FilterID							uniqueidentifier,
    @FilterName							nvarchar(256),

    @q1Id								uniqueidentifier,
    @q1Condition						nvarchar(32),
    @q1CompareValue						nvarchar(256),
	
    @q2Id								uniqueidentifier,
    @q2Condition						nvarchar(32),
    @q2CompareValue						nvarchar(256),
	
    @q3Id								uniqueidentifier,
    @q3Condition						nvarchar(32),
    @q3CompareValue						nvarchar(256),
	
    @q4Id								uniqueidentifier,
    @q4Condition						nvarchar(32),
    @q4CompareValue						nvarchar(256),
	
    @q5Id								uniqueidentifier,
    @q5Condition						nvarchar(32),
    @q5CompareValue						nvarchar(256),
	
    @q6Id								uniqueidentifier,
    @q6Condition						nvarchar(32),
    @q6CompareValue						nvarchar(256),
	
    @sqlString							nvarchar(max)
AS
BEGIN

	DECLARE @filterCount bigint;  
	DECLARE @ParmDefinition nvarchar(500);

	SET @ParmDefinition = N'@filterCount bigint OUTPUT';  

	EXECUTE sp_executesql @sqlString, @ParmDefinition, @filterCount OUTPUT;  
	

    UPDATE  dbo.DynamicReportFilter
    SET		FilterName=@FilterName,
			FilterCount=@filterCount,
			QuestionID1=@q1Id,
			QuestionCondition1=@q1Condition,
			QuestionCompareValue1=@q1CompareValue,
			QuestionID2=@q2Id,
			QuestionCondition2=@q2Condition,
			QuestionCompareValue2=@q2CompareValue,
			QuestionID3=@q3Id,
			QuestionCondition3=@q3Condition,
			QuestionCompareValue3=@q3CompareValue,
			QuestionID4=@q4Id,
			QuestionCondition4=@q4Condition,
			QuestionCompareValue4=@q4CompareValue,
			QuestionID5=@q5Id,
			QuestionCondition5=@q5Condition,
			QuestionCompareValue5=@q5CompareValue,
			QuestionID6=@q6Id,
			QuestionCondition6=@q6Condition,
			QuestionCompareValue6=@q6CompareValue,
			SqlString=@sqlString
	WHERE ID = @FilterId;
				  
	SELECT @FilterId;  
END





