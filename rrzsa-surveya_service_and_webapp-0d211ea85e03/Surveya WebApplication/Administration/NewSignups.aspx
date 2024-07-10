<%@ Page Title="Surveya | New Signups" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="NewSignups.aspx.cs" Inherits="Surveya_Application.Administration.NewSignups" %>
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
            <li class="active"><i class="fa icon-users"></i> System Companies</li>
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
                  <h3 class="box-title">New Signups</h3>
                  <div class="box-tools pull-right">
                     <button id="refreshSignups" type="button" class="btn btn-info" title="Refresh">
                        <i class="fa fa-refresh"></i>
                     </button>
                     <a href="SystemCompanies" class="btn btn-default btn-flat" title="System Companies">
                        <i class="fa icon-company"></i>
                     </a>
                  </div>
                  <div class="row">
                     <div class="col-xs-12 col-sm-6">
                        <div class="switch">
                           <!--<input id="showUnpaid" name="SignupFilters" type="radio" value="Unpaid" checked>
                           <label for="showUnpaid"> Unpaid</label>-->

                           <input id="showLast100" name="SignupFilters" type="radio" value="Last100" checked>
                           <label for="showLast100"> Last 100</label>

                           <input id="showAll" name="SignupFilters" type="radio" value="All">
                           <label for="showAll"> All</label>
                        </div>
                     </div>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body">
                  <table id="tblItems" class="table table-bordered table-striped compact">
                     <thead>
                        <tr>
                           <th width="25%">Company</th>
                           <th width="15%">PackageName</th>
                           <th width="11%">PaymentType</th>
                           <th width="10%">Start</th>
                           <th width="10%">End</th>
                           <th width="12%">Amount Paid</th>
                           <th width="12%">Price</th>
                           <th width="5%"></th>
                        </tr>
                     </thead>
                     <tbody id="companyTBody"></tbody>
                     <tfoot>
                        <tr>
                           <th width="25%">Company</th>
                           <th width="15%">PackageName</th>
                           <th width="11%">PaymentType</th>
                           <th width="10%">Start</th>
                           <th width="10%">End</th>
                           <th width="12%">Amount Paid</th>
                           <th width="12%">Price</th>
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
                <button id="capturePackagePayment" type="button" data-from="NewSignups" class="btn btn-flat btn-success pull-right">Capture Payment</button>
             </div>
             
             <fieldset>
                <legend>Past payments</legend>
             </fieldset>
             <div class="row">
                <div id="packagePayListDiv" class="col-xs-12">
                  <table id="tblPayments" class="table table-bordered table-striped compact" data-page-length='25'>
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
   <!-- /.modal -->
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/SystemCompany.js"></script>
   <script>
       if (dataTableOptions)
       { dataTableOptions.paging = false; }
      $(function () {
          GetSystemSignups('Last100');
      })
   </script>
</asp:Content>
