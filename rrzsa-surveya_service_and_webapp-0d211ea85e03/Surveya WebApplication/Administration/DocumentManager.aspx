<%@ Page Title="Surveya | Document Manager" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="DocumentManager.aspx.cs" Inherits="Surveya_Application.Administration.DocumentManager" EnableEventValidation="false" %>

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
            <li class="active"><i class="fa fa-folder-open"></i> Document Manager</li>
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
                  <span class="box-title">Browse folders</span>
                  <div class="box-tools pull-right">
                     <asp:UpdatePanel ID="ErrorUpdatePanel" Visible="true" runat="server">
                        <ContentTemplate>
                           <asp:Label runat="server" Text="No error" Visible="true" ID="errorLabel" CssClass="pull-right text-yellow"></asp:Label>
                           <asp:HiddenField ID="docFolder" runat="server" />
                        </ContentTemplate>
                     </asp:UpdatePanel>
                  </div>
               </div>
               <div class="box-body">
                  <div id="treeView" class="col-xs-12 col-sm-6 col-md-4 col-lg-3" style="overflow-y:scroll; max-height:70vh;">
                     <div class="col-xs-12">
                        <!-- maybe a search box here -->
                     </div>

                     <asp:UpdatePanel ID="TreePanel" runat="server">
                        <ContentTemplate>
                           <asp:TreeView ID="FolderTreeView" runat="server" NodeIndent="10" ShowLines="True" OnSelectedNodeChanged="FolderTreeView_SelectedNodeChanged">
                              <NodeStyle Font-Names="Verdana" Font-Size="8pt" ForeColor="Black" HorizontalPadding="0px" NodeSpacing="0px" VerticalPadding="0px" />
                              <ParentNodeStyle Font-Bold="False" />
                              <SelectedNodeStyle Font-Underline="True" ForeColor="#DD5555" HorizontalPadding="0px" VerticalPadding="0px" />
                           </asp:TreeView>
                        </ContentTemplate>
                     </asp:UpdatePanel>
                  </div>
                  <div id="gridView" class="col-xs-12 col-sm-6 col-md-8 col-lg-9" style="overflow-y:auto; max-height:70vh;">
                     <asp:UpdatePanel ID="ListPanel" runat="server">
                        <Triggers>
                           <asp:PostBackTrigger ControlID="downloadSelectedFileBtn" />
                           <%--<asp:AsyncPostBackTrigger  ControlID="downloadSelectedFileBtn" />--%>
                        </Triggers>
                        <ContentTemplate>
                           <div class="row">
                              <div class="col-xs-12">
                                 <asp:LinkButton runat="server" ID="rootFolderBtn" CssClass="btn btn-info btn-flat" title="Select Project Folder" Text="<i class='fa fa-home'></i><span class='hidden-xs'> Project Folder</span>" OnClick="rootFolderBtn_Click" />
                                 <asp:LinkButton runat="server" ID="refreshFolderBtn" CssClass="btn btn-info btn-flat" title="Refresh List" Text="<i class='fa fa-refresh'></i><span class='hidden-xs'> Reload</span>" OnClick="refreshFolderBtn_Click" />
                                 <asp:LinkButton runat="server" ID="downloadSelectedFileBtn" CssClass="btn btn-info btn-flat" title="Download Selected File" Text="<i class='fa fa-download'></i><span class='hidden-xs'> Download</span>" OnClick="downloadSelectedFileBtn_Click" />
                                 <asp:LinkButton runat="server" ID="uploadSelectedFileBtn" CssClass="btn btn-info btn-flat" title="Upload File" Text="<i class='fa fa-upload'></i><span class='hidden-xs'> Upload</span>" OnClick="uploadSelectedFileBtn_Click" />
                                 <asp:Hyperlink runat="server" ID="deleteSelectedFileBtn" CssClass="btn btn-info btn-flat" title="Delete Selected File" data-toggle="modal" data-target="#deleteDocumentModal" Text="<i class='fa fa-times text-red'></i><span class='hidden-xs'> Delete</span>"/>
                              </div>
                           </div>
                           <asp:GridView ID="FolderFile" runat="server" AutoGenerateColumns="False" AllowSorting="True" ShowHeaderWhenEmpty="true"
                              CellPadding="10" ForeColor="#333333" GridLines="Vertical" Width="99%" BorderWidth="1px" 
                              OnRowDataBound="OnRowDataBound" OnSelectedIndexChanged="FolderFile_SelectedIndexChanged" DataKeyNames="Value" style="margin-top:10px;">
                              <AlternatingRowStyle BackColor="#F7F6F3" ForeColor="#284775" />
                              <Columns>
                                 <asp:BoundField DataField="Name" HeaderText="Name" ReadOnly="True" SortExpression="Name" HeaderStyle-Width="60%" >
                                 <HeaderStyle Width="60%" />
                                 </asp:BoundField>
                                 <asp:BoundField DataField="SizeString" HeaderText="Size" ReadOnly="True" SortExpression="Size" HeaderStyle-Width="10%" >
                                 <HeaderStyle Width="10%" />
                                 </asp:BoundField>
                                 <asp:BoundField DataField="ModifiedDateString" HeaderText="Modified Date" ReadOnly="True" SortExpression="Date" HeaderStyle-Width="30%" >
                                 <HeaderStyle Width="30%" />
                                 </asp:BoundField>
                              </Columns>
                              <EmptyDataRowStyle HorizontalAlign="Center" />
                              <EmptyDataTemplate>
                                 This folder is empty.
                              </EmptyDataTemplate>
                              <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                              <HeaderStyle BackColor="#F2F2F2" Font-Bold="True" ForeColor="Black" BorderColor="#7F7F7F" BorderStyle="Solid" BorderWidth="1px" />
                              <PagerStyle BackColor="#284775" ForeColor="White" HorizontalAlign="Center" />
                              <RowStyle BackColor="White" ForeColor="#333333" />
                              <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
                              <SortedAscendingCellStyle BackColor="#E9E7E2" />
                              <SortedAscendingHeaderStyle BackColor="#506C8C" />
                              <SortedDescendingCellStyle BackColor="#FFFDF8" />
                              <SortedDescendingHeaderStyle BackColor="#6F8DAE" />
                           </asp:GridView>
                           <asp:LinkButton ID="lnkDummy" runat="server"></asp:LinkButton>
                        </ContentTemplate>

                     </asp:UpdatePanel>
                  </div>
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
                  <p class="text-danger">
                     <asp:Literal runat="server" ID="ErrorMessage1" />
                  </p>
                  <div class="col-xs-12">
                     <asp:UpdatePanel runat="server">
                        <ContentTemplate>
                           <h4><asp:Label runat="server" ID="deleteHead">Are you sure you want to delete this document?</asp:Label></h4>
                           <asp:Label runat="server" id="deleteSubHead">This action can not be undone.</asp:Label>
                        </ContentTemplate>
                     </asp:UpdatePanel>
                  </div>
                                    
                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="errorLbl1" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>
               </div>
            </div>

            <div class="modal-footer">
                <asp:UpdatePanel runat="server">
                        <ContentTemplate>
                            <asp:LinkButton ID="deleteFileBtn" runat="server" CssClass="btn btn-warning btn-flat" OnClick="deleteFileBtn_Click" Text="Delete" />
                        </ContentTemplate>
                     </asp:UpdatePanel>
            </div>
         </div>
      </div>
   </div>
    <script>$(document).ready(function () { $('*[title]').tooltip();});</script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
</asp:Content>