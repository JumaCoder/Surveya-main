<%@ Page Title="Surveya | Company" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="ViewCompany.aspx.cs" Inherits="Surveya_Application.Administration.ViewCompany" %>
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
            <li class="active"><i class="fa icon-company"></i> Company</li>
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
                  <h3 class="box-title"><span class="companyNameHolder"></span> - Company Details</h3>
                  <div class="box-tools pull-right">
                     <span id="moreBtnSpan"></span>
                     <a href="PackagePayment" class="btn btn-success btn-flat" title="Company Package">
                        Company Package
                     </a>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body">
                  <p class="text-danger">
                     <asp:Literal runat="server" ID="ErrorMessage" />
                  </p>
                  
                  <div class="form-group">
                     <a href="CompanyBranding.aspx"><img src="../Content/Images/placeholder_thumb.png" id="compImg" alt="Company Logo"  height='150'></a>
                  </div>

                  <!--<div class="form-group">
                     <label for="compName">Company</label>
                     <input type="text" id="compName" placeholder="Company name" readonly="readonly" class="form-control">
                  </div>-->

                  <div class="row">
                     <div class="col-xs-12 col-md-6">
                        <div class="form-group">
                           <label for="compRegNum">Registration number</label>
                           <input type="text" id="compRegNum" placeholder="Registration number" readonly="readonly" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-md-6">
                        <div class="form-group">
                           <label for="compVatNumber">VAT number</label>
                           <input type="text" id="compVatNumber" placeholder="VAT number" readonly="readonly" class="form-control">
                        </div>
                     </div>
                  </div>

                  <div class="form-group">
                     <label for="compAddress">Address</label>
                     <textarea id="compAddress" rows="2" readonly="readonly" class="form-control"></textarea>
                  </div>

                  <div class="row">
                     <div class="col-xs-12 col-md-4 col-lg-3">
                        <div class="form-group">
                           <label for="compPostalCode">Postal code</label>
                           <input type="text" id="compPostalCode" placeholder="Postal code" readonly="readonly" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-md-8 col-lg-9">
                        <div class="form-group">
                           <label for="compCity">City</label>
                           <input type="text" id="compCity" placeholder="City" readonly="readonly" class="form-control">
                        </div>
                     </div>
                  </div>

                  <div class="form-group">
                     <label for="compCountry">Country</label>
                     <input type="text" id="compCountry" placeholder="Country" readonly="readonly" class="form-control">
                  </div>

                  <div class="form-group">
                     <label for="companyPackage">Current package</label>
                     <input type="text" id="companyPackage" placeholder="Current package" readonly="readonly" class="form-control">
                  </div>

                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="errorLbl" runat="server" CssClass="text-red" Visible="false" />
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


</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/Company.js"></script>
   <script>
      $(function () { GetMyCompanyDetails(); })
   </script>
</asp:Content>
