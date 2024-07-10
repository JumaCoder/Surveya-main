//Global properties
var companyList;
var userList = [];
var selectedUser;
var rolesList = [];

$(function () {
   checkRights('User');
   companyList = [];
   setCountryDDL($('#userCountry'));

   $('#refreshTbl').on('click', function () {
      GetCompanyUsers();
   });

   $('#AddUser').on('click', function () {
      $('#addEditUserModalHead').html('Add New User');
      var addingPanel = $('#addEditUserModal');
      addingPanel.data('id','');
      addingPanel.modal();

      $('#userStatusDiv').hide();
      $('#passwordDiv').show();
      $('#passwordReset').hide();
      $('#emailResend').hide();

      EnableElements(addingPanel.find("*"));
      RemoveReadonly(addingPanel.find("*"));

      addingPanel.find("input,textarea").val('');

      $('#AddEditUserBtn').off('click');
      $('#AddEditUserBtn').on('click', function () {
         AddNewUser();
      });
   });

   $(document).on('click', '.DT_EvokeView', function () {
      $('#addEditUserModalHead').html('Update User');
      var userID = $(this).data('id');
      GetUserToUpdate(userID);

      $('#userStatusDiv').show();

      $('#AddEditUserBtn').off('click');
      $('#AddEditUserBtn').on('click', function () {
         UpdateUser();
      });
   });

   $(document).on('click', '.DT_Activate', function () {
      var userID = $(this).data('id');
      ActivateUser(userID);
   });

   $(document).on('click', '.DT_Deactivate', function (e) {
      e.stopPropagation();
      var userID = $(this).data('id');
      DeactivateUser(userID);
   });


   $(document).on('click', '.DT_Activate2', function () {
      var userID = $(this).data('id');
      ActivateUser(userID, GetUserToUpdate);
   });

   $(document).on('click', '.DT_Deactivate2', function () {
      var userID = $(this).data('id');
      DeactivateUser(userID, GetUserToUpdate);
   });

   $('#resetPassword').click(function () {
      //TODO
   });

   $('#resendEmail').click(function () {
      ResendUserWelcomeEmail();
   });

   $('#resetPassword').click(function () {
      ResetPasswordSendEmail();
   });
});
//GetMyCompanyDetails 

function GetCompanies() {
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
                  var selected = {
                     CompanyID: curComp.compID,
                     CompanyName: curComp.compName
                  }
                  companyList.push(selected);
                  return;
               }
               companyList = JSON.parse(data.RRZResult);
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

   ddl.children().remove();

   opt = $('<option></option>')
      .val('-1')
      .text('None');
   ddl.append(opt);

   for (var i = 0; i < companyList.length; i++) {
      co = companyList[i];
      opt = $('<option></option>')
      .val(co.CompanyID)
      .text(co.CompanyName);
      ddl.append(opt);
   }
}

