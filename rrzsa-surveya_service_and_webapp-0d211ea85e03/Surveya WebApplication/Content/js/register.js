$(function () {
   var months = getQueryParameter('numOfMonths');
   if (months) {
      numOfMonths = 1 * months;
   }

   setCountryDDL($('#userCountry'));
   setCountryDDL($('#compCountry'));

   $('a[data-toggle="tab"]').on('click', function (e) {
      if ($(this).parent('li').hasClass('disabled')) {
         e.preventDefault();
         e.stopImmediatePropagation();
         return false;
      }
   });

   $(document).on('click', '.selectPackage', function () {

      var packageId = $(this).data('id');
      var thisPanel = $(this).closest('.panel');

      var thisBtn = thisPanel.find('.selectPackage');

      thisBtn.removeClass('btn-info').addClass('btn-success');
      thisPanel.removeClass('panel-info').addClass('panel-success');

      var allOtherPanels = $('#packageList').find('.panel').not(thisPanel);
      allOtherPanels.removeClass('panel-success').addClass('panel-info');

      var allOtherBtns = allOtherPanels.find('.selectPackage');
      allOtherBtns.removeClass('btn-success').addClass('btn-info');

      getSelectedPackageFeatures(packageId);
   });
   $('#backToPackageTab').on('click', function () {
      showPackageTab();
   });

   $('#validateUser').on('click', function () {
      validateUser();
   });

   $('#backToUserTab').on('click', function () {
      showUserTab();
   });

   $('#userPassConfirm').change(function () {

      var pWordInp = $('#userPass');
      var pWordConfInp = $('#userPassConfirm');

      if (pWordConfInp.val()) {
         if (pWordInp.val() !== pWordConfInp.val()) {
            pWordInp.closest('.form-group').removeClass('has-success').addClass('has-error');
            pWordConfInp.closest('.form-group').removeClass('has-success').addClass('has-error');

            $('#validateUser').addClass('disabled').attr('disabled', 'disabled');
         }
         else {
            pWordInp.closest('.form-group').removeClass('has-error').addClass('has-success');
            pWordConfInp.closest('.form-group').removeClass('has-error').addClass('has-success');

            $('#validateUser').removeClass('disabled').removeAttr('disabled');
            window.setTimeout(
               function () {
                  $('#userPass').closest('.form-group').removeClass('has-success');
                  $('#userPassConfirm').closest('.form-group').removeClass('has-success');
               }, 2000);
         }
      }
   });

   
   $('#forComp, #forSole').on('ifChecked', function () {
      var chk = $(this);

      var coLbl = $('#compNameLbl');
      var coInp = $('#compName');
      var regLbl = $('#registrationNumberLbl');
      var regInp = $('#registrationNumber');
      switch (chk.val()) {
         case 'Company':
            coLbl.html('Company Name<small>*</small>');
            coInp.attr('placeholder', 'Company Name*');
            regLbl.html('Registration Number');
            regInp.attr('placeholder', 'Registration Number');
            break;
         case 'SoleProprietor':
            coLbl.html('Trading Name<small>*</small>');
            coInp.attr('placeholder', 'Trading Name*');
            regLbl.html('ID Number');
            regInp.attr('placeholder', 'ID Number');
            break;
      }
   });

   $('#compHasVAT').on('ifChecked', function () {
      $('#vatNumber').attr('required', 'required').show('800');
      $('#vatNumberLbl').show('800');
   });

   $('#compHasVAT').on('ifUnchecked', function () {
      $('#vatNumber').removeAttr('required').hide('800');
      $('#vatNumberLbl').hide('800');
   });

   $('#compHasPurchaseOrderNumber').on('ifChecked', function () {
      $('#purchaseOrderNumber').attr('required', 'required').show('800');
      $('#purchaseOrderNumberLbl').show('800');
   });

   $('#compHasPurchaseOrderNumber').on('ifUnchecked', function () {
      $('#purchaseOrderNumber').removeAttr('required').hide('800');
      $('#purchaseOrderNumberLbl').hide('800');
   });

   $('#validateCompany').on('click', function () {
      ValidateCompany();
   });
   $('#backCompanyTab').on('click', function () {
      showCompanyTab();
   });

   $('#CompleteSignUp').on('click', function () {
      NewUserSignup();
   });
   
   $("#selectAnotherPackage").on("click", function () {
       window.location.href = selectAnotherPackageURL;
   });


});


