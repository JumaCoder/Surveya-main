//Global properties
var companyList = [];
var projList = [];
var activityStream = [];

/*

enum ActivityType
        {
            User,
            Document,
            Video,
            Photo,
            Project,
            Survey,
        }

*/
var compUserForProj;

var curProject;
var PrimaryContact;
var lastDateTime;

var showProjOverEdit = false;

$(function () {
   checkRights('User');
   compUserForProj = [];
   lastDateTime = new Date();
   var country = $('#projCountryDDL');
   if (country) { setCountryDDL($('#projCountryDDL')); }
   
   setRoleDDL($('#roleDDL'));

   $('#refreshTbl').on('click', function () {
      GetCompanyProjects();
   });

   $('#AddProj').on('click', function () {
      $('#addEditProjectrModalHead').html('Add New Project');
      $('#addEditProjectModal').modal();
      //Get Primary Contacts
      GetUsersForPrimary();

      $('#AddEditProjBtn').on('click', function () {
         AddNewProj();
      });
   });

   $('#projTabs a[href="#details"]').click(function (e) {
      e.preventDefault();
      $(this).tab('show');

      GetThisProject();
   });
   $('#projTabs a[href="#team"]').click(function (e) {
      e.preventDefault();
      $(this).tab('show');

      GetProjectTeam();
      GetCompanyRoles();

      GetNonTeamUsers();
      GetCompanyRoles();
   });

   $(document).on('click', '.DT_EvokeTeamActivate', function () {
      var userID = $(this).data('id');
      ActivateTeamUser(userID);
   });

   $(document).on('click', '.DT_EvokeTeamDeactivate', function () {
      var userID = $(this).data('id');
      DeactivateTeamUser(userID);
   });

   $(document).on('click', '.DT_EvokeTeamDelete', function () {
      var userID = $(this).data('id');
      RemoveTeamUser(userID);
   });

   $(document).on('click', '.btn-app2', function () {
      var btn = $(this);
      var toClick = btn.data('click');

      if (toClick) {
         document.getElementById(toClick).scrollIntoView();
         $('#' + toClick).trigger('click');
      }
   });

   $('#projTabs a[href="#questions"]').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
      GetProjectSurveys();
   });

   $('#refreshProject').click(function () {
      GetThisProject();
   });

   $('#StartProject').click(function () {
      StartProject();
   });

   $('#EndProject').click(function () {
      EndProject();
   });

   $(document).on('click', '.showImportTeamModal', function () {
      GetProjectsForImport();
   });

   $('#importTeamsBtn').on('click', function () {
      ImportTeamFromProject();
   });

   //projectTimeline

   $('#refreshProjectTimeline').click(function () {
      GetProjectActivityStream(true);
   });

   $(document).find('a[href="#projectTimeline"]').click(function (e) {
      GetProjectActivityStream(true);

      hideAllBtns();
      var allBoxToolBtns = $('#timelineBox').find('.box-tools .btn');
      allBoxToolBtns.show();
   });

   $('#viewMoreTimeBtn').on('click', function () {
      GetProjectActivityStream(false);
   });


   $('#refreshProjectToView').click(function () {
      GetThisProjectToView();
   });

   $(document).find('a[href="#projectOverview"]').click(function (e) {
      showProjOverEdit = true;
      GetThisProjectToView();

      hideAllBtns();
      var allBoxToolBtns = $('#overviewBox').find('.box-tools .btn');
      allBoxToolBtns.show();
   });
   
   $(document).find('a[href="#requiredUserData"]').click(function (e) {
      GetThisProjectRequiredUserData();

      hideAllBtns();
      var allBoxToolBtns = $('#requiredDataBox').find('.box-tools .btn');
      allBoxToolBtns.show();
   });

   $('#refreshRequiredUserData').click(function () {
      GetThisProjectRequiredUserData();
   });

   $('#saveProjectToView').click(function () {
      UpdateProjOverview();
   });

   $('#editProjectOverview').click(function () {
      $('#viewProjectOverview').show();
      $('#editProjectOverview').hide();
      $('#projectOverviewFooter').show();

      var overviewBox = $('#projectOverview');
      EnableElements(overviewBox.find('input, select, textarea'));
   });

   $('#viewProjectOverview').click(function () {
      $('#viewProjectOverview').hide();
      $('#editProjectOverview').show();
      $('#projectOverviewFooter').hide();

      var overviewBox = $('#projectOverview');
      DisableElements(overviewBox.find('input, select, textarea'));
   });

   $('#saveRequiredUserData').click(function () {
      UpdateProjRequiredUserData();
   });

   $(document).find('a[href="#projectTeam"]').click(function (e) {
      GetProjectTeam();
      GetCompanyRoles();
      GetNonTeamUsers();

      hideAllBtns();
      var allBoxToolBtns = $('#projectTeamBox').find('.box-tools .btn');
      allBoxToolBtns.show();
   });

   $('#EditProjBtn').click(function () {
      UpdateProj();
   });



   $('#editRequiredUserData').click(function () {
      $('#viewRequiredUserData').show();
      $('#editRequiredUserData').hide();
      $('#requiredUserDataFooter').show();

      var requiredUserData = $('#requiredUserData');
      EnableElements(requiredUserData.find('input, select, textarea'));
   });

   $('#viewRequiredUserData').click(function () {
      $('#viewRequiredUserData').hide();
      $('#editRequiredUserData').show();
      $('#requiredUserDataFooter').hide();

      var requiredUserData = $('#requiredUserData');
      DisableElements(requiredUserData.find('input, select, textarea'));
   });

   $('#sendProjectUserBtn').on('click', function () {
      $('#sendProjectTeamMailModal').modal('show');
   });

   $('#sendProjectTeamMailBtn').on('click', function () {
      WelcomeProjectTeamEmail();
   });

   $('#addProjectUserBtn').click(function () {
       $('#addProjectUserModal').modal('show');
   });

   $(document).on('click','.addProjectUserBtn', function () {
      $('#addProjectUserModal').modal('show');
   });

   $(document).on('click', '#projectSBody tr', function (event) {
       if ($(event.originalEvent.target).closest('td')[0] == $(event.originalEvent.target).closest('tr')[0].lastChild) return;
       location.href = 'ManageSurveyQuestions?id=' + this.id;
   }); 

   $(document).on('click', '#projectTBody tr', function (event) {
       if ($(event.originalEvent.target).closest('td')[0] == $(event.originalEvent.target).closest('tr')[0].lastChild) return;
       location.href = "ViewProject?id=" + this.id;
   });

   $('#refreshProjectTeam, #refreshTeamBtn, #x, #x1').click(function () {
      GetProjectTeam();
      GetCompanyRoles();
      GetNonTeamUsers();
   });

   $('#compUserDDL').on("change", function () {
      var selectedEmail = $('#compUserDDL option:selected').val();

      $('#UserEmail').val(selectedEmail);
   });
   
   $('#NonTeamUserDDL').on("change", function () {
      var selectedEmail = $('#NonTeamUserDDL option:selected').val();

      $('#UserEmail').val(selectedEmail);
   });

   $('#AddUserToProjBtn').click(function () {
      AddTeamMember();

      $('#addProjectUserModal').on('hidden.bs.modal', function (e) {
         $('#addProjectUserModalError').html('');
      })
   });

   $('#refreshSurveys').click(function () {
      GetProjectSurveys();
   });

   $(document).find('a[href="#projectSurvey"]').click(function (e) {
      GetProjectSurveys();

      hideAllBtns();
      var allBoxToolBtns = $('#surveysBox').find('.box-tools .btn');
      allBoxToolBtns.show();
   });

   $('#addProjectSurveyBtn').click(function () {
      $('#addProjectSurveyModal').modal();
   });

   $(document).on('click','.addProjectSurveyBtn',function () {
      $('#addProjectSurveyModal').modal();
   });

   $('#AddSurveyToProjBtn').click(function () {
      CreateSurvey();
   });

   $(document).on('click', '.importUserDocs', function () {
      $('#importUserDocsModal').modal('show');
   });

   $('#importUserDocsBtn').click(function () {
      importUserDocsToProject();
   });
});

// Hides all buttons on accordion headers
function hideAllBtns() {
   var allBoxToolBtns = $(document).find('.box-tools .btn').not('#StartProject, #EndProject');
   allBoxToolBtns.hide();
}

function GetCompany() {
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
               companyList = JSON.parse(data.RRZResult);
               //setUserCompanyDDL($('#userCompanyDDL'));
               //GetTeamUsers();
               //GetTeamUsers();
            }
         },
         error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
         }
      });
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
function setUserCompanyDDL(ddl) {
   var co, opt;
   for (var i = 0; i < companies.length; i++) {
      co = companies[i];
      opt = $('<option></option>')
      .val(co.compID)
      .text(co.name);
      ddl.append(opt);
   }
   var team = $('#teamDDL');
   opt = $('<option></option>')
       .val(-1)
       .attr('selected', 'selected')
       .text('-- Please select a company --');
   team.append(opt);
}

