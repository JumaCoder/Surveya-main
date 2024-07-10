<%@ Page Title="Surveya | Coupon" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="ViewCoupon.aspx.cs" Inherits="Surveya_Application.Administration.ViewCoupon" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
    <link href="../Content/css/coupon.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><a href="../Administration/"><i class="fa icon-dashboard"></i> Home</a></li>
            <li class="active"><i class="fa icon-company"></i> Coupon</li>
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
                  <h3 class="box-title">Coupon Details</h3>
                  <div class="box-tools pull-right">
                     <span id="couponCountSpan"></span>
                     <a id="GenerateCouponBtn" class="btn btn-success btn-flat" title="Generate Coupon Code">
                        New Coupon
                     </a>
                     <button id="refreshTbl" type="button" class="btn btn-info" title="Refresh">
                        <i class="fa fa-refresh"></i>
                     </button>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body">
                  <p class="text-danger">
                     <asp:Literal runat="server" ID="ErrorMessage" />
                  </p>

                  <div class="row couponContainer">
                     <%--<div class="col-xs-12 col-md-6">
                        <div class="form-group">
                            <h4>Last <span id="itemCount"></span> Coupons</h4>
                            <table id="tblItems" class="table table-bordered table-striped compact">
                           <thead>
                              <tr>
                                 <th width="20%">Code</th>
                                 <th width="20%">Date Created</th>
                              </tr>
                           </thead>
                           <tbody id="couponTBody"></tbody>
                        </table>
                        </div>
                     </div>--%>
                     <div class="col-xs-12 col-md-10 col-lg-8 col-md-push-1 col-lg-push-2 couponOverlay">
                         <img class="watermark" src="../Content/Images/coupon/Re-imagine_mark.png" />
                         <div id="couponCard" style=" text-align:center" class="form-group"><!-- display:none; -->
                            <h4>Thank you for having your say in the RE-IMAGINE YOUR WORKPLACE ONLINE SURVEY.</h4>
                            <p>COUPON CODE: <strong id="codeHolder">XXXXXX</strong></p> 
                            <p>To collect your gift, please present to staff at the following collection points: </p> 
                            <p>
                                <small>
                                    <strong>JHB campus:</strong> Please bring your coupon to our Surveya Research Team in the Colonnades from the 26 th  August 2019 during lunch time.<br />
                                    <strong>De Beers Group:</strong> Please bring your coupon to Lynn Berowsky from the 26th August 2019.<br />
                                    <strong>Kumba Iron Ore:</strong> Please contact Neshania Naidoo or Tumi Morobe to collect your gift from 26 August 2019
                                </small>
                            </p>
                            <div class="col-xs-6 small-logo left-logo">
                                <img src="../Content/Images/Surveyor_thumb.png" alt="Surveya" />
                            </div>
                            <div class="col-xs-6 small-logo right-logo">
                                <img src="../Content/Images/coupon/Building_Blocks.png" alt="Building Blocks" />
                            </div>
                        </div>
                     </div>
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
   <script src="../Content/js/Coupon.js"></script>
   <script>
       // $(function () { GetMyCoupons(); })
   </script>
</asp:Content>