function StartWebAccountActivation()
{
    if (Page_ClientValidate('upgrade'))
    {
        var username = $('#txtUsernameUpgrade').val();
    }
}

var allPackages = [];
var allFeatures = [];
var selectedFeatureList = [];
var selectedPackage;

var userDetails = {
   username: null, firstname: null, lastname: null,
   contactNumber: null, emailAddress: null, password: null,
   physicalAddress: null, postalcode: null, city: null,
   country: null
};

var companyDetails = {
   companyName: null, registrationNumber: null, isVatRegistered: null,
   billingEmail: null, altBillingEmail: null,
   physicalAddress: null, postalcode: null, city: null,
   country: null,
   vatNumber: null, physicalAddress: null
};

var smallImgWithBase;
var smallImgNoBase;

var numOfMonths = 1;

function GetAllFeatures() {

   var methodName = "GetAllFeatures";
   var jsonData = JSON.stringify({
      isActive: true
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

            allFeatures = JSON.parse(data.RRZResult);
            GetThisPackage();
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d + ' - ' + 'Error Occured.');
      }
   });
}

function GetAllPackages() {

   var methodName = "GetAllPackages";
   var jsonData = JSON.stringify({
      isActive: true
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
            var pkg;
            var pkgListDiv = $('#packageList');
            pkgListDiv.children().remove();
            for (var i = 0; i < allPackages.length; i++) {
               pkg = allPackages[i];
               var pkgDiv = makePackageDiv(pkg);
               pkgListDiv.append(pkgDiv);
            }
            initCheck();
            initTooltip();
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d + ' - ' + 'Error Occured.');
      }
   });
}

function GetThisPackage() {
   /*
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }
   */
   var packID = getQueryParameter('packageID');
   if (packID == false) {
      ShowErrorModal('Invalid packageID, please ensure you have the full hyperlink.');
      return false;
   }

   var methodName = "GetSpecificPackage";
   //secretKey: userCode,
   var jsonData = JSON.stringify({
      packageID: packID
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

            var pkgListDiv = $('#packageList');
            pkgListDiv.children().remove();

            var pkg = JSON.parse(data.RRZResult);
            selectedPackage = pkg;

            var pkgDiv = makePackageDiv(pkg);
            pkgListDiv.append(pkgDiv);

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


            initCheck();
            initTooltip();
            initDatepicker();
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d + ' - ' + 'Error Occured.');
      }
   });
}

function getFeaturePrice()
{
   for (var i = (selectedPackage.features.length-1); i >=0 ; i--) {
      ft = selectedPackage.features[i];
      ftPos = selectedFeatureList.indexOf(ft.Name);
      if (ftPos == -1) {
         // This feature is not selected   REMOVE IT
         selectedPackage.features.splice(i, 1);
      }
   }
}

