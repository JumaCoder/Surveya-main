//Global properties

$(function () {

   $('#refreshCompanies').on('click', function () {
      GetAllCompanies();
   });

   $('#showActive, #showInactive').on('click', function () {
      GetAllCompanies();
   });

   $('#showActive, #showInactive').on('ifChecked', function () {
      GetAllCompanies();
   });

   $('#showUnpaid, #showLast100, #showAll').on('click', function () {
      var filter = $(this).val();
      GetSystemSignups(filter);
   });

   $('#showUnpaid, #showLast100, #showAll').on('ifChecked', function () {
      var filter = $(this).val();
      GetSystemSignups(filter);
   });

   $('#refreshSignups').on('click', function () {
      var showUnpaid = $('#showUnpaid').is(':checked');
      var showLast100 = $('#showLast100').is(':checked');
      var showAll = $('#showAll').is(':checked');

      var filter = '';
      if (showUnpaid) { filter = $('#showUnpaid').val(); }
      else if (showLast100) { filter = $('#showLast100').val(); }
      else if (showAll) { filter = $('#showAll').val(); }

      GetSystemSignups(filter);
   });

   initTooltip();
   initCheck();

   $(document).on('click', '.viewPackage', function () {
      var packID = $(this).data('id');
      SystemGetSpecificCompanyPackage(packID);
   });

   $(document).on('click', '#showPackagePayment, .payPackage', function () {
      $('.modal').modal('hide'); //close other modals

      var invID = $(this).data('invoiceid');
      SystemSignupViewPayments(invID);
   });

   $('#showPackagePayment').click(function () {
      var invID = $(this).data('invoiceid');
      $('#capturePackagePayment').attr('data-invoiceid', invID).data('invoiceid', invID);
   });

   $('#capturePackagePayment').click(function () {
      var invID = $(this).data('invoiceid');
      var fromSignups = $(this).data('from');
      SystemCapturePayment(invID,fromSignups);
   });

   $('#companyPackageBtn').click(function () {
      SystemGetCompanyPackages();
   });

   $(document).on('click', '.deactivatePackage', function () {
      var packID = $(this).data('id');
      SystemDeactivateCompanyPackage(packID);
   });
   
   $(document).on('click', '.activatePackage', function () {
      var packID = $(this).data('id');
      SystemActivateCompanyPackage(packID);
   });
});

//GetMyCompanyDetails 
//
function GetAllCompanies() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var getActive = $('#showActive').is(':checked');

   var methodName = "SystemCompanies";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      getActive: getActive
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
         var tbody = $('#companyTBody');
         if (data.RRZResult) {
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult);
               ShowErrorModal(error);
               tbody.html(MakeDataTableError(error, 5));
               return;
            }
            /*
            var compList = $('#companyList');
            compList.children().remove();
            */
            companyList = JSON.parse(data.RRZResult);

            $('#tblItems').dataTable().dataTable().fnClearTable();
            for (var i = 0; i < companyList.length; i++) {
               comp = companyList[i];

               countryCode = findCountryCodeByName(comp.Country);
               if (!countryCode) { countryCode = ' '; }

               $('#tblItems')
                     .dataTable()
                     .fnAddData(
                           [
                              {
                                 "0": comp.CompanyName,
                                 "1": comp.MainUser,
                                 "2": comp.CompanyRegistrationNumber,
                                 "3": activeInactive(comp),
                                 "4": '<a class="btn" href="SystemCompany?id=' + comp.CompanyID+'">view</a>',
                                 "DT_RowId": "the-Item-id-" + comp.CompanyID,
                              }
                           ]
                        );
            }
            $('#tblItems .dropdown-toggle').dropdown();
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
         $('#companyTBody').html(MakeDataTableError(error, 5));
      }
   });
}

function activeInactive(comp)
{
   if(comp.IsActive)
   {
      return '<span class="btn-block btn-sm text-center text-success""><i class="fa fa-check"></i></span>';
   } else {
      return '<span class="btn-block btn-sm text-center text-error""><i class="fa fa-times"></i></span>';
   }
}

function makeActionDropdown(comp)
{
   var ddb = '<div class="dropdown">';
   ddb += '<a class="btn btn-sm btn-flat btn-default dropdown-toggle" data-target="#" data-toggle="dropdown"><span class="caret"></span></a>';
   ddb += '<ul class="dropdown-menu dropdown-menu-right" role="menu">';// aria-labelledby="dLabel"
   ddb += '<li><a href="SystemCompany?id=' + comp.CompanyID + '">View</a></li>';
   ddb += '<li><a class="payPackage pointer" data-invoiceid="' + comp.InvoiceID + '">Payment</a></li>';
   ddb += '<li><a class="pointer" data-id="' + comp.CompanyID + '">View Invoice</a></li>';
   ddb += '<li class="divider"></li>';
   ddb += '<li><a class="pointer" data-id="' + comp.CompanyID + '">Hide company</a></li>';
   ddb += '</ul></div>';

   return ddb;
}

