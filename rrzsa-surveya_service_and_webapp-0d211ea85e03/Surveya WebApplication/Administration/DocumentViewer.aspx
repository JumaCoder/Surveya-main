<%@ Page Title="Surveya | Document Viewer" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="DocumentViewer.aspx.cs" Inherits="Surveya_Application.Administration.DocumentViewer" EnableEventValidation="false" %>

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
            <li class="active"><i class="fa fa-folder-open"></i> Document Viewer</li>
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
                  <span class="box-title">View Document</span><asp:Label runat="server" ID="orLbl">&nbsp;&nbsp;<strong>OR</strong></asp:Label>&nbsp;&nbsp;<asp:HyperLink ID="backLink" runat="server"></asp:HyperLink>
                   <div class="box-tools pull-right">
                     <asp:UpdatePanel ID="ErrorUpdatePanel" Visible="true" runat="server">
                        <ContentTemplate>
                           <asp:Label runat="server" Text="No error" Visible="false" ID="errorLabel2" CssClass="pull-right text-yellow"></asp:Label>
                        </ContentTemplate>
                     </asp:UpdatePanel>
                  </div>
               </div>
               <div class="box-body">
                  <asp:Panel runat="server" ID="errorDiv">
                     <div class="col-xs-12">
                        <asp:Label runat="server" ID="errorText" CssClass="text-red"></asp:Label>
                     </div>
                  </asp:Panel>
                  <div class="col-xs-12">
                     <asp:UpdatePanel runat="server">

                     </asp:UpdatePanel>
                     <div class="form-group">
                        <asp:Label runat="server" AssociatedControlID="docFolder" Text="Folder to upload document to: "></asp:Label>
                        <strong><asp:Label runat="server" ID="docFolder"></asp:Label></strong>
                        <asp:HiddenField runat="server" ID="fullPath" />
                        <asp:HiddenField runat="server" ID="userID" />
                     </div>

                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-8">

                     <div class="form-group">
                        <asp:Label runat="server" AssociatedControlID="docName" Text="Document name"></asp:Label>
                        <small>required</small>
                        <asp:TextBox runat="server" ID="docName" placeholder="Document name" CssClass="form-control"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="docNameReqVal" CssClass="text-red" ControlToValidate="docName" runat="server" ErrorMessage="Document name is required"></asp:RequiredFieldValidator>
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

                  </div>
                   <asp:UpdatePanel ID="DocImageUpdatePanel" Visible="true" runat="server">
                       <ContentTemplate>
                           <div class="col-xs-12 col-sm-6 col-md-4 image-with-controls text-center">
                               <label>Download document</label>
                               <asp:Image runat="server" ID="docTypeImage" ImageUrl="~/Content/Images/filetypes/file.png" CssClass="img-responsive logo-xl no-border" />
                               <div class="input-group logo-xl">
                                   <asp:LinkButton runat="server" ID="downloadDocument" CssClass="btn btn-default" Text="<i class='fa fa-download'></i><span class='hidde-xs'> Download</span>" OnClick="downloadDocument_Click"></asp:LinkButton>
                               </div>
                           </div>
                       </ContentTemplate>
                       <Triggers>
                           <asp:PostBackTrigger ControlID="downloadDocument" />
                       </Triggers>
                   </asp:UpdatePanel>
                  <div class="col-xs-12">

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

               <div class="box-footer text-right">
                  <asp:Button runat="server" ID="updateDocDetailsBtn" CssClass="btn btn-success btn-flat" Text="Update" OnClick="updateDocDetailsBtn_Click" />
                  <a class="btn btn-danger btn-flat" data-toggle="modal" data-target="#deleteDocumentModal">Delete</a>
               </div>
            </div>
         </div>
      </div>
   </section>
   
   <div class="modal fade" id="deleteDocumentModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h3 id="deleteDocumentModalHead" class="modal-title">Delete Document</h3>
            </div>
            
            <div class="modal-body row">
               <div class="col-xs-12">

                  <div class="row">
                     <div class="col-xs-12">
                        <h4>Are you sure you want to delete this document?</h4>
                        <p>This action can not be undone.</p>
                     </div>
                  </div>

               </div>
            </div>

            <div class="modal-footer text-right">
               <asp:Button runat="server" ID="deleteDocDetailsBtn" Text="Delete" class="btn btn-danger btn-flat pull-right" OnClick="deleteDocDetailsBtn_Click"></asp:Button>
            </div>
         </div>
      </div>
   </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
</asp:Content>