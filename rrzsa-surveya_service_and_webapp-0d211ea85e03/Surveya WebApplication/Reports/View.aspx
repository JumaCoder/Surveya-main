<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="View.aspx.cs" Inherits="Surveya_Application.Reports.View" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=12.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div style="height: 100%; width: 725px; margin:auto;">
       <asp:Panel ID="menuPanel" runat="server">
            Errors
            <hr />
            <asp:BulletedList ID="BulletedErrorList" runat="server"></asp:BulletedList>
        </asp:Panel>
       <asp:Panel runat="server" ID="reportPanel">
         <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
         <rsweb:ReportViewer ID="thisReportViewer" runat="server"></rsweb:ReportViewer>
       </asp:Panel>
    </div>
    </form>
</body>
</html>