function makePackageDiv(packObj)
{
   var col = $('<div>').addClass('col-sm-12 col-md-10 col-md-offset-1 text-center');
   var panel = $('<div>').addClass('box box-pricing');

   var pHead = $('<div>').addClass('box-header with-border')
               .html('<h3>' + packObj.PackageName + '<br/> <sup>' + currency + '</sup>' + '<span class="packagePrice">' + packObj.Price + '</span></h3>');
   panel.append(pHead);

   var inf = '&infin;';
   var proj = (packObj.NumberOfProjects > 999 ? inf : (packObj.NumberOfProjects + ''));
   var surv = (packObj.NumberOfSurveys > 999 ? inf : (packObj.NumberOfSurveys + ''));
   var user = (packObj.NumberOfUsers > 999 ? inf : (packObj.NumberOfUsers + ''));
   var question = (packObj.NumberOfQuestions > 999 ? inf : (packObj.NumberOfQuestions + ''));
   var resp = (packObj.NumberOfResponses > 999 ? inf : (packObj.NumberOfResponses + ''));

   var s = 's';
   var LIs = '';

   if (packObj.Description) {
       LIs += '<li class="list-group-item"><h4>' + packObj.Description + '</h4></li>';
   }

   LIs += '<li class="list-group-item"><i class="fa icon-projects"></i>&nbsp;&nbsp;&nbsp;<strong>' + proj + '</strong> Project' + (packObj.NumberOfProjects > 1 ? s : '') + '</li>' +
   '<li class="list-group-item"><i class="fa icon-surveys"></i>&nbsp;&nbsp;&nbsp;<strong>' + surv + '</strong> Survey' + (packObj.NumberOfSurveys > 1 ? s : '') + '</li>' +
   '<li class="list-group-item"><i class="fa icon-users"></i>&nbsp;&nbsp;&nbsp;<strong>' + user + '</strong> User' + (packObj.NumberOfUsers > 1 ? s : '') + '</li>' +
   '<li class="list-group-item"><i class="fa fa-question-circle-o"></i>&nbsp;&nbsp;&nbsp;<strong>' + question + '</strong> Question' + (packObj.NumberOfQuestions > 1 ? s : '') + '</li>' +
   '<li class="list-group-item"><i class="fa fa-list"></i>&nbsp;&nbsp;&nbsp;<strong>' + resp + '</strong> Response' + (packObj.NumberOfResponses > 1 ? s : '') + '</li>';

   var ul = $('<ul>').addClass('list-group text-left')
               .html(LIs);
   panel.append(ul);

   var fBody = $('<div>').addClass('box-header with-border text-center')
               .html('<h4>Customize Package Features</h4>');
   panel.append(fBody);

   var fList = makeFeatureList(packObj);
   panel.append(fList);

   /*var footer = '<div class="box-footer"><div class="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">' +
      '<a data-id="' + packObj.ID + '" class="btn btn-lg btn-block btn-link text-center selectPackage">Continue<span class="hidden-xs"> with your registration</span></a>' +
      '</div></div>';
   panel.append(footer);*/


   var footer = '<div class="box-footer" >'+
                    '<div class="col-xs-12 col-sm-5 col-md-4 pull-left text-left">' +
                        '<a href="'+selectAnotherPackageURL+'" id="selectAnotherPackage" class="btn btn-md btn-block btn-flat btn-sur-sec">Select another <span class="hidden-lg"><br/></span>package</a>' +
                     '</div>' +
                     '<div class="col-xs-12 col-sm-5 col-md-4 pull-right  text-right">' +
                        '<a data-id="' + packObj.ID + '" class="btn btn-md btn-block btn-flat btn-sur-prim selectPackage">Continue <span class="hidden-lg"><br/></span>with your registration</a>' +
                     '</div>' +
                '</div>';
   panel.append(footer);


   col.append(panel);
   return col;
}

