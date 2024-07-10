$(function () {

    $(".currency").html(currency);

    setCountryDDL($('#userCountry'));

    $("#userTab, #companyTab")
       .addClass('disabled')
       .parent('li')
       .addClass('disabled');

    $(document).on('click', '.selectPackage', function () {

        $('#addPackageModal').modal('hide');

        var thisBtn = $(this);
        var packageId = thisBtn.data('id');

        getSelectedPackageFeatures(packageId);
    });

    $('#validateUser').on('click', function () {
        validateUser();
    });

    $('#userPassConfirm').change(function () {

        var pWordInp = $('#userPass');
        var pWordConfInp = $('#userPassConfirm');

    });

    $('#forComp, #forSole').change(function () {

        var chk = $(this);

        var lbl = $('#registrationNumberLbl');
        var inp = $('#registrationNumber');
        switch (chk.val()) {
            case 'Company':
                lbl.html('Registration Number');
                inp.attr('placeholder', 'Registration Number');
                break;
            case 'SoleProprietor':
                lbl.html('ID Number');
                inp.attr('placeholder', 'ID Number');
                break;
        }
    });

    $('#validateCompany').on('click', function () {
        ValidateCompany();
    });

    $('#CompleteSignUp').on('click', function () {
        NewUserSignup();
    });

    $(document).on('click', '.generateInvoiceBtn,.checkoutBtn', function () {
        var pack = $(this).attr('data-id');

        var min = compCart.StartDate ? new Date(compCart.StartDate) : dateSig;

        if (!min) {
            min = new Date();
        }
        var minStr = formatDate(min, 'yyyy-mm-dd');
        $('#startDate').attr('min', minStr).val(minStr);

        var intMonths = compCart.NumberOfMonths ? compCart.NumberOfMonths : 1;
        var subTotal = compCart.CompanyPackageFinalPrice; //compCart.PackagePrice + compCart.SelectedFeaturesPrice;


        min.setMonth(min.getMonth() + intMonths);
        minStr = formatDate(min, 'yyyy-mm-dd');
        $('#endDate').attr('min', minStr).val(minStr);

        $('#monthsFor').val(intMonths);
        $('#paymentAmount').val(subTotal);

        var myModal = $('#checkoutPackageModal');
        myModal.find('#CheckoutEFT, #CheckoutCredit').attr('data-id', pack).data('id', pack);
        myModal.modal('show');
    });

    $('#monthsFor').change(function () {
        //compCart.PackagePrice + compCart.SelectedFeaturesPrice
        var subTotal = compCart.PackagePrice + compCart.SelectedFeaturesPrice;
        var total = $('#paymentAmount');
        var monthsFor = $(this).val();
        var intMonths = parseInt(monthsFor);
        if (isNaN(monthsFor) || isNaN(intMonths)) {
            $(this).val(1);
            return;
        }
        else if (intMonths < 1) {
            $(this).val(1);
            return;
        }
        else {
            total.val(subTotal * intMonths);
            total.closest('form-group').removeClass('has-error');

            var start = $('#startDate').val();

            var min;
            if (start) {
                min = new Date(start);
            }
            else {
                min = new Date();
            }
            min.setMonth(min.getMonth() + intMonths);
            var minEndStr = formatDate(min, 'yyyy-mm-dd');
            $('#endDate').attr('min', minEndStr).val(minEndStr);
        }
    })

    $(document).on('click', '.completePayment', function () {
        var pack = $(this).attr('data-id');

        var nonCompletePack = getPackageByID(pack);
        var min = nonCompletePack.StartDate ? new Date(nonCompletePack.StartDate) : new Date(nonCompletePack.DateSignedUp);
        var today = new Date();
        if (!min || min < today) {
            min = today;
        }

        var minStr = formatDate(min, 'yyyy-mm-dd');
        $('#completeStartDate').attr('min', minStr).val(minStr);

        var intMonths = nonCompletePack.NumberMonthsSignedUpFor ? nonCompletePack.NumberMonthsSignedUpFor : 1;
        var subTotal = nonCompletePack.InvoiceAmount;
        var paidTotal = nonCompletePack.AmountAlreadyPaid

        if (!paidTotal) {
            paidTotal = 0;
        }

        //nonCompletePack.PackagePrice + nonCompletePack.SelectedFeaturesPrice;

        min.setMonth(min.getMonth() + intMonths);
        minStr = formatDate(new Date(min), 'yyyy-mm-dd');
        $('#completeEndDate').attr('min', minStr).val(minStr);

        $('#completeMonthsFor').val(intMonths);
        $('#completePaymentAmount').val(subTotal);
        $('#completeAmountAlreadyPaid').val(paidTotal);
        $('#completePaymentAmountOutstanding').val(subTotal - paidTotal);

        var myModal = $('#completePackagePaymentModal');
        myModal.find('#completeCheckoutEFT, #completeCheckoutCredit').attr('data-id', pack).data('id', pack);
        myModal.modal('show');
    });

    $(document).on('click', '.removePackage', function () {
        var pack = $(this).attr('data-id');

        var myModal = $('#RemoveMyPackageModal');
        myModal.find('#RemoveMyPackageBtn').attr('data-id', pack).data('id', pack);
        myModal.modal('show');

        $('#RemoveMyPackageModal').on('hidden.bs.modal', function () {
            $('#RemoveMyPackageBtn').removeAttr('data-id').removeData('id');
        });
    });

    $('#RemoveMyPackageBtn').on('click', function () {
        var pack = $(this).attr('data-id');

        RemoveMyPackage(pack);
    });

    $('#completeStartDate').change(function () {
        var intMonths = $('#completeMonthsFor').val();
        intMonths = intMonths * 1;
        var min = new Date($(this).val());
        min = min ? min.setMonth(min.getMonth() + intMonths) : new Date();
        var minEndStr = formatDate(new Date(min), 'yyyy-mm-dd');
        $('#completeEndDate').attr('min', minEndStr).val(minEndStr);
    });

    $('#CheckoutEFT').on('click', function () {
        var pack = $(this).attr('data-id');
        GenerateInvoice(pack, 'EFT');
    });

    $('#CheckoutCredit').on('click', function () {
        var pack = $(this).attr('data-id');
        GenerateInvoice(pack, 'CC');
    });

    $('#completeCheckoutEFT').on('click', function () {
        var pack = $(this).attr('data-id');
        CompletePurchaseAgain(pack, 'EFT');
    });

    $('#completeCheckoutCredit').on('click', function () {
        var pack = $(this).attr('data-id');
        CompletePurchaseAgain(pack, 'CC');
    });

    /*
    $('#CheckoutPackage').on('click', function () {
       var pack = $(this).attr('data-id');
       CompletePurchase(pack);
    });
    */

    $('#addCompPackageBtn').on('click', function () {
        GetAllPackages(addToPackageTable);
        GetAllFeatures(false);
    })

    $('#clearCompCartBtn').on('click', function () {
        ClearMyCart();
    })

    $(document).on('click', '.DT_EvokeViewPackage', function () {
        var packID = $(this).data('id');
        selectedPackage = getThisPackage(packID);
        ShowThisPackage(selectedPackage);
        //$('#startDatePack').datepicker();
        initDatepicker();
    });

    $(document).on('click', '#packageTBody tr', function () {
        selectedPackage = getThisPackage(this.id);
        ShowThisPackage(selectedPackage);
        //$('#startDatePack').datepicker();
        initDatepicker();
    });

    $(document).on('click', '.addPackageToCartBtn', function () {
        getSelectedPackageFeatures(selectedPackage.ID, SignupForPackage)
    });


    $('#refreshPaidUnPaidTbls').on('click', function () {
        GetMyPackageHistory();
    });

    // 


    $('#newPackageBtn').on('click', function () {
        setNewPackage();
    });

    $('#duplicatePackageBtn').on('click', function () {
        var packIndex = $('#packageDetails').data('packindex');
        setNewPackage();
        //js engine considers position 0(zero) as false
        if (packIndex || packIndex == 0) {
            var pack = allPackages[packIndex];

            pack.PackageName = "NEW DUPLICATE PACKAGE";
            pack.Description = "NEW DUPLICATE PACKAGE";

            var newPackIndex = allPackages.length;

            allPackages.push(pack);

            setSelectedPackage(newPackIndex);
        }
    });

    $('#refreshFtPacks').on('click', function () {
        GetAllFeatures(true);
    })

    $('#ActivatePackageBtn').on('click', function () {
        ActivatePackage(true);
    });

    $('#DeActivatePackageBtn').on('click', function () {
        ActivatePackage(false);
    });

    $('#showActive, #showInactive').on('click', function () {
        GetAllFeatures(true);
    });

    $('#showActive, #showInactive').on('ifChecked', function () {
        GetAllFeatures(true);
    });

    $(document).on('click', '.packBtn', function () {

        var packIndex = $(this).data('index');

        var opti = $('#featureOptDiv').find(':input');
        ClearData(opti);
        EnableElements(opti);
        selectRole(packIndex);
    });

    $('#featureChckDiv').on('change', '[type="checkbox"]', function () {
        var chk = $(this);
        var name = chk.prop('name');

        var gone = $('#featureOptDiv').find('[data-optdiv="' + name + '"]');

        if (chk.is(':checked')) {
            ClearData(gone);
            DisableElements($(gone).find(':input'));
        }
        else {
            EnableElements($(gone).find(':input'));
        }
    })

    $(document).on('click', '.deactivate_package', function () {
        //TODO
        //Deactivate this package
        var packID = $(this).data('id');
        DeactivateMyPackage(packID);
    });

});

