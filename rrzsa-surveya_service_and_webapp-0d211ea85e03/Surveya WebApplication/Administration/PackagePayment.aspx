<%@ Page Title="Surveya | Package - Payment & History" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="PackagePayment.aspx.cs" Inherits="Surveya_Application.Administration.PackagePayment" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
   <link href="../Content/css/list.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <!--<h3>Package Payment & History</h3>-->
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><a href="../Administration/"><i class="fa icon-dashboard"></i> Home</a></li>
            <li class="active"><i class="fa icon-company"></i> Package Payment & History</li>
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
                  <h3 class="box-title"><span class="companyNameHolder"></span> Cart</h3>
                  <div class="box-tools pull-right">
                     <a id="addCompPackageBtn" class="btn btn-success btn-flat" title="Add Package to cart">
                        <i class="fa fa-plus"></i>
                     </a>
                     <a id="clearCompCartBtn" class="btn btn-warning btn-flat" title="Clear cart">
                        <i class="fa fa-trash"></i>
                     </a>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body">
                  <div class="col-xs-12 col-sm-offset-1 col-sm-10">
                     <div id="packageDiv" class="event-list">
                        <div class="emptyListHolder">
                           <span class="icon"><i class="fa fa-list-alt"></i></span>
                           <span class="header">No packages pending </span>
                           <span class="subheader">Tap '+' to add package</span>
                        </div>
                     </div>
                  </div>
                  <!-- 
                     <li>
                           <time datetime="2014-07-20">
                              <span class="day">4</span>
                              <span class="month">Jul</span>
                              <span class="year">2014</span>
                              <span class="time">ALL DAY</span>
                           </time>
                           <div class="info">
                              <h2 class="title">Independence Day</h2>
                              <p class="desc">United States Holiday</p>
                           </div>
                        </li>

                        <li>
                           <time datetime="2014-07-20 0000">
                              <span class="day">8</span>
                              <span class="month">Jul</span>
                              <span class="year">2014</span>
                              <span class="time">12:00 AM</span>
                           </time>
                           <div class="info">
                              <h2 class="title">One Piece Unlimited World Red</h2>
                              <p class="desc">PS Vita</p>
                              <ul>
                                 <li style="width: 50%;"><a href="#website"><span class="fa fa-globe"></span>Website</a></li>
                                 <li style="width: 50%;"><span class="fa fa-money"></span>$39.99</li>
                              </ul>
                           </div>
                        </li>

                        <li>
                           <time datetime="2014-07-20 2000">
                              <span class="day">20</span>
                              <span class="month">Jan</span>
                              <span class="year">2014</span>
                              <span class="time">8:00 PM</span>
                           </time>
                           <div class="info">
                              <h2 class="title">Mouse0270's 24th Birthday!</h2>
                              <p class="desc">Bar Hopping in Erie, Pa.</p>
                              <ul>
                                 <li style="width: 33%;">1 <span class="glyphicon glyphicon-ok"></span></li>
                                 <li style="width: 34%;">3 <span class="fa fa-question"></span></li>
                                 <li style="width: 33%;">103 <span class="fa fa-envelope"></span></li>
                              </ul>
                           </div>
                        </li>

                        <li>
                           <time datetime="2014-07-31 1600">
                              <span class="day">31</span>
                              <span class="month">Jan</span>
                              <span class="year">2014</span>
                              <span class="time">4:00 PM</span>
                           </time>
                           <div class="info">
                              <h2 class="title">Disney Junior Live On Tour!</h2>
                              <p class="desc">Pirate and Princess Adventure</p>
                              <ul>
                                 <li style="width: 33%;">$49.99 <span class="fa fa-male"></span></li>
                                 <li style="width: 34%;">$29.99 <span class="fa fa-child"></span></li>
                              </ul>
                           </div>
                        </li>
                     -->
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

         <div class="col-md-12" id="unpaid-list">
            <div class="box">
               <div class="box-header">
                  <h3 class="box-title"><span class="companyNameHolder"></span> Order History</h3>
                  <div class="box-tools pull-right">
                     <button id="refreshPaidUnPaidTbls" type="button" class="btn btn-info" title="Refresh">
                        <i class="fa fa-refresh"></i>
                     </button>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body">
                  <div class="col-xs-12"><h4>Paid Packages</h4></div>
                  <div class="col-xs-12">
                     <div class="col-xs-12">
                        <table id="tblPaidPacks" class="table table-bordered table-striped compact">
                           <thead>
                              <tr>
                                 <th width="15%">Package Name</th>
                                 <th width="13%">Signed Up Date</th>
                                 <th width="12%">Payment Type</th>
                                 <th width="15%">Payment Status</th>
                                 <th width="11%">Start Date</th>
                                 <th width="11%">Expiry Date</th>
                                 <th width="13%">Price</th>
                                 <th></th>
                              </tr>
                           </thead>
                           <tbody id="paidTBody"></tbody>
                        </table>
                     </div>
                  </div><a href="ViewCompany.aspx" target="_blank"></a>
                  <div class="row"><br /></div>
                  <div class="col-xs-12"><h4>Payment Pending Packages</h4></div>
                  <div class="col-xs-12">
                     <div class="col-xs-12">
                        <table id="tblUnpaidPacks" class="table table-bordered table-striped compact">
                           <thead>
                              <tr>
                                 <th width="15%">Package Name</th>
                                 <th width="13%">Signed Up Date</th>
                                 <th width="12%">Payment Type</th>
                                 <th width="15%">Payment Status</th>
                                 <th width="11%">Start Date</th>
                                 <th width="11%">Expiry Date</th>
                                 <th width="13%">Price</th>
                                 <th></th>
                              </tr>
                           </thead>
                           <tbody id="unpaidTBody"></tbody>
                        </table>
                     </div>
                  </div>
               </div>
               <!-- /.box-body -->
            </div>
            <!-- /.box -->
         <!-- /.col -->
      </div>
      </div>
      <!-- /.row -->
   </section>
   <!-- /.content -->

   <div class="modal fade" id="checkoutPackageModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="checkoutPackageModalHead" class="modal-title">Checkout Package</h4>
            </div>

            <div class="modal-body row">
               <div class="col-xs-12">
                  <p class="text-red">
                     <span id="addSurveyUserModalError"></span>
                  </p>
                  <!-- paymentAmount -->
                  <div class="form-group">
                     <label for="startDate">Start Date</label>
                     <div class="form-group">
                        <input type="date" id="startDate" class="form-control" readonly="readonly" />
                     </div>
                  </div>

                  <div class="form-group">
                     <label for="monthsFor">Number of Months</label>
                     <div class="form-group">
                        <input type="number" id="monthsFor" class="form-control" min="1" readonly="readonly" />
                     </div>
                  </div>
                  <div class="form-group">
                     <label for="endDate">End Date</label>
                     <div class="form-group">
                        <input type="date" id="endDate" class="form-control" readonly="readonly" />
                     </div>
                  </div>

                  <div class="form-group">
                     <div class="">
                        <label for="paymentAmount">Total Amount</label>
                        <div class="input-group">
                           <span class="input-group-addon"><span class="currency"></span></span>
                           <input type="text" id="paymentAmount" placeholder="Total Amount" class="form-control" readonly="readonly" />
                        </div>
                     </div>
                  </div>

                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="Label2" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer">
               <a id="CheckoutEFT" class="btn btn-success btn-flat">Pay via EFT</a>
               <a id="CheckoutCredit" class="btn btn-success btn-flat">Pay via Credit Card</a>
            </div>
         </div>

         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>

   <div class="modal fade" id="completePackagePaymentModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="completePackagePaymentModalHead" class="modal-title">Complete Package Payment</h4>
            </div>

            <div class="modal-body row">
               <div class="col-xs-12">
                  <p class="text-red">
                     <span id="completePackagePaymentModalError"></span>
                  </p>
                  <!-- paymentAmount -->
                  <div class="form-group">
                     <label for="completeStartDate">Start Date</label>
                     <div class="form-group">
                        <input type="date" id="completeStartDate" class="form-control"/>
                     </div>
                  </div>

                  <div class="form-group">
                     <label for="completeMonthsFor">Number of Months</label>
                     <div class="form-group">
                        <input type="number" id="completeMonthsFor" class="form-control" min="1" readonly="readonly" />
                     </div>
                  </div>
                  <div class="form-group">
                     <label for="completeEndDate">End Date</label>
                     <div class="form-group">
                        <input type="date" id="completeEndDate" class="form-control" readonly="readonly" />
                     </div>
                  </div>
                  
                  <div class="form-group">
                     <div class="">
                        <label for="completePaymentAmount">Total Amount</label>
                        <div class="input-group">
                           <span class="input-group-addon"><span class="currency"></span></span>
                           <input type="text" id="completePaymentAmount" placeholder="Total Amount" class="form-control" readonly="readonly" />
                        </div>
                     </div>
                  </div>
                  <div class="form-group">
                     <div class="">
                        <label for="completeAmountAlreadyPaid">Amount Already Paid</label>
                        <div class="input-group">
                           <span class="input-group-addon"><span class="currency"></span></span>
                           <input type="text" id="completeAmountAlreadyPaid" placeholder="Amount Already Paid" class="form-control" readonly="readonly" />
                        </div>
                     </div>
                  </div>
                  <div class="form-group">
                     <div class="">
                        <label for="completePaymentAmountOutstanding">Total Amount Outstanding</label>
                        <div class="input-group">
                           <span class="input-group-addon"><span class="currency"></span></span>
                           <input type="text" id="completePaymentAmountOutstanding" placeholder="Total Amount Outstanding" class="form-control" readonly="readonly" />
                        </div>
                     </div>
                  </div>

                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="Label1" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer">
               <a id="completeCheckoutEFT" class="btn btn-success btn-flat">Invoice for EFT</a>
               <a id="completeCheckoutCredit" class="btn btn-success btn-flat">Pay via Credit Card</a>
            </div>
         </div>
         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>


   <div class="modal fade" id="addPackageModal">
      <div class="modal-dialog modal-lg">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="addPackageModalHead" class="modal-title">Add Package</h4>
            </div>

            <div class="modal-body row">
               <div class="col-xs-12">
                  <div class="col-xs-12">
                     <h6>Available Packages</h6>
                     <table id="tblItems" class="table table-bordered table-striped compact">
                        <thead>
                           <tr>
                              <th width="32%">Package Name</th>
                              <th width="20%">Package Price</th>
                              <th width="8%">Projects</th>
                              <th width="8%">Surveys</th>
                              <th width="8%">Users</th>
                              <th width="8%">Questions</th>
                              <th width="8%">Responses</th>
                              <th width="8%"></th>
                           </tr>
                        </thead>
                        <tbody id="packageTBody"></tbody>

                     </table>
                  </div>
                  <div class="col-xs-12">
                     <div id="packageList" class="col-xs-12">
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>


   <div class="modal fade" id="RemoveMyPackageModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="RemoveMyPackageModalHead" class="modal-title">Remove Package</h4>
            </div>
            

            <div class="modal-body row">
               <div class="col-xs-12">
                  <p>Are you sure you want to remove the package?</p>
               </div>
            </div>
            
            <div class="modal-footer">
               <a id="RemoveMyPackageBtn" class="btn btn-danger btn-flat">Remove Package</a>
            </div>
         </div>

         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>

   <script id="emptyListHolder" type="text/template">
      <div class="emptyListHolder">
         <span class="icon"><i class="fa fa-list-alt"></i></span>
         <span class="header">No packages pending </span>
         <span class="subheader">Tap '+' to add package</span>
      </div>
   </script>
   <script id="OptionalPackageHolder" type="text/template">
      <br />
      <div class="col-xs-12 form-group">
         <label for="numOfMonths" class="col-sm-5 control-label pull-left">Number of months</label><div class="col-sm-7">
            <input type="number" class="form-control" id="numOfMonthsPack" placeholder="Number of months" min="1" value="1">
         </div>
      </div>
      <div class="col-xs-12 form-group">
         <label for="startDate" class="col-sm-5 control-label pull-left">Start date</label><div class="col-sm-7">
            <input type="date" class="form-control" id="startDatePack" placeholder="Start date" min="[todayStr]">
         </div>
      </div>
      <div class="col-xs-12 form-group">
         <label for="purchaseOrderNumber" class="col-sm-5 control-label pull-left">Purchase Order Number</label><div class="col-sm-7">
            <input type="text" class="form-control" id="purchaseOrderNumber" placeholder="Purchase Order Number">
         </div>
      </div>
   </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/Package.js"></script>
   <script>
      $(function () { GetMyCart(); GetMyPackageHistory(); })
   </script>
</asp:Content>
