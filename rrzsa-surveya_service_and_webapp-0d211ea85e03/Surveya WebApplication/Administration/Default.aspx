<%@ Page Title="Surveya | Activity Log" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Surveya_Application.Administration.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><i class="fa icon-dashboard"></i>&nbsp;<span class="companyNameHolder"></span></li>
         </ol>
      </div>
   </section>

   <!-- Main content -->
   <section class="content">
      <!-- Main row -->
      <div class="row">
         <!-- activity-list -->
         <div class="col-md-12" id="project-controls">
            <div id="timelineBox" class="panel box box-primary">
               <div class="box-header with-border">
                  <h4 class="box-title">
                     Activity Log
                  </h4>
                  <div class="box-tools pull-right">
                     <button id="refreshTimelineBtn" type="button" class="btn btn-info" title="Refresh">
                        <i class="fa fa-refresh"></i>
                     </button>
                  </div>
               </div>
               <div>
                  <div class="box-body">
                     <div class="row">
                        <div class="col-md-12 text-center">
                           <div class="form-inline">
                              <div class="form-group">
                                 <label for="userDDL">User:</label>
                                 <select id="userDDL" class="form-control">
                                 </select>
                              </div>
                              &nbsp;&nbsp;|&nbsp;&nbsp;
                              <div class="form-group">
                                 <label for="projectDDL">Project:</label>
                                 <select id="projectDDL" class="form-control">
                                 </select>
                              </div>
                              &nbsp;&nbsp;|&nbsp;&nbsp;
                              <div class="form-group">
                                 <label for="surveyDDL">Survey:</label>
                                 <select id="surveyDDL" class="form-control">
                                 </select>
                              </div>
                              &nbsp;&nbsp;
                              <a id="filterBtn" class="btn btn-flat btn-default">Filter</a>
                           </div>
                           <hr />
                        </div>
                        <div class="col-md-12">
                           <!-- The time line -->
                           <ul class="timeline">
                              <!-- timeline time label -->
                              <li class="time-label first">
                                 <span class="bg-red">01 Jan. 2000</span>
                              </li>
                              <!-- END timeline item -->
                              <!-- timeline item -->
                              <li class="moreInfo">
                                 <div class="text-center">
                                    <a class="viewMoreTimeBtn btn btn-default">View more</a>
                                 </div>
                              </li>
                              <!-- END timeline item -->
                              <!-- timeline item -->
                              <li class="time-label last">
                                 <i class="fa fa-clock-o bg-gray"></i>
                              </li>
                           </ul>
                        </div>
                        <!-- /.col -->
                     </div>
                  </div>
               </div>
            </div>
            <!-- /.box -->
         </div>
         <!-- /.activity-list-->
         <!-- /.col -->
      </div>
      <!-- /.row -->
   </section>
   <!-- /.content -->
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
    <script type="text/javascript" src="../Content/js/Dashboard.js"></script>
</asp:Content>