var allPackages = [];
var allFeatures = [];
var compRights = [];
var compCart;
var selectedPackageIndex = -1;
var selectedPackage = null;
var dateSig;

var compHistory = [];
var nonPaidForList = [];
var paidForList = [];

function checkCanViewPackage() {

    if (typeof (rights) !== "undefined" && rights && $.isArray(rights)) {
        var r;
        for (var i = 0; i < rights.length; i++) {
            r = rights[i];
            if (r.RightName == 'GetMyPackage' || r.RightName == 'GetMyCart') {
                return true;
            }
            if (r.RightName &&
               ((r.RightName.toLowerCase()).indexOf('company') !== -1 || (r.RightName.toLowerCase()).indexOf('cart') !== -1 || (r.RightName.toLowerCase()).indexOf('package') !== -1)) {
                compRights.push(r);
            }
        }
    }
    return false;
}

function GetMyCart() {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose roles you want to view.");
        return false;
    }

    var methodName = "GetMyCart";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return;
                }
                //TODO success stuff


                var packDiv = $('#packageDiv');
                packDiv.children().remove();

                compCart = JSON.parse(data.RRZResult);
                if (compCart && compCart.PackageID) {
                    /*
                    PackageID, PackageName, DateSignedUp, IsActive, IsCompleted, PackagePrice
        
                    DateSignedUp:"2016-10-14T10:30:00"
                    DateStart: ""
                    IsActive:false
                    IsCompleted:false
                    PackageDescription:null
                    PackageID:"666b2a84-82fb-4402-b3dc-00983ff23658"
                    PackageName:"Custom"
                    PackagePrice:200
                    SelectedFeaturesPrice:47
                    */

                    var li = $('<li>');
                    var time = $('<time>');

                    dateSig = compCart.DateStart ? new Date(compCart.DateStart) : new Date(compCart.DateSignedUp);
                    //Thu Jan 01 1970 02:00:00 GMT+0200 (South Africa Standard Time)  

                    time.attr('datetime', compCart.DateSignedUp).addClass('bg-aqua')
                    .append('<span class="day">' + dateSig.getDate() + '</span>')
                    .append('<span class="month">' + formatDate(dateSig, "mmm") + '</span>')
                    .append('<span class="year">' + dateSig.getYear() + '</span>')
                    .append('<span class="time">' + formatDate(dateSig, "hh:nn") + '</span>');
                    time.css('max-width', '150px');

                    $('#startDate').val(dateSig);

                    var info = $('<div>');
                    var discount = 0;
                    if (compCart.CompanyPackageDiscount) {
                        discount = compCart.CompanyPackageDiscount;
                    }
                    info.addClass('info')
                    .append('<h2 class="title">' + compCart.PackageName + ' (' + currency + (compCart.CompanyPackageFinalPrice).toFixed(2) + ')</h2>')
                    .append('<p class="desc">' + (compCart.PaymentStatus ? compCart.PaymentStatus : '') + '</p>');

                    var featureList = ''
                    if (compCart.AdvancedReporting) { featureList += '&nbsp;<span class="label label-info">Advanced Reporting</span>'; }
                    if (compCart.BasicReporting) { featureList += '&nbsp;<span class="label label-info">Basic Reporting</span>'; }
                    if (compCart.CSV) { featureList += '&nbsp;<span class="label label-info">CSV</span>'; }
                    if (compCart.Excel) { featureList += '&nbsp;<span class="label label-info">Excel</span>'; }
                    if (compCart.GeoServices) { featureList += '&nbsp;<span class="label label-info">Geo Services</span>'; }
                    if (compCart.PDF) { featureList += '&nbsp;<span class="label label-info">PDF</span>'; }
                    if (compCart.PhotoCamera) { featureList += '&nbsp;<span class="label label-info">Photo/Camera</span>'; }
                    if (compCart.Piping) { featureList += '&nbsp;<span class="label label-info">Piping</span>'; }
                    if (compCart.Signatures) { featureList += '&nbsp;<span class="label label-info">Signatures</span>'; }
                    if (compCart.Summing) { featureList += '&nbsp;<span class="label label-info">Summing</span>'; }
                    if (compCart.UniqueID) { featureList += '&nbsp;<span class="label label-info">Unique ID</span>'; }
                    if (compCart.WhiteLabelling) { featureList += '&nbsp;<span class="label label-info">White Labelling</span>'; }

                    info.append('<p class="labels labelsFix">' + featureList + '</p>');

                    if (compCart.CompanyPackageDiscount && compCart.CompanyPackageDiscount != 0) {
                        var additional = compCart.SelectedFeaturesPrice * compCart.NumberOfMonths;
                        info.append('<ul class="hiddenFix"><li style="width: 33.3%;">Base Price: <strong>' + currency + (compCart.PackagePrice - additional).toFixed(2) + '</strong></li>' +
                        '<li style="width: 33.4%;">Additional Feature(s) Price: <strong>' + currency + (additional).toFixed(2) + '</strong></li>' +
                        '<li style="width: 33.3%;">Discount: <strong>' + currency + compCart.CompanyPackageDiscount.toFixed(2) + '</strong></li></ul>')
                    }
                    else {
                        info.append('<ul class="hiddenFix"><li style="width: 50%;">Base Price: <strong>' + currency + compCart.PackagePrice.toFixed(2) + '</strong></li>' +
                        '<li style="width: 50%;">Additional Feature(s) Price: <strong>' + currency + compCart.SelectedFeaturesPrice.toFixed(2) + '</strong></li></ul>')
                    }

                    var btnDiv = $('<div>');
                    btnDiv.addClass('button');
                    if (compCart.HasInvoice) {
                        var chk = ('<a class="btn bg-maroon btn-flat checkoutBtn" data-id="' + compCart.PackageID + '" title="Checkout package and generate invoice">Checkout</a>');
                        btnDiv.append(chk);
                    }
                    else {
                        var inv = ('<a class="btn bg-maroon btn-flat generateInvoiceBtn" data-id="' + compCart.PackageID + '" title="Generate invoice">Complete purchase</a>');
                        var chk = ('<a class="btn bg-maroon btn-flat checkoutBtn" data-id="' + compCart.PackageID + '" title="Checkout package and generate invoice" style="display:none;">Checkout</a>');
                        btnDiv.append(inv).append(chk);
                    }

                    li.append(time).append(info).append(btnDiv);
                    packDiv.append(li);
                }
                else {
                    var emptyHolder = $('#emptyListHolder').html();
                    packDiv.html(emptyHolder);
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(d);
        }
    });
}


