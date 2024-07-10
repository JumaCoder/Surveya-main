//Global properties
var userCompanies = [];
var userList = [];
var vaccCount = 0;

$(function () {
   checkRights('User');

   setCountryDDL($('#userCountry'));
   setRoleDDL($('#roleDDL'));
   if(user && user.IsAdmin)
   {
      var moreBtnSpan = $('#moreBtnSpan');
      var sysBtn = $('<a href="SystemCompanies" class="btn btn-primary" title="Manage system companies">' +
         '<i class="fa fa-building-o"></i></a>');
      moreBtnSpan.append(sysBtn);
   }

   $('#refreshProfile').on('click', function () {
      GetMyDetails();
   });


   $('#userHasAllergy').on('change', function () {

      var checked = $('#userHasAllergy').is(':checked');
      var descr = $('#userAllergyDescription');
      var descDiv = $('#userAllergyDescDiv');
      if(!checked)
      {
         MakeReadonly(descr);
         descr
            .removeAttr('required')
            .attr('title', 'No allergies to describe')
            .attr('placeholder', 'No allergies to describe');

         descDiv.hides('800');
      }
      else {
         RemoveReadonly(descr);
         descr
            .attr('required', 'required')
            .attr('title', 'Describe your allergies')
            .attr('placeholder', 'Allergy Description');

         descDiv.show('800');
      }
   });

   $('#addVaccination').on('click', function () {
      makeVaccRow(vaccCount, null);
      vaccCount++;
      //TODO   add another list item

   });

   $('#SaveUserDetails').on('click', function () {
      UpdateMyDetails();
   });
   //vaccDiv1
   $(document).on('click', '.removeVac', function () {
      var index = $(this).data('vaccindex');
      var removeVaccDiv = $('#vaccDiv' + index);
      removeVaccDiv.remove();
   });

   $(document).on('click', '.viewDocInfo', function () {
      var docItem = $(this);
      var id = docItem.data('did');
      var index = docItem.data('index');

      getThiDocument(id);
   })
});
//GetAllCompanies 

function GetMyCompanyDetails() {
   if (true) {
      if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
         ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
         return false;
      }

      var methodName = "GetMyCompanyDetails";
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
                  ShowErrorModal(error);
                  return;
               }
               userCompanies = JSON.parse(data.RRZResult);
               setUserCompanyDDL($('#userCompanyDDL'));
            }
         },
         error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
         }
      });
   }
}

function setUserCompanyDDL(ddl) {
   //var ddl = $('#roleDDL');
   var co, opt;

   opt = $('<option></option>')
      .val('-1')
      .text('None');
   ddl.append(opt);

   for (var i = 0; i < userCompanies.length; i++) {
      co = userCompanies[i];
      opt = $('<option></option>')
      .val(co.CompanyID)
      .text(co.CompanyName);
      ddl.append(opt);
   }
}

function showView()
{
    var btn = $('.DT_EvokeView');
    if (btn)
    {
        btn.show();
    }
}

function showAdd() {
    var btn = $('#AddUser');
    if (btn) {
        btn.show();
    }
}

function showEdit() {
    var btn = $('#EditUser');
    if (btn) {
        btn.show();
    }
}

function showDelete() {
    var btn = $('#DeleteUser');
    if (btn) {
        btn.show();
    }
}

//GetMyDetails 

