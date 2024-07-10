<%@ Page Title="Surveya | Verify Email" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="VerifyEmail.aspx.cs" Inherits="Surveya_Application.VerifyEmail" Async="true" %>


<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <style type="text/css">
        body{

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
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
            &nbsp;
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
            &nbsp;
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
            &nbsp;
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
            <h3>Verifying your email address...</h3>
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
            &nbsp;
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
            &nbsp;
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
            &nbsp;
         </div>
     </div>

  </div>
  <!-- /.login-box-body -->
</div>
<!-- /.login-box -->

</asp:Content>
<asp:Content runat="server" ID="ScriptContent" ContentPlaceHolderID="CustomScriptHolder">
   <script>

       changebackground();
       
    $(function () {
        VerifyEmailAddress();
    });
   </script>
</asp:Content>