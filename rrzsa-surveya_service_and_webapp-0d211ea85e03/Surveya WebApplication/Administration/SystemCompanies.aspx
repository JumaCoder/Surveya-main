<%@ Page Title="Surveya | System Companies" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="SystemCompanies.aspx.cs" Inherits="Surveya_Application.Administration.SystemCompanies" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><a href="../Administration/"><i class="fa icon-dashboard"></i> Home</a></li>
            <li class="active"><i class="fa icon-company"></i> System Companies</li>
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
                  <h3 class="box-title">System Companies Admin</h3>
                  <div class="box-tools pull-right">
                     <button id="refreshCompanies" type="button" class="btn btn-info" title="Refresh">
                        <i class="fa fa-refresh"></i>
                     </button>
                     <a href="NewSignups" class="btn btn-default btn-flat" title="New Signups">
                        <i class="fa icon-users"></i>
                     </a>
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
                  <table id="tblItems" class="table table-bordered table-striped compact">
                     <thead>
                        <tr>
                           <th width="30%">Company</th>
                           <th width="30%">Main User</th>
                           <th width="30%">Registration #</th>
                           <th width="5%">Active</th>
                           <th width="5%"></th>
                        </tr>
                     </thead>
                     <tbody id="companyTBody"></tbody>
                     <tfoot>
                        <tr>
                           <th width="30%">Company</th>
                           <th width="30%">Main User</th>
                           <th width="30%">Registration #</th>
                           <th width="5%">Active</th>
                           <th width="5%"></th>
                        </tr>
                     </tfoot>
                  </table>
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
   
   <div class="modal fade" id="addEditCompanyModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="editCompanyModalHead" class="modal-title">View Company</h4>
            </div>
            
            <div class="modal-body row">
               <div class="col-xs-12">
                  
                  <%--<div class="form-group">
                     <label>Select this company</label>
                     <div class="pull-right">
                        <a id="selectComp" class="btn btn-info btn-flat btn-sm">Select</a>
                     </div>
                  </div>--%>
                  <p class="text-danger">
                     <asp:Literal runat="server" ID="ErrorMessage" />
                  </p>
                  
                  <div id="compLogoDiv" class="form-group">
                     <div class="pull-right">
                        <input type="file" id="compLogoFile" accept="image/png,image/jpg,image/jpeg,image/jif,image/jfif,image/tif,image/tiff,image/jp2,image/jpx,image/j2k,image/j2c"
                                      onchange="fileChange(this)" />
                     </div>

                     <label for="compImg">Company Logo</label><br />
                     <img src="../Content/Images/placeholder.gif" id="compImg" alt="Company Logo"  height='100'>
                  </div>
                  
                  <div class="form-group">
                     <label for="compName">Company Name</label>
                     <input type="text" id="compName" placeholder="Company Name" class="form-control">
                  </div>

                  <div class="form-group">
                     <label for="registrationNumber">Registration Number</label>
                     <input type="text" id="registrationNumber" placeholder="Registration Number" class="form-control">
                  </div>

                  <div class="form-group">
                     <label for="vatNumber">VAT Number</label>
                     <input type="text" id="vatNumber" placeholder="VAT Number" class="form-control">
                  </div>

                  <div class="form-group">
                     <label for="physicalAddress">Physical address</label>
                     <textarea id="physicalAddress" rows="5" placeholder="Physical address" class="form-control"></textarea>
                  </div>

                  <div class="form-group has-feedback">
                     <label for="packageDDL">Package</label>
                     <select id="packageDDL" class="form-control"></select>
                  </div>

                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="errorLbl" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer">
               <a id="addEditCompanyBtn" class="btn btn-success btn-flat">Save</a>
            </div>
         </div>
         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>
   <!-- /.modal -->
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/SystemCompany.js"></script>
   <script>
      $(function () {
         GetAllCompanies();
      })
   </script>
</asp:Content>
