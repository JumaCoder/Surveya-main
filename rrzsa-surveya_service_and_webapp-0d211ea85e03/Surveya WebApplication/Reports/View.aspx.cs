using Microsoft.Reporting.WebForms;
using Surveya_Application.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Surveya_Application.Reports
{
    public partial class View : System.Web.UI.Page
    {
        ReportEntities rm;
        ArrayList errorList = new ArrayList();
        bool validId1, validId2, validId3, validStart, validEnd, validStatus;

        string[] chartTypes = { "Area", "Column", "Doughnut", "Line", "Pie", "Scatter" };
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                string report = Request.QueryString.Get("report");
                string id1Str = Request.QueryString.Get("id");
                string id2Str = Request.QueryString.Get("id2");

                Guid id1 = Guid.Empty;
                Guid id2 = Guid.Empty;

                validId1 = Guid.TryParse(id1Str, out id1);
                validId2 = Guid.TryParse(id2Str, out id2);
                switch (report)
                {
                    case "PackageInvoice":
                        PackageInvoice(report, id1);
                        break;
                    case "SurveyResponses":
                        SurveyResponses(report, id1);
                        break;
                    case "SurveySummaryReport":
                        SurveySummaryReport(report, id1);
                        break;
                    case "DynamicReport":
                        DynamicReport(report, id2, id1);
                        break;
                    case "ViewResponseData":
                        ViewResponseData(report, id1);
                        break;
                    case "GeneralReportStatic":
                        GeneralReportStatic(report, id1);
                        break;
                    case "SurveyResponsesMatrix":
                        SurveyResponsesMatrix(report, id1);
                        break;
                    case "SurveyResponsesMatrix_CRM":
                        SurveyResponsesMatrix_CRM(report, id1);
                        break;
                    default:
                        BulletedErrorList.Items.Add(new ListItem("No report found matching the provided details."));
                        break;
                }
                //SurveySummaryReport(string report, Guid id2, string chartType)
                foreach (var er in errorList)
                {
                    BulletedErrorList.Items.Add(new ListItem(er.ToString()));
                }
            }
        }

        public void setupReport(ref ReportViewer rv)
        {
            rv.ProcessingMode = ProcessingMode.Local;

            rv.AsyncRendering = true;
            rv.ZoomMode = ZoomMode.PageWidth;

            rv.SizeToReportContent = true;
            rv.Width = Unit.Percentage(100);
            rv.Height = Unit.Percentage(100);

            rv.ShowRefreshButton = false;
            rv.ShowParameterPrompts = false;
            rv.ShowExportControls = true;
            rv.ShowPrintButton = true;
            rv.ShowZoomControl = true;
        }

        public void PackageInvoice(string report, Guid id2)
        {
            //JobcardImages
            if (!string.IsNullOrWhiteSpace(report) && id2 != Guid.Empty)
            {
                setupReport(ref thisReportViewer);

                thisReportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + "/reports/rdls/Invoice.rdl";

                using (rm = new ReportEntities())
                {
                    ReportParameter para = new ReportParameter("InvoiceID", id2.ToString());

                    var spResult1 = rm.GetInvoice(id2).ToList();
                    var spResult2 = rm.GetInvoiceLineItem(id2).ToList();
                    var spResult3 = rm.GetSurveyaDetails().ToList();

                    ReportDataSource reportDS1 = new ReportDataSource("Invoice", spResult1);
                    ReportDataSource reportDS2 = new ReportDataSource("InvoiceDetails", spResult2);
                    ReportDataSource reportDS3 = new ReportDataSource("SurveyaDetails", spResult3);


                    thisReportViewer.LocalReport.DataSources.Add(reportDS1);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS2);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS3);

                    thisReportViewer.LocalReport.SetParameters(para);

                    string type = Request.QueryString.Get("type");
                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if (type.ToLower().Equals("pdf"))
                            downloadReportPDF(report);
                    }
                    else
                    {
                        menuPanel.Visible = false;
                        reportPanel.Visible = true;
                    }
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(report))
                    errorList.Add("Report is required");

                if (id2 == Guid.Empty)
                    errorList.Add("Invalid id2 provided");

                reportPanel.Visible = false;
                menuPanel.Visible = true;
            }
        }

        public void SurveyResponses(string report, Guid id2)
        {
            if (!string.IsNullOrWhiteSpace(report) && id2 != Guid.Empty)
            {
                setupReport(ref thisReportViewer);

                thisReportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + "/reports/rdls/SurveyResponses.rdl";

                using (rm = new ReportEntities())
                {
                    ReportParameter para = new ReportParameter("SurveyID", id2.ToString());

                    var spResult1 = rm.GetSurveyaDetails();
                    var spResult2 = rm.GetAuditedResponses(id2).ToList();
                    var spResult3 = rm.GetSurveyDetails(id2).ToList();

                    ReportDataSource reportDS1 = new ReportDataSource("SurveyaDetails", spResult1);
                    ReportDataSource reportDS2 = new ReportDataSource("AuditedResponses", spResult2);
                    ReportDataSource reportDS3 = new ReportDataSource("ServeyDetails", spResult3);


                    thisReportViewer.LocalReport.DataSources.Add(reportDS1);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS2);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS3);

                    thisReportViewer.LocalReport.SetParameters(para);

                    string type = Request.QueryString.Get("type");
                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if (type.ToLower().Equals("pdf"))
                            downloadReportPDF(report);
                        else if (type.ToLower().Equals("xls") || type.ToLower().Equals("xlsx"))
                        {
                            downloadReportEXCEL(report);
                        }
                    }
                    else
                    {
                        menuPanel.Visible = false;
                        reportPanel.Visible = true;
                    }
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(report))
                    errorList.Add("Report is required");

                if (id2 == Guid.Empty)
                    errorList.Add("Invalid id2 provided");

                reportPanel.Visible = false;
                menuPanel.Visible = true;
            }
        }

        public void SurveySummaryReport(string report, Guid id2)
        {
            //JobcardImages
            if (!string.IsNullOrWhiteSpace(report) && id2 != Guid.Empty)
            {
                setupReport(ref thisReportViewer);

                thisReportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + "/reports/rdls/ResponseSummary.rdl";

                using (rm = new ReportEntities())
                {
                    ReportParameter surIDPara = new ReportParameter("SurveyID", id2.ToString());

                    var spResult1 = rm.GetSurveyaDetails();
                    var spResult2 = rm.GetSurveyDetails(id2).ToList();
                    var spResult3 = rm.ResponseSummaryAllQuestions(id2).ToList();

                    ReportDataSource reportDS1 = new ReportDataSource("SurveyaDetails", spResult1);
                    ReportDataSource reportDS2 = new ReportDataSource("SurveyDetails", spResult2);
                    ReportDataSource reportDS3 = new ReportDataSource("QuestionResponseSummary", spResult3);


                    thisReportViewer.LocalReport.DataSources.Add(reportDS1);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS2);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS3);

                    thisReportViewer.LocalReport.SetParameters(surIDPara);

                    string type = Request.QueryString.Get("type");
                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if (type.ToLower().Equals("pdf"))
                            downloadReportPDF(report);
                        else if (type.ToLower().Equals("xls") || type.ToLower().Equals("xlsx"))
                        {
                            downloadReportEXCEL(report);
                        }
                    }
                    else
                    {
                        menuPanel.Visible = false;
                        reportPanel.Visible = true;
                        //thisReportViewer.RefreshReport();
                    }
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(report))
                    errorList.Add("Report is required");

                if (id2 == Guid.Empty)
                    errorList.Add("Invalid id2 provided");

                reportPanel.Visible = false;
                menuPanel.Visible = true;
            }
        }

        public void DynamicReport(string report, Guid id1, Guid id2)
        {
            //JobcardImages
            if (!string.IsNullOrWhiteSpace(report) && id2 != Guid.Empty)
            {
                setupReport(ref thisReportViewer);

                thisReportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + "/reports/rdls/DynamicReport.rdl";

                using (rm = new ReportEntities())
                {
                    ReportParameter repIDPara = new ReportParameter("ReportID", id1.ToString());
                    ReportParameter surIDPara = new ReportParameter("SurveyID", id2.ToString());

                    var spResult1 = rm.GetSurveyaDetails();
                    var spResult2 = rm.GetSurveyDetails(id2).ToList();
                    var spResult3 = rm.GetDynamicReportDetails(id1);
                    var spResult4 = rm.GetReportFilters(id1);

                    ReportDataSource reportDS1 = new ReportDataSource("SurveyaDetails", spResult1);
                    ReportDataSource reportDS2 = new ReportDataSource("SurveyDetails", spResult2);
                    ReportDataSource reportDS3 = new ReportDataSource("DynamicReportDetails", spResult3);
                    ReportDataSource reportDS4 = new ReportDataSource("ReportFilters", spResult4);


                    thisReportViewer.LocalReport.DataSources.Add(reportDS1);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS2);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS3);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS4);

                    thisReportViewer.LocalReport.SetParameters(surIDPara);

                    string type = Request.QueryString.Get("type");
                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if (type.ToLower().Equals("pdf"))
                            downloadReportPDF(report);
                        else if (type.ToLower().Equals("xls") || type.ToLower().Equals("xlsx"))
                        {
                            downloadReportEXCEL(report);
                        }
                    }
                    else
                    {
                        menuPanel.Visible = false;
                        reportPanel.Visible = true;
                        //thisReportViewer.RefreshReport();
                    }
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(report))
                    errorList.Add("Report is required");

                if (id2 == Guid.Empty)
                    errorList.Add("Invalid id2 provided");

                reportPanel.Visible = false;
                menuPanel.Visible = true;
            }
        }

        public void SurveySummaryReport2(string report, Guid id2, string chartType)
        {
            //JobcardImages
            if (!string.IsNullOrWhiteSpace(report) && id2 != Guid.Empty)
            {
                setupReport(ref thisReportViewer);

                thisReportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + "/reports/rdls/SurveySummaryReport.rdl";

                using (rm = new ReportEntities())
                {
                    ReportParameter surIDPara = new ReportParameter("SurveyID", id2.ToString());
                    if (string.IsNullOrWhiteSpace(chartType) || !chartTypes.Contains(chartType))
                    {
                        //if empty or invalid: defaults to "Column"
                        chartType = chartTypes[1];
                    }
                    ReportParameter chartTypePara = new ReportParameter("ChartType", chartType);

                    var spResult1 = rm.GetSurveyaDetails();
                    var spResult2 = rm.GetSurveyDetails(id2).ToList();
                    var spResult3 = rm.GetSurveyQuestions(id2).ToList();
                    var spResult4 = rm.ResponseSummaryAllQuestions(id2).ToList();

                    ReportDataSource reportDS1 = new ReportDataSource("SurveyaDetails", spResult1);
                    ReportDataSource reportDS2 = new ReportDataSource("SurveyDetails", spResult2);
                    ReportDataSource reportDS3 = new ReportDataSource("SurveyQuestions", spResult3);
                    ReportDataSource reportDS4 = new ReportDataSource("QuestionResponseSummary", spResult4);


                    thisReportViewer.LocalReport.DataSources.Add(reportDS1);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS2);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS3);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS4);

                    thisReportViewer.LocalReport.SetParameters(surIDPara);
                    thisReportViewer.LocalReport.SetParameters(chartTypePara);

                    //This is ignored when using 'thisReportViewer.LocalReport.ReportPath = ...'
                    //thisReportViewer.LocalReport.ReportEmbeddedResource = "ResponseSummarySubreport";

                    // Add a handler for SubreportProcessing.

                    thisReportViewer.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(SummarySubreportProcessingEventHandler);
                    /*using (System.IO.Stream subReportStream = System.IO.File.OpenRead(Request.MapPath(Request.ApplicationPath) + "/reports/rdls/ResponseSummarySubreport.rdl"))
                    {
                     * //This is ignored when using 'thisReportViewer.LocalReport.ReportPath = ...'
                        thisReportViewer.LocalReport.LoadSubreportDefinition("ResponseSummarySubreport", subReportStream);
                    }*/

                    string type = Request.QueryString.Get("type");
                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if (type.ToLower().Equals("pdf"))
                            downloadReportPDF(report);
                        else if (type.ToLower().Equals("xls") || type.ToLower().Equals("xlsx"))
                        {
                            downloadReportEXCEL(report);
                        }
                    }
                    else
                    {
                        menuPanel.Visible = false;
                        reportPanel.Visible = true;
                        //thisReportViewer.RefreshReport();
                    }
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(report))
                    errorList.Add("Report is required");

                if (id2 == Guid.Empty)
                    errorList.Add("Invalid id2 provided");

                reportPanel.Visible = false;
                menuPanel.Visible = true;
            }
        }

        public void ViewResponseData(string report, Guid id1)
        {
            if (!string.IsNullOrWhiteSpace(report) && id1 != Guid.Empty)
            {
                setupReport(ref thisReportViewer);

                thisReportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + "/reports/rdls/ViewResponseData.rdl";

                using (rm = new ReportEntities())
                {
                    ReportParameter para = new ReportParameter("ResponseID", id1.ToString());

                    var spResult1 = rm.GetSurveyaDetails();
                    var spResult2 = rm.GetResponse(id1).ToList();

                    ReportDataSource reportDS1 = new ReportDataSource("SurveyaDetails", spResult1);
                    ReportDataSource reportDS2 = new ReportDataSource("GetResponse", spResult2);


                    thisReportViewer.LocalReport.DataSources.Add(reportDS1);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS2);

                    thisReportViewer.LocalReport.SetParameters(para);

                    string type = Request.QueryString.Get("type");
                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if (type.ToLower().Equals("pdf"))
                            downloadReportPDF(report);
                        else if (type.ToLower().Equals("xls") || type.ToLower().Equals("xlsx"))
                        {
                            downloadReportEXCEL(report);
                        }
                    }
                    else
                    {
                        menuPanel.Visible = false;
                        reportPanel.Visible = true;
                    }
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(report))
                    errorList.Add("Report is required");

                if (id1 == Guid.Empty)
                    errorList.Add("Invalid id1 provided");

                reportPanel.Visible = false;
                menuPanel.Visible = true;
            }
        }

        public void GeneralReportStatic(string report, Guid id1)
        {
            //JobcardImages
            if (!string.IsNullOrWhiteSpace(report) && id1 != Guid.Empty)
            {
                setupReport(ref thisReportViewer);

                thisReportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + "/reports/rdls/GeneralReportStatic.rdl";

                using (rm = new ReportEntities())
                {
                    ReportParameter para = new ReportParameter("SurveyID", id1.ToString());

                    var spResult1 = rm.GetSurveyaDetails();
                    var spResult2 = rm.GetSurveyDetails(id1).ToList();
                    var spResult3 = rm.GetSurveyQuestionStats(id1).ToList();

                    ReportDataSource reportDS1 = new ReportDataSource("SurveyaDetails", spResult1);
                    ReportDataSource reportDS2 = new ReportDataSource("GetSurveyDetails", spResult2);
                    ReportDataSource reportDS3 = new ReportDataSource("GetSurveyQuestionStats", spResult3);


                    thisReportViewer.LocalReport.DataSources.Add(reportDS1);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS2);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS3);

                    thisReportViewer.LocalReport.SetParameters(para);

                    string type = Request.QueryString.Get("type");
                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if (type.ToLower().Equals("pdf"))
                            downloadReportPDF(report);
                        else if (type.ToLower().Equals("xls") || type.ToLower().Equals("xlsx"))
                        {
                            downloadReportEXCEL(report);
                        }
                    }
                    else
                    {
                        menuPanel.Visible = false;
                        reportPanel.Visible = true;
                    }
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(report))
                    errorList.Add("Report is required");

                if (id1 == Guid.Empty)
                    errorList.Add("Invalid id1 provided");

                reportPanel.Visible = false;
                menuPanel.Visible = true;
            }
        }

        public void SurveyResponsesMatrix(string report, Guid id1)
        {
            if (!string.IsNullOrWhiteSpace(report) && id1 != Guid.Empty)
            {
                setupReport(ref thisReportViewer);

                thisReportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + "/reports/rdls/SurveyResponsesMatrix.rdl";

                using (rm = new ReportEntities())
                {
                    ReportParameter para = new ReportParameter("SurveyID", id1.ToString());

                    var spResult1 = rm.GetSurveyaDetails();
                    var spResult2 = rm.GetSurveyDetails(id1).ToList();
                    var spResult3 = rm.GetAuditedResponsesForMatrix(id1).ToList();

                    ReportDataSource reportDS1 = new ReportDataSource("SurveyaDetails", spResult1);
                    ReportDataSource reportDS2 = new ReportDataSource("GetSurveyDetails", spResult2);
                    ReportDataSource reportDS3 = new ReportDataSource("AuditedResponses", spResult3);


                    thisReportViewer.LocalReport.DataSources.Add(reportDS1);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS2);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS3);

                    thisReportViewer.LocalReport.SetParameters(para);

                    string type = Request.QueryString.Get("type");
                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if (type.ToLower().Equals("pdf"))
                            downloadReportPDF(report);
                        else if (type.ToLower().Equals("xls") || type.ToLower().Equals("xlsx"))
                        {
                            downloadReportEXCEL(report);
                        }
                    }
                    else
                    {
                        menuPanel.Visible = false;
                        reportPanel.Visible = true;
                    }
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(report))
                    errorList.Add("Report is required");

                if (id1 == Guid.Empty)
                    errorList.Add("Invalid id1 provided");

                reportPanel.Visible = false;
                menuPanel.Visible = true;
            }
        }

        public void SurveyResponsesMatrix_CRM(string report, Guid id1)
        {
            if (!string.IsNullOrWhiteSpace(report) && id1 != Guid.Empty)
            {
                setupReport(ref thisReportViewer);

                thisReportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + "/reports/rdls/SurveyResponsesMatrix.rdl";

                using (rm = new ReportEntities())
                {
                    ReportParameter para = new ReportParameter("SurveyID", id1.ToString());

                    var spResult1 = rm.GetSurveyaDetails();
                    var spResult2 = rm.GetSurveyDetails(id1).ToList();
                    var spResult3 = rm.GetAuditedResponsesForMatrix_CRM(id1).ToList();

                    ReportDataSource reportDS1 = new ReportDataSource("SurveyaDetails", spResult1);
                    ReportDataSource reportDS2 = new ReportDataSource("GetSurveyDetails", spResult2);
                    ReportDataSource reportDS3 = new ReportDataSource("AuditedResponses", spResult3);


                    thisReportViewer.LocalReport.DataSources.Add(reportDS1);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS2);
                    thisReportViewer.LocalReport.DataSources.Add(reportDS3);

                    thisReportViewer.LocalReport.SetParameters(para);

                    string type = Request.QueryString.Get("type");
                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if (type.ToLower().Equals("pdf"))
                            downloadReportPDF(report);
                        else if (type.ToLower().Equals("xls") || type.ToLower().Equals("xlsx"))
                        {
                            downloadReportEXCEL(report);
                        }
                    }
                    else
                    {
                        menuPanel.Visible = false;
                        reportPanel.Visible = true;
                    }
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(report))
                    errorList.Add("Report is required");

                if (id1 == Guid.Empty)
                    errorList.Add("Invalid id1 provided");

                reportPanel.Visible = false;
                menuPanel.Visible = true;
            }
        }

        void SummarySubreportProcessingEventHandler(object sender, SubreportProcessingEventArgs e)
        {

            var SurveyID = e.Parameters["SurveyID"].Values[0];
            var ChartType = e.Parameters["ChartType"].Values[0];
            Guid id2;

            if (Guid.TryParse(SurveyID, out id2))
            {
                var spResult1 = rm.GetSurveyaDetails();
                var spResult2 = rm.GetSurveyDetails(id2).ToList();
                var spResult3 = rm.GetSurveyQuestions(id2).ToList();
                var spResult4 = rm.ResponseSummaryAllQuestions(id2).ToList();

                ReportDataSource reportDS1 = new ReportDataSource("SurveyaDetails", spResult1);
                ReportDataSource reportDS2 = new ReportDataSource("SurveyDetails", spResult2);
                ReportDataSource reportDS3 = new ReportDataSource("SurveyQuestions", spResult3);
                ReportDataSource reportDS4 = new ReportDataSource("SurveyQuestions", spResult4);


                e.DataSources.Add(reportDS1);
                e.DataSources.Add(reportDS2);
                e.DataSources.Add(reportDS3);
                e.DataSources.Add(reportDS4);

                ReportParameter surIDPara = new ReportParameter("SurveyID", id2.ToString());
                ReportParameter chartTypePara = new ReportParameter("ChartType", ChartType);
            }
        }

        public void downloadReportPDF(string report)
        {
            Warning[] warnings;
            string[] streamids;
            string mimeType;
            string encoding;
            string extension;

            byte[] bytes = thisReportViewer.LocalReport.Render(
               "PDF", null, out mimeType, out encoding,
                out extension,
               out streamids, out warnings);

            Response.ClearContent();
            Response.ClearHeaders();
            Response.AddHeader("cache-control", "private");     //Also try ->   "max-age=1"
            Response.ContentType = "application/pdf";
            Response.AddHeader("content-disposition", "attachment; filename=" + report + ".pdf");
            Response.AddHeader("content-length", bytes.Length + "");
            Response.BinaryWrite(bytes);
            Response.Flush();
            Response.End();
        }
        public void downloadReportEXCEL(string report)
        {
            Warning[] warnings;
            string[] streamids;
            string mimeType;
            string encoding;
            string extension;

            byte[] bytes = thisReportViewer.LocalReport.Render(
               "EXCELOPENXML", null, out mimeType, out encoding,
                out extension,
               out streamids, out warnings);

            Response.ClearContent();
            Response.ClearHeaders();
            Response.AddHeader("cache-control", "private");     //Also try ->   "max-age=1"
            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            Response.AddHeader("content-disposition", "attachment; filename=" + report + ".xlsx");
            Response.AddHeader("content-length", bytes.Length + "");
            Response.BinaryWrite(bytes);
            Response.Flush();
            Response.End();
        }
    }
}