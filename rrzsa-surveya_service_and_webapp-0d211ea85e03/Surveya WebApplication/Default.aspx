<%@ Page Title="Surveya | Welcome" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Surveya_Application._Default" Async="true" %>


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
            <h3>Welcome to the Surveya Global Admin Portal.</h3>
            <small>Choose from the below to proceed</small>
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
            &nbsp;
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
           <a class="btn btn-sur-prim btn-block btn-lg btn-flat" href="Account/Login.aspx">Log in</a>
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
            &nbsp;
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center textX2">
            OR
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
            &nbsp;
         </div>
         <div class="col-xs-12 col-sm-10 col-sm-push-1 text-center">
           <a id="registerBtn" class="btn btn-sur-sec btn-block btn-lg btn-flat">Register</a>
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
   /*
    $(function () {
        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
        });
    });
   */

       changebackground();
      $(function () {
         $('#registerBtn')
            .attr('href', selectAnotherPackageURL);
      });
   </script>
</asp:Content>