function GenerateInvoice(pack, payType) {
    //GenerateInvoice(secretKey, companyPackageID, numberMonthsSignedUpFor)
    var monthsFor = $('#monthsFor').val();

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose roles you want to view.");
        return false;
    }

    var intMonthsFor = parseInt(monthsFor);
    if (isNaN(monthsFor) || isNaN(intMonthsFor) || intMonthsFor < 1) {
        ShowErrorModal("Number of months cannot be less than 1");
        return false;
    }
    var total = (monthsFor * (compCart.PackagePrice + compCart.SelectedFeaturesPrice));

    var methodName = "GenerateInvoice";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        companyPackageID: pack,
        numberMonthsSignedUpFor: intMonthsFor,
        paymentMethod: payType
    });

    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return;
                }
                //TODO success stuff

                var resp = JSON.parse(data.RRZResult);
                if (resp.Status = "Success") {

                    var more = '';
                    if (payType == 'CC') {
                        var url = paymentURL + '?p1=' + userCode + '&p2=' + pack;
                        more = '<div id="invDownDiv"></div><br/><br/><a href="' + url + '">Click here if you are not automatically redirected</a>';

                        $('#SuccessModal').on('hidden.bs.modal', function () {
                            $('#SuccessModal').off('hidden.bs.modal');


                            window.open(paymentURL + '?p1=' + userCode + '&p2=' + pack, '_blank');
                            //document.location = (paymentURL + '?p1=' + userCode + '&p2=' + pack);
                        });
                    }
                    else if (payType == 'EFT') {
                        more = '<div id="invDownDiv"></div>';
                    }
                    ShowSuccessModal("An invoice has been generated of total cost: <strong>" + currency + resp.TotalCost + "</strong> and will be sent to your email address." + more);


                    $(document).find('.checkoutBtn').show();
                    $(document).find('.generateInvoiceBtn').hide();

                    $('#checkoutPackageModal').modal('hide');
                    CompletePurchase(pack, payType);
                }
                else {
                    ShowErrorModal(resp);
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(a.status + ' - ' + a.statusText);
        }
    });
}

function CompletePurchase(pack, paymentType) {
    //CompletePurchase(secretKey, companyPackageID, numberMonthsSignedUpFor, paymentAmount)
    //CompletePurchaseEFT(secretKey, companyPackageID, dateStart, numberMonthsSignedUpFor, paymentAmount)
    var start = $('#startDate').val();
    var monthsFor = $('#monthsFor').val();
    var paymentAmount = $('#paymentAmount').val();

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose roles you want to view.");
        return false;
    }


    if (typeof start == "undefined" || start == null || start.length <= 0) {
        ShowErrorModal("Please pick a starting date");
        return false;
    }
    var today = new Date();
    var startDate = new Date(start);
    var afterStartDate = today;
    today.setDate(today.getDate() - 1);
    //afterStartDate.setDate(afterStartDate.getDate() + 1); //to ignore hour/minute differences
    /* && today > afterStartDate
    if (today > startDate) {
       ShowErrorModal("Start date cannot be in the past");
       return false;
    }
    */
    var intMonthsFor = parseInt(monthsFor);
    if (monthsFor && intMonthsFor < 1) {
        ShowErrorModal("Number of months cannot be less than 1");
        return false;
    }
    var total = (monthsFor * (compCart.PackagePrice + compCart.SelectedFeaturesPrice));

    var methodName = "CompletePurchase";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        companyPackageID: pack,
        dateStart: start,
        numberMonthsSignedUpFor: intMonthsFor,
        paymentAmount: total,
        paymentMethod: paymentType
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return;
                }
                //TODO success stuff
                //$('.modal').modal('hide');

                var resp = JSON.parse(data.RRZResult);
                if (resp.Status = "Success") {
                    GetMyCart();
                    var invID = resp.InvoiceID;



                    var url = (packageInvoiceURL + '?report=PackageInvoice&type=pdf&id=' + invID);
                    more = '<br/><br/><a href="' + url + '">Click here to download the invoice</a> (which was sent to your email address)';
                    $('#invDownDiv').html(more);
                    if (paymentType == 'EFT') {
                        //window.open(url,'_blank');
                        document.location = (url);
                    }
                    else if (paymentType == 'CC') {
                        window.open(url, '_blank');
                        //document.location = (url);

                        //       payment gateway
                        //window.open(paymentURL + '?p1=' + userCode + '&p2=' + pack, '_blank');
                        //document.location = (paymentURL + '?p1=' + userCode + '&p2=' + pack);
                    }
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(a.status + ' - ' + a.statusText);
        }
    });
}

