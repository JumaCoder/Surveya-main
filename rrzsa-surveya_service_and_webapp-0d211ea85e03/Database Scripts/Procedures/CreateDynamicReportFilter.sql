/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	02 May 2017			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	02 May 2017
	Title			:	Create Dynamic Report Filter
	Purpose			:	Creates a Dynamic Report Filter
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

CREATE PROCEDURE [dbo].[CreateDynamicReportFilter]
    @reportId							uniqueidentifier,
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

	DECLARE @FilterId uniqueidentifier;
    SET @FilterId = NEWID();

	DECLARE @filterCount bigint;  
	DECLARE @ParmDefinition nvarchar(500);

	SET @ParmDefinition = N'@filterCount bigint OUTPUT';  

	EXECUTE sp_executesql @sqlString, @ParmDefinition, @filterCount OUTPUT;  
	

    INSERT INTO dbo.DynamicReportFilter
                ( ID,
                  DynamicReportID,
                  FilterName,
                  FilterCount,
                  QuestionID1,
                  QuestionCondition1,
                  QuestionCompareValue1,
                  QuestionID2,
                  QuestionCondition2,
                  QuestionCompareValue2,
                  QuestionID3,
                  QuestionCondition3,
                  QuestionCompareValue3,
                  QuestionID4,
                  QuestionCondition4,
                  QuestionCompareValue4,
                  QuestionID5,
                  QuestionCondition5,
                  QuestionCompareValue5,
                  QuestionID6,
                  QuestionCondition6,
                  QuestionCompareValue6,
				  SqlString )
         VALUES ( @FilterId,
                  @reportId,
				  @FilterName,
                  @filterCount,
                  @q1Id,
				  @q1Condition,
				  @q1CompareValue,
                  @q2Id,
				  @q2Condition,
				  @q2CompareValue,
                  @q3Id,
				  @q3Condition,
				  @q3CompareValue,
                  @q4Id,
				  @q4Condition,
				  @q4CompareValue,
                  @q5Id,
				  @q5Condition,
				  @q5CompareValue,
                  @q6Id,
				  @q6Condition,
				  @q6CompareValue,
				  @sqlString )
				  
	SELECT @FilterId;  
END