function GetCompanyRoles() {
   if (typeof(userCode) == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof(curComp) == "undefined" || curComp == null || typeof(curComp.compID) == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   var methodName = "GetAllRolesForCompany";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID
   });

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
            rolesList = JSON.parse(data.RRZResult);
            setCompRoleDDL($('#roleDDL'));
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function setCompRoleDDL(ddl) {
   //var ddl = $('#roleDDL');
   ddl.children().remove();
   var ro, opt;
   for (var i = 0; i < rolesList.length; i++) {
      ro = rolesList[i];
      if (ro.RoleName != "RRZAdministrator") {
         opt = $('<option></option>')
         .val(ro.RoleId)
         .text(ro.RoleName);
         ddl.append(opt);
      }
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

//GetMyCompanyDetails 

function GetCompanyUsers() {

      if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
         ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
         return false;
      }

      if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
         ShowErrorModal("Please select a company whose employees you want to view.");
         return false;
      }

      var methodName = "GetCompanyUsers";
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
            var tbody = $('#userTBody');
            if (data.RRZResult) {
               if (IsError(data.RRZResult)) {
                  var error = CleanError(data.RRZResult);
                  ShowErrorModal(error);
                  tbody.html(MakeDataTableError(error, 6));
                  return;
               }
               //GetCompanies();
               GetCompanyRoles();
               userList = JSON.parse(data.RRZResult);
               var countryCode;

               $('#tblItems').dataTable().dataTable().fnClearTable();
               for (var i = 0; i < userList.length; i++) {
                  person = userList[i];

                  var appr = null;
                  if (person.IsActive) {
                     appr = {
                        key: person.UserId,
                        icon: 'fa fa-times btn',
                        cssClass: 'text-yellow DT_Deactivate',
                        toolTip: 'Deactivate this user'
                     }
                  }
                  else {
                     appr = {
                        key: person.UserId,
                        icon: 'fa fa-check btn',
                        cssClass: 'text-aqua DT_Activate',
                        toolTip: 'Activate this user'
                     }
                  }

                  countryCode = findCountryCodeByName(person.Country);
                  if (!countryCode) { countryCode = ' '; }

                  $('#tblItems')
                      .dataTable()
                      .fnAddData(
                             [
                                 {
                                    "0": person.Firstnames + ' ' + person.Lastname,
                                    "1": person.RoleName,
                                    "2": person.Email,
                                    "3": person.ContactNumber,
                                    "4": countryCode,
                                    "5": //DT_AddCustom(person.UserId, 'fa fa-pencil btn', 'DT_EvokeView', 'Edit') + 
                                         DT_AddCustom(appr.key, appr.icon, appr.cssClass, appr.toolTip),
                                    "DT_RowId": person.UserId,
                                 }
                             ]
                         );

                  $("#tblItems tbody tr").click(function (event) {
                      if ($(event.originalEvent.target).closest('td')[0] == $(event.originalEvent.target).closest('tr')[0].lastChild)
                          return;
                      var userID = this.id;
                      $('#addEditUserModalHead').html('Update User');
                      GetUserToUpdate(userID);
                      $('#userStatusDiv').show();
                      $('#AddEditUserBtn').off('click');
                      $('#AddEditUserBtn').on('click', function () {
                          UpdateUser();
                      });
                  });
               }
            }
         },
         error: function (a, e, d) {
            //ShowModal(e + ' ' + d, "Error Occured.");
         }
      });
}

function showSelectedUser()
{
   var userID = getQueryParameter('id');
   if (userID) {
      $('#addEditUserModalHead').html('Update User');
      var userModal = $('#addEditUserModal');
      GetUserToUpdate(userID);
      userModal.data("id", userID);
      userModal.modal();

      $('#AddEditUserBtn').off('click');
      $('#AddEditUserBtn').on('click', function () {
         UpdateUser();
      });
   }
}

function AddNewUser() {
   var editModal = $('#addEditUserModal');
   if (true) {
      //Page_ClientValidate('new')
      //get all the details
      var name = $('#userFirstname').val();
      var lastname = $('#userLastname').val();
      var email = $('#userEmailAddress').val();
      var password = $('#userPass').val();
      var confPassword = $('#userPassConfirm').val();
      var contactNum = $('#userContactNumber').val();
      var country = $('#userCountry option:selected').text();
      var roleID = $('#roleDDL option:selected').attr('value');
      roleID = roleID.replace('_', ' ');
      var address = $('#userAddress').val();


      var Contact1Fullname = $('#emergencyContact1Fullname').val();
      var Contact1ContactNumber = $('#emergencyContact1ContactNumber').val();
      var Contact1Relationship = $('#emergencyContact1Relationship').val();

      var Contact2Fullname = $('#emergencyContact2Fullname').val();
      var Contact2ContactNumber = $('#emergencyContact2ContactNumber').val();
      var Contact2Relationship = $('#emergencyContact2Relationship').val();

      if (password != confPassword) {
         //error
         ShowErrorModal("Provided passwords do not match");
         return false;
      }
      if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
         //$("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
         return false;
      }

      if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
         ShowErrorModal("Please select a company to add employee to.");
         return false;
      }

      var methodName = "AddUser";
      var jsonData = JSON.stringify({
         secretKey: userCode,
         firstnames: name, lastname: lastname, companyID: curComp.compID,
         contactNumber: contactNum, emailAddress: email,
         password: password, country: country, physicalAddress: address,
         role: roleID,
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
                  ShowErrorModal(error, false, editModal);
                  return;
               }
               var response = JSON.parse(data.RRZResult);
               if (response.Status == 'Success') {

                  editModal.modal('hide');
                  //User added
                  var user = {
                     "name": name, "surname": lastname,
                     "email": email, "cell": contactNum,
                     "countryCode": $('#userCountry option:selected').attr('value'),
                     "compID": curComp.compID, "roleID": roleID
                  };


                  $('#emergencyContact1Fullname').val('');
                  $('#emergencyContact1ContactNumber').val('');
                  $('#emergencyContact1Relationship').val('');

                  $('#emergencyContact2Fullname').val('');
                  $('#emergencyContact2ContactNumber').val('');
                  $('#emergencyContact2Relationship').val('');

                  ShowSuccessModal("User: <strong>" + name + " " + lastname + "</strong> has been created for Company: <strong>" + curComp.compName + "</strong>");
                  GetCompanyUsers();
               }
            }
         },
         error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d, false, editModal);
         }
      });
   }
}