function CompletePurchaseAgain(pack, paymentType) {
    //CompletePurchase(secretKey, companyPackageID, numberMonthsSignedUpFor, paymentAmount)
    //CompletePurchaseEFT(secretKey, companyPackageID, dateStart, numberMonthsSignedUpFor, paymentAmount)
    var start = $('#completeStartDate').val();
    var monthsFor = $('#completeMonthsFor').val();
    var paymentAmount = $('#completePaymentAmountOutstanding').val();

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose roles you want to view.");
        return false;
    }


    if (typeof start == "undefined" || start == null || start.length <= 0) {
        ShowErrorModal("Please pick a starting date");
        return false;
    }
    var today = new Date();
    var startDate = new Date(start);
    var afterStartDate = today;
    today.setDate(today.getDate() - 1);
    //afterStartDate.setDate(afterStartDate.getDate() + 1); //to ignore hour/minute differences
    /* && today > afterStartDate
    if (today > startDate) {
       ShowErrorModal("Start date cannot be in the past");
       return false;
    }
    */
    var intMonthsFor = parseInt(monthsFor);
    if (monthsFor && intMonthsFor < 1) {
        ShowErrorModal("Number of months cannot be less than 1");
        return false;
    }
    var total = (monthsFor * (compCart.PackagePrice + compCart.SelectedFeaturesPrice));

    var methodName = "CompletePurchaseOnPendingPackage";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        companyPackageID: pack,
        dateStart: start,
        numberMonthsSignedUpFor: intMonthsFor,
        paymentAmount: paymentAmount,
        paymentMethod: paymentType
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return;
                }
                //TODO success stuff
                //$('.modal').modal('hide');

                var resp = JSON.parse(data.RRZResult);
                if (resp.Status = "Success") {
                    GetMyCart();
                    GetMyPackageHistory();
                    var invID = resp.InvoiceID;

                    $('#completePackagePaymentModal').modal('hide');

                    var url = (packageInvoiceURL + '?report=PackageInvoice&type=pdf&id=' + invID);
                    more = '<br/><br/><a href="' + url + '">Click here to download the invoice</a> (which was sent to your email address)';
                    $('#invDownDiv').html(more);
                    if (paymentType == 'EFT') {
                        //window.open(url,'_blank');
                       document.location = (url);
                       more += '<br/><br/><strong class="text-orange">NOTE:</strong> Package will only be active after payment is confirmed.';
                    }
                    else if (paymentType == 'CC') {
                        window.open(url, '_blank');
                        url = paymentURL + '?p1=' + userCode + '&p2=' + pack;
                        more = '<div id="invDownDiv"></div><br/><br/><a href="' + url + '" target="_blank">Click here if you are not automatically redirected</a>';

                        $('#SuccessModal').on('hidden.bs.modal', function () {
                            $('#SuccessModal').off('hidden.bs.modal');
                            window.open(url, '_blank');
                        });
                    }
                    ShowSuccessModal("An invoice has been generated of total cost: <strong>" + currency + paymentAmount + "</strong> and will be sent to your email address." + more);
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(a.status + ' - ' + a.statusText);
        }
    });
}


function GetAllFeatures(show) {

    var methodName = "GetAllFeatures";
    var jsonData = JSON.stringify({});

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return;
                }

                allFeatures = JSON.parse(data.RRZResult);

                if (show) {
                    showAllFeatures();
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d + ' - ' + 'Error Occured.');
        }
    });
}

function showAllFeatures() {
    var featuresDiv = $('#featureChckDiv');
    var optFeaturesDiv = $('#featureOptDiv');
    var optFeatTemp = $('#optFeatDivTemp').html();


    featuresDiv.children().remove();
    optFeaturesDiv.children().remove();
    var ft, ftOpt, rightChk, rightGroup, RightGroupName = '';
    for (var i = 0; i < allFeatures.length; i++) {
        ft = allFeatures[i];

        rightChk = $('<div></div>')
         .html("<div class='checkbox col-xs-12 col-sm-6 col-md-4 truncate'><label title='" + ft.FriendlyName + "'><input id='" + ft.ID + "' name='" + ft.Name + "' type='checkbox' title='" + ft.FriendlyName + "'> " + ft.FriendlyName + " </label></div>");

        featuresDiv.append(rightChk);

        ftOpt = optFeatTemp.replace('[featName]', ft.Name).replace('[featName]', ft.Name).replace('[featFriendlyName]', ft.FriendlyName)
           .replace('[featCheck]', ft.Name + "Check").replace('[featCheck]', ft.Name + "Check").replace('[featCheckTitle]', "Make '" + ft.Name + "' optional")
           .replace('[featCheckPrice]', ft.Name + "Price").replace('[featCheckPriceTitle]', "Set '" + ft.Name + "' price");
        optFeaturesDiv.append(ftOpt);
    }
    initTooltip();
    //Get Packages and add to card list
    GetAllPackages(addToPackageCardList);
}

function GetAllPackages(callback) {

    var check = $('#showActive');
    var getActive = true;
    if (check && check[0]) {
        getActive = check.is(':checked');
    }

    var methodName = "GetAllPackages";
    var jsonData = JSON.stringify({
        isActive: getActive
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return;
                }

                allPackages = JSON.parse(data.RRZResult);
                if (callback) {
                    callback();
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d + ' - ' + 'Error Occured.');
        }
    });
}

function addToPackageTable() {
    var pack;
    var inf = '&infin;';

    $('#tblItems').dataTable().fnClearTable();
    for (var i = 0; i < allPackages.length; i++) {
        pack = allPackages[i];
        $('#tblItems')
            .dataTable()
            .fnAddData(
                   [
                       {
                           "0": pack.PackageName,
                           "1": currency + pack.Price,
                           "2": (pack.NumberOfProjects > 9999 ? inf : (pack.NumberOfProjects + '')),
                           "3": (pack.NumberOfSurveys > 9999 ? inf : (pack.NumberOfSurveys + '')),
                           "4": (pack.NumberOfUsers > 9999 ? inf : (pack.NumberOfUsers + '')),
                           "5": (pack.NumberOfQuestions > 9999 ? inf : (pack.NumberOfQuestions + '')),
                           "6": (pack.NumberOfResponses > 9999 ? inf : (pack.NumberOfResponses + '')),
                           "7": '',//DT_AddCustom(pack.ID, 'fa fa-cog btn text-black', 'DT_EvokeViewPackage', 'Select & Configure ' + pack.PackageName + ' Package'),
                           "DT_RowId": pack.ID,
                       }
                   ]
               );

        $('#packageList').children().remove();
        $('#addPackageModal').modal('show');

    }
}

function addToPackageCardList() {
    var roleDiv = $('#roleCardDiv');
    roleDiv.children().remove();
    var ro, packBtn;
    for (var i = 0; i < allPackages.length; i++) {
        ro = allPackages[i];

        packBtn = $('<div></div>')
           .attr('id', 'role' + i)
           .attr('data-index', i)
           .addClass('btn btn-flat btn-lg btn-block truncate packBtn btn-default')
           .html('<h4>' + ro.PackageName + '</h4><small>' + currency + ro.Price + '</small>');

        roleDiv.append(packBtn);
    }
    if (allPackages.length > 0) {
        selectRole(0);
    } else {
        packBtn = $('<div></div>')
           .addClass('btn btn-flat btn-lg btn-block truncate btn-default')
           .html('<h4>No Packages Found</h4>');

        roleDiv.append(packBtn);

        resetRightsChecked();

        MakeReadonly($("#packageName").val(''));
        MakeReadonly($("#packagePrice").val(''));
        MakeReadonly($("#packageDescription").val(''));
        MakeReadonly($("#packageProjects").val(''));
        MakeReadonly($("#packageSurveys").val(''));
        MakeReadonly($("#packageUsers").val(''));
        MakeReadonly($("#packageQuestions").val(''));
        MakeReadonly($("#packageResponses").val(''));

        $('#ActivatePackageBtn').hide();
        $('#DeActivatePackageBtn').hide();
        $('#SavePackageBtn').hide();

        DisableElements($("#featureChckDiv").find('input[type="checkbox"]'));
    }
}

