<%@ Page Title="Surveya | Roles & Rights" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="ManageRoles.aspx.cs" Inherits="Surveya_Application.Administration.ManageRoles" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <h3>Manage Roles & Rights</h3>
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><a href="../Administration/"><i class="fa icon-dashboard"></i> Home</a></li>
            <li class="active"><i class="fa icon-roles"></i> Roles</li>
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
                  <h3 class="box-title">Manage existing Roles and Rights and create new Roles</h3>
                  <div class="box-tools pull-right">
                     <button id="newRoleBtn" type="button" class="btn btn-success btn-flat" title="New Role">
                        <i class="fa fa-plus"></i>
                     </button>
                     <button id="duplicateRoleBtn" type="button" class="btn btn-info btn-flat" title="Duplicate Role">
                        <i class="fa fa-files-o"></i>
                     </button>
                     <button id="refreshRoles" type="button" class="btn btn-info" title="Refresh">
                        <i class="fa fa-refresh"></i>
                     </button>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body">
                  <p class="text-danger">
                     <asp:Literal runat="server" ID="ErrorMessage" />
                  </p>
                  <div class="col-xs-12 col-sm-3">
                     <div class="row">
                        <div class="col-xs-12" id="roleCardDiv">
                        </div>
                     </div>
                  </div>
                  <div class="col-xs-12 col-sm-9">
                     <div id="isReadOnly" class="callout callout-warning" style="display: none;">
                        <p>This is a system role and cannot be edited.</p>
                     </div>
                     <div class="form-group has-feedback">
                        <label for="roleName">Role Name</label>
                        <input type="text" id="roleName" placeholder="Role Name" class="form-control">
                     </div>
                     <div class="form-group has-feedback">
                        <label for="roleDescription">Role Description</label>
                        <input type="text" id="roleDescription" placeholder="Role Description" class="form-control">
                     </div>
                     <h4>Rights</h4>
                     <div id="rightChckDiv" class="col-sm-12 well clearfix">
                     </div>
                  </div>
               </div>
               <!-- /.box-body -->

               <div class="box-footer">
                  <div class="row">
                     <div class="col-xs-12">
                        <div id="controlBtnDiv" class="pull-right">
                           <a id="ActivateRoleBtn" class="btn btn-warning btn-flat" style="display: none;">&nbsp;&nbsp; Activate &nbsp;&nbsp;</a>
                           <a id="DeActivateRoleBtn" class="btn btn-danger btn-flat" style="display: none;">&nbsp;&nbsp; Deactivate &nbsp;&nbsp;</a>
                           <a id="SaveRightsBtn" class="btn btn-primary btn-flat">&nbsp;&nbsp; Save &nbsp;&nbsp;</a>
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
   <script src="../Content/js/Roles.js"></script>
</asp:Content>
