//Global properties
var companyList;
var smallThumbWithBase, smallThumbNoBase,CurCompLogoThumb;
var smallPinWithBase, smallPinNoBase, CurCompLogoPin;
var selectedSkin;

$(function () {
   companyList = [];
   checkRights('Company');

   if (user && user.IsAdmin) {
      var moreBtnSpan = $('#moreBtnSpan');
      if(moreBtnSpan)
      {
         var sysBtn = $('<a href="SystemCompanies" class="btn btn-flat btn-primary" title="Manage system companies">' +
            '<i class="fa icon-company"></i></a>');
         moreBtnSpan.append(sysBtn);
      }
   }

   $('#showAddCompany').click(function () {
      var modal = $('#addEditCompanyModal');
      modal.find('.modal-title').html('Add a Company');
      modal.find('#compLogoDiv').show();
      ClearData(modal.find('input,select'));
      modal.modal();

      $('#addEditCompanyBtn').off();
      $('#addEditCompanyBtn').click(function () {
         AddNewCompany();
      });
   });

   loadJObjFromStore('packages');
   setPackageDDL($('#packageDDL'));
   
   $('#selectComp').on('click', function () {
      var modal = $('#editCompanyModal');
      var coID = modal.attr('data-id');
      setSelectedComp(coID);
   });

   $(document).on('click', '.DT_Evoke', function () {
      var compID = $(this).attr('data-id');
      GetCompanyToEdit(compID);
      var modal = $('#addEditCompanyModal');
      modal.find('.modal-title').html('Edit Company');
      modal.find('#compLogoDiv').show();
      ClearData(modal.find('input,select'));
      modal.attr('data-id', compID);
      modal.modal('show');

      $('#addEditCompanyBtn').off();
      $('#addEditCompanyBtn').click(function () {
         UpdateCompany();
      });
   });

   $('#refreshCompanies').on('click', function () {
      GetAllCompanies();
   });
   initTooltip();


   $('#compLogoUp').change(function (evt) {
      var file = $(this);
      if (file) {
         var fileName = (file.val()).split("\\");
         var text = $('#compLogoTxt');
         text.val(fileName[fileName.length - 1]);
         text.focus();

         //ResizeImg(file, maxWidth, maxHeight, callback)
         ResizeImg(this.files[0], 800, 500,
            function (returnVal) {
               smallThumbNoBase = returnVal;
               smallThumbWithBase = reBase64Data(smallThumbNoBase);
               CurCompLogoThumb = $('#compImg').attr('src');
               $('#compImg').attr('src', smallThumbWithBase);
               $('#logoLg').attr('src', smallThumbWithBase);
               $('#compLogoBtn').removeAttr('disabled');
            });
      }
      event.preventDefault();
   });
   $('#compLogoBtn').click(function () {
      $('#compLogoTxt').val('');
      $(this).attr('disabled', 'disabled');
      var input = $('#compLogoUp');
      smallThumbNoBase = null;
      smallThumbWithBase = null;
      input.replaceWith(input.val('').clone(true));
      $('#compImg').attr('src', CurCompLogoThumb);
      $('#logoLg').attr('src', CurCompLogoThumb);
   });


   $('#compSqLogoUp').change(function (evt) {
      var file = $(this);
      if (file) {
         var fileName = (file.val()).split("\\");
         var text = $('#comSqLogoTxt');
         text.val(fileName[fileName.length - 1]);
         text.focus();

         //ResizeImg(file, maxWidth, maxHeight, callback)
         ResizeImg(this.files[0], 500, 500,
            function (returnVal) {
               smallPinNoBase = returnVal;
               smallPinWithBase = reBase64Data(smallPinNoBase);
               CurCompLogoPin = $('#compSqImg').attr('src');
               $('#compSqImg').attr('src', smallPinWithBase);
               $('#logoMini').attr('src', smallPinWithBase);
               $('#compSqLogoBtn').removeAttr('disabled');
            });
      }
      event.preventDefault();
   });
   $('#compSqLogoBtn').click(function () {
      $('#comSqLogoTxt').val('');
      $(this).attr('disabled', 'disabled');
      var input = $('#compSqLogoUp');
      smallPinNoBase = null;
      smallPinWithBase = null;
      input.replaceWith(input.val('').clone(true));
      $('#compSqImg').attr('src', CurCompLogoPin);
      $('#logoMini').attr('src', CurCompLogoPin);
   });

   $("#MainContent_uploadImgBtn").on('click', function () {

      event.preventDefault();
   });

   $("#MainContent_uploadImgBtn").on('click', function () {

      event.preventDefault();
   });


   $("[data-skin]").on('click', function (e) {
      e.preventDefault();
      selectedSkin = $(this).data('skin');
      change_skin(selectedSkin);
   });

   $('#saveWhiteLabelling').click(function () {
      // TODO
      saveWhiteLabelling();
   });
});