function makeFeatureList(packObj) {
   var packID = packObj.ID;
   var features = packObj.features;

   var ul = $('<div>')
        .attr('data-id', packID)
        .addClass('text-left box-header with-border featureList bg-light-gray');

   var li, checkB, lbl, ft;

   // START QuestionTypes list item

   var inpt, fAny, fPrice;
   for (var i = 0; i < allFeatures.length; i++) {
      fAny = allFeatures[i];

          //Some features don't have a description so we use it's friendly name
         fAny.Description = fAny.Description ? fAny.Description : fAny.FriendlyName;

      fPrice = 0;
      li = $('<div>').addClass('col-xs-12 col-sm-6 col-lg-4 flexy no-padding');
      checkB = $('<div>').addClass('checkbox');
      checkB.attr('title', fAny.Description + " (not available for package)");
      lbl = $('<label>');

      ft = getThisFeature(fAny.Name, features);
      if (ft) {
         fPrice = ft.OptionalPrice;
         inpt = '<input type="checkbox" value="' + fAny.Name + '" data-price="' + fPrice + '" />';
         
         if (!ft.OptionalFeature) {
            //inpt = '<input type="checkbox" value="' + fAny.Name + '" data-price="' +
            //   fPrice + '" checked="checked" disabled="disabled" />';
            inpt = '<i class="fa fa-check text-success textX2"></i>';
            checkB.attr('title', fAny.Description + " (comes with package)");
         }
         else {
             inpt = '<input type="checkbox" value="' + fAny.Name + '" data-price="' + fPrice + '" />';
             checkB.attr('title', fAny.Description + " (optional for package)");
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
         inpt = $('<i class="fa fa-times text-danger textX2"></i>');
      }

      lbl.append(inpt);
      lbl.append('&nbsp;&nbsp;');
      lbl.append(fAny.FriendlyName + ' <strong>('+currency + fPrice + ')</strong>');

      checkB.append(lbl);
      li.append(checkB);
      ul.append(li);
   }
   return ul;
}


function showPackageTab() {
   //Now switch to the User Details tab

   $('#currTabHeader').html('Customise your package');
   $('.nav-tabs-custom #packageTab').tab('show');
}

function getThisFeature(fName,features)
{
   if(!features || features.length==0)
   { return null; }
   else {
      var ft;
      for (var i = 0; i < features.length; i++) {
         ft = features[i];
         if(ft.Name==fName)
         { return ft;}
      }
      return null;
   }
}

function showUserTab()
{
   //If user picked the en only require Usename,Email & Password
   //selectedPackage
   /*
   if (selectedPackage.PackageName == "Free")
   {
      var notFreeUserDiv = $('#notFreeUserDiv').hide();
   }
   */
   //Now switch to the User Details tab
    //$('#currTabHeader').html('Enter main user details');
    $('#currTabHeader').html('Account owner');
   $('.nav-tabs-custom #userTab').tab('show');
}

function getSelectedPackageFeatures(packageId) {
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

      var featureIDs = [];
      var ft, ftPos;
      for (var i = selectedPackage.features.length-1; i >=0; i--) {
         ft = selectedPackage.features[i];
         ftPos = selectedFeatureList.indexOf(ft.Name);
         if (ftPos == -1) {
            // This feature is not selected   REMOVE IT
            selectedPackage.features.splice(i, 1);
         }
         else {
            featureIDs.push({ id: ft.ID });
         }
      }
      var idString = JSON.stringify(featureIDs);

      var methodName = "ValidatePackageSignup";
      var jsonData = JSON.stringify({
         packageID: selectedPackage.ID, features: idString
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

               var resp = JSON.parse(data.RRZResult);
               var discount = 0;
               if (numOfMonths == 6) {
                  discount = resp.DiscountPerc6Months;
               }
               else if (numOfMonths == 12) {
                  discount = resp.DiscountPerc12Months;
               }
               selectedPackage.DiscountPerc = discount;
               showUserTab();

            }
         },
         error: function (a, e, d) {
            ShowErrorModal(d);
         }
      });
   }
}

function showCompanyTab() {
   //Now switch to the Company Details tab

   $('#currTabHeader').html('Organisation details');
   $('.nav-tabs-custom #companyTab').tab('show');
}