//'<a class="btn" href="/Administration/SystemCompany?id=' + comp.CompanyID + '" title="View Company">' + DT_AddCustom(comp.CompanyID, 'fa fa-pencil btn', 'DT_Evoke') + '</a>'

function AddNewCompany() {
   //Page_ClientValidate('new')
   //get all the details
   var modal = $('#addEditCompanyModal');

   var name = modal.find('#compName').val();
   var regNum = modal.find('#registrationNumber').val();
   var vatNum = modal.find('#vatNumber').val();
   var compAddress = modal.find('#physicalAddress').val();
   var packageID = modal.find('#packageDDL option:selected').attr('value');
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      modal.modal('hide');
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "AddCompany";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyName: name, registrationNumber: regNum, logo: smallImgNoBase,
      vatNumber: vatNum, physicalAddress: compAddress, packageID: packageID
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
         modal.modal('hide');
         if (data.RRZResult) {
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult);
               ShowErrorModal(error);
               return;
            }
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //company registered
               ShowSuccessModal("Company: <strong>" + name + "</strong> has been created.");
               //TODO Other stuff
               GetAllCompanies();
            }
         }
      },
      error: function (a, e, d) {
         modal.modal('hide');
         ShowErrorModal(d);
      }
   });
}


function SystemGetCompany() {
   //VIEW ONLY
   var inps = $(document).find('input, textarea, select');
   DisableElements(inps);

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   compID = getQueryParameter('id');
   if (compID == false) {
      ShowErrorModal('Invalid url, please ensure you have the full hyperlink.');
      return false;
   }

   var methodName = "SystemGetCompany";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: compID
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
            //Show company
            var comp = JSON.parse(data.RRZResult);

            $(document).find('.compNameTxt').html(comp.CompanyName);

            $('#compName').val(comp.CompanyName);
            $('#registrationNumber').val(comp.RegistrationNumber);

            var hasVAT = comp.VatNumber ? 'checked' : '';
            $('#compHasVAT').prop('checked', hasVAT).attr('checked', true);

            $('#vatNumber').val(comp.VatNumber);
            $('#physicalAddress').val(comp.PhysicalAddress);
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(d);
      }
   });
}

function SystemGetCompanyMainUser() {

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   compID = getQueryParameter('id');
   if (compID == false) {
      ShowErrorModal('Invalid url, please ensure you copied the full hyperlink.');
      return false;
   }

   var methodName = "SystemGetCompanyMainUser";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: compID
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
            //Show company
            var main = JSON.parse(data.RRZResult);
            setCountryDDL($('#userCountry'));

            $('#userFirstname').val(main.Firstnames);
            $('#userLastname').val(main.Lastname);

            $('#userEmailAddress').val(main.Email);
            $('#userContactNumber').val(main.ContactNumber);

            var couCode = '';
            if (main.Country && main.Country.length > 3) {
               couCode = getCountryCode(main.Country);
            }
            else {
               couCode = main.Country;
            }
            $('#userCountry').val(couCode);
            $('#userAddress').val(main.PhysicalAddress);
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(d);
      }
   });
}

