/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	03 May 2017			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	03 May 2017
	Title			:	Get Dynamic Report Filters
	Purpose			:	Getting the provided Dynamic Report Filters
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

CREATE PROCEDURE [dbo].[GetReportFilters]
    @ReportID		uniqueidentifier
AS
BEGIN
    SELECT  ID, FilterName, FilterCount
	FROM dbo.DynamicReportFilter
	WHERE DynamicReportID = @ReportID;
END





