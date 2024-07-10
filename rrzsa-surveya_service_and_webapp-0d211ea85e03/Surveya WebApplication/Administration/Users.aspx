<%@ Page Title="Surveya | Users" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="Users.aspx.cs" Inherits="Surveya_Application.Administration.Users" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
   <style>
      .userStatus{
          font-size: 18px;
          font-weight: 500;
      }
   </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <div class="pull-right">
         <ol class="breadcrumb">
         <li><a href="../Administration"><i class="fa icon-dashboard"></i> Home</a></li>
         <li class="active"><i class="fa icon-users"></i> Users</li>
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
                  <h3 class="box-title"><span class="companyNameHolder"></span> Users</h3>
                  <div class="box-tools pull-right">
                     <button id="AddUser" type="button" class="btn btn-success btn-flat" title="Add User">
                        <i class="fa fa-plus"></i>
                     </button>
                     <button id="refreshTbl" type="button" class="btn btn-info" title="Refresh">
                        <i class="fa fa-refresh"></i>
                     </button>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body">
                  <div class="row">
                     <div class="col-xs-12">
                        <table id="tblItems" class="table table-bordered table-striped compact">
                           <thead>
                              <tr>
                                 <th width="20%">Name</th>
                                 <th width="20%">Role</th>
                                 <th width="20%">Email</th>
                                 <th width="20%">Cell No</th>
                                 <th width="10%">Country</th>
                                 <th></th>
                              </tr>
                           </thead>
                           <tbody id="userTBody"></tbody>
                        </table>
                     </div>
                  </div>
               </div>
               <!-- /.box-body -->
            </div>
            <!-- /.box -->
         </div>
         <!-- /.activity-list-->
         <!-- /.col -->
      </div>
      <!-- /.row -->
   </section>
   <!-- /.content -->
      
   <div class="modal fade" id="addEditUserModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="addEditUserModalHead" class="modal-title">New User</h4>
            </div>
            
            <div class="modal-body">
               <div class="row">
                  <div class="col-xs-12">
                     <p class="text-danger">
                        <asp:Literal runat="server" ID="ErrorMessage" />
                     </p>

                     <div id="emailResend" class="form-group clearfix">
                        <label>Profile incomplete? Resend welcome/profile completion email</label>
                        <a id="resendEmail" class="btn btn-sm btn-flat btn-info pull-right" title="Resend welcome/profile completion email">Resend Email</a>
                     </div>

                     <div class="form-group has-feedback">
                        <label for="userFirstname">First name(s)*</label>
                        <input type="text" id="userFirstname" placeholder="First name(s) [required]" class="form-control">
                     </div>

                     <div class="form-group has-feedback">
                        <label for="userLastname">Last name*</label>
                        <input type="text" id="userLastname" placeholder="Last name [required]" class="form-control">
                     </div>

                     <div id="userStatusDiv" class="form-group has-feedback">
                        <label for="userStatus">Status</label>&nbsp;&nbsp;<label id="userStatus" class="userStatus"></label>
                        <a id="activateUser" class="btn btn-sm btn-flat btn-info pull-right" title="Activate User">Activate User</a>
                        <a id="deactivateUser" class="btn btn-sm btn-flat btn-warning pull-right" title="Deactivate User">Deactivate User</a>
                     </div>

                     <div class="row">
                        <div class="col-xs-8 col-sm-9">
                           <div class="form-group">
                              <label for="roleDDL">Role*</label>
                              <select id="roleDDL" class="form-control"></select>
                           </div>
                        </div>
                        <div id="manageRoleDiv" class="col-xs-4 col-sm-3">
                           <div class="form-group">
                              <label for="manageRolesBtn"><span class="hidden-xs">Manage </span>Roles</label>
                              <a id="manageRolesBtn"  href="ManageRoles" class="btn btn-sm btn-flat btn-info form-control" title="Manage Roles">Manage<span class="hidden-xs"> Roles</span></a>
                           </div>
                        </div>
                     </div>

                     <div class="form-group has-feedback">
                        <label for="userEmailAddress">Email*</label>
                        <input type="email" id="userEmailAddress" placeholder="Email [required]" class="form-control">
                        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                     </div>

                     <div id="passwordDiv">
                        <div class="form-group has-feedback">
                           <label for="userPass">Password*</label>
                           <input type="password" id="userPass" placeholder="Password [required]" class="form-control">
                           <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>

                        <div class="form-group has-feedback">
                           <label for="userPassConfirm">Confirm password*</label>
                           <input type="password" id="userPassConfirm" placeholder="Confirm password [required]" class="form-control">
                           <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                     </div>

                     <div id="passwordReset" class="form-group clearfix">
                        <label>Password</label>
                        <a id="resetPassword" class="btn btn-sm btn-flat btn-warning pull-right" title="Password reset email will be sent to user email">Reset Password</a>
                     </div>

                     <div class="form-group has-feedback">
                        <label for="userContactNumber">Contact number</label>
                        <input type="text" id="userContactNumber" placeholder="Contact number" class="form-control">
                     </div>

                     <div class="form-group has-feedback">
                        <label for="userCountry">Country</label>
                        <select id="userCountry" class="form-control"></select>
                     </div>

                     <div class="form-group has-feedback">
                        <label for="userAddress">Physical address</label>
                        <textarea rows="5" id="userAddress" placeholder="Physical address" class="form-control"></textarea>
                     </div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12">
                     <div class="form-group has-feedback">
                        <fieldset>
                           <legend>Emergency contact(s)</legend>
                           <h4>Primary contact</h4>
                           <div class="row">
                              <div class="col-xs-12">
                                 <div class="form-group has-feedback">
                                    <label for="emergencyContact1Fullname">Full name</label>
                                    <input type="text" id="emergencyContact1Fullname" placeholder="Full name" class="form-control">
                                 </div>
                              </div>
                           </div>

                           <div class="row">
                              <div class="col-xs-12 col-md-6">
                                 <div class="form-group has-feedback">
                                    <label for="emergencyContact1ContactNumber">Contact number</label>
                                    <input type="text" id="emergencyContact1ContactNumber" placeholder="Contact number" class="form-control">
                                    <span class="glyphicon glyphicon-earphone form-control-feedback"></span>
                                 </div>
                              </div>
                              <div class="col-xs-12 col-md-6">
                                 <div class="form-group has-feedback">
                                    <label for="emergencyContact1Relationship">Relationship</label>
                                    <input type="text" id="emergencyContact1Relationship" placeholder="Relationship" class="form-control">
                                 </div>
                              </div>
                           </div>

                           <h4>Secondary contact</h4>
                           <div class="row">
                              <div class="col-xs-12">
                                 <div class="form-group has-feedback">
                                    <label for="emergencyContact2Fullname">Full name</label>
                                    <input type="text" id="emergencyContact2Fullname" placeholder="Full name" class="form-control">
                                 </div>
                              </div>
                           </div>

                           <div class="row">
                              <div class="col-xs-12 col-md-6">
                                 <div class="form-group has-feedback">
                                    <label for="emergencyContact2ContactNumber">Contact number</label>
                                    <input type="text" id="emergencyContact2ContactNumber" placeholder="Contact number" class="form-control">
                                    <span class="glyphicon glyphicon-earphone form-control-feedback"></span>
                                 </div>
                              </div>
                              <div class="col-xs-12 col-md-6">
                                 <div class="form-group has-feedback">
                                    <label for="emergencyContact2Relationship">Relationship</label>
                                    <input type="text" id="emergencyContact2Relationship" placeholder="Relationship" class="form-control">
                                 </div>
                              </div>
                           </div>
                        </fieldset>
                     </div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-xs-12">
                     <asp:Label ID="errorLbl" runat="server" CssClass="text-red" Visible="false" />
                  </div>
               </div>
            </div>
            <div class="modal-footer">
               <a id="AddEditUserBtn" class="btn btn-success btn-flat">Save</a>
            </div>
         </div>
         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>
   <!-- /.modal -->
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/User.js"></script>
   <script>
      $(function () {
         GetCompanyUsers();
         showSelectedUser();
      });
   </script>
</asp:Content>