function SystemGetCompanyPackages() {

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   compID = getQueryParameter('id');
   if (compID == false) {
      ShowErrorModal('Invalid url, please ensure you copied the full hyperlink.');
      return false;
   }

   var methodName = "SystemGetCompanyPackages";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: compID
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
            //Show company
            var packages = JSON.parse(data.RRZResult);

            var packDiv = $('#packageDiv');
            packDiv.children().remove();

            var li, time, dateSig, dateExp, dateExpStr, info, btnDiv, payBtn, packBtn, inv, pack;

            if (packages && packages.length > 0) {
               for (var i = 0; i < packages.length; i++) {
                  li = $('<li>');
                  time = $('<time>');
                  pack = packages[i];
                  dateSig = pack.DateSignedUp.DateTimeWCF();
                  dateExp = pack.DateExpires.DateTimeWCF();
                  dateExpStr = '' + dateExp.getDate() + ' ' + formatDate(dateExp, "mmm") + ' ' + dateExp.getFullYear();

                  //Thu Jan 01 1970 02:00:00 GMT+0200 (South Africa Standard Time)  

                  time.attr('datetime', pack.DateSignedUp.DateWCF()).addClass('bg-info').css('min-height', '135px')
                  .append('<span class="day">' + dateSig.getDate() + '</span>')
                  .append('<span class="month">' + formatDate(dateSig, "mmm") + '</span>')
                  .append('<span class="year">' + dateSig.getFullYear() + '</span>')
                  .append('<span class="time">' + formatDate(dateSig, "hh:nn") + '</span>');

                  info = $('<div>');
                  info.addClass('info')
                  .append('<h2 class="title">' + pack.PackageName + ' (' + currency + (pack.Price ? pack.Price : '0') + ')</h2>')
                  .append('<p class="desc">' + (pack.PackageDescription ? pack.PackageDescription : '<i>no description</i>') + '</p>');

                  var featureList = ''
                  if (pack.AdvancedReporting) { featureList += '&nbsp;<span class="label label-info">Advanced Reporting</span>'; }
                  if (pack.BasicReporting) { featureList += '&nbsp;<span class="label label-info">Basic Reporting</span>'; }
                  if (pack.CSV) { featureList += '&nbsp;<span class="label label-info">CSV</span>'; }
                  if (pack.Excel) { featureList += '&nbsp;<span class="label label-info">Excel</span>'; }
                  if (pack.GeoServices) { featureList += '&nbsp;<span class="label label-info">Geo Services</span>'; }
                  if (pack.PDF) { featureList += '&nbsp;<span class="label label-info">PDF</span>'; }
                  if (pack.PhotoCamera) { featureList += '&nbsp;<span class="label label-info">Photo/Camera</span>'; }
                  if (pack.Piping) { featureList += '&nbsp;<span class="label label-info">Piping</span>'; }
                  if (pack.Signatures) { featureList += '&nbsp;<span class="label label-info">Signatures</span>'; }
                  if (pack.Summing) { featureList += '&nbsp;<span class="label label-info">Summing</span>'; }
                  if (pack.UniqueID) { featureList += '&nbsp;<span class="label label-info">Unique ID</span>'; }
                  if (pack.WhiteLabelling) { featureList += '&nbsp;<span class="label label-info">White Labelling</span>'; }

                  info.append('<p class="labels">' + featureList + '</p>');

                  info.append('<ul><li style="width: 95%;">Expiry: <strong>' + dateExpStr + '</strong></li></ul>');

                  btnDiv = $('<div>');
                  btnDiv.addClass('button');

                  var activeDeactive = '';

                  if (pack.IsActive)
                  {
                     activeDeactive = ('<a class="btn btn-warning btn-flat deactivatePackage" data-id="' + pack.CompanyPackageID + '">Dectivate</a>&nbsp;');
                  }
                  else {
                     activeDeactive = ('<a class="btn btn-info btn-flat activatePackage" data-id="' + pack.CompanyPackageID + '">Activate</a>&nbsp;');
                  }
                  btnDiv.append(activeDeactive);

                  payBtn = ('<a class="btn btn-success btn-flat payPackage" data-invoiceid="' + pack.InvoiceID + '">Pay</a>&nbsp;');
                  btnDiv.append(payBtn);

                  packBtn = ('<a class="btn btn-primary btn-flat viewPackage" data-id="' + pack.CompanyPackageID + '">View</a>');
                  btnDiv.append(packBtn);
                  /*
                  if (pack.HasInvoice) {
                     chk = ('<a class="btn btn-success btn-flat checkoutBtn" data-id="' + pack.PackageID + '">Checkout</a>');
                     btnDiv.append(chk);
                  }
                  else {
                     inv = ('<a class="btn btn-info btn-flat generateInvoiceBtn" data-id="' + pack.PackageID + '">Invoice</a>');
                     chk = ('<a class="btn btn-primary btn-flat checkoutBtn" data-id="' + pack.PackageID + '" style="display:none;">Checkout</a>');
                     btnDiv.append(inv).append(chk);
                  }
                  */
                  li.append(time).append(info).append(btnDiv);
                  packDiv.append(li);
                  initTooltip();
               }
            }
            else {

               packDiv.html('<div class="col-xs-12"><br /><br /></div>' +
                           '<div class="emptyListHolder">' +
                              '<span class="icon"><i class="fa fa-list-alt"></i></span>' +
                              '<span class="header">No active packages</span>' +
                              '<span class="subheader"></span></div>' +
                        '<div class="col-xs-12"><br /><br /><br /></div>');
               /*
               
               */
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(d);
      }
   });
}