function ShowThisPackage(pkg) {

    var pkgListDiv = $('#packageList');
    pkgListDiv.children().remove();

    var pkgDiv = makePackageDiv(pkg);
    pkgListDiv.append(pkgDiv);

    initCheck();

    // Two different handlers bound to check and uncheck
    // (iCheck also has an ifClicked callback but it fired before the checkbox/radio)
    $('.featureList input').on('ifChecked', function (event) {
        var chk = $(this);
        var packPriceDiv = $('.packagePrice');
        if (packPriceDiv) {
            var num = 1 * (packPriceDiv.html());
            var more = 1 * (chk.data('price'));
            packPriceDiv.html(num + more);

        }
    });

    $('.featureList input').on('ifUnchecked', function (event) {
        var chk = $(this);
        var packPriceDiv = $('.packagePrice');
        if (packPriceDiv) {
            var num = 1 * (packPriceDiv.html());
            var less = 1 * (chk.data('price'));
            packPriceDiv.html(num - less);

        }
    });

    $('.featureList input').on('click', function (event) {
        var chk = $(this);
        var packPriceDiv = $('.packagePrice');
        if (packPriceDiv) {
            var num = 1 * (packPriceDiv.html());
            var more = 1 * (chk.data('price'));
            if (chk.is(':checked'))
            { packPriceDiv.html(num + more); }
            else
            { packPriceDiv.html(num - more); }

        }
    });

    initTooltip();

}

function getFeaturePrice() {
    for (var i = 0; i < selectedPackage.features.length; i++) {
        ft = selectedPackage.features[i];
        ftPos = selectedFeatureList.indexOf(ft.Name);
        if (ftPos == -1) {
            // This feature is no selected   REMOVE IT
            selectedPackage.features.splice(i, 1);
        }
    }
}

function makePackageDiv(packObj) {
    var col = $('<div>').addClass('col-sm-12 text-center');
    var panel = $('<div>').addClass('box box-pricing');

    var pHead = $('<div>').addClass('box-header with-border')
                .html('<h3>' + packObj.PackageName + ' <sup>' + currency + '</sup>' + '<span class="packagePrice">' + packObj.Price + '</span> per month</h3>');
    panel.append(pHead);

    var inf = '&infin;';
    var proj = (packObj.NumberOfProjects > 9999 ? inf : (packObj.NumberOfProjects + ''));
    var surv = (packObj.NumberOfSurveys > 9999 ? inf : (packObj.NumberOfSurveys + ''));
    var user = (packObj.NumberOfUsers > 9999 ? inf : (packObj.NumberOfUsers + ''));
    var question = (packObj.NumberOfQuestions > 9999 ? inf : (packObj.NumberOfQuestions + ''));
    var resp = (packObj.NumberOfResponses > 9999 ? inf : (packObj.NumberOfResponses + ''));


    var LIs = '<li class="list-group-item"><i class="fa icon-projects"></i>&nbsp;&nbsp;&nbsp;<strong>' + proj + '</strong> Project(s)</li>' +
    '<li class="list-group-item"><i class="fa icon-surveys"></i>&nbsp;&nbsp;&nbsp;<strong>' + surv + '</strong> Survey(s)</li>' +
    '<li class="list-group-item"><i class="fa icon-users"></i>&nbsp;&nbsp;&nbsp;<strong>' + user + '</strong> User(s)</li>' +
    '<li class="list-group-item"><i class="fa fa-question-circle-o"></i>&nbsp;&nbsp;&nbsp;<strong>' + question + '</strong> Questions</li>' +
    '<li class="list-group-item"><i class="fa fa-list"></i>&nbsp;&nbsp;&nbsp;<strong>' + resp + '</strong> Responses</li>';

    var ul = $('<ul>').addClass('list-group text-left')
                .html(LIs);
    panel.append(ul);

    var fBody = $('<div>').addClass('box-header with-border text-center')
                .html('<h4>Features</h4>');
    panel.append(fBody);

    var fList = makeFeatureList(packObj);
    panel.append(fList);

    var today = new Date();
    var todayStr = formatDate(today, 'yyyy-mm-dd');

    var OptionalPackageHolder = $('#OptionalPackageHolder').html();
    OptionalPackageHolder = OptionalPackageHolder.replace('[todayStr]', todayStr);
    var moreBody = $('<div>').addClass('form-horizontal otherInput clearfix').html(OptionalPackageHolder);

    panel.append(moreBody);
    /*
    '<select class="form-control" id="numOfMonths">
       <option value="1">1</potion>
       <option value="6">6</potion>
       <option value="12">12</potion>
    </select>'
    */

    var footer = '<div class="box-footer"><div class="col-sm-12">' +
       '<a data-id="' + packObj.ID + '" class="btn btn-flat btn-success pull-right addPackageToCartBtn" >Add to cart</a>' +
       '</div></div>';
    panel.append(footer);

    col.append(panel);
    return col;
}

function makeFeatureList(packObj) {
    var packID = packObj.ID;
    var features = packObj.features;

    var ul = $('<div>')
         .attr('data-id', packID)
         .addClass('text-left box-header with-border featureList');

    var li, checkB, lbl, ft;

    // START QuestionTypes list item

    var inpt, fAny, fPrice;
    for (var i = 0; i < allFeatures.length; i++) {
        fAny = allFeatures[i];
        fPrice = 0;
        li = $('<div>').addClass('col-xs-12 col-sm-6 col-md-5 flexy');
        checkB = $('<div>').addClass('checkbox');
        lbl = $('<label>');

        ft = getThisFeature(fAny.Name, features);
        if (ft) {
            fPrice = ft.OptionalPrice;
            lbl.data('title', ft.Description);
            inpt = '<input type="checkbox" value="' + fAny.Name + '" data-price="' + fPrice + '" />';

            if (!ft.OptionalFeature) {
                lbl.data('title',ft.Description + ' (included in package)');
                inpt = '<i style="color:green" class="fa fa-check textX2"></i><input style="display:none" type="checkbox" value="' + fAny.Name + '" data-price="' +
                   fPrice + '" checked="checked" disabled="disabled" title="/>';
            }
            else {
                lbl.data('title', ft.Description);
                inpt = '<input type="checkbox" value="' + fAny.Name + '" data-price="' + fPrice + '"/>';
            }

            /*
            if (!ft.OptionalFeature) {
               inpt
                  .attr('checked', 'checked')
                  .attr('disabled', 'disabled')
                  .attr('title', ft.Description+' (comes with package)');
            } else {
               fPrice = ft.OptionalPrice;
               inpt.attr('title', ft.Description);
            }
            */
        }
        else {
            lbl.data('title', 'Unavailable on this package');
            inpt = $('<i class="fa fa-times text-danger textX2"></i>');
        }

        lbl.append(inpt);
        lbl.append('&nbsp;&nbsp;');
        lbl.append(fAny.FriendlyName + ' <strong>(' + currency + fPrice + ')</strong>');

        checkB.append(lbl);
        li.append(checkB);
        ul.append(li);
    }
    return ul;
}

