<%@ Page Title="Surveya | Manage Packages" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="ManagePackages.aspx.cs" Inherits="Surveya_Application.Administration.ManageRoles" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <h3>Manage Packages</h3>
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><a href="../Administration/"><i class="fa icon-dashboard"></i> Home</a></li>
            <li class="active"><i class="fa fa-desktop"></i> System Packages</li>
         </ol>
      </div>
   </section>

   <!-- Main content -->
   <section class="content">
      <!-- Main row -->
      <div class="row">
         <!-- activity-list -->
         <div class="col-md-12" id="activity-list">
            <div class="box">
               <div class="box-header">
                  <h3 class="box-title">Manage existing Packages or create a new one</h3>
                  <div class="box-tools pull-right">
                     <button id="newPackageBtn" type="button" class="btn btn-success btn-flat" title="New Package">
                        <i class="fa fa-plus"></i>
                     </button>
                     <button id="duplicatePackageBtn" type="button" class="btn btn-info btn-flat" title="Duplicate Package">
                        <i class="fa fa-files-o"></i>
                     </button>
                     <button id="refreshFtPacks" type="button" class="btn btn-info" title="Refresh">
                        <i class="fa fa-refresh"></i>
                     </button>
                  </div>
                  <div class="row">
                     <div class="col-xs-12 col-sm-6">
                        <div class="switch">
                           <input id="showActive" name="switch-x" type="radio" checked>
                           <label for="showActive">Show Active</label>

                           <input id="showInactive" name="switch-x" type="radio">
                           <label for="showInactive">Show Inactive</label>
                        </div>
                     </div>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body">
                  <p class="text-danger">
                     <asp:Literal runat="server" ID="ErrorMessage2" />
                  </p>
                  <div class="col-xs-12 col-sm-3">
                     <div class="row">
                        <div class="col-xs-12" id="roleCardDiv">
                        </div>
                     </div>
                  </div>
                  <div id="packageDetails" class="col-xs-12 col-sm-9">
                     <div class="col-md-8 col-lg-9">
                        <div class="form-group">
                           <label for="packageName">Package Name</label>
                           <input type="text" id="packageName" placeholder="Package Name" class="form-control">
                        </div>
                     </div>
                     <div class="col-md-4 col-lg-3">
                        <div class="form-group">
                           <label for="packagePrice">Package Price</label>
                           <input type="number" id="packagePrice" placeholder="Package Price" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12">
                        <div class="form-group">
                           <label for="packageDescription">Package Description</label>
                           <input type="text" id="packageDescription" placeholder="Package Description" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-sm-6">
                        <div class="form-group">
                           <label for="packageProjects">Package Projects</label>
                           <input type="text" id="packageProjects" placeholder="Package Projects" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-sm-6">
                        <div class="form-group">
                           <label for="packageSurveys">Package Surveys</label>
                           <input type="text" id="packageSurveys" placeholder="Package Surveys" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-sm-6">
                        <div class="form-group">
                           <label for="packageUsers">Package Users</label>
                           <input type="text" id="packageUsers" placeholder="Package Users" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-sm-6">
                        <div class="form-group">
                           <label for="packageQuestions">Package Questions</label>
                           <input type="text" id="packageQuestions" placeholder="Package Questions" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-sm-6">
                        <div class="form-group">
                           <label for="packageResponses">Package Responses</label>
                           <input type="text" id="packageResponses" placeholder="Package Responses" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-sm-6">
                        <div class="form-group">
                           <label for="startDate">Start Date</label>
                           <input type="date" id="startDate" placeholder="Start Date" class="form-control">
                        </div>
                     </div>
                     <h4>Included Features <small>(included in the package)</small></h4>
                     <div id="featureChckDiv" class="col-sm-12 well clearfix">
                     </div>
                     <h4>Optional Features <small>(not part of the package but is available for addition)</small></h4>
                     <div id="featureOptDiv" class="col-sm-12 well clearfix">
                     </div>
                     <script type="text/template" id="optFeatDivTemp">
                        <div class="col-xs-12 col-sm-6 col-md-4" data-optdiv="[featName]">
                           <div class="form-group">
                              <label for="[featName]">[featFriendlyName]</label>
                              <div class="input-group" data-feat="[featCheck]">
                                 <span class="input-group-addon">
                                    <input type="checkbox" name="[featCheck]" title="[featCheckTitle]">
                                 </span>
                                 <input type="text" name="[featCheckPrice]" class="form-control" title="[featCheckPriceTitle]">
                              </div>
                           </div>
                        </div>
                     </script>
                  </div>
               </div>
               <!-- /.box-body -->

               <div class="box-footer">
                  <div class="row">
                     <div class="col-xs-12">
                        <div class="pull-right">
                           <a id="ActivatePackageBtn" class="btn btn-warning btn-flat" style="display: none;">&nbsp;&nbsp; Activate &nbsp;&nbsp;</a>
                           <a id="DeActivatePackageBtn" class="btn btn-danger btn-flat" style="display: none;">&nbsp;&nbsp; Deactivate &nbsp;&nbsp;</a>
                           <a id="SavePackageBtn" class="btn btn-primary btn-flat">&nbsp;&nbsp; Save &nbsp;&nbsp;</a>
                        </div>
                     </div>
                     <!-- /.col -->
                  </div>
                  <!-- /.row -->
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
   <script src="../Content/js/Package.js"></script>
   <script>
      $(function () {
         GetAllFeatures(true);
      });
   </script>
</asp:Content>
