<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RRZPaymentStatus.aspx.cs" Inherits="SurveyaPayment.RRZPaymentStatus" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>RRZ Payment Handler</title>
    <meta charset="UTF-8">
    <link rel="icon" href="images/favicon.png" type="image/x-icon" />
    <meta name="description" content="RRZ Payment Handler">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="author" lang="en" content="RRZ Innovations" />
    <meta name="keywords" content="RRZ Innovations" />
    <meta name="keywords" content="Surveya" />
    <meta name="keywords" content="Surveya Global" />
    <meta name="keywords" content="Surveya Global Survey Network" />
    <meta name="keywords" content="Survey Network" />
    <meta name="keywords" content="Survey" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" type="text/css" href="./res/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="./res/custom/site.css">


    <script src="res/jquery/jquery-2.2.3.min.js" type="text/javascript"></script>

</head>
<body>
    <form id="form1" runat="server">

        <div class="container-fluid">
            <div class="row  vertical-center text-center">
                <div class="col-xs-10 col-sm-4 col-md-4 col-lg-3 logo-background">
                    <div class="col-xs-12 text-center">
                        <br />
                        <img src="images/Surveyor_thumb.png" style="max-height: 250px;" class="text-center" />
                        <br />
                    </div>
                    <div class="col-xs-12 text-center">
                        <br />
                        <asp:Label runat="server" ID="lblStatus" Font-Size="XX-Large"></asp:Label>
                        <br />
                        <br />
                        <asp:Button runat="server" class="btn btn-default btn-flat btn-block" Text="Back" ID="btnClose" OnClick="btnClose_Click"></asp:Button>
                        <br />
                    </div>
                </div>
            </div>

            <div class="row footer text-center">
                <div class="col-xs-12 col-sm-6 col-sm-push-3 col-md-4 col-md-push-4 col-lg-4 col-lg-push-4 text-center">
                    <a href="http://www.rrzinnovations.com">
                        <img src="images/RRZImage.png" alt="powered by RRZ Innovations" style="width: 100%;" />
                    </a>
                </div>
            </div>
        </div>
    </form>

    <script src="./res/jquery/jquery-2.2.3.min.js"></script>
    <script src="./res/jquery/jquery.validate.min.js"></script>
    <script src="./res/bootstrap/js/bootstrap.min.js"></script>
    <script src="./res/custom/site.js"></script>
</body>
</html>
