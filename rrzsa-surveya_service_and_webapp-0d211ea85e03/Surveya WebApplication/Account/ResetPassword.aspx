<%@ Page Title="Surveya | Reset Password" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ResetPassword.aspx.cs" Inherits="Surveya_Application.Account.ResetPassword" Async="true" %>


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
         
         <div class="form-group has-feedback">
            <label for="resetPassword">New password</label>
            <input type="password" id="newPassword" placeholder="new password" class="form-control" />
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
         </div>
         <div class="form-group has-feedback">
            <label for="confirmPassword">Confirm password</label>
            <input type="password" id="confirmPassword" placeholder="confirm password" class="form-control" />
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
         </div>
         <div class="row">
            <div class="col-xs-6 pull-right">
               <a id="confirmResetBtn" class="btn btn-primary btn-block btn-flat">Reset Password</a>
            </div>
            <!-- /.col -->
         </div>
         <a href="Login" class="text-center">Login</a>

         <div class="row">
            <div class="col-xs-12">
               <asp:Label ID="errorLbl" runat="server" CssClass="text-red" Visible="false" />
            </div>
         </div>

      </div>
      <!-- /.login-box-body -->
   </div>
   <!-- /.login-box -->

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
      checkParam();
   </script>
</asp:Content>
