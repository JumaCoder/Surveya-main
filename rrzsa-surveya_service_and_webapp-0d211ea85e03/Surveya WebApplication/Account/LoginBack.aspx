<%@ Page Title="Log in" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="LoginBack.aspx.cs" Inherits="Surveya_Application.Account.LoginBack" Async="true" %>


<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <h2><%: Title %>.</h2>

    <div class="row">
        <div class="column large-12 small-12">
            <section id="loginForm">
                <div class="form-horizontal">
                    <h4>Use a local account to log in.</h4>
                    <hr />
                    <asp:PlaceHolder runat="server" ID="ErrorMessage" Visible="false">
                        <p>
                            <label class="error">
                                <asp:Literal runat="server" ID="FailureText" />
                            </label>
                        </p>
                    </asp:PlaceHolder>
                    <div class="row">
                        <div class="columns large-12 small-12">
                            <label>
                                Username
                                <asp:TextBox runat="server" ID="UserName" CssClass="error" />
                            </label>
                            <small>
                                <asp:RequiredFieldValidator runat="server" CssClass="error" ControlToValidate="UserName"
                                    ErrorMessage="The user name field is required." />

                            </small>
                        </div>
                    </div>
                    <div class="row">
                        <div class="columns large-12 small-12">
                            <label>
                                Password
                        
                            <asp:TextBox runat="server" ID="Password" TextMode="Password" CssClass="error" />
                            </label>
                            <small>
                                <asp:RequiredFieldValidator runat="server" ControlToValidate="Password" CssClass="error" ErrorMessage="The password field is required." />
                            </small>
                        </div>
                    </div>
                   <%-- <div class="form-group">
                        <div class="col-md-offset-2 col-md-10">
                            <div class="checkbox">
                                <asp:CheckBox runat="server" ID="RememberMe" />
                                <asp:Label runat="server" AssociatedControlID="RememberMe">Remember me?</asp:Label>
                            </div>
                        </div>
                    </div>--%>
                    <div class="form-group">
                        <div class="col-md-offset-2 col-md-10">
                            <asp:Button runat="server" OnClick="LogIn" Text="Log in" CssClass="button" />
                        </div>
                    </div>
                </div>
                <p>
                    <asp:HyperLink runat="server" ID="RegisterHyperLink" ViewStateMode="Disabled">Register</asp:HyperLink>
                    if you don't have a local account.
                </p>
            </section>
        </div>


    </div>
</asp:Content>