function SystemGetSpecificCompanyPackage(packID) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof packID == "undefined" || packID == null || packID.length <= 0) {
      ShowErrorModal('No package ID provided.');
      return false;
   }

   var methodName = "SystemGetCompanyPackage";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyPackageID: packID
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

            var packObj = JSON.parse(data.RRZResult);
            makePackageDiv(packObj);

            var packModal = $('#viewPackageModal');   //InvoiceID
            $('#showPackagePayment').attr('data-id', packID).data('id', packID).attr('data-invoiceid', packObj.InvoiceID).data('invoiceid', packObj.InvoiceID);
            packModal.modal('show');
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}


function makePackageDiv(packObj) {
   var packModalDiv = $('#packageModalDiv');
   packModalDiv.children().remove();


   var col = $('<div>').addClass('col-sm-12 text-center');
   var panel = $('<div>').addClass('box box-pricing');

   var pHead = $('<div>').addClass('box-header with-border')
               .html('<h3>' + packObj.PackageName + ' <sup>' + currency + '</sup>' + '<span class="packagePrice">' + packObj.Price + '</span></h3>');
   panel.append(pHead);

   var inf = '&infin;';
   var proj = (packObj.NumberOfProjects > 9999 ? inf : (packObj.NumberOfProjects + ''));
   var surv = (packObj.NumberOfSurveys > 9999 ? inf : (packObj.NumberOfSurveys + ''));
   var user = (packObj.NumberOfUsers > 9999 ? inf : (packObj.NumberOfUsers + ''));
   var question = (packObj.NumberOfQuestions > 9999 ? inf : (packObj.NumberOfQuestions + ''));
   var resp = (packObj.NumberOfResponses > 9999 ? inf : (packObj.NumberOfResponses + ''));


   var LIs = '<li class="list-group-item"><strong>' + proj + '</strong> Project(s)</li>' +
   '<li class="list-group-item"><strong>' + surv + '</strong> Survey(s)</li>' +
   '<li class="list-group-item"><strong>' + user + '</strong> User(s)</li>' +
   '<li class="list-group-item"><strong>' + question + '</strong> Questions</li>' +
   '<li class="list-group-item"><strong>' + resp + '</strong> Responses</li>';

   var ul = $('<ul>').addClass('list-group text-left')
               .html(LIs);
   panel.append(ul);

   var fBody = $('<div>').addClass('box-header with-border text-center')
               .html('<h4>Features</h4>');
   panel.append(fBody);

   var fList = makeFeatureList(packObj);
   panel.append(fList);

   col.append(panel);

   packModalDiv.append(col);
}

function makeFeatureList(pack) {
   var row = $('<div>')
        .addClass('row');

   var ul = $('<div>')
        .addClass('col-xs-12');

   var div = '<div class="col-xs-12 col-md-6 text-left">';
   var div2 = '</div>';

   var inp = '<i class="fa fa-check text-success"></i>&nbsp;';

   if (pack.AdvancedReporting) { ul.append(div + inp + 'Advanced Reporting' + div2); }
   if (pack.BasicReporting) { ul.append(div + inp + 'Basic Reporting' + div2); }
   if (pack.CSV) { ul.append(div + inp + 'CSV' + div2); }
   if (pack.Excel) { ul.append(div + inp + 'Excel' + div2); }
   if (pack.GeoServices) { ul.append(div + inp + 'Geo Services' + div2); }
   if (pack.PDF) { ul.append(div + inp + 'PDF' + div2); }
   if (pack.PhotoCamera) { ul.append(div + inp + 'Photo/Camera' + div2); }
   if (pack.Piping) { ul.append(div + inp + 'Piping' + div2); }
   if (pack.Signatures) { ul.append(div + inp + 'Signatures' + div2); }
   if (pack.Summing) { ul.append(div + inp + 'Summing' + div2); }
   if (pack.UniqueID) { ul.append(div + inp + 'Unique ID' + div2); }
   if (pack.WhiteLabelling) { ul.append(div + inp + 'White Labelling' + div2); }

   row.append(ul);
   return row;
}

function SystemCapturePayment(invID, from) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof invID == "undefined" || invID == null || invID.length <= 0) {
      ShowErrorModal('No invoice ID provided.');
      return false;
   }

   var datePaid = $('#datePaid').val();
   if (typeof datePaid == "undefined" || datePaid == null || datePaid.length <= 0) {
      ShowErrorModal('Please provide the payment date.');
      return false;
   }

   var paymentAmount = $('#paymentAmount').val();
   if (typeof paymentAmount == "undefined" || paymentAmount == null || paymentAmount.length <= 0) {
      ShowErrorModal('Please provide the payment amount.');
      return false;
   }

   var methodName = "SystemCapturePayment";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      invoiceID: invID,
      datePaid: datePaid,
      paymentAmount: paymentAmount
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
            $('.modal').modal('hide');
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult);
               ShowErrorModal(error);
               return;
            }

            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //company registered
               ShowSuccessModal("Payment captured.");
               var payForm = $('#makePaymentBody');
               ClearData(payForm);
               $('#datePaid').val("");
               $('#paymentAmount').val("");
               //TODO Other stuff
               if (from)
               {
                  $('#refreshSignups').click();
               }
               else {
                  SystemGetCompanyPackages();
               }
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

