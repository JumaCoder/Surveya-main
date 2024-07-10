<%@ Page Title="Surveya | Document Uploader" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="DocumentUploader.aspx.cs" Inherits="Surveya_Application.Administration.DocumentUploader" EnableEventValidation="false" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
   <style type="text/css">
      tr{
            cursor: pointer;
      }
      tr:hover{
         color: #72afd2;
      }
   </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><a href="../Administration"><i class="fa icon-dashboard"></i> Home</a></li>
            <li class="active"><i class="fa fa-folder-open"></i> Document Uploader</li>
         </ol>
      </div>
   </section>

   <!-- Main content -->
   <section class="content">
      <!-- Main row -->
      <div class="row">
         <div class="col-xs-12">
            <div class="box box-solid">
               <div class="box-header with-border">
                  <span class="box-title">Upload Document</span>&nbsp;&nbsp;<strong>OR</strong>&nbsp;&nbsp;<asp:HyperLink ID="backLink" runat="server"></asp:HyperLink>
               </div>
               <div class="box-body">
                  <asp:Panel runat="server" ID="errorDiv">
                     <div class="col-xs-12">
                        <asp:Label ID="errorText" runat="server" CssClass="text-red" Visible="false"></asp:Label>
                     </div>
                  </asp:Panel>
                  <div class="col-xs-12">
                     
                     <div class="form-group">
                        <asp:Label runat="server" AssociatedControlID="docFolder" Text="Folder to upload document to: "></asp:Label>
                        <strong><asp:Label runat="server" ID="docFolder"></asp:Label></strong>
                        <asp:HiddenField runat="server" ID="fullPath" />
                        <asp:HiddenField runat="server" ID="userID" />
                     </div>

                     <div class="form-group">
                        <asp:Label runat="server" AssociatedControlID="docName" Text="Document name"></asp:Label>
                        <small>required</small>
                        <asp:TextBox runat="server" ID="docName" placeholder="Document name" CssClass="form-control"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="docNameReqVal" CssClass="text-red" ControlToValidate="docName" runat="server" ErrorMessage="Document name is required"></asp:RequiredFieldValidator>
                     </div>

                     <div class="form-group">
                        <asp:Label runat="server" AssociatedControlID="fileUploader" Text="Select Document"></asp:Label>
                        <small>required</small>
                        <asp:FileUpload ID="fileUploader" runat="server" CssClass="form-control" />
                     </div>

                     <div class="form-group">
                        <asp:Label runat="server" AssociatedControlID="docTypeNum" Text="Document Type"></asp:Label>
                        <asp:DropDownList runat="server" ID="docTypeNum" CssClass="form-control">
                           <asp:ListItem Value="0" Selected="True">Other</asp:ListItem>
                           <asp:ListItem Value="1">Passport</asp:ListItem>
                           <asp:ListItem Value="2">Visa</asp:ListItem>
                           <asp:ListItem Value="3">Vaccination Certificates</asp:ListItem>
                           <asp:ListItem Value="4">Customs Clearance Certificates</asp:ListItem>
                           <asp:ListItem Value="5">ETickets</asp:ListItem>
                           <asp:ListItem Value="6">Accommodation Confirmation</asp:ListItem>
                           <asp:ListItem Value="7">Drivers License</asp:ListItem>
                        </asp:DropDownList>
                     </div>

                     <div class="form-group">
                        <asp:Label runat="server" AssociatedControlID="docTypeDesc" Text="Document Description"></asp:Label>
                        <asp:TextBox runat="server" ID="docTypeDesc" placeholder="Document Description" TextMode="MultiLine" Rows="4" CssClass="form-control"></asp:TextBox>
                     </div>

                     <div class="form-group">
                        <asp:Label runat="server" AssociatedControlID="docExpiryDate" Text="Expiry Date"></asp:Label>
                        <asp:TextBox runat="server" ID="docExpiryDate" TextMode="Date" placeholder="Expiry Date" CssClass="form-control"></asp:TextBox>
                     </div>

                     <div class="form-group">
                        <asp:CheckBox runat="server" ID="docIsProjectSpecific" Text="&nbsp;Is Project Specific" />
                     </div>

                     <div class="form-group">
                        <asp:Label runat="server" AssociatedControlID="companyProjects" Text="Company Projects"></asp:Label>
                        <asp:DropDownList runat="server" ID="companyProjects" CssClass="form-control"></asp:DropDownList>
                     </div>


                     <div class="row">
                        <div class="col-xs-12">
                           <asp:Label ID="uploadErrorLbl" runat="server" CssClass="text-red" Visible="false" />
                        </div>
                     </div>
                  </div>
               </div>

               <div class="box-footer">
                  <asp:Button runat="server" Visible="false" ID="uploadProjSurBtn" CssClass="btn btn-success btn-flat pull-right" Text="Save" OnClick="uploadProjSurBtn_Click" />
                  <asp:Button runat="server" Visible="false" ID="uploadUserBtn" CssClass="btn btn-success btn-flat pull-right" Text="Save" OnClick="uploadUserBtn_Click" />
               </div>
            </div>
         </div>
      </div>
   </section>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
</asp:Content>