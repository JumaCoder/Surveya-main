<%@ Page Title="Surveya | Verification" Language="C#" MasterPageFile="~/SiteVerification.Master" AutoEventWireup="true" CodeBehind="Verification.aspx.cs" Inherits="Surveya_Application.Account.Verification" Async="true" %>


<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
   <style type="text/css">
      body {
    
         background-size: cover !important;
      }
   </style>
   <div class="login-box">

      <!-- /.login-logo -->
      <div class="login-box-body">
         <div class="login-logo">
            <img src="../Content/Images/Surveyor_thumb.png" />
         </div>
         <asp:PlaceHolder runat="server" ID="ErrorMessage" Visible="false">
            <p>
               <label class="text-red">
                  <asp:Literal runat="server" ID="FailureText" />
               </label>
            </p>
         </asp:PlaceHolder>
         <div class="row">
            <!-- /.col -->
            <div class="col-xs-10 col-xs-offset-1 text-center">
                <h3>Enter Verification Code</h3>
            </div>
            <!-- /.col -->
         </div>
         <div class="form-group has-feedback">
            <asp:Label runat="server" AssociatedControlID="userEmail">Verification code</asp:Label>
            <asp:TextBox runat="server" ID="userEmail" TextMode="Number" MaxLength="6" placeholder="Verification code" CssClass="form-control" />
            <span class="glyphicon glyphicon-phone form-control-feedback"></span>
            <small>
               <asp:RequiredFieldValidator runat="server" CssClass="error" ControlToValidate="userEmail"
                  ErrorMessage="The user name field is required." />
            </small>
         </div>
         <div class="row">
            <!-- /.col -->
            <div class="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2">
               <asp:Button runat="server" ID="loginBtn" Text="Verify"
                  CssClass="btn btn-sur-prim btn-block btn-flat" OnClick="LogIn" />
            </div>
            <!-- /.col -->
         </div>
          <div class="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2">
              <br />
              <a href="https://www.google.com/landing/2step/" class="text-center">About 2-Step Verification</a>
          </div>

         <div class="row">
            <div class="col-xs-12">
               <asp:Label ID="errorLbl" runat="server" CssClass="text-red" Visible="false" />
            </div>
         </div>

      </div>
      <!-- /.login-box-body -->
   </div>
   <!-- /.login-box -->
      
   <div class="modal fade" id="resetUserPasswordModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h4 id="resetUserPasswordModalHead" class="modal-title">Find your Surveya account</h4>
            </div>
            <div class="row">
               <div class="col-xs-12">
                  <label id="resetError" class="text-red" style="display:none"></label>
               </div>
            </div>
            
            <div class="modal-body">
               <div class="form-group has-feedback">
                  <label for="resetPassword">A password reset email will be sent to this email address</label>
                  <input type="email" id="resetPassword" placeholder="Email" class="form-control" />
                  <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
               </div>
            </div>

            <div class="modal-footer">
               <a id="resetUserPasswordUserBtn" class="btn btn-success btn-flat">Send</a>
            </div>
         </div>
         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>
   <!-- /.modal -->

</asp:Content>
<asp:Content runat="server" ID="ScriptContent" ContentPlaceHolderID="CustomScriptHolder">
   <script src="../Content/js/UserReset.js"></script>
   <script>

       changebackground();
      /*
       $(function () {
           $('input').iCheck({
               checkboxClass: 'icheckbox_square-blue',
               radioClass: 'iradio_square-blue',
               increaseArea: '20%' // optional
           });
       });
      */
   </script>
</asp:Content>