function GetCompanyProjects() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var methodName = "GetAllProjectsForCompany";
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
         var tbody = $('#projectTBody');
         if (data.RRZResult) {
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult);
               ShowErrorModal(error);
               tbody.html(MakeDataTableError(error, 5));
               return;
            }

            projList = JSON.parse(data.RRZResult);
            var countryCode, proj;

            var dataTableAPI = $('#tblItems').dataTable();
            dataTableAPI.fnClearTable();
            for (var i = 0; i < projList.length; i++) {
               proj = projList[i];

               countryCode = findCountryCodeByName(proj.Country);
               if (!countryCode) { countryCode = ' '; }

               dataTableAPI.fnAddData(
                           [
                              {
                                 "0": proj.ProjectName,
                                 "1": proj.ProjectDescription,
                                 "2": proj.StartDate ? proj.StartDate.DateWCF() : ' ',
                                 "3": proj.EndDate ? proj.EndDate.DateWCF() : ' ',
                                 "4": //'<a href="ViewProject?id=' + proj.ID + '" title="View Project">' + DT_AddCustom(proj.ID, 'fa fa-pencil btn text-black', 'DT_EvokeView', 'Edit Project') + '</a>'+
                                    '<a href="DocumentManager?projectID=' + proj.ID + '" title="Project Documents" target="_blank">' + DT_AddCustom(proj.ID, 'fa  fa-folder-open btn text-black', 'DT_EvokeView', 'Manage Documents') + '</a>',
                                 "DT_RowId": proj.ID,
                              }
                           ]
                        );
            }
            /*$('#tblItems tbody tr').click(function (event) {
                if ($(event.originalEvent.target).closest('td')[0] == $(event.originalEvent.target).closest('tr')[0].lastChild) return;
                window.open("ViewProject?id=" + event.currentTarget.id);
            });*/
         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}

function GetUsersForPrimary() {
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
      companyID: curComp.compID,
      getAll: 'false'
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

            compUserForProj = JSON.parse(data.RRZResult);
            loadContactPersonDDL();
         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}

function GetTeamUsers() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }

   
   var methodName = "GetTeamMembers";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID,
      getAll: 'true'
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

            compUserForProj = JSON.parse(data.RRZResult);
            loadContactPersonDDL();
         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}

function GetNonTeamUsers() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }

   var methodName = "GetActiveCompanyUsersNotInProject";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID
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

            nonTeamUserForProj = JSON.parse(data.RRZResult);
            loadNonTeamUsersDDL();
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function loadContactPersonDDL()
{
   var ddl = $('#projContactPerson');
   ddl.children().remove();
   for (var i = 0; i < compUserForProj.length; i++) {
      person = compUserForProj[i];

      if (person.Firstnames || person.Lastname) {
         opt = $('<option></option>')
         .val(person.UserId)
         .text(person.Firstnames + ' ' + person.Lastname + ' (' + person.RoleName + ')');
         ddl.append(opt);
      }
      else {
         opt = $('<option></option>')
         .val(person.UserId)
         .text(person.Email + ' (' + person.RoleName + ')');
         ddl.append(opt);
      }

   }
   
   if (PrimaryContact) {
      ddl.val(PrimaryContact);
   }
}

function loadNonTeamUsersDDL() {
   var ddl = $('#NonTeamUserDDL');
   ddl.children().remove();
   for (var i = 0; i < nonTeamUserForProj.length; i++) {
      person = nonTeamUserForProj[i];
      //person.Firstnames + ' ' + person.Lastname
      //person.RoleName, person.Email, person.ContactNumber
      /*
      opt = $('<option></option>')
      .val(person.Email)
      .text(person.Firstnames + ' ' + person.Lastname + ' '+person.Email+' (' + person.Email + ')');
      ddl.append(opt);
      */
      if (person.Firstnames || person.Lastname) {
         opt = $('<option></option>')
         .val(person.Email)
         .text(person.Firstnames + ' ' + person.Lastname + ' (' + person.RoleName + ')');
         ddl.append(opt);
      }
      else {
         opt = $('<option></option>')
         .val(person.Email)
         .text(person.Email + ' (' + person.RoleName + ')');
         ddl.append(opt);
      }

   }
   if (nonTeamUserForProj && nonTeamUserForProj.length > 0) {
      person = nonTeamUserForProj[0];
      $('#UserEmail').val(person.Email);
   }
   else {
      // No available users can be added to the drop down list

      opt = $('<option></option>')
         .val('')
         .text('No available users');
      ddl.append(opt);
   }
}

function AddNewProj() {
   //get all the details
   var projName = $('#projName').val();
   var projDescription = $('#projDescription').val();
   var projCountryDDL = $('#projCountryDDL option:selected').text();
   var contactPerson = $('#projContactPerson option:selected').val();
   var projNumberOfMembers = $('#projNumberOfMembers').val();
   var projstartDate = $('#projstartDate').val();
   var projendDate = $('#projendDate').val();

   //Emergency contact
   var isPrimaryContactReq = $("#isPrimaryContactRequired").is(':checked');
   var isSecondaryContactReq = $("#isSecondaryContactRequired").is(':checked');

   //Passport settings
   var isPassportNumReq = $("#isPassportNumberRequired").is(':checked');
   var isPassportExpiryDateReq = $("#isPassportExpiryDateRequired").is(':checked');

   //Medical Aid settings
   var isMedicalAidNameRequired = $("#isMedicalAidNameRequired").is(':checked');
   var isMedicalAidNumberRequired = $("#isMedicalAidNumberRequired").is(':checked');
   var isMedicalAidContactNumReq = $("#isMedicalAidContactNumberRequired").is(':checked');
   var isBloodTypeReq = $("#isBloodTypeRequired").is(':checked');
   var isAllergiesReq = $("#isAllergiesRequired").is(':checked');
   var isAllergiesDescrReq = $("#isAllergiesDescriptionRequired").is(':checked');
   var isVaccinationsReq = $("#isVaccinationsRequired").is(':checked');

   //Clothing settings
   var isSafetyBootsReq = $("#isSafetyBootsRequired").is(':checked');
   var isVestReq = $("#isVestRequired").is(':checked');

   //Docs settings
   var isPassportDocReq = $("#isPassportDocRequired").is(':checked');
   var isETicketDocReq = $("#isETicketDocRequired").is(':checked');
   var isVisaDocReq = $("#isVisaDocRequired").is(':checked');
   var isAccommodationDocReq = $("#isAccommodationDocRequired").is(':checked');
   var isVaccinationDocReq = $("#isVaccinationDocRequired").is(':checked');
   var isDriversDocReq = $("#isDriversLicenseDocRequired").is(':checked');
   var isCustomsDocReq = $("#isCustomsClearanceDocRequired").is(':checked');

   var otherInformation = $('#otherInformationRequired').val();

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      //$("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company.");
      return false;
   }

   var methodName = "CreateProject";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: curComp.compID,
      projectName: projName, projectDescription: projDescription,
      projectCountry: projCountryDDL, primaryContactID: contactPerson,
      numberOfMembers: projNumberOfMembers, startDate: projstartDate, endDate: projendDate,
      isEmergencyContactOneRequired: isPrimaryContactReq, isEmergencyContactTwoRequired: isSecondaryContactReq,
      isPassportNumberRequired: isPassportNumReq, isPassportExpiryDateRequired: isPassportExpiryDateReq,
      isMedicalAidNameRequired: isMedicalAidNameRequired, isMedicalAidNumberRequired: isMedicalAidNumberRequired,
      isMedicalAidContactNumberRequired: isMedicalAidContactNumReq,
      isAllergiesRequired: isAllergiesReq, isAllergiesDescriptionRequired: isAllergiesDescrReq,
      isVaccinationsRequired: isVaccinationsReq, isBloodTypeRequired: isBloodTypeReq,
      isSafetyBootsRequired: isSafetyBootsReq, isVestRequired: isVestReq,
      isPassportDocRequired: isPassportDocReq, isETicketDocRequired: isETicketDocReq, isVisaDocRequired: isVisaDocReq,
      isAccommodationDocRequired: isAccommodationDocReq, isVaccinationDocRequired: isVaccinationDocReq, isDriversLicenseDocRequired: isDriversDocReq,
      isCustomsClearanceDocRequired: isCustomsDocReq, otherInformation: otherInformation
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

         var prModal = $('#addEditProjectModal');
         if (data.RRZResult) {
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult);
               ShowErrorModal(error, false, prModal);
               return;
            }
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //Project created
               prModal.modal('hide');
               var projectID = response.ProjectID;
               window.location = ('/Administration/ViewProject?id=' + projectID);

            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function GetThisProject() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find a project to view.");
      return false;
   }

   var methodName = "GetSpecificProject";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID
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
            //TODO
            GetTeamUsers();
            var project = JSON.parse(data.RRZResult);
            curProject = project;

            projectID = project.ID;
            $('#projName').val(project.ProjectName);
            $(document).find('.projectNameTxt').html(project.ProjectName);

            $('#ProjectTeam').html('(' + project.NumberOfProjectUsers + ')');
            $('#ProjectSurveys').html('(' + project.NumberOfSurveys + ')');

            $('#projDescription').val(project.ProjectDescription);

            var couCode = getCountryCode(project.ProjectCountry);
            $('#projCountryDDL').val(couCode);
            PrimaryContact = project.PrimaryContact;
            $('#projContactPerson').val(project.PrimaryContact);
            $('#projNumberOfMembers').val(project.NumberOfMembers);
            $('#projstartDate').val(project.StartDate ? project.StartDate.DateWCF() : '');
            $('#projendDate').val(project.EndDate ? project.EndDate.DateWCF() : '');

            //Passport settings
            $("#isPassportNumberRequired").prop('checked', project.IsPassportNumberRequired);
            $("#isPassportExpiryDateRequired").prop('checked', project.IsPassportExpiryDateRequired);

            //Medical Aid settings
            $("#isMedicalAidNameRequired").prop('checked', project.IsMedicalAidNameRequired);
            $("#isMedicalAidNumberRequired").prop('checked', project.IsMedicalAidNumberRequired);
            $("#isMedicalAidContactNumberRequired").prop('checked', project.IsMedicalAidContactNumberRequired);
            $("#isBloodTypeRequired").prop('checked', project.IsBloodTypeRequired);
            $("#isAllergiesRequired").prop('checked', project.IsAllergiesRequired);
            $("#isAllergiesDescriptionRequired").prop('checked', project.IsAllergiesDescriptionRequired);
            $("#isVaccinationsRequired").prop('checked', project.IsVaccinationsRequired);

            //Clothing settings
            $("#isSafetyBootsRequired").prop('checked', project.IsSafetyBootsRequired);
            $("#isVestRequired").prop('checked', project.IsVestRequired);

            //Docs settings
            $("#isPassportDocRequired").prop('checked', project.IsPassportDocRequired);
            $("#isETicketDocRequired").prop('checked', project.IsETicketDocRequired);
            $("#isVisaDocRequired").prop('checked', project.IsVisaDocRequired);
            $("#isAccommodationDocRequired").prop('checked', project.IsAccommodationDocRequired);
            $("#isVaccinationDocRequired").prop('checked', project.IsVaccinationDocRequired);
            $("#isDriversLicenseDocRequired").prop('checked', project.IsDriversLicenseDocRequired);
            $("#isCustomsClearanceDocRequired").prop('checked', project.IsCustomsClearanceDocRequired);

            $('#otherInformationRequired').val(project.OtherInformation);
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}