function getSelectedPackageFeatures(packageId, callBack) {
    selectedPackageId = packageId;
    var featureList = $('.featureList[data-id="' + packageId + '"]');
    if (featureList) {
        var checkList = featureList.find('input[type="checkbox"]');
        selectedFeatureList = [];

        var thisFeature;
        for (var i = 0; i < checkList.length; i++) {
            thisFeature = $(checkList[i]);
            if (thisFeature.is(':checked')) {
                selectedFeatureList.push(thisFeature.val());
            }
        }
        // selectedPackage : [ { Description, FriendlyName, ID, Name, OptionalFeature, OptionalPrice}, ...]
        var ft, ftPos;
        for (var i = 0; i < selectedPackage.features.length; i++) {
            ft = selectedPackage.features[i];
            ftPos = selectedFeatureList.indexOf(ft.Name);
            if (ftPos == -1) {
                // This feature is not selected   REMOVE IT
                selectedPackage.features.splice(i, 1);
            }
        }
    }

    if (callBack) { callBack(); }
}

function showPackageTab() {
    //Now switch to the User Details tab

    $('#currTabHeader').html('Customise package');
    $('.nav-tabs-custom #packageTab').tab('show');
}

function getThisPackage(packID) {
    if (!packID || allPackages.length == 0)
    { return null; }
    else {
        var pc;
        for (var i = 0; i < allPackages.length; i++) {
            pc = allPackages[i];
            if (pc.ID == packID)
            { return pc; }
        }
        return null;
    }
}

function getThisFeature(fName, features) {
    if (!features || features.length == 0)
    { return null; }
    else {
        var ft;
        for (var i = 0; i < features.length; i++) {
            ft = features[i];
            if (ft.Name == fName)
            { return ft; }
        }
        return null;
    }
}

function SignupForPackage() {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose roles you want to view.");
        return false;
    }

    var featureIDs = [];
    for (var i = 0; i < selectedPackage.features.length; i++) {
        featureIDs.push({ id: selectedPackage.features[i].ID });
    }

    features = JSON.stringify(featureIDs);

    selectedPackage.NumberOfMonths = $('#numOfMonthsPack').val();
    selectedPackage.StartDate = $('#startDatePack').val();
    selectedPackage.PurchaseOrderNumber = $('#purchaseOrderNumber').val();
    //startDatePack

    //SignupForPackage( secretKey, packageID, features, numOfMonths, startDate)
    var methodName = "SignupForPackage";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        packageID: selectedPackage.ID,
        features: features,
        numOfMonths: selectedPackage.NumberOfMonths,
        startDate: selectedPackage.StartDate,
        purchaseOrderNumber: selectedPackage.PurchaseOrderNumber
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error, false, $('#addPackageModal'));
                    return;
                }
                //TODO success stuff

                var success = JSON.parse(data.RRZResult);

                $('#packageList').children().remove();
                $('#addPackageModal').modal('hide');
                GetMyCart();
                GetMyPackageHistory();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(d, false, $('#addPackageModal'));
        }
    });
}

function ClearMyCart() {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    //ClearMyCart( secretKey)
    var methodName = "ClearMyCart";
    var jsonData = JSON.stringify({
        secretKey: userCode
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error, false, $('#addPackageModal'));
                    return;
                }
                //TODO success stuff

                var success = JSON.parse(data.RRZResult);
                GetMyCart();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(d, false, $('#addPackageModal'));
        }
    });
}

function GetMyPackageHistory() {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    //GetMyPackageHistory( secretKey)
    var methodName = "GetMyPackageHistory";
    var jsonData = JSON.stringify({
        secretKey: userCode
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error, false, $('#addPackageModal'));
                    return;
                }
                //TODO success stuff

                compHistory = JSON.parse(data.RRZResult);
                paidForList = JSON.parse(compHistory.PaidPackages);
                nonPaidForList = JSON.parse(compHistory.NonPaidPackages);

                var nonPaidFor = null, paidFor = null;
                var signD, startD, ExpD;

                var EFT = DT_AddCustom('', 'fa fa-money', '', 'EFT');
                var CC = DT_AddCustom('', 'fa fa-credit-card', '', 'Credit Card');

                var invURL = (packageInvoiceURL + '?report=PackageInvoice&type=pdf&id=');
                var activeDi;
                $('#tblPaidPacks').dataTable().dataTable().fnClearTable();
                for (var i = 0; i < paidForList.length; i++) {
                    paidFor = paidForList[i];
                    payIcon = null;
                    activeDi = '';

                    if (paidFor.DateSignedUp) {
                        paidFor.DateSignedUp = paidFor.DateSignedUp.DateTimeWCF();
                        paidFor.DateSignedUp = formatDate(paidFor.DateSignedUp, "dd mmm yyyy");
                    }

                    if (paidFor.DateStart) {
                        paidFor.DateStart = paidFor.DateStart.DateTimeWCF();
                        paidFor.DateStart = formatDate(paidFor.DateStart, "dd mmm yyyy");
                    }

                    if (paidFor.DateExpires) {
                        paidFor.DateExpires = paidFor.DateExpires.DateTimeWCF();
                        paidFor.DateExpires = formatDate(paidFor.DateExpires, "dd mmm yyyy");
                    }
                    if (paidFor.IsActive) {
                        activeDi = '<a class="deactivate_package" data-id="' + paidFor.ID + '">' + DT_AddCustom('', 'fa fa-times btn', '', 'Deactivate package') + '</a>';
                    }

                    payIcon = paidFor.PaymentType == 'CC' ? (CC + ' ') : (paidFor.PaymentType == 'EFT' ? (EFT + ' ') : '');

                    $('#tblPaidPacks')
                       .dataTable()
                       .fnAddData(
                             [
                                {
                                    "0": paidFor.PackageName,
                                    "1": paidFor.DateSignedUp,
                                    "2": payIcon + paidFor.PaymentType,
                                    "3": paidFor.PaymentStatus,
                                    "4": paidFor.DateStart,
                                    "5": paidFor.DateExpires,
                                    "6": currency + paidFor.InvoiceAmount,
                                    "7": '<a href="' + invURL + paidFor.InvoiceID + '" target="_blank">' + DT_AddCustom('', 'fa fa-file-pdf-o btn', '', 'Download PDF') + '</a>'+
                                        activeDi,
                                    "DT_RowId": paidFor.ID,
                                }
                             ]
                          );
                }
                //DT_AddCustom(paidFor.ID, 'fa fa-file-pdf-o btn', 'DT_EvokeView')

                $('#tblUnpaidPacks').dataTable().dataTable().fnClearTable();
                var inv;
                for (var i = 0; i < nonPaidForList.length; i++) {
                    nonPaidFor = nonPaidForList[i];
                    payIcon = null;
                    inv = '';

                    if (nonPaidFor.DateSignedUp) {
                        nonPaidFor.DateSignedUp = nonPaidFor.DateSignedUp.DateTimeWCF();
                        nonPaidFor.DateSignedUp = formatDate(nonPaidFor.DateSignedUp, "dd mmm yyyy");
                    }

                    if (nonPaidFor.DateStart) {
                        nonPaidFor.DateStart = nonPaidFor.DateStart.DateTimeWCF();
                        nonPaidFor.DateStart = formatDate(nonPaidFor.DateStart, "dd mmm yyyy");
                    }

                    if (nonPaidFor.DateExpires) {
                        nonPaidFor.DateExpires = nonPaidFor.DateExpires.DateTimeWCF();
                        nonPaidFor.DateExpires = formatDate(nonPaidFor.DateExpires, "dd mmm yyyy");
                    }

                    payIcon = nonPaidFor.PaymentType == 'CC' ? (CC + ' ') : (nonPaidFor.PaymentType == 'EFT' ? (EFT + ' ') : '');

                    // If they have an invoice
                    if (nonPaidFor.InvoiceID) {
                        inv = '<a href="' + invURL + nonPaidFor.InvoiceID + '" target="_blank">' + DT_AddCustom('', 'fa fa-file-pdf-o btn') + '</a>'
                    }
                    $('#tblUnpaidPacks')
                       .dataTable()
                       .fnAddData(
                             [
                                {
                                    "0": nonPaidFor.PackageName,
                                    "1": nonPaidFor.DateSignedUp,
                                    "2": payIcon + (!nonPaidFor.PaymentType ? 'NONE' : nonPaidFor.PaymentType),
                                    "3": nonPaidFor.PaymentStatus,
                                    "4": nonPaidFor.DateStart,
                                    "5": nonPaidFor.DateExpires,
                                    "6": currency + nonPaidFor.InvoiceAmount,
                                    "7": inv + ' ' +
                                       DT_AddCustom(nonPaidFor.ID, 'fa fa-money', 'completePayment', 'Complete Payment') +
                                       DT_AddCustom(nonPaidFor.ID, 'fa fa-times text-danger', 'removePackage', 'Remove Package'),
                                    "DT_RowId": nonPaidFor.ID,
                                }
                             ]
                          );

                    //DT_AddCustom(paidFor.ID, 'fa fa-money btn', 'DT_EvokeView', 'Checkout') +
                    //DT_AddCustom(nonPaidFor.ID, 'fa fa-times btn text-danger', 'DT_EvokeDelete', 'Remove')
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(d, false, $('#addPackageModal'));
        }
    });
}