function GetUserToUpdate(userID)
{
   var updatePanel = $('#addEditUserModal');
   updatePanel.data("id", userID);
   updatePanel.attr("data-id", userID);
   updatePanel.modal();

   DisableElements(updatePanel.find("*"));
   MakeReadonly(updatePanel.find("*"));
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   if (typeof userID == "undefined" || userID == null) {
      ShowErrorModal("Please select employee you want to view.");
      return false;
   }

   var methodName = "GetUserDetails";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      theUserID: userID
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
               ShowErrorModal(error, false, updatePanel);
               return;
            }

            selectedUser = JSON.parse(data.RRZResult);
            var countryCode;

            //get all the details
            $('#userFirstname').val(selectedUser.Firstnames);
            $('#userLastname').val(selectedUser.Lastname);
            var userStatusLbl = $('#userStatus');
            var ActivateEmp = $('#activateUser');
            var DeactivateEmp = $('#deactivateUser');
            if (selectedUser.IsActive) {
               userStatusLbl.html('Active');
               userStatusLbl.addClass('text-aqua').removeClass('text-yellow');
               ActivateEmp.hide();
               DeactivateEmp.addClass('DT_Deactivate2').data('id', userID);
               DeactivateEmp.show();
            }
            else {
               userStatusLbl.html('Inactive');
               userStatusLbl.addClass('text-yellow').removeClass('text-aqua');
               ActivateEmp.addClass('DT_Activate2').data('id', userID);
               ActivateEmp.show();
               DeactivateEmp.hide();
            }

            var email = $('#userEmailAddress');
            email.val(selectedUser.Email);
            email.attr('title', "Cannot change user email");

            var company = $('#userCompanyDDL');
            company.val(selectedUser.CompanyID);
            company.attr('title', "Cannot change user company");

            $('#userContactNumber').val(selectedUser.ContactNumber);
            var couCode = getCountryCode(selectedUser.Country);
            $('#userCountry').val(couCode);
            $('#roleDDL').val(selectedUser.RoleID);
            $('#userAddress').val(selectedUser.PhysicalAddress);

            $('#emergencyContact1Fullname').val(selectedUser.EmergencyContact1Fullname);
            $('#emergencyContact1ContactNumber').val(selectedUser.EmergencyContact1ContactNumber);
            $('#emergencyContact1Relationship').val(selectedUser.EmergencyContact1Relationship);

            $('#emergencyContact2Fullname').val(selectedUser.EmergencyContact2Fullname);
            $('#emergencyContact2ContactNumber').val(selectedUser.EmergencyContact2ContactNumber);
            $('#emergencyContact2Relationship').val(selectedUser.EmergencyContact2Relationship);

            $('#passwordDiv').hide();
            $('#passwordReset').show();
            $('#emailResend').show();

            EnableElements(updatePanel.find("*"));
            RemoveReadonly(updatePanel.find("*"));

            MakeReadonly(company);
            MakeReadonly(email);
         }
      },
      error: function (a, e, d) {
         ShowModal(e + ' ' + d, false, updatePanel);
      }
   });
}