//ViewProjectActivityStream
function GetProjectActivityStream(clear)
{
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find a project to view.");
      return false;
   }

   if (clear) {
      lastDateTime = new Date();
   }

   ///////////////////////////////
   // Date fix

   //lastDateTime = removeTimezoneOffset(lastDateTime);

   ///////////////////////////////

   var methodName = "ViewProjectActivityStream";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID,
      dateToViewFrom: lastDateTime
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
            //If we reach the first post in the timeline then we stop
            activityStream = JSON.parse(data.RRZResult);

            if (activityStream.length > 0) {
               appendToTimeline(clear);
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function appendToTimeline(clear) {
   var timelineUL = $(document).find('.timeline');
   var now = formatDate(new Date(), "dd mmm yyyy");
   if (timelineUL) {
      if (clear) {
         //////////////////////////////
         // Do we clear the timeline ???
         timelineUL.children().remove();
         //////////////////////////////
      }
      //Display a label with todays date at the top of the timeline 
      var first = timelineUL.find('.first')
      if (first.length == 0) {
         first = $('<li>').addClass('time-label first')
                  .html('<span class="bg-red">' + now + '</span>');

         timelineUL.append(first);
      }
   }

   var moreInfo = timelineUL.find('.moreInfo');
   if (moreInfo.length > 0) {
      timelineUL.detach('.moreInfo');
   }

   var last = timelineUL.find('.last');
   if (last.length > 0) {
      timelineUL.detach('.last');
   }

   var item;
   for (var i = 0; i < activityStream.length; i++) {
      item = makeTimelineItem(activityStream[i]);
      timelineUL.append(item);
   }

   if (moreInfo.length == 0) {
      moreInfo = $('<li>').addClass('moreInfo')
               .html('<div class="text-center"><a id="viewMoreTimeBtn" class="btn btn-default">View more</a></div>');
   }
   timelineUL.append(moreInfo);
   $('#viewMoreTimeBtn').off();
   $('#viewMoreTimeBtn').on('click', function () {
      GetProjectActivityStream(false);
   });

   var lastItem, displayDateTime;
   if (activityStream && activityStream.length > 0) {
      lastItem = activityStream[activityStream.length - 1];
      lastDateTime = lastItem.ActivityDate.DateTimeWCF();
      displayDateTime = formatDate(lastDateTime, "dd mmm yyyy");
      
   }
   else {
      lastDateTime = now;
      displayDateTime = formatDate(lastDateTime, "dd mmm yyyy");
   }

   if (last.length == 0) {
      last = $('<li>').addClass('time-label last')
               .html('<span class="bg-green">' + displayDateTime + '</span>');
   }
   else {
      last.html('<span class="bg-green">' + displayDateTime + '</span>');
   }
   timelineUL.append(last);
}

function makeTimelineItem(obj)
{

   /*
   
   enum ActivityType
   {
      User,
      Document,
      Video,
      Photo,
      Project,
      Survey
   }
      case 'Document':
         return makeDocumentItem(obj);
         break;
   
   */

   switch(obj.ActivityType)
   {
      case 'User':
         return makeUserItem(obj);
         break;
      case 'Audio':
         return makeAudioItem(obj);
         break;
      case 'Video':
         return makeVideoItem(obj);
         break;
      case 'Image':
         return makeImageItem(obj);
         break;
      case 'Project':
         return makeProjectItem(obj);
         break;
      case 'Survey':
         return makeSurveyItem(obj);
         break;
   }

}

function makeUserItem(obj)
{
   /*

   ActivityDate:"/Date(1471332829647)/"
   ActivityMessage:"added as the primary contact on a project"
   ActivityType:"User"
   AffectedUserFullName:"Zolani Zweni"
   AffectedUserID:"56923263-bc83-44b3-982e-b7ba1d00bf41"
   CompanyID:"038c3649-2d2c-412d-b845-53f24b4213ef"
   ID:"64bdf74a-a3eb-4421-ab8c-fa5a96526c8c"
   PerformedByUserFullName:"Zolani User"
   PerformedByUserID:"281cc394-1193-45c7-a996-63037328bdb4"
   ProjectID:"487e19de-f832-4772-b0fa-f4ef5294114b"
   ProjectName:"First Project"
   SurveyID:null
   SurveyName:null
   link:null
   */

   var li = $('<li>').html('<i class="fa fa-user bg-aqua"></i>');
   /*
   <li>
      <i class="fa fa-user bg-aqua"></i>

      <div class="timeline-item">
         <span class="time"><i class="fa fa-clock-o"></i>27 mins ago</span>

         <h3 class="timeline-header"><a href="#">Jay White</a> commented on your post</h3>

         <div class="timeline-body">
         </div>
      </div>
   </li>
   */
   var date = obj.ActivityDate.DateTimeWCF();
   date = formatDate(date, "dd mmm yyyy");

   var tl = $('<div>')
      .addClass('timeline-item')
      .append('<span class="time"><i class="fa fa-clock-o"></i>' + date + '</span>')
      .append('<h3 class="timeline-header"><a href="/Administration/Users?id='
      + obj.PerformedByUserID + '">' + obj.PerformedByUserFullName + '</a> ' + obj.ActivityMessage
      + ' <a href="/Administration/Users?id='
      + obj.AffectedUserID + '">' + obj.AffectedUserFullName + '</a></h3>');


   li.append(tl);
   return li;
}

function makeProjectItem(obj) {
   /*

   ActivityDate:"/Date(1471332831350)/"
   ActivityMessage:"updated a project's details"
   ActivityType:"Project"
   AffectedUserFullName:null
   AffectedUserID:null
   CompanyID:"038c3649-2d2c-412d-b845-53f24b4213ef"
   ID:"70dddc08-6e36-430c-988e-f26ec1a9293b"
   PerformedByUserFullName:"Zolani User"
   PerformedByUserID:"281cc394-1193-45c7-a996-63037328bdb4"
   ProjectID:"487e19de-f832-4772-b0fa-f4ef5294114b"
   ProjectName:"First Project"
   SurveyID:null
   SurveyName:null

   */

   var li = $('<li>').html('<i class="fa fa-suitcase bg-blue"></i>');
   /*

   <li>
      <i class="fa fa-user bg-aqua"></i>

      <div class="timeline-item">
         <span class="time"><i class="fa fa-clock-o"></i>27 mins ago</span>

         <h3 class="timeline-header"><a href="#">Jay White</a> commented on your post</h3>

         <div class="timeline-body">
         </div>
      </div>
   </li>

   */
   var date = obj.ActivityDate.DateTimeWCF();
   date = formatDate(date, "dd mmm yyyy");

   var tl = $('<div>')
      .addClass('timeline-item')
      .append('<span class="time"><i class="fa fa-clock-o"></i>' + date + '</span>')
      .append('<h3 class="timeline-header"><a href="/Administration/Users?id='
      + obj.PerformedByUserID + '">' + obj.PerformedByUserFullName + '</a> ' + obj.ActivityMessage
      + ' <a href="#">' + obj.ProjectName + '</a></h3>');


   li.append(tl);
   return li;
}

function makeSurveyItem(obj) {
   /*

   ActivityDate:"/Date(1471421313443)/"
   ActivityMessage:"created a new survey called"
   ActivityType:"Survey"
   AffectedUserFullName:"Zolani User (zolani@rrzsa.com)"
   AffectedUserID:"281cc394-1193-45c7-a996-63037328bdb4"
   CompanyID:"038c3649-2d2c-412d-b845-53f24b4213ef"
   ID:"600cee46-e5a9-44af-b92d-9addc4a25abb"
   PerformedByUserFullName:"Zolani User (zolani@rrzsa.com)"
   PerformedByUserID:"281cc394-1193-45c7-a996-63037328bdb4"
   ProjectID:"c50fb6a4-c09b-4e78-aa78-73598c3826aa"
   ProjectName:"eigth project"
   SurveyID:"f84b545b-5540-41d0-8a7e-d945c9a64823"
   SurveyName:"Life"

   */

   var li = $('<li>').html('<i class="fa fa-list-alt bg-yellow"></i>');
   /*

   <li>
      <i class="fa fa-user bg-aqua"></i>

      <div class="timeline-item">
         <span class="time"><i class="fa fa-clock-o"></i>27 mins ago</span>

         <h3 class="timeline-header"><a href="#">Jay White</a> commented on your post</h3>

         <div class="timeline-body">
         </div>
      </div>
   </li>

   */
   var date = obj.ActivityDate.DateTimeWCF();
   date = timelineDate(date);

   var tl = $('<div>')
      .addClass('timeline-item')
      .append('<span class="time"><i class="fa fa-clock-o"></i>' + date + '</span>')
      .append('<h3 class="timeline-header"><a href="/Administration/Users?id='
      + obj.PerformedByUserID + '">' + obj.PerformedByUserFullName + '</a> ' + obj.ActivityMessage
      + ' <a href="/Administration/ViewSurvey?id='
      + obj.SurveyID + '">' + obj.SurveyName + '</a></h3>');


   li.append(tl);
   return li;
}

function makeImageItem(obj) {
   /*

   ActivityDate:"/Date(1471332831350)/"
   ActivityMessage:"uploaded a document"
   ActivityType:"Image"
   AffectedUserFullName:null
   AffectedUserID:null
   CompanyID:"038c3649-2d2c-412d-b845-53f24b4213ef"
   ID:"70dddc08-6e36-430c-988e-f26ec1a9293b"
   PerformedByUserFullName:"Zolani User"
   PerformedByUserID:"281cc394-1193-45c7-a996-63037328bdb4"
   ProjectID:null
   ProjectName:null
   SurveyID:null
   SurveyName:null

   */

   var li = $('<li>').html('<i class="fa fa-camera bg-purple"></i>');
   /*

   <li>
      <i class="fa fa-user bg-aqua"></i>

      <div class="timeline-item">
         <span class="time"><i class="fa fa-clock-o"></i>27 mins ago</span>

         <h3 class="timeline-header"><a href="#">Jay White</a> commented on your post</h3>

         <div class="timeline-body">
            <img src= documentsPath + obj.link alt=""/>
         </div>
      </div>
   </li>

   */
   var re = /\\/g;
   obj.link = obj.link.replace(re, "/");
   var date = obj.ActivityDate.DateTimeWCF();
   date = formatDate(date, "dd mmm yyyy");

   var tl = $('<div>')
      .addClass('timeline-item')
      .append('<span class="time"><i class="fa fa-clock-o"></i>' + date + '</span>')
      .append('<h3 class="timeline-header"><a href="/Administration/Users?id='
      + obj.PerformedByUserID + '">' + obj.PerformedByUserFullName + '</a> ' + obj.ActivityMessage +
      ' <a href="/Administration/DocumentViewer?DocID=' + obj.DocumentID + '"> View details</a></h3>')
      .append('<div class="timeline-body"><a href="/Administration/DocumentViewer?DocID=' + obj.DocumentID +
      '"><img src="' + documentsPath + obj.link + '" alt="" style="max-height:200px"/></a></div>');

   li.append(tl);
   return li;
}

function makeVideoItem(obj) {
   /*
   ActivityDate:"/Date(1471332831350)/"
   ActivityMessage:"uploaded a document"
   ActivityType:"Image"
   AffectedUserFullName:null
   AffectedUserID:null
   CompanyID:"038c3649-2d2c-412d-b845-53f24b4213ef"
   ID:"70dddc08-6e36-430c-988e-f26ec1a9293b"
   PerformedByUserFullName:"Zolani User"
   PerformedByUserID:"281cc394-1193-45c7-a996-63037328bdb4"
   ProjectID:null
   ProjectName:null
   SurveyID:null
   SurveyName:null

   <li>
      <i class="fa fa-user bg-aqua"></i>
      <div class="timeline-item">
         <span class="time"><i class="fa fa-clock-o"></i>27 mins ago</span>
         <h3 class="timeline-header"><a href="#">Jay White</a> commented on your post</h3>
         <div class="timeline-body">
            <img src= documentsPath + obj.link alt=""/>
         </div>
      </div>
   </li>
   */

   var li = $('<li>').html('<i class="fa fa-video-camera bg-maroon"></i>');
   var re = /\\/g;
   obj.link = obj.link.replace(re, "/");
   var date = obj.ActivityDate.DateTimeWCF();
   date = formatDate(date, "dd mmm yyyy");

   var tl = $('<div>')
      .addClass('timeline-item')
      .append('<span class="time"><i class="fa fa-clock-o"></i>' + date + '</span>')
      .append('<h3 class="timeline-header"><a href="/Administration/Users?id='
      + obj.PerformedByUserID + '">' + obj.PerformedByUserFullName + '</a> ' + obj.ActivityMessage +
      ' <a href="/Administration/DocumentViewer?DocID=' + obj.DocumentID + '"> View details</a></h3>')
      .append('<div class="timeline-body"><video src="' + documentsPath + obj.link +
      '" controls="controls" style="max-height:200px">Sorry, your browser does not support embedded videos. <a href="' + documentsPath + obj.link + '">Click here to download it.</a></video></div>');

   li.append(tl);
   return li;
}

function makeAudioItem(obj) {
   /*
   ActivityDate:"/Date(1471332831350)/"
   ActivityMessage:"uploaded a document"
   ActivityType:"Image"
   AffectedUserFullName:null
   AffectedUserID:null
   CompanyID:"038c3649-2d2c-412d-b845-53f24b4213ef"
   ID:"70dddc08-6e36-430c-988e-f26ec1a9293b"
   PerformedByUserFullName:"Zolani User"
   PerformedByUserID:"281cc394-1193-45c7-a996-63037328bdb4"
   ProjectID:null
   ProjectName:null
   SurveyID:null
   SurveyName:null

   <li>
      <i class="fa fa-user bg-aqua"></i>
      <div class="timeline-item">
         <span class="time"><i class="fa fa-clock-o"></i>27 mins ago</span>
         <h3 class="timeline-header"><a href="#">Jay White</a> commented on your post</h3>
         <div class="timeline-body">
            <img src= documentsPath + obj.link alt=""/>
         </div>
      </div>
   </li>
   */

   var li = $('<li>').html('<i class="fa fa-music bg-blue"></i>');
   var re = /\\/g;
   obj.link = obj.link.replace(re, "/");
   var date = obj.ActivityDate.DateTimeWCF();
   date = formatDate(date, "dd mmm yyyy");

   var tl = $('<div>')
      .addClass('timeline-item')
      .append('<span class="time"><i class="fa fa-clock-o"></i>' + date + '</span>')
      .append('<h3 class="timeline-header"><a href="/Administration/Users?id='
      + obj.PerformedByUserID + '">' + obj.PerformedByUserFullName + '</a> ' + obj.ActivityMessage +
      ' <a href="/Administration/DocumentViewer?DocID=' + obj.DocumentID + '"> View details</a></h3>')
      .append('<div class="timeline-body"><audio src="' + documentsPath + obj.link +
      '" controls="controls" style="max-height:200px">Sorry, your browser does not support embedded audio. <a href="' + documentsPath + obj.link + '">Click here to download it.</a></audio ></div>');

   li.append(tl);
   return li;
}

function makeFileItem(obj) {
   /*
   ActivityDate:"/Date(1471332831350)/"
   ActivityMessage:"uploaded a document"
   ActivityType:"Image"
   AffectedUserFullName:null
   AffectedUserID:null
   CompanyID:"038c3649-2d2c-412d-b845-53f24b4213ef"
   ID:"70dddc08-6e36-430c-988e-f26ec1a9293b"
   PerformedByUserFullName:"Zolani User"
   PerformedByUserID:"281cc394-1193-45c7-a996-63037328bdb4"
   ProjectID:null
   ProjectName:null
   SurveyID:null
   SurveyName:null

   <li>
      <i class="fa fa-user bg-aqua"></i>
      <div class="timeline-item">
         <span class="time"><i class="fa fa-clock-o"></i>27 mins ago</span>
         <h3 class="timeline-header"><a href="#">Jay White</a> commented on your post</h3>
         <div class="timeline-body">
            <img src= documentsPath + obj.link alt=""/>
         </div>
      </div>
   </li>
   */

   var li = $('<li>').html('<i class="fa fa-file-o bg-gray"></i>');
   var re = /\\/g;
   obj.link = obj.link.replace(re, "/");
   var date = obj.ActivityDate.DateTimeWCF();
   date = formatDate(date, "dd mmm yyyy");

   var tl = $('<div>')
      .addClass('timeline-item')
      .append('<span class="time"><i class="fa fa-clock-o"></i>' + date + '</span>')
      .append('<h3 class="timeline-header"><a href="/Administration/Users?id='
      + obj.PerformedByUserID + '">' + obj.PerformedByUserFullName + '</a> ' + obj.ActivityMessage +
      ' <a href="/Administration/DocumentViewer?DocID=' + obj.DocumentID + '"> View details</a></h3>');

   li.append(tl);
   return li;
}

function timelineDate(date)
{
   return formatDate(date, "dd mmm yyyy");
}

function GetThisProjectToView() {

   var overviewBox = $('#projectOverview');
   DisableElements(overviewBox.find('input, select, textarea'));

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find a project to view.");
      return false;
   }

   var methodName = "GetSpecificProject";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID
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
            //TODO
            GetTeamUsers();
            var project = JSON.parse(data.RRZResult);
            curProject = project;

            projectID = project.ID;
            $(document).find('.projectNameTxt').html(project.ProjectName);

            loadProjectLabels(projectID, project.NumberOfProjectUsers, project.NumberOfSurveys);

            initTooltip();
            GetCompanyRoles();
            GetNonTeamUsers();
            
            $('#viewProjectOverview').hide();
            if (showProjOverEdit) {
               $('#editProjectOverview').show();
            }
            //$('#projectOverviewFooter').show();

            $('#projName').val(project.ProjectName);
            $('#projDescription').val(project.ProjectDescription);

            var couCode = getCountryCode(project.ProjectCountry);
            $('#projCountryDDL').val(couCode);
            PrimaryContact = project.PrimaryContact;
            $('#projContactPerson').val(project.PrimaryContact);
            /*
            var contact = project.PrimaryContactName ? project.PrimaryContactName : project.PrimaryContactEmail;
            $('#projContactPerson').val(contact);
            */
            $('#projNumberOfMembers').val(project.NumberOfMembers);
            $('#projstartDate').val(project.StartDate ? project.StartDate.DateWCF() : '');
            $('#projendDate').val(project.EndDate ? project.EndDate.DateWCF() : '');

            $('#otherInformationRequired').val(project.OtherInformation);

            //Show Start/End project buttons

            var startBtn = $('#StartProject');
            var endBtn = $('#EndProject');

            if(project.ActualStartDate!==null && project.ActualEndDate!==null)
            {
               //We hide the buttons, the project has ended
               startBtn.hide();
               endBtn.hide();
            }
            else{
               if (project.ActualStartDate !== null && project.ActualEndDate == null)
               {
                  //Has started but has not ended
                  startBtn.hide();
                  endBtn.show();
               }
               else if (project.ActualStartDate == null && project.ActualEndDate == null)
               {
                  //Has not started yet
                  startBtn.show();
                  endBtn.hide();
               }
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function loadProjectLabels(projectID, numberOfProjectUsers, numberOfSurveys)
{
    var importTeam = '<a class="showImportTeamModal btn btn-default manageQuestionGroupBtn" title="Import team"><i class="fa fa-download text-purple"></i><span class="hidden-md hidden-sm hidden-xs"> Import Team</span></a>';

    var users = '<a class="btn btn-app2" btn-sm title="Number of actual users" data-click="projectTeamHead"> <span class="badge bg-purple">'
       + numberOfProjectUsers + '</span><i class="fa icon-users text-purple"></i></a>';

    var addUser = '<a class="btn btn-default addProjectUserBtn" title="Create User">'
       + '<i class="fa fa-plus text-purple"></i><span class="hidden-md hidden-sm hidden-xs"> Create User</span></a>';

    var survey = '<a class="btn btn-app2" title="Number of surveys" data-click="projectSurveyHead"> <span class="badge bg-teal">'
       + numberOfSurveys + '</span><i class="fa icon-surveys text-teal"></i></a>';

    var addSurvey = '<a class="btn btn-default addProjectSurveyBtn" title="Create Survey">'
          + '<i class="fa fa-plus text-teal"></i><span class="hidden-md hidden-sm hidden-xs"> Create Survey</span></a>';

    var projDocs = '<a href="DocumentManager?projectID=' + projectID + '" class="btn btn-default" title="Project Documents" target="_blank"><i class="fa fa-folder-open text-aqua"></i><span class="hidden-md hidden-sm hidden-xs"> Project Documents</span></a>'

    var importUserDocs = '<a class="btn btn-default importUserDocs" title="Import User Documents" target="_blank">'
          + '<i class="fa fa-plus text-aqua"></i><span class="hidden-md hidden-sm hidden-xs"> Import User Documents</span></a>';

    $('#projectLabels').html('&nbsp;&nbsp;' + importTeam + '&nbsp;&nbsp;' + addUser + '&nbsp;&nbsp;' + users + '&nbsp;&nbsp;&nbsp;&nbsp;'
       + addSurvey + '&nbsp;&nbsp;' + survey + '&nbsp;&nbsp;&nbsp;&nbsp;'
       + projDocs + '&nbsp;&nbsp;' + importUserDocs);
}


function GetThisProjectRequiredUserData()
{
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find a project to view.");
      return false;
   }

   var methodName = "GetSpecificProject";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID
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
            //TODO
            //GetCompanyUsers();
            var project = JSON.parse(data.RRZResult);
            curProject = project;

            projectID = project.ID;
            $('#projName').html(project.ProjectName);
            $(document).find('.projectNameTxt').html(project.ProjectName);

            var requiredUserData = $('#requiredUserData');
            DisableElements(requiredUserData.find('input, select, textarea'));

            loadProjectLabels(projectID, project.NumberOfProjectUsers, project.NumberOfSurveys);

            $('#viewRequiredUserData').hide();
            $('#editRequiredUserData').show();
            //$('#projectOverviewFooter').show();

            //Emergency contact
            $("#isPrimaryContactRequired").prop('checked', project.IsEmergencyContactOneRequired);
            $("#isSecondaryContactRequired").prop('checked', project.IsEmergencyContactTwoRequired);

            //Passport settings
            $("#isPassportNumberRequired").prop('checked', project.IsPassportNumberRequired);
            $("#isPassportExpiryDateRequired").prop('checked', project.IsPassportExpiryDateRequired);

            //Medical Aid settings
            $("#isMedicalAidNameRequired").prop('checked', project.IsMedicalAidNameRequired);
            $("#isMedicalAidNumberRequired").prop('checked', project.IsMedicalAidNumberRequired);
            $("#isMedicalAidContactNumberRequired").prop('checked', project.IsMedicalAidContactNumberRequired);
            $("#isBloodTypeRequired").prop('checked', project.IsBloodTypeRequired);
            $("#isAllergiesRequired").prop('checked', project.IsAllergiesRequired);
            $("#isAllergiesDescriptionRequired").prop('checked', project.IsAllergiesDescriptionRequired);
            $("#isVaccinationsRequired").prop('checked', project.IsVaccinationsRequired);

            //Clothing settings
            $("#isSafetyBootsRequired").prop('checked', project.IsSafetyBootsRequired);
            $("#isVestRequired").prop('checked', project.IsVestRequired);

            //Docs settings
            $("#isPassportDocRequired").prop('checked', project.IsPassportDocRequired);
            $("#isETicketDocRequired").prop('checked', project.IsETicketDocRequired);
            $("#isVisaDocRequired").prop('checked', project.IsVisaDocRequired);
            $("#isAccommodationDocRequired").prop('checked', project.IsAccommodationDocRequired);
            $("#isVaccinationDocRequired").prop('checked', project.IsVaccinationDocRequired);
            $("#isDriversLicenseDocRequired").prop('checked', project.IsDriversLicenseDocRequired);
            $("#isCustomsClearanceDocRequired").prop('checked', project.IsCustomsClearanceDocRequired);
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function UpdateProj() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }

   //get all the details
   var projName = $('#projName').val();
   var projDescription = $('#projDescription').val();
   var projCountryDDL = $('#projCountryDDL option:selected').text();
   var contactPerson = $('#projContactPerson option:selected').val();
   var projNumberOfMembers = $('#projNumberOfMembers').val();
   var projstartDate = $('#projstartDate').val();
   var projendDate = $('#projendDate').val();

   //Passport settings
   var isPassportNumReq = $("#isPassportNumberRequired").is(':checked');
   var isPassportExpiryDateReq = $("#isPassportExpiryDateRequired").is(':checked');

   //Medical Aid settings
   var isMedicalAidNameRequired = $("#isMedicalAidNameRequired").is(':checked');
   var isMedicalAidNumberRequired = $("#isMedicalAidNumberRequired").is(':checked');
   var isMedicalAidContactNumReq = $("#isMedicalAidContactNumberRequired").is(':checked');
   var isBloodTypeReq = $("#isBloodTypeRequired").is(':checked');
   var isAllergiesReq = $("#isAllergiesRequired").is(':checked');
   var isAllergiesDescrReq = $("#isAllergiesDescriptionRequired").is(':checked');
   var isVaccinationsReq = $("#isVaccinationsRequired").is(':checked');

   //Clothing settings
   var isSafetyBootsReq = $("#isSafetyBootsRequired").is(':checked');
   var isVestReq = $("#isVestRequired").is(':checked');

   //Docs settings
   var isPassportDocReq = $("#isPassportDocRequired").is(':checked');
   var isETicketDocReq = $("#isETicketDocRequired").is(':checked');
   var isVisaDocReq = $("#isVisaDocRequired").is(':checked');
   var isAccommodationDocReq = $("#isAccommodationDocRequired").is(':checked');
   var isVaccinationDocReq = $("#isVaccinationDocRequired").is(':checked');
   var isDriversDocReq = $("#isDriversLicenseDocRequired").is(':checked');
   var isCustomsDocReq = $("#isCustomsClearanceDocRequired").is(':checked');

   var otherInformation = $('#otherInformationRequired').val();

   var methodName = "UpdateProject";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: curComp.compID, projectID: projID,
      projectName: projName, projectDescription: projDescription,
      projectCountry: projCountryDDL, primaryContactID: contactPerson,
      numberOfMembers: projNumberOfMembers, startDate: projstartDate, endDate: projendDate,
      isPassportNumberRequired: isPassportNumReq, isPassportExpiryDateRequired: isPassportExpiryDateReq,
      isMedicalAidNameRequired: isMedicalAidNameRequired, isMedicalAidNumberRequired: isMedicalAidNumberRequired,
      isMedicalAidContactNumberRequired: isMedicalAidContactNumReq,
      isAllergiesRequired: isAllergiesReq, isAllergiesDescriptionRequired: isAllergiesDescrReq,
      isVaccinationsRequired: isVaccinationsReq, isBloodTypeRequired: isBloodTypeReq,
      isSafetyBootsRequired: isSafetyBootsReq, isVestRequired: isVestReq,
      isPassportDocRequired: isPassportDocReq, isETicketDocRequired: isETicketDocReq, isVisaDocRequired: isVisaDocReq,
      isAccommodationDocRequired: isAccommodationDocReq, isVaccinationDocRequired: isVaccinationDocReq, isDriversLicenseDocRequired: isDriversDocReq,
      isCustomsClearanceDocRequired: isCustomsDocReq, otherInformation: otherInformation
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
               return false;
            }
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //Project updated
               ShowSuccessModal("Project <strong>" + projName + "</strong> has been updated.");
               GetThisProject();
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function UpdateProjOverview() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }

   //get all the details
   var projName = $('#projName').val();
   var projDescription = $('#projDescription').val();
   var projCountryDDL = $('#projCountryDDL option:selected').text();
   var contactPerson = $('#projContactPerson option:selected').val();
   var projNumberOfMembers = $('#projNumberOfMembers').val();
   var projstartDate = $('#projstartDate').val();
   var projendDate = $('#projendDate').val();

   var methodName = "UpdateProjectPrimaryInfo";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: curComp.compID, projectID: projID,
      projectName: projName, projectDescription: projDescription,
      projectCountry: projCountryDDL, primaryContactID: contactPerson,
      numberOfMembers: projNumberOfMembers, startDate: projstartDate, endDate: projendDate
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
               return false;
            }
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //Project updated
               ShowSuccessModal("Project <strong>" + projName + "</strong> has been updated.");

               $('#viewProjectOverview').hide();
               $('#editProjectOverview').show();
               $('#projectOverviewFooter').hide();

               var overviewBox = $('#projectOverview');
               DisableElements(overviewBox.find('input, select, textarea'));

               GetThisProjectToView();
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function UpdateProjRequiredUserData() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }
   var projName = $('#projName').val();

   //Emergency contact
   var isPrimaryContactReq = $("#isPrimaryContactRequired").is(':checked');
   var isSecondaryContactReq = $("#isSecondaryContactRequired").is(':checked');

   //Passport settings
   var isPassportNumReq = $("#isPassportNumberRequired").is(':checked');
   var isPassportExpiryDateReq = $("#isPassportExpiryDateRequired").is(':checked');

   //Medical Aid settings
   var isMedicalAidNameRequired = $("#isMedicalAidNameRequired").is(':checked');
   var isMedicalAidNumberRequired = $("#isMedicalAidNumberRequired").is(':checked');
   var isMedicalAidContactNumReq = $("#isMedicalAidContactNumberRequired").is(':checked');
   var isBloodTypeReq = $("#isBloodTypeRequired").is(':checked');
   var isAllergiesReq = $("#isAllergiesRequired").is(':checked');
   var isAllergiesDescrReq = $("#isAllergiesDescriptionRequired").is(':checked');
   var isVaccinationsReq = $("#isVaccinationsRequired").is(':checked');

   //Clothing settings
   var isSafetyBootsReq = $("#isSafetyBootsRequired").is(':checked');
   var isVestReq = $("#isVestRequired").is(':checked');

   //Docs settings
   var isPassportDocReq = $("#isPassportDocRequired").is(':checked');
   var isETicketDocReq = $("#isETicketDocRequired").is(':checked');
   var isVisaDocReq = $("#isVisaDocRequired").is(':checked');
   var isAccommodationDocReq = $("#isAccommodationDocRequired").is(':checked');
   var isVaccinationDocReq = $("#isVaccinationDocRequired").is(':checked');
   var isDriversDocReq = $("#isDriversLicenseDocRequired").is(':checked');
   var isCustomsDocReq = $("#isCustomsClearanceDocRequired").is(':checked');

   var otherInformation = $('#otherInformationRequired').val();

   var methodName = "UpdateProjectRequiredInfo";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: curComp.compID, projectID: projID,
      isEmergencyContactOneRequired: isPrimaryContactReq, isEmergencyContactTwoRequired: isSecondaryContactReq,
      isPassportNumberRequired: isPassportNumReq, isPassportExpiryDateRequired: isPassportExpiryDateReq,
      isMedicalAidNameRequired: isMedicalAidNameRequired, isMedicalAidNumberRequired: isMedicalAidNumberRequired,
      isMedicalAidContactNumberRequired: isMedicalAidContactNumReq,
      isAllergiesRequired: isAllergiesReq, isAllergiesDescriptionRequired: isAllergiesDescrReq,
      isVaccinationsRequired: isVaccinationsReq, isBloodTypeRequired: isBloodTypeReq,
      isSafetyBootsRequired: isSafetyBootsReq, isVestRequired: isVestReq,
      isPassportDocRequired: isPassportDocReq, isETicketDocRequired: isETicketDocReq, isVisaDocRequired: isVisaDocReq,
      isAccommodationDocRequired: isAccommodationDocReq, isVaccinationDocRequired: isVaccinationDocReq, isDriversLicenseDocRequired: isDriversDocReq,
      isCustomsClearanceDocRequired: isCustomsDocReq, otherInformation: otherInformation
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
               return false;
            }
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //Project updated


               $('#viewRequiredUserData').show();
               $('#editRequiredUserData').hide();
               $('#requiredUserDataFooter').show();

               var requiredUserData = $('#requiredUserData');
               EnableElements(requiredUserData.find('input, select, textarea'));

               ShowSuccessModal("Project <strong>" + projName + "</strong> has been updated.");
               GetThisProjectToView();
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

