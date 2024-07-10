<%@ Page Title="Surveya | System Company" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="SystemCompany.aspx.cs" Inherits="Surveya_Application.Administration.SystemCompany" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
   <link href="../Content/css/list.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><a href="../Administration/"><i class="fa icon-dashboard"></i> Home</a></li>
            <li><a href="../Administration/SystemCompanies"><i class="fa icon-company"></i> System Companies</a></li>
            <li class="active"><i class="fa fa-list-alt"></i>&nbsp;<span class="compNameTxt"></span></li>
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
                  <h3 class="box-title compNameTxt">Company</h3>
                  <span id="surveyLabels"></span>
                  <div class="box-tools pull-right">
                     <a id="ActivatePackage" class="btn btn-default btn-flat" title="Activate Package" style="display: none;">
                        <i class="fa fa-play"></i>
                     </a>
                     <a id="DeactivatePackage" class="btn btn-default btn-flat" title="Deactivate Package" style="display: none;">
                        <i class="fa fa-stop"></i>
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
                        
                        <div id="companyDetailsBox" class="panel box box-primary">
                           <div class="box-header with-border">
                              <h4 class="box-title">
                                 <a data-toggle="collapse" data-parent="#accordion" href="#companyDetails" aria-expanded="true">Company Details
                                 </a>
                              </h4>
                           </div>
                           <div id="companyDetails" class="panel-collapse collapse in" aria-expanded="true">

                              <!-- /.box-header -->
                              <div class="box-body">

                                 <div class="form-group">
                                    <label for="compName">Company Name</label>
                                    <input type="text" id="compName" placeholder="Company Name" class="form-control">
                                 </div>

                                 <div class="form-group">
                                    <label id="registrationNumberLbl" for="registrationNumber">Registration Number</label>
                                    <input type="text" id="registrationNumber" placeholder="Registration Number" class="form-control">
                                 </div>

                                 <div class="form-group has-feedback">
                                    <br />
                                    <label class="checkbox-inline no-left-padding">
                                       <input type="checkbox" id="compHasVAT">
                                       Company is VAT registered
                                    </label>
                                 </div>

                                 <div class="form-group">
                                    <label for="vatNumber">VAT Number</label>
                                    <input type="text" id="vatNumber" placeholder="VAT Number" class="form-control">
                                 </div>

                                 <div class="form-group">
                                    <label for="physicalAddress">Physical address</label>
                                    <textarea id="physicalAddress" rows="5" placeholder="Physical address" class="form-control"></textarea>
                                 </div>
                              </div>
                           </div>
                        </div>
                        
                        <div id="mainUserDetailsBox" class="panel box box-primary">
                           <div class="box-header with-border">
                              <h4 class="box-title">
                                 <a data-toggle="collapse" data-parent="#accordion" href="#mainUserDetails" aria-expanded="false">Main User Details
                                 </a>
                              </h4>
                           </div>
                           <div id="mainUserDetails" class="panel-collapse collapse" aria-expanded="false">

                              <!-- /.box-header -->
                              <div class="box-body">

                                 <div class="row">
                                    <div class="col-xs-12 col-md-6">
                                       <div class="form-group">
                                          <label for="userFirstname">First name(s)</label>
                                          <input type="text" id="userFirstname" required="required" placeholder="First Name(s)" class="form-control">
                                       </div>
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                       <div class="form-group">
                                          <label for="userLastname">Last name</label>
                                          <input type="text" id="userLastname" required="required" placeholder="Last Name" class="form-control">
                                       </div>
                                    </div>
                                 </div>

                                 <div class="row">
                                    <div class="col-xs-12 col-md-6">
                                       <div class="form-group has-feedback">
                                          <label for="userEmailAddress">Email</label>
                                          <input type="email" id="userEmailAddress" required="required" placeholder="Email" class="form-control">
                                          <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                                       </div>
                                    </div>
                                    <div class="col-xs-12 col-md-6">
                                       <div class="form-group has-feedback">
                                          <label for="userContactNumber">Contact number</label>
                                          <input type="text" id="userContactNumber" required="required" placeholder="Contact Number" class="form-control">
                                          <span class="glyphicon glyphicon-earphone form-control-feedback"></span>
                                       </div>
                                    </div>
                                 </div>

                                 <div class="form-group has-feedback">
                                    <label for="userCountry">Country</label>
                                    <select id="userCountry" class="form-control"></select>
                                 </div>

                                 <div class="form-group has-feedback">
                                    <label for="userAddress">Physical address</label>
                                    <textarea rows="5" id="userAddress" placeholder="Physical Address" class="form-control"></textarea>
                                 </div>
                              </div>
                           </div>
                        </div>
                        
                        <div id="packageDetailsBox" class="panel box box-primary">
                           <div class="box-header with-border">
                              <h4 class="box-title">
                                 <a data-toggle="collapse" data-parent="#accordion" href="#packageDetails" aria-expanded="false">Package Details
                                 </a>
                              </h4>
                              <div class="box-tools pull-right">
                                 <a id="companyPackageBtn" class="btn btn-info" title="Refresh">
                                    <i class="fa fa-refresh"></i>
                                 </a>
                              </div>
                           </div>
                           <div id="packageDetails" class="panel-collapse collapse" aria-expanded="false">
                              <div class="box-body row">
                                 <ul id="packageDiv" class="event-list">
                                    <li class="emptyListHolder">
                                       <span class="icon"><i class="fa fa-list-alt"></i></span>
                                       <span class="header">No packages</span>
                                       <span class="subheader">&nbsp;</span>
                                    </li>
                                 </ul>
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

   <div id="viewPackageModal" class="modal fade" tabindex="-1" role="dialog">
     <div class="modal-dialog" role="document">
       <div class="modal-content">
         <div class="modal-body">
           <div id="packageModalDiv" class="row"></div>
         </div>
         <div class="modal-footer">
           <button id="showPackagePayment" type="button" class="btn btn-flat btn-primary">Capture Payment</button>
         </div>
       </div><!-- /.modal-content -->
     </div><!-- /.modal-dialog -->
   </div><!-- /.modal -->

   <div id="viewPackagePaymentModal" class="modal fade" tabindex="-1" role="dialog">
     <div class="modal-dialog" role="document">
       <div class="modal-content">
          <div class="modal-header">
             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
             </button>
             <h4 id="packagePaymentsModalHead" class="modal-title">Package Payment</h4>
          </div>

          <div id="makePaymentBody" class="modal-body">
             <div class="form-group">
                <label for="paymentAmount">Amount paid</label>
                <input type="number" class="form-control" id="paymentAmount" placeholder="Amount paid">
             </div>
             <div class="form-group">
                <label for="datePaid">Date paid</label>
                <input type="date" class="form-control" id="datePaid" placeholder="Date paid">
             </div>

             <div class="form-group clearfix">
                <button id="capturePackagePayment" type="button" class="btn btn-flat btn-success pull-right">Capture Payment</button>
             </div>
             
             <fieldset>
                <legend>Past payments</legend>
             </fieldset>
             <div class="row">
                <div id="packagePayListDiv" class="col-xs-12">
                  <table id="tblPayments" class="table table-bordered table-striped compact">
                     <thead>
                        <tr>
                           <th width="50%">Date Paid</th>
                           <th width="50%">Amount Paid</th>
                        </tr>
                     </thead>
                     <tbody id="paymentsTBody"></tbody>
                     <tfoot>
                        <tr>
                           <th width="50%">Date Paid</th>
                           <th width="50%">Amount Paid</th>
                        </tr>
                     </tfoot>
                  </table>
                </div>
             </div>
          </div>
       </div><!-- /.modal-content -->
     </div><!-- /.modal-dialog -->
   </div><!-- /.modal -->

</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/SystemCompany.js"></script>
   <script>
      $(function () {
         SystemGetCompany();
         SystemGetCompanyMainUser();
         SystemGetCompanyPackages();
      });
   </script>
</asp:Content>