function showView()
{
    var btn = $('.DT_EvokeView');
    if (btn)
    {
        btn.show();
    }
}

function showAdd() {
   var btn = $('#AddCompany');
    if (btn) {
        btn.show();
    }
}

function showEdit() {
   var btn = $('#EditCompany');
    if (btn) {
        btn.show();
    }
}

function showDelete() {
   var btn = $('#DeleteCompany');
    if (btn) {
        btn.show();
    }
}

function showCompanyTable() {
    var person, tbody, tr, td, btn;
    tbody = $('#companyTBody');

    if (tbody) {
        tbody.children().remove();
        var rName;
        for (var i = 0; i < people.length; i++) {
           person = people[i];

           rName = findRoleNameByID(person.roleID);
           if (!rName) { rName = ' '; }

           $('#tblItems')
               .dataTable()
               .fnAddData(
                      [
                          {
                             "0": person.name + ' ' + person.surname,
                             "1": rName,
                             "2": person.email,
                             "3": person.cell,
                             "4": person.countryCode,
                             "5": ' ',
                             "6": DT_AddCustom(person.ID, 'fa fa-pencil btn', 'DT_EvokeView'),
                             "DT_RowId": "the-Item-id-" + person.ID,
                          }
                      ]
                  );
        }
    }
}

function setPackageDDL(ddl) {
   //var ddl = $('#roleDDL');
   var pa, opt;
   for (var i = 0; i < packages.length; i++) {
      pa = packages[i];
      opt = $('<option></option>')
      .val(pa.ID)
      .text(pa.name);
      ddl.append(opt);
   }
}

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

//GetMyCompanyDetails 
//
function GetAllCompanies() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "GetAllCompanies";
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
                                 "0": makeCompanyLogo(comp.CompanyLogo),
                                 "1": comp.CompanyName,
                                 "2": comp.CompanyVatNumber,
                                 "3": comp.CompanyRegistrationNumber,
                                 "4": DT_AddCustom(comp.CompanyID, 'fa fa-pencil btn', 'DT_Evoke'),
                                 "DT_RowId": "the-Item-id-" + comp.CompanyID,
                              }
                           ]
                        );
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
         $('#companyTBody').html(MakeDataTableError(error, 5));
      }
   });
}

function GetCompanyToEdit(compID) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof compID == "undefined" || compID == null || compID.length <= 0) {
      ShowErrorModal("Please select company you want to view.");
      return false;
   }

   var methodName = "GetSpecificCompany";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: compID
   });

   var modal = $('#addEditCompanyModal');

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
               $('#editCompanyModal').find('.text-danger').html(error);
               return;
            }

            var thisCo = JSON.parse(data.RRZResult);
            if (thisCo && thisCo.Status == "Success") {

               modal.find('#compName').val(thisCo.CompanyName);
               modal.find('#registrationNumber').val(thisCo.CompanyRegistrationNumber);
               modal.find('#vatNumber').val(thisCo.CompanyVatNumber);
               modal.find('#physicalAddress').val(thisCo.CompanyAddress);

               if (thisCo.CompanyLogo) {
                  modal.find('#compImg').attr('src', reBase64Data(thisCo.CompanyLogo));
               }
               else {
                   modal.find('#compImg').attr('src', "../Content/Images/placeholder_thumb.png");
               }

               modal.attr('data-id', compID);
               modal.modal();
            }
         }
      },
      error: function (a, e, d) {
         modal.find('.text-danger').html(e + ' ' + d);
      }
   });
}

function UpdateCompany() {
   //Page_ClientValidate('new')
   //get all the details
   var modal = $('#addEditCompanyModal');
   var compID = modal.attr('data-id');
   var name = modal.find('#compName').val();
   var regNum = modal.find('#registrationNumber').val();
   var vatNum = modal.find('#vatNumber').val();
   var physicalAddress = modal.find('#physicalAddress').val();


   var compLogo = smallThumbNoBase ? smallThumbNoBase : '';
   var compLogoSmall = smallPinWithBase ? smallPinWithBase : '';

   //var packageID = modal.find('#packageDDL option:selected').attr('value');
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      modal.modal('hide');
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   var methodName = "EditCompany";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: curComp.compID,
      companyName: name, logoSM: compLogoSmall, logoLG: compLogo,
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
               ShowErrorModal(error, false, modal);
               return;
            }
            modal.modal('hide');
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //company registered
               ShowSuccessModal("Company: <strong>" + name + "</strong> has been updated.");
               //TODO Other stuff
               GetAllCompanies();
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(d, false, modal);
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

