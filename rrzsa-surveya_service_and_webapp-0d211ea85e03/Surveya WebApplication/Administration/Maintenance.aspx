<%@ Page Title="Surveya | Maintenance" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="Maintenance.aspx.cs" Inherits="Surveya_Application.Administration.Maintenance" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><a href="../Administration"><i class="fa icon-dashboard"></i> Home</a></li>
            <li class="active"><i class="fa icon-maint"></i> Maintenance</li>
         </ol>
      </div>
   </section>

   <!-- Main content -->
   <section class="content">
      <!-- Main row -->
      <div class="row">
         <div id="packageDiv" class="col-md-4 col-sm-6 col-xs-12" style="display:none;">
            <a href="PackagePayment">
               <div class="info-box">
                  <span class="info-box-icon bg-aqua"><i class="fa fa-desktop"></i></span>

                  <div class="info-box-content text-aqua">
                     <span class="info-box-number">Company Package</span>
                     <span class="info-box-text">features and plan to fit your needs</span>
                  </div>
                  <!-- /.info-box-content -->
               </div>
            </a>
            <!-- /.info-box -->
         </div>

         <div class="col-md-4 col-sm-6 col-xs-12">
            <a href="ManageRoles">
               <div class="info-box">
                  <span class="info-box-icon bg-light-blue"><i class="fa icon-roles"></i></span>

                  <div class="info-box-content text-light-blue">
                     <span class="info-box-number">Roles</span>
                     <span class="info-box-text">roles & rights for the company</span>
                  </div>
                  <!-- /.info-box-content -->
               </div>
            </a>
            <!-- /.info-box -->
         </div>

         <div class="col-md-4 col-sm-6 col-xs-12">
            <a href="CompanyBranding">
               <div class="info-box">
                  <span class="info-box-icon bg-purple"><i class="fa icon-branding"></i></span>

                  <div class="info-box-content text-purple">
                     <span class="info-box-number">Branding</span>
                     <span class="info-box-text">Company logo and app skin</span>
                  </div>
                  <!-- /.info-box-content -->
               </div>
            </a>
            <!-- /.info-box -->
         </div>
      </div>
   </section>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/Package.js"></script>
   <script>
      $(function () {

         if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
            ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
            return false;
         }

         if (checkCanViewPackage()) {
            $('#packageDiv').show();
         }
         setTimeout(function () {
            if (checkCanViewPackage()) {
               $('#packageDiv').show();
            }
         }, 1000);
         
      });
   </script>
</asp:Content>