function GetThisProjectAlt() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find a project to view.");
      return false;
   }

   var methodName = "GetSpecificProject";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID
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
            //TODO
            GetTeamUsers();
            var project = JSON.parse(data.RRZResult);

            projectID = project.ID;
            $('#projName').val(project.ProjectName);
            $('#projDescription').val(project.ProjectDescription);

            var couCode = getCountryCode(project.ProjectCountry);
            $('#projCountryDDL').val(couCode);
            $('#projContactPerson').val(project.PrimaryContact);
            $('#projNumberOfMembers').val(project.NumberOfMembers);
            $('#projstartDate').val(project.StartDate ? project.StartDate.DateWCF() : '');
            $('#projendDate').val(project.EndDate ? project.EndDate.DateWCF() : '');

            //Passport settings
            $("#isPassportNumberRequired").prop('checked', project.IsPassportNumberRequired);
            $("#isPassportExpiryDateRequired").prop('checked', project.IsPassportExpiryDateRequired);

            //Medical Aid settings
            $("#isMedicalAidNameRequired").prop('checked', project.IsMedicalAidNameRequired);
            $("#isMedicalAidNumberRequired").prop('checked', project.IsMedicalAidNumberRequired);
            $("#isMedicalAidContactNumberRequired").prop('checked', project.IsMedicalAidContactNumberRequired);
            $("#isBloodTypeRequired").prop('checked', project.IsBloodTypeRequired);
            $("#isAllergiesRequired").prop('checked', project.IsAllergiesRequired);
            $("#isAllergiesDescriptionRequired").prop('checked', project.IsAllergiesDescriptionRequired);
            $("#isVaccinationsRequired").prop('checked', project.IsVaccinationsRequired);

            //Clothing settings
            $("#isSafetyBootsRequired").prop('checked', project.IsSafetyBootsRequired);
            $("#isVestRequired").prop('checked', project.IsVestRequired);

            //Docs settings
            $("#isPassportDocRequired").prop('checked', project.IsPassportDocRequired);
            $("#isETicketDocRequired").prop('checked', project.IsETicketDocRequired);
            $("#isVisaDocRequired").prop('checked', project.IsVisaDocRequired);
            $("#isAccommodationDocRequired").prop('checked', project.IsAccommodationDocRequired);
            $("#isVaccinationDocRequired").prop('checked', project.IsVaccinationDocRequired);
            $("#isDriversLicenseDocRequired").prop('checked', project.IsDriversLicenseDocRequired);
            $("#isCustomsClearanceDocRequired").prop('checked', project.IsCustomsClearanceDocRequired);

            $('#otherInformationRequired').val(project.otherInformation);

            //Show Start/End project buttons

            var startBtn = $('#StartProject');
            var endBtn = $('#EndProject');

            if (project.ActualStartDate !== null && project.ActualEndDate !== null) {
               //We hide the buttons, the project has ended
               startBtn.hide();
               endBtn.hide();
            }
            else {
               if (project.ActualStartDate !== null && project.ActualEndDate == null) {
                  //Has started but has not ended
                  startBtn.hide();
                  endBtn.show();
               }
               else if (project.ActualStartDate == null && project.ActualEndDate == null) {
                  //Has not started yet
                  startBtn.show();
                  endBtn.hide();
               }
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}