function GetMyCompanyDetails() {

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }
   //userCompanies
   var compID;
   if (typeof curComp !== "undefined" && curComp !== null)
   {
      compID = curComp.compID;
   }
   if (typeof compID == "undefined" || compID == null || compID.length <= 0) {
      ShowErrorModal("No company was found to be viewed.");
      return false;
   }

   var methodName = "GetSpecificCompany";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: compID
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
               $('.text-danger').html(error);
               return;
            }

            var thisCo = JSON.parse(data.RRZResult);
            if (thisCo && thisCo.Status == "Success") {

               $('#compName').val(thisCo.CompanyName);
               if (thisCo.CompanyAddress) {
                  $('#compAddress').val(thisCo.CompanyAddress);
               }
               if (thisCo.CompanyLogo) {
                  $('#compImg').attr('src', reBase64Data(thisCo.CompanyLogo));
               }
               else {
                   $('#compImg').attr('src', "../Content/Images/placeholder_thumb.png");
               }
               if (thisCo.CompanyPostalCode) {
                  $('#compPostalCode').val(thisCo.CompanyPostalCode);
               }
               if (thisCo.CompanyCity) {
                  $('#compCity').val(thisCo.CompanyCity);
               }
               if (thisCo.CompanyCountry) {
                  $('#compCountry').val(thisCo.CompanyCountry);
               }
               if (thisCo.CompanyRegistrationNumber) {
                  $('#compRegNum').val(thisCo.CompanyRegistrationNumber);
               }
               if (thisCo.CompanyVatNumber) {
                  $('#compVatNumber').val(thisCo.CompanyVatNumber);
               }
               //thisCo.CompanyPackageID
               /*
               var packageName = getPackageName(thisCo.CompanyPackageID);

               if(packageName)
               { $('#companyPackage').val(packageName) }
               */
               $('#companyPackage').val(thisCo.CompanyPackageName);
            }
         }
      },
      error: function (a, e, d) {
         $('.text-danger').html(d);
      }
   });
}

function getPackageName(packID)
{
   if (!packID) return null;

   packID = packID.toUpperCase();
   var pack;
   for (var i = 0; i < packages.length; i++) {
      pack =packages[i];
      if (packID == pack.ID)
         return pack.name;
   }
   return null;
}
function makeCompanyCard(comp) {
   var card, r1, r2, r3, r4;

   card = $('<div></div>')
   .addClass('companyCard row');

   r1 = $('<div></div>')
   .addClass('col-xs-12');
   var imgDiv = $('<div></div>')
   .addClass('col-xs-10');

   if(comp.CompanyLogo)
   {
      var img = $('<img>')
      .attr('class','img-bordered-sm')
      .attr('height', '40')
      .attr('src', '../Content/Images/Surveyor_thumb.png')
      .attr('alt', 'User Image');
      imgDiv.append(img);
   }
   else
   {
      var img = $('<img>')
      .attr('class', 'img-bordered-sm')
      .attr('height', '40')
      .attr('src', '../Content/Images/Surveyor_thumb.png')
      .attr('alt', 'User Image');
      imgDiv.append(img);
   }

   //CompanyID    

   var selectDiv = $('<div></div>')
   .addClass('pull-right');
   var select = $('<a></a>')
   .addClass('btn btn-default btn-flat selectComp')
   .attr('data-id', comp.CompanyID)
   .html('Select');
   selectDiv.append(select);

   r1.append(imgDiv);
   r1.append(selectDiv);
   card.append(r1);

   r2 = $('<div></div>')
   .addClass('col-xs-12');

   var r2Lbl = $('<div></div>')
   .addClass('col-xs-4 col-md-2')
   .html('Company');

   var r2Val = $('<div></div>')
   .addClass('col-xs-8 col-md-10')
   .html(comp.CompanyName);

   r2.append(r2Lbl);
   r2.append(r2Val);
   card.append(r2);

   r3 = $('<div></div>')
   .addClass('col-xs-12');

   var r3Lbl = $('<div></div>')
   .addClass('col-xs-4 col-md-2')
   .html('VAT #');

   var r3Val = $('<div></div>')
   .addClass('col-xs-8 col-md-10 text-muted')
   .html(comp.CompanyVatNumber);

   r3.append(r3Lbl);
   r3.append(r3Val);
   card.append(r3);

   r4 = $('<div></div>')
   .addClass('col-xs-12');

   var r4Lbl = $('<div></div>')
   .addClass('col-xs-4 col-md-2')
   .html('Reg #');

   var r4Val = $('<div></div>')
   .addClass('col-xs-8 col-md-10 text-muted')
   .html(comp.CompanyRegistrationNumber);

   r4.append(r4Lbl);
   r4.append(r4Val);
   card.append(r4);

   return card;
}