function GetMyDetails()
{
   var updatePanel = $('#profileDiv');
   $('#vaccinationsDiv').children().remove();
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "GetMyDetails";
   var jsonData = JSON.stringify({
      secretKey: userCode
   });

   //maka AJAX call
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

            //updatePanel.removeClass('makeLabels')
            EnableElements(updatePanel.find("input, select, textarea").not($("#DocumentList").find("input, select, textarea")));
            RemoveReadonly(updatePanel.find("input, select, textarea").not($("#DocumentList").find("input, select, textarea")));
            /*
            DisableElements($("#DocumentList").find("input, select, textarea").not("input[type='button']"));
            RemoveReadonly($("#DocumentList").find("input, select, textarea").not("input[type='button']"));
            */
            var response = JSON.parse(data.RRZResult);

            if (response && response.Status == 'Success') {
               GetMyDocuments();
               var thisUser = JSON.parse(response.User);
               var countryCode;


               //get all the details
               $('#userFirstname').val(thisUser.Firstnames);
               $('#userLastname').val(thisUser.Lastname);
               $('#userContactNumber').val(thisUser.ContactNumber);

               $('#addDocument').attr('href', 'DocumentUploader?dir="/Users/' + thisUser.Firstnames + ' ' + thisUser.Lastname+'"');

               var email = $('#userEmailAddress');
               email.val(thisUser.Email);
               email.attr('title', "Cannot change email");
               DisableElements(email);

               var couCode = '';
               if (thisUser.Country && thisUser.Country.length > 3) {
                  couCode = getCountryCode(thisUser.Country);
               }
               else {
                  couCode = thisUser.Country;
               }
               $('#userCountry').val(couCode);

               $('#userAddress').val(thisUser.PhysicalAddress);
               $('#userPassportNumber').val(thisUser.PassportNumber);

               if (thisUser.PassportExpiryDate) {
                  $('#userPassportExpiryDate').val(thisUser.PassportExpiryDate.DateWCF());
               }

               $('#userMedicalAidName').val(thisUser.MedicalAidName);
               $('#userMedicalAidNumber').val(thisUser.MedicalAidNumber);
               $('#userMedicalAidContactNumber').val(thisUser.MedicalAidContactNumber);

               $('#userBloodType').val(thisUser.BloodType);
               if (thisUser.HasAllergy) {
                  $('#userHasAllergy').prop('checked', true);
                  $('#userAllergyDescription').val(thisUser.AllergyDescription);
               }

               $('#userSafetyBootsSize').val(thisUser.SafetyBootsSize);
               $('#highVisibilityVestSize').val(thisUser.HighVisibilityVestSize);


               $('#emergencyContact1Fullname').val(thisUser.EmergencyContact1Fullname);
               $('#emergencyContact1ContactNumber').val(thisUser.EmergencyContact1ContactNumber);
               $('#emergencyContact1Relationship').val(thisUser.EmergencyContact1Relationship);

               $('#emergencyContact2Fullname').val(thisUser.EmergencyContact2Fullname);
               $('#emergencyContact2ContactNumber').val(thisUser.EmergencyContact2ContactNumber);
               $('#emergencyContact2Relationship').val(thisUser.EmergencyContact2Relationship);

               var vaccinations = JSON.parse(response.Vaccinations);
               var vacc;
               for (var i = 0; i < vaccinations.length; i++) {
                  vacc = vaccinations[i];
                  makeVaccRow(i, vacc);
                  vaccCount++;
               }

            }
         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}