//StartProject(string secretKey, string companyID, string projectID)
function StartProject() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }

   var methodName = "StartProject";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID
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

            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //User deactivated
               ShowSuccessModal("Project has been started.");
               GetThisProjectToView();
            }
         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}

//EndProject(string secretKey, string companyID, string projectID)
function EndProject() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }

   var methodName = "EndProject";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID
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

            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //User deactivated
               ShowSuccessModal("Project has been ended.");
               GetThisProjectToView();
            }
         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}

//GetTeamMembers
function GetProjectTeam() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose team you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find a project to view.");
      return false;
   }

   var getAll = $('#x').is(':checked');

   var methodName = "GetTeamMembers";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID,
      getAll: getAll
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
            //TODO
            var TeamMembers = JSON.parse(data.RRZResult);
            var member;

            var dataTableAPI = $('#tblTeamItems').dataTable();
            dataTableAPI.fnClearTable();
            for (var i = 0; i < TeamMembers.length; i++) {
               member = TeamMembers[i];
               var active = null;
               if (!member.IsActive){
                  active = DT_AddCustom(member.UserId, 'fa fa-user-plus', 'DT_EvokeTeamActivate btn text-green', 'Activate user');
               }
               else {
                  active = DT_AddCustom(member.UserId, 'fa fa-user-times', 'DT_EvokeTeamDeactivate btn text-yellow', 'Deactivate user');
               }
               var ComReg = null;
               if (member.CompletedRegistration) {
                  ComReg = ''
               } else {
                  ComReg = DT_AddCustom(member.UserId, 'fa fa-warning', 'text-red', 'This user has not completed registration');
               }

               member.Firstnames = member.Firstnames ? member.Firstnames : '';
               member.Lastname = member.Lastname ? member.Lastname : '';

               dataTableAPI.fnAddData(
                          [
                              {
                                 "0": member.Firstnames + ' ' + member.Lastname,
                                 "1": member.RoleName,
                                 "2": member.Email,
                                 "3": member.ContactNumber,
                                 "4": //'<a href="/Administration/Users?id=' + member.UserId + '" title="Edit User">' + DT_AddCustom(member.UserId, 'fa fa-pencil btn text-black', 'DT_EvokeView') + '</a>' + ' ' +
                                    active + ' ' +
                                    DT_AddCustom(member.UserId, 'fa fa-trash-o btn text-black', 'DT_EvokeTeamDelete', 'Remove team user from project') + ' ' +
                                    ComReg,
                                 "DT_RowId": member.UserId,
                              }
                          ]
                      );

               //'<a class="btn" href="/Administration/Users?id=' + proj.ID + '" title="Edit User">' + DT_AddCustom(member.UserId, 'fa fa-pencil btn', 'DT_EvokeView') + '</a>'
               //DT_AddCustom(appr.key, appr.icon, appr.cssClass, appr.toolTip) +' '+
            }
            $('#tblTeamItems tr').click(function (event) {
                if ($(event.originalEvent.target).closest('td')[0] == $(event.originalEvent.target).closest('tr')[0].lastChild) return;
                event.stopPropagation();
                location.href = "/Administration/Users?id=" + event.currentTarget.id;
            });
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function GetProjectsForImport() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var methodName = "GetAllProjectsForCompany";
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
         var tbody = $('#projectTBody');
         if (data.RRZResult) {
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult);
               ShowErrorModal(error);
               tbody.html(MakeDataTableError(error, 5));
               return;
            }

            projList = JSON.parse(data.RRZResult);
            var proj;

            var projectsToImportList = $('#projectsToImportList');
            projSurveys = JSON.parse(data.RRZResult);
            var proj, sStart, sEnd, projOpt;


            for (var i = 0; i < projList.length; i++) {
               proj = projList[i];
               sStart = proj.StartDate ? proj.StartDate.DateWCF() : 'Has not Started';
               sEnd = proj.EndDate ? proj.StartDate.DateWCF() : 'Has not Ended';
               projOpt = '<option value="' + proj.ID + '">' + proj.ProjectName + ' (' + sStart + ' - ' + sEnd + ')</option>';

               projectsToImportList.append(projOpt);
               $('#importTeamsModal').modal('show');
            }
         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}