function UpdateUser() {
   var editModal = $('#addEditUserModal');
   var userID = editModal.data('id');
   //get all the details
   var name = $('#userFirstname').val();
   var lastname = $('#userLastname').val();
   var email = $('#userEmailAddress').val();
   var password = $('#userPass').val();
   var confPassword = $('#userPassConfirm').val();
   var contactNum = $('#userContactNumber').val();
   var country = $('#userCountry option:selected').text();
   var roleID = $('#roleDDL option:selected').attr('value');
   roleID = roleID.replace('_', ' ');
   var address = $('#userAddress').val();


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

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }
   /*

   string emergencyContact1Fullname, string emergencyContact1ContactNumber, string emergencyContact1Relationship,
            string emergencyContact2Fullname, string emergencyContact2ContactNumber, string emergencyContact2Relationship

   */
   var methodName = "UpdateUser";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: curComp.compID, userID: userID,
      firstnames: name, lastname: lastname, photo: '', roleID: roleID,
      contactNumber: contactNum, country: country, physicalAddress: address,
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
               ShowErrorModal(error, false, editModal);
               return;
            }
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               editModal.modal('hide');

               $('#emergencyContact1Fullname').val('');
               $('#emergencyContact1ContactNumber').val('');
               $('#emergencyContact1Relationship').val('');

               $('#emergencyContact2Fullname').val('');
               $('#emergencyContact2ContactNumber').val('');
               $('#emergencyContact2Relationship').val('');
               GetCompanyUsers();

               //User added
               ShowSuccessModal("User: <strong>" + name + " " + lastname + "</strong> has been updated for Company: <strong>" + curComp.compName + "</strong>");
               //TODO Other stuff
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d, false, editModal);
      }
   });
}
//ResendAddUserInvite(string secretKey, string companyID, string userID)


//DeactivateUser(string secretKey, string companyID, string userID)
function DeactivateUser(userID, callbackFunc) {
   var editModal = $('#addEditUserModal');
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   if (typeof userID == "undefined" || userID == null) {
      ShowErrorModal("Please select user you want to view.");
      return false;
   }

   var methodName = "DeactivateUser";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      userID: userID
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
               if (callbackFunc) {
                  ShowErrorModal(error, false, editModal);
               } else {
                  ShowErrorModal(error);
               }
               return;
            }

            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //User deactivated
               if (callbackFunc) {
                   editModal.modal('hide');
                   window.setTimeout(function () { callbackFunc(userID); }, 2000);
                  
               } else {
                  ShowSuccessModal("User has been deactivated.");
               }
               GetCompanyUsers();
            }
         }
      },
      error: function (a, e, d) {
         ShowModal(e + ' ' + d, false, editModal);
      }
   });
}


//ReactivateUser(string secretKey, string companyID, string userID)
function ActivateUser(userID, callbackFunc) {
   var editModal = $('#addEditUserModal');

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   if (typeof userID == "undefined" || userID == null) {
      ShowErrorModal("Please select user you want to view.");
      return false;
   }

   var methodName = "ReactivateUser";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      userID: userID
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

               if (callbackFunc) {
                  ShowErrorModal(error, false, editModal);
               } else {
                  ShowErrorModal(error);
               }
               return;
            }

            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //User activated
               if (callbackFunc) {
                   editModal.modal('hide');
                   window.setTimeout(function () { callbackFunc(userID); }, 2000);
               } else {
                  ShowSuccessModal("User has been activated.");
               }
               GetCompanyUsers();
            }
         }
      },
      error: function (a, e, d) {
         ShowModal(e + ' ' + d, false, editModal);
      }
   });
}

function ResendUserWelcomeEmail() {
   var editModal = $('#addEditUserModal');
   var userID = editModal.attr('data-id');

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      //$("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   var methodName = "ResendAddUserInvite";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      userID: userID
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
               ShowErrorModal(error, false, editModal);
               return;
            }
            var response = JSON.parse(data.RRZResult);
            editModal.modal('hide');
            if (response.Status == 'Success') {
               //User added
               ShowSuccessModal("Email has been sent to user.");
               //TODO Other stuff

               GetCompanyUsers();
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d, false, editModal);
      }
   });
}

function ResetPasswordSendEmail() {
   var editModal = $('#addEditUserModal');
   var userID = editModal.attr('data-id');;

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof selectedUser == "undefined" || selectedUser == null ||
      typeof selectedUser.Email == "undefined" || selectedUser.Email == null ||
      selectedUser.Email.length <= 0) {
      ShowErrorModal("No user or user email address found.", false);
      return false;
   }

   var company = $('#userCompanyDDL option:selected').attr('value');

   var methodName = "ResetPassword";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      emailAddress: selectedUser.Email
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
               ShowErrorModal(error, false, editModal);
               return;
            }
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               editModal.modal('hide');

               GetCompanyUsers();
               //User added
               ShowSuccessModal("Email has been sent to user.");
               //TODO Other stuff
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d, false, editModal);
      }
   });
}