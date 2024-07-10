<%@ Page Title="Surveya | Responses" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="Responses.aspx.cs" Inherits="Surveya_Application.Administration.Responses" %>

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
            <li><a href="../Administration/Surveys"><i class="fa icon-surveys"></i> Surveys</a></li>
             <li><a id="viewSurvey" href="#"><i class="fa icon-surveys"></i> &nbsp;<span class="surveyNameTxt"></span></a></li>
            <li class="active"><i class="fa fa-list"></i>&nbsp;Responses</li>
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
               <h3 class="box-title"><span class="surveyNameHolder"></span> Responses</h3>
               <div class="box-tools pull-right">
                  <button id="refreshResponses" type="button" class="btn btn-info" title="Refresh">
                     <i class="fa fa-refresh"></i>
                  </button>
               </div>
               <%--<div class="row">
                  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                     <div class="switch">
                        <input id="x" name="switch-x" type="radio" checked>
                        <label for="x">Show Inactive</label>

                        <input id="x1" name="switch-x" type="radio">
                        <label for="x1">Hide Inactive</label>

                        <span></span>
                     </div>
                  </div>
               </div>--%>
            </div>
            <!-- /.box-header -->
            <div class="box-body row">
               <div class="col-xs-12">
                  <table id="tblResponseItems" class="table table-bordered table-striped compact">
                     <thead>
                        <tr>
                           <th width="35%">Response Title</th>
                           <th width="20%">Date Created</th>
                           <th width="35%">Created By</th>
                           <th width="10%"></th>
                        </tr>
                     </thead>
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

</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/Responses.js"></script>
</asp:Content>