function ImportTeamFromProject() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   var projectToImportID = $('#projectsToImportList').val();

   //ImportProjectTeam(secretKey, fromProjectID, toProjectID)
   var methodName = "ImportProjectTeam";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      fromProjectID: projectToImportID,
      toProjectID: projID
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
               ShowErrorModal(error, false, $('#importTeamsModal'));
               return;
            }
            $('#importTeamsModal').modal('hide');
            var reponse = JSON.parse(data.RRZResult);
            GetThisProjectToView();
            GetProjectTeam();
            ShowSuccessModal('Team has been successfully imported');
         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}



function WelcomeProjectTeamEmail() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   //WelcomeProjectTeamEmail(secretKey, projectID)
   var methodName = "WelcomeProjectTeamEmail";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      projectID: projID
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
               ShowErrorModal(error, false, $('#sendProjectTeamMailModal'));
               return;
            }
            $('#sendProjectTeamMailModal').modal('hide');
            var reponse = JSON.parse(data.RRZResult);
            ShowSuccessModal('Mail sent to team');
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d, false, $('#sendProjectTeamMailModal'));
      }
   });
}

function GetCompanyRoles() {
   if (typeof (userCode) == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof (curComp) == "undefined" || curComp == null || typeof (curComp.compID) == "undefined" || curComp.compID == null) {
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

function AddTeamMember() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }

   //get all the details
   var userEmail = $('#UserEmail').val();
   var roleDDL = $('#roleDDL option:selected').val();
   
   if (!userEmail)
   {
      $('#addProjectUserModalError').html('Select a user or add user email to invite');
      return false;
   }

   if (!roleDDL) {
      $('#addProjectUserModalError').html('Select a role for user in this project');
      return false;
   }

   var methodName = "AddTeamMember";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: curComp.compID, projectID: projID,
      emailAddress: userEmail, roleID: roleDDL
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
               ShowErrorModal(error, false, $('#addProjectUserModal'));
               return false;
            }
            $('#addProjectUserModal').modal('hide');
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //Project updated
               var proj = curProject ? "Project: <strong>" + curProject.ProjectName + "</strong>." : "this project.";
               ShowSuccessModal("User: <strong>" + userEmail + "</strong> has been added to " + proj);
               $('#projTabs a[href="#team"]').tab('show');
               GetProjectTeam();
               GetCompanyRoles();
               GetNonTeamUsers();
               GetThisProjectRequiredUserData();
               $('#UserEmail').val('');
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d, false, $('#addProjectUserModal'));
      }
   });
}