function validateUser() {
   //  ValidateUserSignUp(string firstname, string lastname, 
   //  string contactNumber, string emailAddress, 
   //  string password, string physicalAddress, string country )

   //has-error


   var fname = $('#userFirstname').val();
   var lname = $('#userLastname').val();
   var email = $('#userEmailAddress').val();

   var pWordInp = $('#userPass');
   var pWordConfInp = $('#userPassConfirm');

   if (pWordInp.val() !== pWordConfInp.val()) {
      pWordInp.closest('.form-group').addClass('has-error');
      pWordConfInp.closest('.form-group').addClass('has-error');
      return false;
   }

   var pWord = pWordInp.val();

   var contNum = $('#userContactNumber').val();
   var address = $('#userAddress').val();
   var uPostal = $('#userPostalCode').val();
   var uCity = $('#userCity').val();
   var country = $('#userCountry :selected').html();

   var methodName = "ValidateUserSignUp";
   var jsonData = JSON.stringify({
      firstname: fname, lastname: lname,
      contactNumber: contNum, emailAddress: email,
      password: pWord, physicalAddress: address,
      postalCode: uPostal, city: uCity, country: country
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

            var resp = JSON.parse(data.RRZResult);
            if (resp.Status == 'Success')
            {
               showCompanyTab();

               userDetails = {
                  firstname: fname, lastname: lname, contactNumber: contNum,
                  emailAddress: email, password: pWord, physicalAddress: address,
                  postalCode: uPostal, city: uCity, country: country
               };

               $('#companyBillingEmailAddress').val($('#userEmailAddress').val());

               $('#compAddress').val($('#userAddress').val());
               $('#compPostalCode').val($('#userPostalCode').val());
               $('#compCity').val($('#userCity').val());
               //$('#compCountry').val($('#userCountry').val());

               $('#forComp').focus();
            }
            else
            {
               console.error(resp);
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}


function fileChange(element) {
   var reader = new FileReader();
   var thumb = $('#compImg');

   reader.onload = function (e) {
      // get loaded data and render thumbnail.

      var tempImg = new Image();
      tempImg.onload = function () {
         /*
         smallImgNoBase = (resize(tempImg, 500, 500)).toString();
         smallImgNoBase = tempImg;
         smallImgWithBase = reBase64Data(smallImgNoBase);
         thumb.src = smallImgWithBase;
         */
      };
      tempImg.src = e.target.result;
      thumb.attr('src', e.target.result);

      smallImgWithBase = e.target.result;
      smallImgNoBase = cleanBase64Data(smallImgWithBase);//reBase64Data(smallImgNoBase);
   };

   // read the image file as a data URL.
   reader.readAsDataURL(element.files[0]);

};

function showSummaryTab() {
   //Now switch to the Summary tab

   $('#currTabHeader').html('Confirm your details');
   $('.nav-tabs-custom #summaryTab').tab('show');
}

function ValidateCompany() {
   //ValidateCompanySignUp(string companyName, string registrationNumber, 
   // string isVatRegistered, string vatNumber, string physicalAddress)

   var name = $('#compName').val();
   var regNum = $('#registrationNumber').val();
   var billEmail = $('#companyBillingEmailAddress').val();
   var altBillEmail = $('#companyAlternateEmailAddress').val();
   var purchaseOrderNumber = $('#purchaseOrderNumber').val();
   var isVat = $('#compHasVAT').is(':checked');
   var vatNum = $('#vatNumber').val();
   var compAddress = $('#compAddress').val();
   var compPostal = $('#compPostalCode').val();
   var compCity = $('#compCity').val();
   var compCountry = $('#compCountry :selected').html();


   var methodName = "ValidateCompanySignUp";
   var jsonData = JSON.stringify({
      companyName: name, registrationNumber: regNum, 
      billEmail: billEmail, alternateBillEmail: altBillEmail,
      isVatRegistered: isVat, vatNumber: vatNum,
      companyAddress: compAddress, companyPostal: compPostal, companyCity: compCity,
      companyCountry: compCountry, purchaseOrderNumber: purchaseOrderNumber
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

            var resp = JSON.parse(data.RRZResult);
            if (resp.Status == 'Success') {

               companyDetails = {
                  companyName: name, registrationNumber: regNum, isVatRegistered: isVat,
                  vatNumber: vatNum, billEmail: billEmail, alternateBillEmail: altBillEmail,
                  companyAddress: compAddress, companyPostal: compPostal, companyCity: compCity,
                  companyCountry: compCountry, purchaseOrderNumber: purchaseOrderNumber
               };

               showSummaryDetails();
               showSummaryTab();
            }
            else {
               console.error(resp);
            }
         }
      },
      error: function (a, e, d) {
         //modal.modal('hide');
         ShowErrorModal(d);
      }
   });
}

function showSummaryDetails()
{
   // selectedPackage
   // ID, PackageName, Price, NumberOfProjects, NumberOfSurveys,
   // NumberOfUsers, NumberOfQuestions, NumberOfResponses
   // features:
   //       Name, FriendlyName, Description, OptionalPrice

   /*
   //userDetails
      firstname, lastname,
      contactNumber, emailAddress,
      password, physicalAddress, postalCode, city, country

   //companyDetails
      companyName, registrationNumber,
      isVatRegistered, vatNumber, billEmail, alternateBillEmail
      companyAddress, companyPostal, companyCity, companyCountry
   */

   $('#compHeader').html(companyDetails.companyName);
   $('#userHeader').html(userDetails.firstname + ' ' + userDetails.lastname);

   var hashWord = '';
   if (userDetails.password.length > 5)
   { hashWord = '****' + userDetails.password.substring(4) }
   else if (userDetails.password.length = 5)
   { hashWord = '***' + userDetails.password.substring(3) }
   else if (userDetails.password.length = 4)
   { hashWord = '**' + userDetails.password.substring(2) }
   else if (userDetails.password.length = 3)
   { hashWord = '*' + userDetails.password.substring(1) }
   else { hashWord = userDetails.password }

   $('#mainUserDiv').html(
      '<strong>' + userDetails.firstname + ' ' + userDetails.lastname + '</strong><br>' +
      'Password: <strong>' + hashWord + '</strong><br>' +
      'Phone: <strong>' + userDetails.contactNumber + '</strong><br>' +
      'Email: <strong>' + userDetails.emailAddress + '</strong><br>' +
      '<div class="pull-left">Address:&nbsp;</div><div class="pull-left"><strong>' + userDetails.physicalAddress + '</strong><br>' +
      (userDetails.postalCode?'<strong>' + userDetails.postalCode + '</strong><br>':'') +
      (userDetails.city?'<strong>' + userDetails.city + '</strong><br>':'') +
      (userDetails.country?'<strong>' + userDetails.country + '</strong>':'')+
      '</div>'
   );

   $('#companyDiv').html(
      '<strong>' + companyDetails.companyName + '</strong><br>' +
      'Reg #: <strong>' + companyDetails.registrationNumber + '</strong><br>' +
      'VAT #: <strong>' + companyDetails.vatNumber + '</strong><br>' +
      'Billing Email: <strong>' + companyDetails.billEmail + '</strong><br>' +
      'Alternate Billing Email: <strong>' + companyDetails.alternateBillEmail + '</strong><br>' +
      'Purchase Order Number: <strong>' + companyDetails.purchaseOrderNumber + '</strong><br>' +
      '<div class="pull-left">Address:&nbsp;</div><div class="pull-left"><strong>' + companyDetails.companyAddress + '</strong><br>' +
      (companyDetails.companyPostal?'<strong>' + companyDetails.companyPostal + '</strong><br>':'') +
      (companyDetails.companyCity?'<strong>' + companyDetails.companyCity + '</strong><br>':'') +
      (companyDetails.companyCountry?'<strong>' + companyDetails.companyCountry + '</strong>':'')+
      '</div>'
   );

   /*
    +
      'Number Of Projects: <strong>' + selectedPackage.NumberOfProjects + '</strong><br>' +
      'Number Of Surveys: <strong>' + selectedPackage.NumberOfSurveys + '</strong><br>' +
      'Number Of Users: <strong>' + selectedPackage.NumberOfUsers + '</strong><br>' +
      'Number Of Questions: <strong>' + selectedPackage.NumberOfQuestions + '</strong><br>' +
      'Number Of Responses: <strong>' + selectedPackage.NumberOfResponses + '</strong><br>'
      */
   var prodTB = $('#productTB');
   prodTB.children().remove();

   var total = selectedPackage.Price;
   var totalWithDiscount = 0;
   var vatAmount = 0;
   var subtotal = 0;

   prodTB.append(
      '<tr><td>'+selectedPackage.PackageName+'</td>' +
      '<td>' + selectedPackage.Description + '</td>' +
      '<td>' + numOfMonths + '</td>' +
      '<td>' + currency + selectedPackage.Price + '</td></tr>');

   prodTB.append(
      '<tr><td>Number Of Projects</td>' +
      '<td>Number of projects for package</td>' +
      '<td>' + selectedPackage.NumberOfProjects + '</td>' +
      '<td>' + currency + 0 + '</td></tr>');

   prodTB.append(
      '<tr><td>Number Of Surveys</td>' +
      '<td>Number of surveys for package</td>' +
      '<td>' + selectedPackage.NumberOfSurveys + '</td>' +
      '<td>' + currency + 0 + '</td></tr>');

   prodTB.append(
      '<tr><td>Number Of Users</td>' +
      '<td>Number of users for package</td>' +
      '<td>' + selectedPackage.NumberOfUsers + '</td>' +
      '<td>' + currency + 0 + '</td></tr>');

   prodTB.append(
      '<tr><td>Number Of Questions</td>' +
      '<td>Number of questions for package</td>' +
      '<td>' + selectedPackage.NumberOfQuestions + '</td>' +
      '<td>' + currency + 0 + '</td></tr>');

   prodTB.append(
      '<tr><td>Number Of Responses</td>' +
      '<td>Number of responses for package</td>' +
      '<td>' + selectedPackage.NumberOfResponses + '</td>' +
      '<td>' + currency + 0 + '</td></tr>');

   var ft,ftPrice;
   // selectedPackage : [ { Description, FriendlyName, ID, Name, OptionalFeature, OptionalPrice}, ...]
   for (var i = 0; i < selectedPackage.features.length; i++) {
      ft = selectedPackage.features[i];
      ftPrice = 0;
      if(ft.OptionalFeature)
      {
         total += ft.OptionalPrice;
         ftPrice = ft.OptionalPrice;
      }
      prodTB.append(
         '<tr><td>' + ft.FriendlyName + '</td>' +
         '<td>' + ft.Description + '</td>' +
         '<td>' + numOfMonths + '</td>' +
         '<td>' + currency + ftPrice + '</td></tr>');
   }
   total = (total * numOfMonths);
   var totalDiscountAmount = total * (selectedPackage.DiscountPerc / 100);

   totalWithDiscount = total - totalDiscountAmount;
   vatAmount = ((15 / 115) * totalWithDiscount).toFixed(2);
   subtotal = (totalWithDiscount - vatAmount).toFixed(2);

   if (totalDiscountAmount && totalDiscountAmount != 0) {
      $('#discountRow').show();
      $('#prodDiscount').html('('+currency + totalDiscountAmount.toFixed(2)+')');
   }
   else {
      $('#discountRow').hide();

   }

   $('#prodSubtotal').html(currency + subtotal);
   $('#prodVAT').html(currency + vatAmount);
   $('#prodTotal').html('<strong>' + currency + totalWithDiscount.toFixed(2) + '</strong>');
}

function NewUserSignup() {
   // NewUserSignup( 
   //user details 
   /*  firstname, string lastname, string contactNumber, string emailAddress, string password, string physicalAddress, string country, */
   //company details
   /*  companyName, string registrationNumber, string isVatRegistered, string vatNumber, string companyPhysicalAddress, string companyPostalCode, 
       string companyCity, string companyCountry, string billEmail, string alternateBillEmail,  */
   //package details
   /*  packageID, string numberOfMonths, string features */

   var featureIDs = [];
   var ft;
   // selectedPackage : [ { Description, FriendlyName, ID, Name, OptionalFeature, OptionalPrice}, ...]
   for (var i = 0; i < selectedPackage.features.length; i++) {
      ft = selectedPackage.features[i];
      featureIDs.push({ id: ft.ID });
   }

   var idString = JSON.stringify(featureIDs);

   var methodName = "NewUserSignup";
   var jsonData = JSON.stringify({
      firstname: userDetails.firstname, lastname: userDetails.lastname,
      contactNumber: userDetails.contactNumber, emailAddress: userDetails.emailAddress,
      password: userDetails.password, physicalAddress: userDetails.physicalAddress,
      postalCode: userDetails.postalCode, city: userDetails.city, country: userDetails.country,

      companyName: companyDetails.companyName, registrationNumber: companyDetails.registrationNumber,
      isVatRegistered: companyDetails.isVatRegistered, vatNumber: companyDetails.vatNumber,
      billEmail: companyDetails.billEmail, alternateBillEmail: companyDetails.alternateBillEmail,
      companyPhysicalAddress: companyDetails.companyAddress, companyPostalCode: companyDetails.companyPostal, companyCity: companyDetails.companyCity,
      companyCountry: companyDetails.companyCountry, purchaseOrderNumber: companyDetails.purchaseOrderNumber,

      packageID: selectedPackage.ID, features: idString, numOfMonths: numOfMonths
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

            var resp = JSON.parse(data.RRZResult);
            if (resp.Status == 'Success') {
               ShowSuccessModal("Your account has been created and a welcome email has been sent to <strong>" + userDetails.emailAddress + '</strong><br/><br/>Please complete your purchase to receive an invoice');
               $('#CompleteSignUp').addClass('disabled').attr('disabled', 'disabled');

               $('.modal').on('hidden.bs.modal', function () {
                  window.location = '/Account/Login?ReturnUrl=/Administration/PackagePayment';
               });
            }
            else {
               console.error(resp);
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(d);
      }
   });
}