function GetThisCompany(compID) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof compID == "undefined" || compID == null || compID.length <= 0) {
      ShowErrorModal("Please select company you want to view.");
      return false;
   }

   var methodName = "GetSpecificCompany";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: compID
   });

   var modal = $('#editCompanyModal');

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
               $('#editCompanyModal').find('.text-danger').html(error);
               return;
            }

            var thisCo = JSON.parse(data.RRZResult);
            if (thisCo && thisCo.Status == "Success") {

               modal.find('#compName').val(thisCo.CompanyName);
               modal.find('#registrationNumber').val(thisCo.CompanyRegistrationNumber);
               modal.find('#vatNumber').val(thisCo.CompanyVatNumber);
               modal.find('#physicalAddress').val(thisCo.CompanyAddress);

               if (thisCo.CompanyLogo) {
                  modal.find('#compImg').attr('src', reBase64Data(thisCo.CompanyLogo));
               }
               else {
                   modal.find('#compImg').attr('src', "../Content/Images/placeholder_thumb.png");
               }

               modal.attr('data-id', compID);
               modal.modal();
            }
         }
      },
      error: function (a, e, d) {
         modal.find('.text-danger').html(e + ' ' + d);
      }
   });
}

function makeCompanyLogo(CompanyLogo)
{
   var img;
   if (comp.CompanyLogo) {
       img = "<img height='40' src='../Content/Images/placeholder_thumb.png' alt='Company Logo' >";
      /*
      .attr('class', 'img-bordered-sm')
      .attr('height', '40')
      .attr('src', '../Content/Images/Surveyor_thumb.png')
      .attr('alt', 'User Image');
      */
   }
   else {
       img = "<img height='40' src='../Content/Images/placeholder_thumb.png' alt='Company Logo' >";
      /*
      .attr('class', 'img-bordered-sm')
      .attr('height', '40')
      .attr('src', '../Content/Images/Surveyor_thumb.png')
      .attr('alt', 'User Image');
      */
   }
   return img;
}

function getCompByID(id)
{
   var co;
   for (var i = 0; i < companyList.length; i++) {
      co = companyList[i];
      if(id==co.CompanyID)
      {
         return co;
      }
   }
   return null
}

function setSelectedComp(compID) {
   var comp = getCompByID(compID);

   if (comp != null) {

      // TODO get company logos
      logos = defaultLogos;
      curComp = {
         compID: compID,
         compName: comp.CompanyName,
         compLogos: logos
      }
   } else {
      curComp = setDefaultComp();
   }

   $('#curCompImgMini')
   .attr('src', '../../Content/Images/placeholder_pin.png')
   .attr('alt', curComp.compName);

   $('#companyName')
   .html(curComp.compName);

   saveJObjToStore('curComp', curComp);
}

function clearSelectedComp()
{
   companyList = [];
   logos = defaultLogos;
   curComp = {};
}

function saveWhiteLabelling() {
   //var packageID = modal.find('#packageDDL option:selected').attr('value');
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }
    /*
    var my_skins = [
        "skin-blue",
        "skin-black",
        "skin-red",
        "skin-yellow",
        "skin-purple",
        "skin-green",
        "skin-blue-light",
        "skin-black-light",
        "skin-red-light",
        "skin-yellow-light",
        "skin-purple-light",
        "skin-green-light"
    ];
    */

   //var re = /skin-/gi;
   var selectedTheme = selectedSkin;

   var methodName = "SaveWhiteLabelling";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: curComp.compID,
      selectedSkin: selectedSkin, logoSM: smallPinNoBase, logoLG: smallThumbNoBase,
      selectedTheme: selectedTheme
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
               //company registered
                ShowSuccessModal("White-labelling saved.<br/><br/>For branding changes to completely take effect, you will be required to re login.");
               //TODO Other stuff
               saveJObjToStore('skin', selectedSkin);
               if (smallPinNoBase) {
                  CurCompLogoPin = smallPinNoBase;
                  if (user)
                  {
                     user.LogoSM = reBase64Data(smallPinNoBase);
                     }
               }
               if (smallThumbNoBase) {
                  CurCompLogoThumb = smallThumbNoBase;
                  if (user)
                  {
                     user.LogoLG = reBase64Data(smallThumbNoBase);
                  }
               }
               if (user) {
                  user.SelectedSkin = selectedSkin;
               }

                //LOG THE USER OUT
               __doPostBack('ctl00$ctl08', '');
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(d);
      }
   });
}