// SystemSignups(string secretKey, SignupFilters filterType)
function GetSystemSignups(filter) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "SystemSignups";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      filterType: filter
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
         var tbody = $('#companyTBody');
         if (data.RRZResult) {
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult);
               ShowErrorModal(error);
               tbody.html(MakeDataTableError(error, 5));
               return;
            }
            /*
            var compList = $('#companyList');
            compList.children().remove();
            */
            companyList = JSON.parse(data.RRZResult);
            var AmountPaid = 0, payment, start = '', end = '';
            $('#tblItems').dataTable().dataTable().fnClearTable();
            for (var i = 0; i < companyList.length; i++) {
               comp = companyList[i];

               startEnd = '';
               AmountPaid = 0;
               for (var j = 0; j < comp.Payments.length; j++) {
                   payment = comp.Payments[j];
                   AmountPaid += payment.AmountPaid;
               }

               if (comp.DateStart && comp.DateExpires) {
                   start = comp.DateStart.DateWCF();
                   end = comp.DateExpires.DateWCF();
               }

               $('#tblItems')
                     .dataTable()
                     .fnAddData(
                           [
                              {
                                  "0": comp.CompanyName,
                                  "1": comp.PackageName,
                                  "2": comp.PaymentType,
                                  "3": start,
                                  "4": end,
                                  "5": currency + AmountPaid,
                                  "6": '<strong>' + currency + comp.Price + '</strong>',
                                  "7": makeActionDropdown(comp),
                                  "DT_RowId": "the-Item-id-" + comp.CompanyID,
                              }
                           ]
                        );
            }
            $('#tblItems .dropdown-toggle').dropdown();
            //'<a class="btn" href="SystemCompany?id=' + comp.CompanyID + '">view</a>'
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
         $('#companyTBody').html(MakeDataTableError(error, 5));
      }
   });
}

// SystemSignupViewPayments(string secretKey, string invoiceID)
function SystemSignupViewPayments(invID) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "SystemSignupViewPayments";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      invoiceID: invID
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
         var tbody = $('#paymentsTBody');
         if (data.RRZResult) {
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult);
               ShowErrorModal(error);
               tbody.html(MakeDataTableError(error, 5));
               return;
            }
            /*
                  { ID, DatePaid, AmountPaid, InvoiceID}
            */
            paymentList = JSON.parse(data.RRZResult);
            var payment;
            $('#tblPayments').dataTable().dataTable().fnClearTable();
            for (var i = 0; i < paymentList.length; i++) {
               payment = paymentList[i];

               $('#tblPayments')
                     .dataTable()
                     .fnAddData(
                           [
                              {
                                 "0": payment.DatePaid ? payment.DatePaid.DateWCF() : '',
                                 "1": currency + payment.AmountPaid,
                                 "DT_RowId": "the-Item-id-" + payment.CompanyID,
                              }
                           ]
                        );
            }
            $('#tblPayments .dropdown-toggle').dropdown();

            var paymentModal = $('#viewPackagePaymentModal');
            $('#capturePackagePayment').attr('data-invoiceid', invID).data('invoiceid', invID);
            var inp = paymentModal.find('input');
            EnableElements(inp);
            paymentModal.modal('show');
            //'<a class="btn" href="SystemCompany?id=' + comp.CompanyID + '">view</a>'
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
         $('#paymentsTBody').html(MakeDataTableError(error, 5));
      }
   });
}

// SystemDeactivateCompanyPackage(string secretKey, string companyPackageID)
function SystemDeactivateCompanyPackage(packID) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "SystemDeactivateCompanyPackage";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyPackageID: packID
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
            SystemGetCompanyPackages();
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
         //$('#paymentsTBody').html(MakeDataTableError(error, 5));
      }
   });
}

// SystemActivateCompanyPackage(string secretKey, string companyPackageID)
function SystemActivateCompanyPackage(packID) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "SystemActivateCompanyPackage";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyPackageID: packID
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
            SystemGetCompanyPackages();
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
         //$('#paymentsTBody').html(MakeDataTableError(error, 5));
      }
   });
}