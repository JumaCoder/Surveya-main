<%@ Page Title="Surveya | Survey" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="ViewSurvey.aspx.cs" Inherits="Surveya_Application.Administration.ViewSurvey" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Content Header (Page header) -->
    <section class="content-header clearfix">
        <div class="pull-right">
            <ol class="breadcrumb">
                <li><a href="../Administration/"><i class="fa icon-dashboard"></i>Home</a></li>
                <li><a href="../Administration/Surveys"><i class="fa icon-surveys"></i>Surveys</a></li>
                <li class="active"><i class="fa fa-list-alt"></i>&nbsp;<span class="surveyNameTxt"></span></li>
            </ol>
        </div>
    </section>

    <!-- Main content -->
    <section class="content">
        <!-- Main row -->
        <div class="row">
            <!-- activity-list -->
            <div class="col-md-12" id="project-controls">
                <div class="box">
                    <div class="box-header">
                        <h3 class="box-title surveyNameTxt">Survey</h3>
                        <br />
                        <br />
                        <span id="surveyLabels"></span>
                        <div class="box-tools pull-right">
                            <a id="StartSurvey" class="btn btn-default btn-flat" title="Collect Responses" style="display: none;">
                                <i class="fa fa-play"></i>
                            </a>
                            <a id="EndSurvey" class="btn btn-default btn-flat" title="Stop Collection" style="display: none;">
                                <i class="fa fa-stop"></i>
                            </a>
                            <a id="updateSurveyView" class="btn btn-default" title="">
                                <i class="fa fa-list-alt text-purple"></i>
                                <span id="updateSurveyViewText" class="hidden-md hidden-sm hidden-xs"></span>
                            </a>
                            <a id="HelpViewSurveyTop" class="btn btn-default btn-flat" title="Help me!">
                                <i class="fa fa-info-circle"> Help</i>
                            </a>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body row" id="projectDiv">
                        <div class="col-xs-12">
                            <p class="text-danger">
                                <asp:Literal runat="server" ID="ErrorMessage1" />
                            </p>

                            <div class="box-group" id="accordion">
                                <!-- we are adding the .panel class so bootstrap.js collapse plugin detects it -->

                                <div id="surveyOverviewBox" class="panel box box-primary">
                                    <div class="box-header with-border">
                                        <h4 class="box-title">
                                            <a data-toggle="collapse" data-parent="#accordion" href="#surveyOverview" aria-expanded="false">Survey Overview
                                            </a>
                                        </h4>
                                        <div class="box-tools pull-right">
                                            <a id="viewSurveyOverview" class="btn btn-default btn-flat" title="View" style="display: none;">
                                                <i class="fa fa-ban"></i>
                                            </a>
                                            <a id="editSurveyOverview" class="btn btn-default btn-flat" title="Edit" style="display: none;">
                                                <i class="fa fa-pencil"></i>
                                            </a>
                                            <button id="refreshSurveyOverview" type="button" class="btn btn-info" title="Refresh" style="display: none;">
                                                <i class="fa fa-refresh"></i>
                                            </button>
                                            <a id="HelpViewSurveyOverview" class="btn btn-default btn-flat" title="Help me!">
                                                <i class="fa fa-info-circle">Help</i>
                                            </a>
                                        </div>
                                    </div>
                                    <div id="surveyOverview" class="panel-collapse collapse" aria-expanded="true">

                                        <!-- /.box-header -->
                                        <div class="box-body">
                                            <p class="text-danger">
                                                <asp:Literal runat="server" ID="Literal1" />
                                            </p>

                                            <div class="row mb-2">
                                                <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                                    <label for="surveyTitle">Survey title</label>
                                                </div>
                                                <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                                    <input type="text" id="surveyTitle" placeholder="Survey Title" class="form-control">
                                                </div>
                                            </div>
                                            <div class="row mb-2">
                                                <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                                    <label for="themePrimary">Primary Color (Header/Primary Button)</label>
                                                </div>
                                                <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                                    <input type="color" id="themePrimary" value="#27418e" class="form-control">
                                                </div>
                                            </div>
                                            <div class="row mb-2">
                                                <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                                    <label for="themeSecondary">Secondary Color (Subsection)</label>
                                                </div>
                                                <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                                    <input type="color" id="themeSecondary" value="#d5a07a" class="form-control">
                                                </div>
                                            </div>

                                            <hr />
                                            
                                            <div class="row mb-2">
                                                <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                                    <label for="headerColor">Header Color (will override header color)</label>
                                                </div>
                                                <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                                    <input type="color" id="headerColor" value="#17a2b8" class="form-control">
                                                </div>
                                            </div>
                                            
                                            <div class="row mb-2">
                                                <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                                    <label for="controlColor">Control Color (will override checkbox/radio/rating colors)</label>
                                                </div>
                                                <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                                    <input type="color" id="controlColor" value="#2b3784" class="form-control">
                                                </div>
                                            </div>
                                            
                                            <div class="row mb-2">
                                                <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                                    <label for="buttonColor">Button Color (will override button colors)</label>
                                                </div>
                                                <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                                    <input type="color" id="buttonColor" value="#17a2b8" class="form-control">
                                                </div>
                                            </div>
                                            
                                            <div class="row mb-2">
                                                <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                                    <label for="submitButtonColor">Submit Button Color (will override button color)</label>
                                                </div>
                                                <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                                    <input type="color" id="submitButtonColor" value="#28a745" class="form-control">
                                                </div>
                                            </div>

                                            <hr />

                                            <div class="row mb-2">
                                                <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                                    <label for="surveyPurpose">Survey purpose</label>
                                                </div>
                                                <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                                    <textarea rows="5" id="surveyPurpose" placeholder="Survey Purpose" class="form-control"></textarea>
                                                </div>
                                            </div>

                                            <div class="row mb-2">
                                                <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                                    <label for="surveyConclusion">Survey conclusion</label>
                                                </div>
                                                <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                                    <textarea rows="5" id="surveyConclusion" placeholder="Survey C onclusion" class="form-control"></textarea>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                                    <label for="projectName">Project</label>
                                                </div>
                                                <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                                    <label id="projectName" title="Project" class="form-control"></label>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <asp:Label ID="Label1" runat="server" CssClass="text-red" Visible="false" />
                                                </div>
                                            </div>
                                        </div>
                                        <!-- /.box-body -->
                                        <div class="box-footer" id="surveyOverviewFooter" style="display: none;">
                                            <div class="col-xs-12">
                                                <div class="pull-right">
                                                    <a id="SaveUserDetails" class="btn btn-success btn-block btn-flat">Save</a>
                                                </div>
                                            </div>
                                            <!-- /.col -->
                                        </div>
                                    </div>
                                </div>

                                <div id="surveyTeamBox" class="panel box box-primary">
                                    <div class="box-header with-border">
                                        <h4 class="box-title">
                                            <a data-toggle="collapse" data-parent="#accordion" href="#surveyTeam" aria-expanded="false">Survey Users
                                            </a>
                                        </h4>
                                        <div class="box-tools pull-right">
                                            <button id="addSurveyUserBtn" type="button" class="btn btn-success btn-flat" title="Add User" style="display: none;">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                            <button id="refreshSurveyTeam" type="button" class="btn btn-info" title="Refresh" style="display: none;">
                                                <i class="fa fa-refresh"></i>
                                            </button>
                                            <a id="HelpViewSurveyUsers" class="btn btn-default btn-flat" title="Help me!">
                                                <i class="fa fa-info-circle">Help</i>
                                            </a>
                                        </div>
                                    </div>
                                    <div id="surveyTeam" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                                        <div class="box-body row" id="teamDiv">
                                            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                                                <div class="switch">
                                                    <input id="x" name="switch-x" type="radio" checked>
                                                    <label for="x">Hide Inactive</label>

                                                    <input id="x1" name="switch-x" type="radio">
                                                    <label for="x1">Show Inactive</label>

                                                    <span></span>
                                                </div>
                                            </div>
                                            <div class="col-xs-12">
                                                <table id="tblTeamItems" class="table table-bordered table-striped compact">
                                                    <thead>
                                                        <tr>
                                                            <th width="25%">Name</th>
                                                            <th width="20%">Role</th>
                                                            <th width="20%">Email</th>
                                                            <th width="20%">Cell No</th>
                                                            <th width="15%"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="projectTBody"></tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th width="25%">Name</th>
                                                            <th width="20%">Role</th>
                                                            <th width="20%">Email</th>
                                                            <th width="20%">Cell No</th>
                                                            <th width="15%"></th>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="surveyQuestionResponsesBox" class="panel box box-primary">
                                    <div class="box-header with-border">
                                        <h4 class="box-title">
                                            <a data-toggle="collapse" data-parent="#accordion" href="#responseList" aria-expanded="false">Responses
                                            </a></h4>
                                        <div class="box-tools pull-right">
                                            <a id="CopyResponsesToAudit" class="btn btn-success" title="Copy Responses To Audit">
                                                <i class="fa fa-copy"></i>
                                            </a>
                                            <a id="ViewOriginalResponses2" class="btn btn-default btn-flat" href="#" title="View Original Responses" style="display: none;">
                                                <i class="fa fa-list text-green"></i>
                                            </a>
                                            <a id="ViewResponsesToAudit" target="_blank" class="btn btn-primary" title="Download Audit Responses">
                                                <i class="fa fa-table"></i>
                                            </a>
                                            <%--<a id="uploadResponses" class="btn btn-primary" title="Upload Audited Responses">
                                          <i class="fa fa-upload"></i>
                                       </a>--%>
                                            <%--<asp:LinkButton runat="server" ID="uploadResponses" OnClick="showUploadDiv" CssClass="btn bg-aqua" ToolTip="Upload Audited Responses" Text="<i class='fa fa-upload'></i>"></asp:LinkButton>--%>
                                            <a id="refreshSurveyQuestionResponses" class="btn btn-info" title="Refresh">
                                                <i class="fa fa-refresh"></i>
                                            </a>
                                            <a id="HelpViewSurveyResponses" class="btn btn-default btn-flat" title="Help me!">
                                                <i class="fa fa-info-circle">Help</i>
                                            </a>
                                        </div>
                                    </div>
                                    <div id="responseList" class="box-body panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                            <!-- small box -->
                                            <div class="small-box bg-purple disabled ">
                                                <div class="inner">
                                                    <h3 id="NumOfUploadedResponses">0</h3>
                                                    <p>Uploaded Responses</p>
                                                </div>
                                                <div class="icon">
                                                    <i class="fa fa-pie-chart"></i>
                                                </div>
                                                <span class="small-box-footer">Total Responses</span>
                                            </div>
                                        </div>
                                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                            <!-- small box -->
                                            <div class="small-box bg-green disabled ">
                                                <div class="inner">
                                                    <h3 id="NumOfAuditedResponses">0</h3>
                                                    <p>Audit Responses</p>
                                                </div>
                                                <div class="icon">
                                                    <i class="fa fa-copy"></i>
                                                </div>
                                                <a id="CopyResponsesToAudit2" class="small-box-footer btn">Copy Responses To Audit</a>
                                            </div>
                                        </div>
                                        <div class="col-xs-12">
                                            <hr />
                                        </div>
                                        <asp:UpdatePanel runat="server">
                                            <Triggers>
                                                <asp:PostBackTrigger ControlID="uploadResponse" />
                                                <%--<asp:AsyncPostBackTrigger ControlID="uploadResponse" />--%>
                                            </Triggers>
                                            <ContentTemplate>
                                                <div id="respModalPanel">
                                                    <div class="col-xs-12">
                                                        <h3>
                                                            <i class="fa fa-upload"></i>Upload Audited Responses
                                                        </h3>
                                                        <asp:Panel runat="server" ID="lblError" CssClass="col-xs-12">
                                                            <small>
                                                                <asp:Label runat="server" ID="excelLbl" Text=""></asp:Label>
                                                            </small>
                                                        </asp:Panel>

                                                        <div class="form-group">
                                                            <asp:Label runat="server" AssociatedControlID="excelfileUpload" Text="Select File"></asp:Label>
                                                            <small>required</small>
                                                            <asp:FileUpload ID="excelfileUpload" runat="server" CssClass="form-control" />
                                                        </div>

                                                        <div class="col-xs-12">
                                                            <h4 class="text-yellow"><i class="icon fa fa-info"></i>Note</h4>
                                                            To speed up the audited response processing, you can delete all rows that have not been changed in the Excel file.
                                                       
                                                        </div>
                                                    </div>
                                                    <br />
                                                    <div class="col-xs-12">
                                                        <asp:Button ID="uploadResponse" runat="server" CssClass="btn btl-flat bg-light-blue pull-right"
                                                            OnClick="uploadResponse_Click" Text="Upload Response" />
                                                    </div>
                                                </div>
                                            </ContentTemplate>
                                        </asp:UpdatePanel>
                                    </div>
                                </div>

                                <!--
                                <div id="surveyReportsBox" class="panel box box-primary">
                                    <div class="box-header with-border">
                                        <h4 class="box-title">
                                            <a data-toggle="collapse" data-parent="#accordion" href="#surveyReports" aria-expanded="false">Dynamic Reports
                                            </a>
                                        </h4>
                                        <div class="box-tools pull-right">
                                            <a id="addDynamicReportBtn" class="btn btn-success btn-flat" title="Dynamic Reports" style="display: none;">
                                                <i class="fa fa-plus"></i>
                                            </a>
                                            <a id="refreshSurveyReports" class="btn btn-info" title="Refresh" style="display: none;">
                                                <i class="fa fa-refresh"></i>
                                            </a>
                                            <a id="HelpViewSurveyReports" class="btn btn-default btn-flat" title="Help me!">
                                                <i class="fa fa-info-circle">Help</i>
                                            </a>
                                        </div>
                                    </div>
                                    <div id="surveyReports" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                                        <table id="tblReportItems" class="table table-bordered table-striped compact">
                                            <thead>
                                                <tr>
                                                    <th width="30%">Name</th>
                                                    <th width="30%">Created By</th>
                                                    <th width="30%">Date Created</th>
                                                    <th width="10%"></th>
                                                </tr>
                                            </thead>
                                            <tbody id="reportTBody"></tbody>
                                        </table>
                                    </div>
                                </div>
                                -->
                                <div id="surveyReportsBox2" class="panel box box-primary">
                                    <div class="box-header with-border">
                                        <h4 class="box-title">
                                            <a data-toggle="collapse" data-parent="#accordion" href="#surveyReports2" aria-expanded="false">Report
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="surveyReports2" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                                        <div class="box-body">
                                            <!--<div class="row">
                                                <div class="col-xs-12">
                                                    <b>General Report</b>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <ul>
                                                        <li>Outlines the statistics of the survey per question</li>
                                                        <li>Provides general feedback with information regarding the survey</li>
                                                    </ul>

                                                    <a href="#" id="DownloadGeneralReport" class="btn btn-default">
                                                        <i title="" class="fa fa-bar-chart btn text-black" style="padding-left: 6px; padding-right: 6px"></i>View Report
                                                    </a>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <hr />
                                                </div>
                                            </div>-->

                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <b>Response Report</b>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <ul>
                                                        <li>View Audited Response Data per question in Matrix format</li>
                                                    </ul>

                                                    <a href="#" id="DownloadSurveyResponsesMatrix" class="btn btn-default">
                                                        <i title="" class="fa fa-bar-chart btn text-black" style="padding-left: 6px; padding-right: 6px"></i>View Report
                                                    </a>
                                                </div>
                                            </div>
                                            
                                            
                                            <!--
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <hr />
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <b>CRM Response Report</b>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <ul>
                                                        <li>View Audited Response Data for CRM per question in Matrix format</li>
                                                    </ul>

                                                    <a href="#" id="DownloadSurveyResponsesMatrix_CRM" class="btn btn-default">
                                                        <i title="" class="fa fa-bar-chart btn text-black" style="padding-left: 6px; padding-right: 6px"></i>View CRM Report
                                                    </a>
                                                </div>
                                            </div>
                                            -->
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /.activity-list-->
            <!-- /.col -->
        </div>
        <!-- /.row -->
    </section>
    <!-- /.content -->

    <div class="modal fade" id="addSurveyUserModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="addSurveyUserModalHead" class="modal-title">Add User to Survey</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="addSurveyUserModalError"></span>
                        </p>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="availableUsers">Select user</label>
                                <select id="availableUsers" class="form-control"></select>
                            </div>
                            <p class="text-warning">
                                <small>Ensure the user(s) you want to add to this survey are active for the project this survey is part of.
                                </small>
                            </p>
                        </div>

                        <div class="row">
                            <div class="col-xs-12">
                                <asp:Label ID="Label2" runat="server" CssClass="text-red" Visible="false" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="AddUserToProjBtn" class="btn btn-success btn-flat">Save</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="addGroupModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="addGroupModalHead" class="modal-title">Add Section to Survey</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="addGroupModalError"></span>
                        </p>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="groupName">Group name</label>
                                <input type="text" id="groupName" placeholder="Group name" class="form-control" />
                            </div>
                        </div>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="groupTypeDDL">Group type</label>
                                <select id="groupTypeDDL" class="form-control">
                                    <option value="Page">Page</option>
                                    <option value="Table">Table</option>
                                    <option value="Normal">Normal</option>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-xs-12">
                                <asp:Label ID="Label3" runat="server" CssClass="text-red" Visible="false" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="AddGroupBtn" class="btn btn-success btn-flat">Save</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="addInnerGroupModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="addInnerGroupModalHead" class="modal-title">Add Inner Question Group</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="addInnerGroupModalError"></span>
                        </p>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="ParentGroupName">Parent group</label>
                                <label id="ParentGroupName" class="form-control"></label>
                            </div>
                        </div>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="groupName">Group name</label>
                                <input type="text" id="innerGroupName" placeholder="Group name" class="form-control" />
                            </div>
                        </div>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="innerGroupTypeDDL">Group type</label>
                                <select id="innerGroupTypeDDL" class="form-control">
                                    <option value="Table">Table</option>
                                    <option value="Normal">Normal</option>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-xs-12">
                                <asp:Label ID="Label4" runat="server" CssClass="text-red" Visible="false" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="AddInnerGroupBtn" class="btn btn-success btn-flat">Save</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="deleteGroupModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="deleteGroupModalHead" class="modal-title">Are you sure you want to delete this group?</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p>
                            Group: <strong id="groupNameToDelete"></strong>will be deleted along with any subgroups and questions in it
                       
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="deleteGroupAndQuestionsBtn" class="btn btn-danger btn-flat">Delete</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="questionModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="questionModalHead" class="modal-title">Add Question</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="questionModalError"></span>
                        </p>

                        <div class="form-group">
                            <label for="questionTxt">Question</label>
                            <input type="text" id="questionTxt" placeholder="Question" class="form-control" required="required">
                        </div>

                        <div class="form-group">
                            <label for="typeDDL">Type</label>
                            <select id="typeDDL" class="form-control">
                            </select>
                        </div>

                        <div class="form-group" id="optionsSect">
                            <fieldset>
                                <legend>Type Options</legend>
                                <div class="col-xs-6"><small>Default | <a class="text-black" title="'Option Text' will be displayed">Option Text <i class="fa fa-question"></i></a></small></div>
                                <div class="col-xs-6"><small><a class="text-black" title="'Option Value' will be used for validation and/or calculations">Option Value <i class="fa fa-question"></i></a></small></div>
                                <div id="optionsDiv" class="row">
                                </div>
                                <div class="col-xs-12 text-center">
                                    <a id="addOption" title="Add an answer option for Type" class="btn btn-sm btn-flat btn-primary"><i class="fa fa-plus"></i></a>
                                </div>
                            </fieldset>
                        </div>

                        <div class="form-group" id="validationSect">
                            <fieldset>
                                <legend>Validation</legend>
                                <div id="validationDiv" class="row form-group">
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <input type="checkbox" id="RequiredQuestion" />
                                            <label for="RequiredQuestion">An answer is required</label>
                                        </div>
                                    </div>
                                    <div id="MinMaxRow" style="display: none;">
                                        <div class="col-xs-12 col-md-6">
                                            <label for="minTxt">Minimum value</label>
                                            <input id="minTxt" class="form-control" />
                                        </div>
                                        <div class="col-xs-12 col-md-6">
                                            <label for="maxTxt">Maximum value</label>
                                            <input id="maxTxt" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="EqualsValue">Must be EQUAL to</label>
                                        <input id="EqualsValue" class="form-control" />
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="NotEqualsValue">Must NOT be EQUAL to</label>
                                        <input id="NotEqualsValue" class="form-control" />
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="StartsWithValue">Must START with</label>
                                        <input id="StartsWithValue" class="form-control" />
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="EndsWithValue">Must END with</label>
                                        <input id="EndsWithValue" class="form-control" />
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="ContainsValue">Must contain this value</label>
                                        <input id="ContainsValue" class="form-control" />
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                        <label for="LengthValue">Answer must be of length</label>
                                        <input type="text" id="LengthValue" class="form-control" />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12 form-group">
                                        <div class="pull-left row" id="regExControls" style="display: none;">
                                            <div class="col-xs-12">
                                                <label for="regexDDL">Add more validation rules</label>
                                            </div>
                                            <div class="col-xs-10">
                                                <select id="regexDDL" class="form-control">
                                                    <option value="[a-zA-Z]+">Only letters</option>
                                                    <option value="^[A-Z]+">Starts with uppercase letter</option>
                                                    <option>Three</option>
                                                </select>
                                            </div>
                                            <div class="col-xs-1"><a id="addRegEx" class="btn btn-flat btn-primary"><i class="fa fa-plus"></i></a></div>
                                        </div>
                                        <div class="pull-right">
                                            <a id="advancedRegEx" class="btn btn-flat bg-purple">More</a>
                                            <a id="simpleRegEx" class="btn btn-flat bg-purple" style="display: none;">Less</a>
                                        </div>
                                    </div>
                                    <div id="regExDiv" class="col-xs-12" style="display: none;">
                                        <label for="regexTxt">Type out the validation rules</label>
                                        <textarea id="regexTxt" class="form-control" rows="5"></textarea>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <!-- /.modal-content -->

                <div class="modal-footer">
                    <a id="deleteQuestionBtn" class="btn btn-danger btn-flat" style="display: none;">Delete</a>
                    <a id="saveQuestionBtn" class="btn btn-success btn-flat">Save</a>
                </div>
            </div>

        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="addTableRowModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="addTableRowModalHead" class="modal-title">Add Section to Survey</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="addTableRowModalError"></span>
                        </p>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="newRowText">Row text</label>
                                <input type="text" id="newRowText" placeholder="Row text" class="form-control" />
                            </div>
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <a id="AddRowBtn" class="btn btn-success btn-flat">Save</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>


    <div class="modal fade" id="StartCollectionModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="StartCollectionModalHead" class="modal-title">
                        <i class="fa fa-question-circle text-aqua"></i>Are you sure you want to start collecting responses?
                    </h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <ul>
                            <li>You will no longer be able to edit questions if you continue.</li>
                            <li>You will still be able to add/remove users to this survey</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="StartCollectionBtn" data-dismiss="modal" class="btn bg-purple btn-flat">Collect</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="StopCollectionModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="StopCollectionModalHead" class="modal-title">
                        <i class="fa fa-question-circle text-orange"></i>Are you sure you want to stop collecting responses?
                    </h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <ul>
                            <li>You will no longer be able to collect responses for this survey.</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="StopCollectionBtn" data-dismiss="modal" class="btn bg-orange btn-flat">Stop Collection</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="importQuestionsModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="importQuestionsModalHead" class="modal-title">Import Questions from this Survey</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="importQuestionsModalError"></span>
                        </p>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="surveysToImportList">Select Survey</label>
                                <select id="surveysToImportList" class="form-control"></select>
                            </div>
                        </div>
                        <div class="col-xs-12 text-yellow">
                            <h4><i class="icon fa fa-warning"></i>Alert!</h4>
                            <p>Importing will replace all questions currently in this survey.</p>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <asp:Label ID="Label5" runat="server" CssClass="text-red" Visible="false" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="importQuestionsBtn" class="btn btn-success btn-flat">Import</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>


    <div class="modal fade" id="duplicateSurveyModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="duplicateSurveyModalHead" class="modal-title">Duplicate Survey</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="duplicateSurveyModalError"></span>
                        </p>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="surveyToDuplicate">Survey to duplicate</label>
                                <input id="surveyToDuplicate" class="form-control" readonly="readonly" />
                            </div>
                        </div>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="duplicatSurveyTitle">New survey title</label>
                                <input type="text" id="duplicatSurveyTitle" placeholder="New survey title" class="form-control" />
                            </div>
                        </div>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="duplicatSurveyPurpose">New survey purpose</label>
                                <textarea rows="5" id="duplicatSurveyPurpose" placeholder="New survey purpose" class="form-control"></textarea>
                            </div>
                        </div>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="duplicatSurveyConclusion">New survey conclusion</label>
                                <textarea rows="5" id="duplicatSurveyConclusion" placeholder="New survey conclusion" class="form-control"></textarea>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-xs-12">
                                <asp:Label ID="Label6" runat="server" CssClass="text-red" Visible="false" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="duplicatSurveyBtn" class="btn btn-success btn-flat">Duplicate</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>



    <div class="modal fade" id="addDynamicReportModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="addDynamicReportModalHead" class="modal-title">Add Dynamic Report to Survey</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="newReportName">New report name</label>
                                <input type="text" id="newReportName" class="form-control" />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-xs-12">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="CreateDynamicReportBtn" class="btn btn-success btn-flat">Save</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- /.modal .fade -->


    <div class="modal fade" id="deleteSurveyModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="deleteSurveyModalHead" class="modal-title">Delete Survey</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <div class="col-xs-12">
                            <div class="form-group row">
                                <p>This action is irreversible, are you sure you want to delete this survey?</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="CancelDeleteSurveyBtn" data-dismiss="modal" class="btn btn-info btn-flat">Cancel</a>
                    <a id="DeleteSurveyBtn" class="btn btn-danger btn-flat">Delete</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="GenerateSurveyEmailLinkModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="GenerateSurveyEmailLinkModalHead" class="modal-title">
                        <i class="fa fa-question-circle text-aqua"></i>Make this survey publicly available?
               </h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p>
                            All reponses completed using this link will appear as being completed by a specific user, please specify this user.
                   
                        </p>
                        <div class="form-group">
                            <label for="emailLinkUsers">Select user</label>
                            <select id="emailLinkUsers" class="form-control"></select>
                        </div>
                        <p class="text-warning">
                            <small>Ensure the user you want to specify is active for the project this survey is part of.
                        </small>
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="GenerateSurveyEmailLinkBtn" class="btn bg-purple btn-flat">Generate</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="infoModal">
        <div class="modal-dialog">

            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="infoModalHead" class="modal-title">Survey Management</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <h5>Things you can do...</h5>
                        <ul>
                            <li>Company Admin can create surveys under a project</li>
                            <li>Create questionnaire for survey</li>
                            <li>Assign users to capture responses</li>
                            <li>View/audit responses</li>
                            <li>Create/View survey reports</li>
                        </ul>
                    </div>
                </div>

                <div class="modal-footer">
                    <label for="dontshowagain">Don't show this again. <input type="checkbox" id="dontshowagain" class="icheckbox_minimal-blue"></label>
                    <button type="button" class="btn btn-flat" data-dismiss="modal" aria-label="Close">Close</button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="errorModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-light-blue">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title text-center">Error!</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <asp:BulletedList ID="ErrorList" runat="server">
                        </asp:BulletedList>
                    </div>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
    <script src="../Content/js/Survey.js?v=2.013"></script>
    <script src="../Content/js/Tours.js"></script>
    <script>
        $(function () {
            initSurveyOverview();
            hideAllBtns();

            $('#x, #x1').click(function () {
                GetSurveyTeam();
            });
            $('form').attr('novalidate', 'novalidate');
        });
    </script>
</asp:Content>