//DeactivateUser(string secretKey, string companyID, string userID)
function DeactivateTeamUser(userID) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }

   if (typeof userID == "undefined" || userID == null) {
      ShowErrorModal("Please select user you want to view.");
      return false;
   }

   var methodName = "DeactivateTeamMember";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID,
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
               ShowErrorModal(error);
               return;
            }

            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //User deactivated
               ShowSuccessModal("User has been deactivated.");
            }
            GetProjectTeam();
         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}


//ReactivateUser(string secretKey, string companyID, string userID)
function ActivateTeamUser(userID) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }

   if (typeof userID == "undefined" || userID == null) {
      ShowErrorModal("Please select user you want to view.");
      return false;
   }

   var methodName = "ReactivateTeamMember";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID,
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
               ShowErrorModal(error);
               return;
            }

            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //User activated

               ShowSuccessModal("User has been activated.");
            }
            GetTeamUsers();
         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}

//ReactivateUser(string secretKey, string companyID, string userID)
function RemoveTeamUser(userID) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }

   if (typeof userID == "undefined" || userID == null) {
      ShowErrorModal("Please select user you want to view.");
      return false;
   }

   var methodName = "RemoveTeamMember";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID,
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
               ShowErrorModal(error);
               return;
            }

            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //User activated
               ShowSuccessModal("User has been removed from project.");
            }
            GetProjectTeam();
            GetCompanyRoles();
            GetNonTeamUsers();
            GetThisProjectRequiredUserData();
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d, "Error Occured.");
      }
   });
}

