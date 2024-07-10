<%@ Page Title="Surveya | Surveys" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="Surveys.aspx.cs" Inherits="Surveya_Application.Administration.Surveys" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
   <%--<style>
      .dataTables_filter, .dataTables_length{
          visibility:collapse;
      }
   </style>--%>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><a href="../Administration/"><i class="fa icon-dashboard"></i> Home</a></li>
            <li class="active"><i class="fa icon-surveys"></i> Surveys</li>
         </ol>
      </div>
   </section>

   <!-- Main content -->
   <section class="content">
      <!-- Main row -->
      <div class="row">
         <!-- activity-list -->
         <div class="box">
            <div class="box-header">
               <h3 class="box-title"><span class="companyNameHolder"></span> Surveys</h3>
               <div class="box-tools pull-right">
                  <button id="addSurveyBtn" type="button" class="btn btn-success btn-flat" title="Add Survey">
                     <i class="fa fa-plus"></i>
                  </button>
                  <button id="refreshSurveys" type="button" class="btn btn-info" title="Refresh">
                     <i class="fa fa-refresh"></i>
                  </button>
               </div>
               <div class="row">
                  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                     <div class="switch">
                        <input id="x" name="switch-x" type="radio" checked>
                        <label for="x">Show Inactive</label>

                        <input id="x1" name="switch-x" type="radio">
                        <label for="x1">Hide Inactive</label>

                        <span></span>
                     </div>
                  </div>
               </div>
            </div>
            <!-- /.box-header -->
            <div class="box-body row" id="projectListDiv">
               <div class="col-xs-12">
                  <table id="tblSurveysItems" class="table table-bordered table-striped compact">
                     <thead>
                        <tr>
                           <th width="15%">Survey Title</th>
                           <th width="15%">Project</th>
                           <th width="15%">Date Created</th>
                           <th width="15%">Created By</th>
                           <th width="15%">Start Date</th>
                           <th width="15%">End Date</th>
                           <th width="10%"></th>
                        </tr>
                     </thead>
                     <tbody id="SurveyBody"></tbody>
                     <tfoot>
                        <tr>
                           <th width="15%">Survey Title</th>
                           <th width="15%">Project</th>
                           <th width="15%">Date Created</th>
                           <th width="15%">Created By</th>
                           <th width="15%">Start Date</th>
                           <th width="15%">End Date</th>
                           <th width="10%"></th>
                        </tr>
                     </tfoot>
                  </table>
               </div>
            </div>
            <!-- /.box-body -->
            <!-- NO box-footer -->
         </div>
         <!-- /.activity-list-->
         <!-- /.col -->
      </div>
      <!-- /.row -->
   </section>
   <!-- /.content -->

   
   <div class="modal fade" id="addProjectSurveyModal">
      <div class="modal-dialog modal-lg">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="addProjectSurveyModalHead" class="modal-title">Create survey</h4>
            </div>
            
            <div class="modal-body row">
               <div class="col-xs-12">
                  <p class="text-danger">
                     <asp:Literal runat="server" ID="Literal2" />
                  </p>

                  <div class="col-xs-12">
                     <div class="form-group row">
                        <label for="projectDDL">Project to add to</label>
                        <select id="projectDDL" class="form-control"></select>
                     </div>
                  </div>

                  <div class="col-xs-12">
                     <div class="form-group row">
                        <label for="surveyTitle">Survey title</label>
                        <input type="text" id="surveyTitle" placeholder="Survey Title" class="form-control">
                     </div>
                  </div>

                  <div class="col-xs-12">
                     <div class="form-group row">
                        <label for="surveyPurpose">Survey purpose</label>
                        <textarea rows="5" id="surveyPurpose" placeholder="Survey Purpose" class="form-control"></textarea>
                     </div>
                  </div>

                  <div class="col-xs-12">
                     <div class="form-group row">
                        <label for="surveyConclusion">Survey conclusion</label>
                        <textarea rows="5" id="surveyConclusion" placeholder="Survey Conclusion" class="form-control"></textarea>
                     </div>
                  </div>

                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="Label2" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer">
               <a id="AddSurveyToProjBtn" class="btn btn-success btn-flat">Save</a>
            </div>
         </div>
         
         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>

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
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/Survey.js"></script>
   <script>
      $(function () {
         GetCompanySurveys();
         $('#x, #x1').on('click', function () {
            GetCompanySurveys();
         });

         var sp = document.getElementById('surveyPurpose');
         if (sp && !CKEDITOR.instances.surveyPurpose) {
             CKEDITOR.replace('surveyPurpose', {
                 language: 'en',
                 toolbarCanCollapse: true
             });
         }

         var sc = document.getElementById('surveyConclusion');
         if (sc && !CKEDITOR.instances.surveyConclusion) {
             CKEDITOR.replace('surveyConclusion', {
                 language: 'en',
                 toolbarCanCollapse: true
             });
         }
      });
   </script>
</asp:Content>
