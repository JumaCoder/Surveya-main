<%@ Page Title="Register for an Account" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="RegisterBack.aspx.cs" Inherits="Surveya_Application.Account.RegisterBack" %>

<asp:Content runat="server" ID="Content1" ContentPlaceHolderID="MainContent">
   <style type="text/css">
      body {
      
         background-size: cover !important;
      }
   </style>
   <div class="register-wizard-box">
      <div class="nav-tabs-custom">
         <ul class="nav nav-tabs pull-right">
            <li class="disabled"><a id="summaryTab" href="#tab_Summary" data-toggle="tab" class="disabled">Summary</a></li>
            <li class="disabled"><a id="companyTab" href="#tab_Company" data-toggle="tab" class="disabled">Company</a></li>
            <li class="disabled"><a id="userTab" href="#tab_User" data-toggle="tab" class="disabled">User</a></li>
            <li class="disabled active"><a id="packageTab" href="#tab_Package" data-toggle="tab" class="disabled">Package</a></li>
            <li class="pull-left header">
               <span id="currTabHeader">Select a package</span>
            </li>
         </ul>
         <div class="tab-content">
            <div class="tab-pane active" id="tab_Package">
               <div class="row">
                  <div id="packageList" class="col-xs-12">
                     <div class="col-xs-12"><br /><br /><br /></div>
                     <div class="emptyListHolder">
                        <span class="icon"><i class="fa fa-list-alt"></i></span>
                        <span class="header">No active packages</span>
                        <span class="subheader">Please contact us to get a quote</span>
                     </div>
                     <div class="col-xs-12"><br /><br /><br /></div>
                  </div>
               </div>
            </div>
            <!-- /.tab-pane -->
            <div class="tab-pane" id="tab_User">
               <div class="row">
                  <div class="col-xs-12">
                     <p class="text-danger">
                        <asp:Literal runat="server" ID="Literal1" />
                     </p>

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

                     <div class="row">
                        <div class="col-xs-12 col-md-6">
                           <div class="form-group has-feedback">
                              <label for="userPass">Password</label>
                              <input type="password" id="userPass" required="required" placeholder="Password" class="form-control">
                              <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-6">
                           <div class="form-group has-feedback">
                              <label for="userPassConfirm">Confirm password</label>
                              <input type="password" id="userPassConfirm" required="required" placeholder="Confirm Password" class="form-control">
                              <span class="glyphicon glyphicon-lock form-control-feedback"></span>
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

                     <div class="row">
                        <div class="col-xs-4 pull-left">
                           <a id="backToPackageTab" class="btn btn-md btn-block btn-flat btn-info">Previous</a>
                        </div>
                        <div class="col-xs-4 pull-right">
                           <a id="validateUser" class="btn btn-md btn-block btn-flat btn-success">Continue</a>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <!-- /.tab-pane -->
            <div class="tab-pane" id="tab_Company">
               <div class="row">
                  <div class="col-xs-12">
                     <p class="text-danger">
                        <asp:Literal runat="server" ID="Literal2" />
                     </p>

                     <div id="compLogoDiv" class="form-group" style="display:none;">
                        <label for="compImg">Company Logo</label><br />
                        <img src="../Content/Images/placeholder.gif" id="compImg" alt="Company Logo" height='100'>
                        <br />
                        <div class="col-xs-12">
                           <input type="file" id="compLogoFile" accept="image/png,image/jpg,image/jpeg,image/jif,image/jfif,image/tif,image/tiff,image/jp2,image/jpx,image/j2k,image/j2c"
                              onchange="fileChange(this)" />
                        </div>
                     </div>

                     <div class="form-group">
                        <label>Company Type</label>
                        <div class="form-inline">
                           <div class="checkbox">
                              <label>
                                 <input id="forComp" class="forSoleComp" value="Company" type="radio" name="companyType" checked="checked">
                                 Company
                              </label>
                           </div>
                           <div class="checkbox">
                              <label>
                                 <input id="forSole" class="forSoleComp" value="SoleProprietor" type="radio" name="companyType">
                                 Sole Proprietor
                              </label>
                           </div>
                        </div>
                     </div>

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

                     <div class="row">
                        <div class="col-xs-4 pull-left">
                           <a id="backToUserTab" class="btn btn-md btn-block btn-flat btn-info">Previous</a>
                        </div>
                        <div class="col-xs-4 pull-right">
                           <a id="validateCompany" class="btn btn-md btn-block btn-flat btn-success">Continue</a>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <!-- /.tab-pane -->
            <div class="tab-pane" id="tab_Summary">
               <section class="">
                  <!-- title row    invoice  -->
                  <div class="row">
                     <div class="col-xs-12">
                        <h2 class="page-header">
                           <i id="compHeader"></i>
                           &nbsp;
                           <i><small>by <i id="userHeader"></i></small></i>
                        </h2>
                     </div>
                     <!-- /.col -->
                  </div>
                  <!-- info row -->
                  <div class="row invoice-info">
                     <div class="col-sm-6 invoice-col">
                        Main user details
       
                        <div id="mainUserDiv">
                        </div>
                     </div>
                     <!-- /.col -->
                     <div class="col-sm-6 invoice-col">
                        Company details
       
                        <div id="companyDiv">
                        </div>
                     </div>
                     <!-- /.col -->
                  </div>
                  <!-- Package head -->
                  <div class="row">
                     <div class="col-xs-12">
                        <h2 class="page-header">
                           <i id="packageHeader">Product(s)</i>
                        </h2>
                     </div>
                     <!-- /.col -->
                  </div>
                  <!-- /.row -->
                  <div class="row"><div class="col-xs-12"><br /></div></div>
                  <!-- Table row -->
                  <div class="row">
                     <div class="col-xs-12 table-responsive">
                        <table class="table table-striped">
                           <thead>
                              <tr>
                                 <th>Product</th>
                                 <th>Description</th>
                                 <th>Qty</th>
                                 <th>Subtotal</th>
                              </tr>
                           </thead>
                           <tbody id="productTB">
                           </tbody>
                        </table>
                     </div>
                     <!-- /.col -->
                  </div>
                  <!-- /.row -->

                  <div class="row">
                     <!-- accepted payments column -->
                     <div class="col-xs-12 col-md-6">
                        <p class="lead">Payment Methods:</p>
                        <p class="bg-info" style="margin-top: 10px;">
                        By completing this process you will be provisioned...
                        The action or process of paying someone or something or of being paid.
                        The way that a buyer chooses to compensate the seller of a good or 
                        service that is also acceptable to the seller. Typical payment methods 
                        used in a modern business context include cash, checks, credit or debit 
                        cards, money orders, bank transfers and online payment services
                        </p>
                     </div>
                     <!-- /.col -->
                     <div class="col-xs-12 col-md-6">
                        <p class="lead">&nbsp;</p>

                        <div class="table-responsive">
                           <table class="table">
                              <tr>
                                 <th style="width: 50%">Subtotal:</th>
                                 <td id="prodSubtotal"></td>
                              </tr>
                              <tr>
                                 <th>VAT (15%)</th>
                                 <td id="prodVAT"></td>
                              </tr>
                              <tr>
                                 <th>Total:</th>
                                 <td id="prodTotal"></td>
                              </tr>
                           </table>
                        </div>
                     </div>
                     <!-- /.col -->
                  </div>
                  <!-- /.row -->
                  

                  <div class="row">
                     <div class="col-xs-4 pull-left">
                        <a id="backCompanyTab" class="btn btn-md btn-block btn-flat btn-info">Previous</a>
                     </div>
                     <div class="col-xs-4 pull-right">
                        <a id="CompleteSignUp" class="btn btn-md btn-block btn-flat btn-success">Complete Registration</a>
                     </div>
                  </div>
               </section>
            </div>
         </div>
         <!-- /.tab-content -->
      </div>
   </div>
   <!-- /.login-box -->

</asp:Content>
<asp:Content ID="customScript" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script type="text/javascript" charset="utf-8" src="../Content/js/register.js"></script>
   <script>
       changebackground();

      $(function () {
         GetAllFeatures();
      });
   </script>
</asp:Content>