//GetAllSurveysForProject
function GetProjectSurveys() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose surveys you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find a project to view.");
      return false;
   }

   var methodName = "GetAllSurveysForProject";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      projectID: projID,
      getAll:true
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
            //TODO
            var projSurveys = JSON.parse(data.RRZResult);
             var surv;
             var name = '/' + user.Firstnames + '%20' + user.Lastname;
             var theme = '/' + user.SelectedSkin;
             var key = '/' + encodeURIComponent(userCode);

            var dataTableAPI = $('#tblSurveysItems').dataTable();
            dataTableAPI.fnClearTable();
            for (var i = 0; i < projSurveys.length; i++) {
                surv = projSurveys[i];
                var survID = '/' + surv.ID;
               var by = surv.CreatedByName ? surv.CreatedByName : ' ';
               dataTableAPI.fnAddData(
                          [
                              /*{
                                 "0": surv.SurveyTitle,
                                 "1": surv.Purpose,
                                 "2": by,
                                 "3": surv.StartDate ? surv.StartDate.DateWCF() : 'Has not Started',
                                 "4": surv.EndDate ? surv.EndDate.DateWCF() : 'Has not Ended',
                                 "5": '',//'<a href="ManageSurveyQuestions?id=' + surv.ID + '" title="View Survey">' + DT_AddCustom(surv.ID, 'fa fa-pencil btn text-black', '') + '</a>',
                                 "DT_RowId": surv.ID,
                              },*/
                              {
                                   "0": surv.SurveyTitle,
                                   "1": surv.DateCreated ? surv.DateCreated.DateWCF() : ' ',
                                   "2": surv.CreatedByName ? surv.CreatedByName : ' ',
                                   "3": surv.StartDate ? surv.StartDate.DateWCF() : 'Has not Started',
                                   "4": surv.EndDate ? surv.StartDate.DateWCF() : 'Has not Ended',
                                   "5": //'<a href="ViewSurvey?id=' + surv.ID + '"title="Manage Survey">' + DT_AddCustom(surv.ID, 'fa fa-cogs btn text-black', '') + '</a>' +
                                       '  ' + '<a href="ManageSurveyQuestions?id=' + surv.ID + '"title="Edit Questions">' + DT_AddCustom(surv.ID, 'fa fa-question-circle-o btn text-black', '') + '</a>'
                                      + '<a target="_blank" href="' + surveyPreviewURL + survID + name + theme + key + '" title="Preview Survey">' + DT_AddCustom(surv.ID, 'fa icon-surveys btn text-black', '') + '</a>'
                                       + '  ' + '<a href="ViewSurvey?id=' + surv.ID + '"title="View Survey">' + DT_AddCustom(surv.ID, 'fa fa-eye btn text-black', '') + '</a>',
                                   "DT_RowId": surv.ID,
                               }
                          ]
                      );

               //'<a href="/Administration/Survey?id=' + surv.ID + '" title="Edit User">' + DT_AddCustom(surv.ID, 'fa fa-pencil btn', 'DT_EvokeView') + '</a>'
             }
             $('#tblSurveysItems tbody tr').click(function (event) {
                 if ($(event.originalEvent.target).closest('td')[0] == $(event.originalEvent.target).closest('tr')[0].lastChild) return;

                 location.href = "ViewSurvey?id=" + event.currentTarget.id;
             });
             initTooltip();
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function CreateSurvey() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }
   /*
   public string AddSurvey(string secretKey, string companyID, string surveyTitle, string projectID, string purpose)

   */
   //get all the details
   var title = $('#surveyTitle').val();
   var purpose = $('#surveyPurpose').val();

   var methodName = "AddSurvey";
   var jsonData = JSON.stringify({
      secretKey: userCode, companyID: curComp.compID, projectID: projID,
      surveyTitle: title, purpose: purpose
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
         //$('#addProjectUserModal').modal('hide');
         if (data.RRZResult) {
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult, false, $('#addProjectSurveyModal'));
               ShowErrorModal(error);
               return false;
            }
            $('#addProjectSurveyModal').modal('hide');
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //Project updated
               var proj = curProject ? "Project: <strong>" + curProject.ProjectName + "</strong>." : "this project.";
               ShowSuccessModal("Survey: <strong>" + title + "</strong> has been created for " + proj);
               $('#projTabs a[href="#questions"]').tab('show');
               GetProjectSurveys();
               $('#surveyTitle').val('');
               $('#surveyPurpose').val('');
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(d, false, $('#addProjectSurveyModal'));
      }
   });
}

// importUserDocsToProject(secretKey, projectID, replaceFile)
function importUserDocsToProject() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   var projID = getQueryParameter('id');

   if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
      ShowErrorModal("Could not find project id to update.");
      return false;
   }

   var replace = $('#replaceExisting').is(':checked');

   // importUserDocsToProject(secretKey, projectID, replaceFile)
   var methodName = "importUserDocsToProject";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      projectID: projID,
      replaceFile: replace
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
               ShowErrorModal(error,false,$('#importUserDocsModal'));
               return;
            }
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               $('#importUserDocsModal').modal('hide');
               $('#replaceExisting').prop('checked', false);

               ShowSuccessModal("User documents imported, click 'Project Documents' to view");
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d, false, $('#importUserDocsModal'));
      }
   });
}