function getPackageByID(pack) {
    var nonPaidFor = null;
    for (var i = 0; i < nonPaidForList.length; i++) {
        nonPaidFor = nonPaidForList[i];
        if (nonPaidFor.ID == pack) {
            return nonPaidFor;
        }
    }
    return null;
}


function RemoveMyPackage(pack) {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    //RemoveMyPackage(secretKey, companyPackageID)
    var methodName = "RemoveMyPackage";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyPackageID: pack
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error, false, $('#RemoveMyPackageModal'));
                    return;
                }
                //TODO success stuff
                $('#RemoveMyPackageModal').modal('hide');
                var success = JSON.parse(data.RRZResult);
                GetMyCart();
                GetMyPackageHistory();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(d, false, $('#RemoveMyPackageModal'));
        }
    });
}
// Functions for `ManagePackages` page

function resetRightsChecked() {
    $("#featureChckDiv").find('input').prop('checked', false);
}

function resetOptFeaturesChecked() {
    var opti = $('#featureOptDiv');

    ClearData(opti);
    EnableElements(opti.find(':input'));
}

function setNewPackage() {
    selectedPackageIndex = undefined;

    RemoveReadonly($("#packageName").val(''));
    RemoveReadonly($("#packageDescription").val(''));

    RemoveReadonly($("#packageName").val(''));
    RemoveReadonly($("#packagePrice").val(''));
    RemoveReadonly($("#packageDescription").val(''));
    RemoveReadonly($("#packageProjects").val(''));
    RemoveReadonly($("#packageSurveys").val(''));
    RemoveReadonly($("#packageUsers").val(''));
    RemoveReadonly($("#packageQuestions").val(''));
    RemoveReadonly($("#packageResponses").val(''));

    var activate = $('#ActivateRoleBtn');
    var deactivate = $('#DeActivateRoleBtn');
    var save = $('#SavePackageBtn');

    $('#isReadOnly').hide();
    activate.hide();
    deactivate.hide();
    EnableElements(save);

    var righDiv = $("#featureChckDiv");
    EnableElements(righDiv.find('input'));
    righDiv.find('input').prop('checked', false);
    $("#roleCardDiv .btn").removeClass("btn-info").addClass("btn-default");

    $('#packageDetails').removeAttr('data-packindex').removeData('packindex');


    resetRightsChecked();
    resetOptFeaturesChecked();

    $('#SavePackageBtn').off('click');
    $('#SavePackageBtn').on('click', function () {
        AddNewPackage();
    });
}

function selectRole(packIndex) {

    //unselect the last selected role btn and select the clicked one
    $("#roleCardDiv .btn").removeClass("btn-info").addClass("btn-default");
    $('#role' + packIndex).addClass("btn-info");

    resetRightsChecked();
    setSelectedPackage(packIndex);

    $('#SavePackageBtn').off('click');
    $('#SavePackageBtn').on('click', function () {
        UpdatePackage();
    });
}