function UpdateMyDetails() {

   //get all the details
   var name = $('#userFirstname').val();
   var lastname = $('#userLastname').val();
   var contactNum = $('#userContactNumber').val();
   var country = $('#userCountry option:selected').text();

   var address = $('#userAddress').val();
   var userPass = $('#userPassportNumber').val();
   var userPassExpDate = $('#userPassportExpiryDate').val();

   var medicalAidName = $('#userMedicalAidName').val();
   var medicalAidNumber = $('#userMedicalAidNumber').val();
   var medicalAidContactNumber = $('#userMedicalAidContactNumber').val();

   var bloodType = $('#userBloodType option:selected').text();
   var hasAllergy = $('#userHasAllergy').is(':checked');
   var allergyDescription = null;
   if (hasAllergy) {
      allergyDescription = $('#userAllergyDescription').val();
   }

   var bootsSize = $('#userSafetyBootsSize').val();
   var vestSize = $('#highVisibilityVestSize').val();

   var Contact1Fullname = $('#emergencyContact1Fullname').val();
   var Contact1ContactNumber = $('#emergencyContact1ContactNumber').val();
   var Contact1Relationship = $('#emergencyContact1Relationship').val();

   var Contact2Fullname = $('#emergencyContact2Fullname').val();
   var Contact2ContactNumber = $('#emergencyContact2ContactNumber').val();
   var Contact2Relationship = $('#emergencyContact2Relationship').val();


   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      //$("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
      return false;
   }

   var vacc = [];
   vacc = getVaccList();

   var methodName = "UpdateMyDetails";
   var jsonData = JSON.stringify({
      secretKey: userCode, firstnames: name, lastname: lastname, photo: '',
      contactNumber: contactNum, country: country, physicalAddress: address,
      passportNumber: userPass, passportExpiryDate: userPassExpDate, medicalAidName: medicalAidName, medicalAidNumber: medicalAidNumber,
      medicalAidContactNumber: medicalAidContactNumber, bloodType: bloodType, hasAllergy: hasAllergy, allergyDescription: allergyDescription,
      safetyBootsSize: bootsSize, highVisibilityVestSize: vestSize, vaccinations: JSON.stringify(vacc),
      emergencyContact1Fullname: Contact1Fullname, emergencyContact1ContactNumber: Contact1ContactNumber, emergencyContact1Relationship: Contact1Relationship,
      emergencyContact2Fullname: Contact2Fullname, emergencyContact2ContactNumber: Contact2ContactNumber, emergencyContact2Relationship: Contact2Relationship
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
               //User added
               ShowSuccessModal("Details have been updated.");
               //TODO Other stuff
               user.Firstnames = name;
               user.Lastname = lastname;
               $(document).find('.userName').html(user.Firstnames + ' ' + user.Lastname);
               GetMyDetails();
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function makeVaccRow(index, vac) {
   var vaccListDiv = $('#vaccinationsDiv');
   var name = '', date = '';

   if (vac)
   {
      name = vac.VaccinationName;
      date = vac.VaccinationExpiryDate ? vac.VaccinationExpiryDate.DateWCF() : '';
   }

   var vaccDiv = $('<div></div>')
      .attr('id', 'vaccDiv' + index);

   var div1 = $('<div></div>')
      .addClass('col-xs-12 col-md-6')
   .html('<div class="form-group">' +
   '<input type="text" value="' + name + '" data-vacc="vaccname' + index + '" placeholder="Vaccination Name" title="Vaccination Name" class="vaccControl form-control">' +
   '</div>');

   vaccDiv.append(div1);

   var div2 = $('<div></div>')
      .addClass('col-xs-10 col-md-5')
   .html('<div class="form-group has-feedback">' +
   '<input value="' + date + '" type="date" data-vacc="vaccdate' + index + '" placeholder="Vaccination Expiry Date" title="Vaccination Expiry Date" class="vaccControl form-control">' +
   '<span class="fa fa-calendar form-control-feedback"></span></div>');

   vaccDiv.append(div2);

   var div3 = $('<div></div>')
      .addClass('col-xs-1')
   .html('<a data-vaccIndex="' + index + '" class="btn btn-sm btn-flat btn-danger removeVac"><i class="fa fa-times"></i></a>');

   vaccDiv.append(div3);

   vaccListDiv.append(vaccDiv);
}

function getVaccList()
{
   var vacc = [];
   var vaccName, vaccDate, vaccNameVal, vaccDateVal;
   var vaccDiv = $(document).find('.vaccControl');

   for (var i = 0; i < vaccCount; i++) {
      vaccName = vaccDiv.filter('[data-vacc="vaccname' + i + '"]');
      vaccDate = vaccDiv.filter('[data-vacc="vaccdate' + i + '"]');

      if(vaccName && vaccDate)
      {
         vaccNameVal = vaccName.val();
         vaccDateVal = vaccDate.val();

         if (vaccNameVal && vaccDateVal) {
            var vacObj = {
               name: vaccNameVal,
               expiryDate: vaccDateVal
            }
            vacc.push(vacObj);
         }
      }
   }
   return vacc;
}


//GetMyDetails 

function GetMyDocuments() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "getMyDocuments";
   var jsonData = JSON.stringify({
      secretKey: userCode
   });

   //maka AJAX call
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

            docList = JSON.parse(data.RRZResult);
            $('#documentsDiv').children().remove();
            if (docList) {
               var doc;
               for (var i = 0; i < docList.length; i++) {
                  doc = docList[i];
                  makeDocRow(i, doc);
               }
            }
         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}


function makeDocRow(index, doc) {
   var docListDiv = $('#documentsDiv');
   var name = '', typeNum = '', id = '';

   if (doc) {
      name = doc.Name;
      typeNum = doc.TypeNumber;
      id = doc.ID;
   }

   var docDiv = $('<div></div>')
      .attr('id', 'docDiv' + index);

   var div1 = $('<div></div>')
      .addClass('col-xs-12 col-md-5')
    .attr('data-userid', doc.UserID)
   .html('<div class="form-group">' +
   '<input type="text" disabled="disabled" readonly="readonly" value="' + name + '" data-doc="docname' + index + '" placeholder="Document Name" title="Document Name" class="vaccControl form-control">' +
   '</div>');

   docDiv.append(div1);

   var div2 = $('<div></div>')
      .addClass('col-xs-10 col-md-5');

   var formGr = $('<div></div>')
      .addClass('form-group');

   var select = $('#docTypeSelectTemplate').html();

   select.replace('[index]', index);

   formGr.append(select);
   div2.append(formGr);
   docDiv.append(div2);

   var div3 = $('<div></div>')
      .addClass('col-xs-2')
   .html('<a href="DocumentViewer?DocID=' + id + '" target="_blank" class="btn btn-sm btn-flat bg-blue viewDocInfo"><i class="fa fa-bars"></i> | Edit</a>');

   docDiv.append(div3);

   docListDiv.append(docDiv);
   docDiv.find("select").val(typeNum);
}


function getThiDocument(docID) {

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "getMyDocumentDetails";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      docID: docID
   });

   //maka AJAX call
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

            var thisDoc = JSON.parse(data.RRZResult);

            var docModal = $('#viewDocumentModal');
            docModal.attr('data-docid', docID);

            thisDoc.ID;
            $('#docTypeNum').val(thisDoc.TypeNumber);
            $('#docName').val(thisDoc.Name);
            $('#docTypeDesc').val(thisDoc.TypeDescription);
            //$('#docName').val(thisDoc.Link);
            $('#docExpiryDate').val(thisDoc.ExpiryDate);
            //$('#docName').val(thisDoc.UserID);
            $('#companyProjects').val(thisDoc.ProjectID);
            $('#docIsProjectSpecific').prop('checked', thisDoc.IsProjectSpecific)
            docModal.modal('show');

         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}