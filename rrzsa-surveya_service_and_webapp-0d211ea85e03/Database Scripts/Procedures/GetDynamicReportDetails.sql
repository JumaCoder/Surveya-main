/*-------------------------------------------------------------------------------------------------
	Date Edited			Developer				Description
---------------------------------------------------------------------------------------------------
	03 May 2017			Zolani Zweni			Created
---------------------------------------------------------------------------------------------------

	Created By		:	Zolani Zweni
	Date Created	:	03 May 2017
	Title			:	GetDynamicReportDetails
	Purpose			:	Getting Dynamic Report Details
	Instructions	:	

-------------------------------------------------------------------------------------------------*/

CREATE PROCEDURE [dbo].[GetDynamicReportDetails]
    @ReportID		uniqueidentifier
AS
BEGIN
    SELECT  *
	FROM dbo.DynamicReport
	WHERE ID = @ReportID;
END


--exec [GetDynamicReportDetails] N'4139cd49-0eaf-42d4-b3d4-58824967e6de'