// GetSpecificPackage(string secretKey, string packageID)
function setSelectedPackage(packIndex) {

    if (typeof packIndex == "undefined" || packIndex == null) {
        ShowErrorModal("Please select a package to view.");
        return false;
    }

    $('#packageDetails').removeData('packindex').data('packindex', packIndex).attr('data-packindex', packIndex);
    var pack = allPackages[packIndex];

    var isReadOnly = $('#isReadOnly');

    var packName = $("#packageName");
    packName.val(pack.PackageName);

    var packPrice = $("#packagePrice");
    packPrice.val(pack.Price);

    var packDescr = $("#packageDescription");
    packDescr.val(pack.Description);

    var packProj = $("#packageProjects");
    packProj.val(pack.NumberOfProjects);

    var packSurv = $("#packageSurveys");
    packSurv.val(pack.NumberOfSurveys);

    var packUsers = $("#packageUsers");
    packUsers.val(pack.NumberOfUsers);

    var packQues = $("#packageQuestions");
    packQues.val(pack.NumberOfQuestions);

    var packResp = $("#packageResponses");
    packResp.val(pack.NumberOfResponses);

    var activate = $('#ActivatePackageBtn');
    var deactivate = $('#DeActivatePackageBtn');
    var save = $('#SavePackageBtn');

    if (!pack.IsActive) {
        MakeReadonly(packName);
        MakeReadonly(packPrice);
        MakeReadonly(packDescr);
        MakeReadonly(packProj);
        MakeReadonly(packSurv);
        MakeReadonly(packUsers);
        MakeReadonly(packQues);
        MakeReadonly(packResp);

        activate.show();
        deactivate.hide();
        save.hide();
    }
    else {
        RemoveReadonly(packName);
        RemoveReadonly(packPrice);
        RemoveReadonly(packDescr);
        RemoveReadonly(packProj);
        RemoveReadonly(packSurv);
        RemoveReadonly(packUsers);
        RemoveReadonly(packQues);
        RemoveReadonly(packResp);

        activate.hide();
        deactivate.show();
        save.show();
    }

    if (pack.features && $.isArray(pack.features)) {
        var check, ri, optDiv;
        ClearData($('#featureOptDiv'));

        for (var i = 0; i < pack.features.length; i++) {
            ri = pack.features[i];
            if (ri.OptionalFeature) {
                div = $('#featureOptDiv').find('[data-optdiv="' + ri.Name + '"]');
                if (div) {
                    $(div).find('[type="checkbox"]').click();
                    $(div).find('[type="text"]').val(ri.OptionalPrice);
                }
            }
            else {
                check = $('#' + ri.ID);
                check.click();
            }
        }
    }
}

//  SystemAddPackage(secretKey, numberOfSurveys, numberOfQuestions, numberOfUsers, startDate, numberOfResponses, packageName, price, string description, numberOfProjects, numberOfMonthsValidFor, features)

function AddNewPackage() {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        //$("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
        return false;
    }

    var features = [];
    var f, checked, optChecked, optPrice, fe;
    for (var i = 0; i < allFeatures.length; i++) {
        f = allFeatures[i];
        optPrice = 0;
        checked = $('#' + f.ID).is(":checked");
        optChecked = $('#featureOptDiv').find('[name="' + f.Name + 'Check"]').is(":checked");
        if (checked) {
            fe = { id: f.ID, optionalFeature: false, optionalPrice: optPrice };
            features.push(fe);
        }
        else if (optChecked) {
            optPrice = $('#featureOptDiv').find('[name="' + f.Name + 'Price"]').val();
            fe = { id: f.ID, optionalFeature: true, optionalPrice: optPrice };
            features.push(fe);
        }
    }

    var name = $("#packageName").val();
    var price = $("#packagePrice").val();
    var description = $("#packageDescription").val();

    var projects = $("#packageProjects").val();
    var surveys = $("#packageSurveys").val();
    var users = $("#packageUsers").val();
    var questions = $("#packageQuestions").val();
    var responses = $("#packageResponses").val();

    var startDate = $("#startDate").val();

    var methodName = "SystemAddPackage";
    var jsonData = JSON.stringify({
        secretKey: userCode, packageName: name, price: price, description: description, startDate: startDate,
        numberOfSurveys: surveys, numberOfQuestions: questions, numberOfUsers: users,
        numberOfResponses: responses, numberOfProjects: projects, numberOfMonthsValidFor: 0,
        features: JSON.stringify(features)
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return;
                }
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Role saved
                    ShowSuccessModal("Package : <strong>" + name + "</strong> has been saved.");

                    GetAllPackages(addToPackageCardList);
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

//  SystemUpdatePackage(secretKey, packageID, numberOfSurveys, numberOfQuestions, numberOfUsers, startDate, numberOfResponses, packageName, price, string description, numberOfProjects, numberOfMonthsValidFor, features)

function UpdatePackage() {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        $("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
        return false;
    }

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        $("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
        return false;
    }

    var packIndex = $('#packageDetails').data('packindex');
    var pack = allPackages[packIndex];

    var features = [];
    var f, checked, fe;

    for (var i = 0; i < allFeatures.length; i++) {
        f = allFeatures[i];
        optPrice = 0;
        checked = $('#' + f.ID).is(":checked");
        optChecked = $('#featureOptDiv').find('[name="' + f.Name + 'Check"]').is(":checked");
        if (checked) {
            fe = { id: f.ID, optionalFeature: false, optionalPrice: optPrice };
            features.push(fe);
        }
        else if (optChecked) {
            optPrice = $('#featureOptDiv').find('[name="' + f.Name + 'Price"]').val();
            fe = { id: f.ID, optionalFeature: true, optionalPrice: optPrice };
            features.push(fe);
        }
    }

    var name = $("#packageName").val();
    var price = $("#packagePrice").val();
    var description = $("#packageDescription").val();

    var projects = $("#packageProjects").val();
    var surveys = $("#packageSurveys").val();
    var users = $("#packageUsers").val();
    var questions = $("#packageQuestions").val();
    var responses = $("#packageResponses").val();

    var startDate = $("#startDate").val();

    var methodName = "SystemUpdatePackage";
    var jsonData = JSON.stringify({
        secretKey: userCode, packageID: pack.ID, packageName: name, price: price, description: description, startDate: startDate,
        numberOfSurveys: surveys, numberOfQuestions: questions, numberOfUsers: users,
        numberOfResponses: responses, numberOfProjects: projects, numberOfMonthsValidFor: 0,
        features: JSON.stringify(features)
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return;
                }
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Role saved
                    ShowSuccessModal("Package : <strong>" + name + "</strong> has been saved.");

                    GetAllPackages(addToPackageCardList);
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

//  SystemActivatePackage(string secretKey, string packageID, string activate)

function ActivatePackage(activate) {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        $("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
        return false;
    }

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        $("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
        return false;
    }

    var packIndex = $('#packageDetails').data('packindex');
    var pack = allPackages[packIndex];

    var methodName = "SystemActivatePackage";
    var jsonData = JSON.stringify({
        secretKey: userCode, packageID: pack.ID, activate: activate
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return;
                }
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Role saved
                    var deactive = activate ? 'activated' : 'de-activated';
                    var clickText = activate ? "Click 'Show Active' to view this and all other active packages" : "Click 'Show Inactive' to view this and all other active packages";
                    //Show Inactive
                    //Show Active
                    ShowSuccessModal("Package : <strong>" + name + "</strong> has been " + deactive + ".<br /><br />" + clickText);

                    GetAllPackages(addToPackageCardList);
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}


//  DeactivateMyPackage(string secretKey, string companyPackageID)
function DeactivateMyPackage(packageID) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    var methodName = "DeactivateMyPackage";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyPackageID: packageID
    });

    //register the user using AJAX... and hope for the best.. lol
    $.support.cors = true;

    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: baseServicePath + "/" + methodName,
        success: function (data) {
            //var tbody = $('#paymentsTBody');
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    //tbody.html(MakeDataTableError(error, 5));
                    return;
                }

                var result = JSON.parse(data.RRZResult);
                GetMyCart();
                GetMyPackageHistory();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
            //$('#paymentsTBody').html(MakeDataTableError(error, 5));
        }
    });
}