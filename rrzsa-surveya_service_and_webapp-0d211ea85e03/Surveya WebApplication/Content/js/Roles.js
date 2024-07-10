//Global properties
var roleList = [];
var rightsList = [];
var selectedRoleIndex = -1;
var selectedRights = [];

$(function () {
   checkRights('User');
   GetAllRights();

   $('#refreshRoles').on('click', function () {
      if (user.IsAdmin) {
         GetSystemRoles();
      }
      else {
         GetCompanyRoles();
      }
   });

   $('#newRoleBtn').on('click', function () {
      setNewRole();
   });

   $('#duplicateRoleBtn').on('click', function () {
      setNewRole();

      var roleName = $("#roleName");
      roleName.val("NEW DUPLICATE ROLE");

      var roleDescr = $("#roleDescription");
      roleDescr.val("NEW DUPLICATE ROLE");

      if (selectedRights && $.isArray(selectedRights)) {
         var rightsContainer = $("#rightChckDiv");

         var check, ri;

         for (var i = 0; i < selectedRights.length; i++) {
            ri = selectedRights[i];
            check = $('#' + ri.ID);
            check.prop('checked', true);
         }
      }
   });

   $(document).on('click', '.roleBtn', function () {

      var roleIndex = $(this).data('index');
      selectRole(roleIndex);
   });

   $('#DeActivateRoleBtn').on('click', function () {
      DeactivateRole();
   });

   $('#ActivateRoleBtn').on('click', function () {
      ReactivateRole();
   });

   $(document).on('click', '.selectGroup', function () {
      var role = undefined;
      if (typeof (selectedRoleIndex) == 'number' && selectedRoleIndex >= 0) {
         role = roleList[selectedRoleIndex];
         role.IsActive
         role.IsSysRole
      }

      // if typeof (selectedRoleIndex) == 'undefined' then we are adding a new role
      if (typeof (selectedRoleIndex) == 'undefined' || role.IsActive == true && (role.IsSysRole == false || user.IsAdmin == true)) {

         var btn = $(this);
         var group = btn.data('group');
         var selected = btn.attr('data-selected');    //.data('selected');

         if (selected == true || selected == 'true') { selected = false; }
         else { selected = true; }

         var txt = selected ? '[uncheck all]' : '[check all]';

         btn.attr('data-selected', selected);
         btn.html(txt);

         var checks = $("#rightChckDiv").find('input');
         var cbx, cbxGrp;
         for (var i = 0; i < checks.length; i++) {
            cbx = checks[i];
            cbxGrp = $(cbx).data('group');
            if (group == cbxGrp) {
               $(cbx).prop('checked', selected);
            }
         }
      }
   });
   /*
   $(document).on('click', '.unselectGroup', function () {
      var group = $(this).data('group');
      $("#rightChckDiv").filter('[data-group="' + group + '"]').prop('checked', false);
   });
   */
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

function GetAllRights() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "GetAllRights";
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
            if (user.IsAdmin) {
               GetSystemRoles();
            }
            else {
               GetCompanyRoles();
            }
            rightsList = JSON.parse(data.RRZResult);
            var rightsDiv = $('#rightChckDiv');
            rightsDiv.children().remove();
            var ri, rightChk, rightGroup, RightGroupName = '';
            for (var i = 0; i < rightsList.length; i++) {
               ri = rightsList[i];
               if (ri.RightGroup !== RightGroupName)
               {
                  RightGroupName = ri.RightGroup;
                  rightGroup = $('<div></div>')
                  .addClass('rightsHeader col-xs-12')
                  .html('<h4>'+RightGroupName +
                     "  <small><a class='selectGroup btn' data-selected='false' data-group='" + RightGroupName + "'> [check all] </a></small></h4>");
                  rightsDiv.append(rightGroup);
               }

               rightChk = $('<div></div>')
                .html("<div class='checkbox col-xs-12 col-sm-6 col-md-4 truncate'><label title='" + ri.FriendlyName + " - " + ri.Description + "'><input id='" + ri.ID + "' name='" + ri.Name + "' data-group='" + RightGroupName + "' type='checkbox' title='" + ri.FriendlyName + " - " + ri.Description + "'> " + ri.FriendlyName + " </label></div>");

               rightsDiv.append(rightChk);
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function resetRightsChecked()
{
   $("#rightChckDiv").find('input').prop('checked', false);
}

function setNewRole()
{
   selectedRoleIndex = undefined;

   var roleName = $("#roleName");
   var roleDescr = $("#roleDescription");

   var activate = $('#ActivateRoleBtn');
   var deactivate = $('#DeActivateRoleBtn');
   var save = $('#SaveRightsBtn');

   $('#isReadOnly').hide();
   activate.hide();
   deactivate.hide();
   EnableElements(save);

   roleName.val("");
   roleDescr.val("");

   RemoveReadonly(roleName);
   RemoveReadonly(roleDescr);

   var righDiv = $("#rightChckDiv");
   EnableElements(righDiv.find('input'));
   righDiv.find('input').prop('checked', false);
   $("#roleCardDiv .btn").removeClass("btn-info").addClass("btn-default");

   $('#SaveRightsBtn').off('click');
   $('#SaveRightsBtn').on('click', function () {
      AddNewRole();
   });
}

function selectRole(roleIndex)
{

   //unselect the last selected role btn and select the clicked one
   $("#roleCardDiv .btn").removeClass("btn-info").addClass("btn-default");
   $('#role' + roleIndex).addClass("btn-info");

   resetRightsChecked();
   setSelectedRole(roleIndex);

   $('#SaveRightsBtn').off('click');
   $('#SaveRightsBtn').on('click', function () {
      UpdateRole();
   });
}

/*

IsActive:true
IsDeleted:false
IsSysRole:true

*/

function setSelectedRole(roIndex) {

   if (typeof roIndex == "undefined" || roIndex == null) {
      ShowErrorModal("Please select a role whose rights you want to view.");
      return false;
   }
   var role = roleList[roIndex];

   var isReadOnly = $('#isReadOnly');

   var roleName = $("#roleName");
   roleName.val(role.RoleName);

   var roleDescr = $("#roleDescription");
   roleDescr.val(role.Description);

   var activate = $('#ActivateRoleBtn');
   var deactivate = $('#DeActivateRoleBtn');
   var save = $('#SaveRightsBtn');

   if (!role.IsActive)
   {
      MakeReadonly(roleName);
      MakeReadonly(roleDescr);
      activate.show();
      deactivate.hide();
   }
   else {
      RemoveReadonly(roleName);
      RemoveReadonly(roleDescr);
      activate.hide();
      deactivate.show();
   }

   if (role.IsSysRole && !role.CanEditSysRole)
   {
      MakeReadonly(roleName);
      MakeReadonly(roleDescr);
      DisableElements(activate);
      DisableElements(deactivate);
      DisableElements(save);
      isReadOnly.show();
   }
   else {
      RemoveReadonly(roleName);
      RemoveReadonly(roleDescr);
      EnableElements(activate);
      EnableElements(deactivate);
      EnableElements(save);
   }

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   /*
   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }
   companyID: curComp.compID,
   */
   
   if (typeof role == "undefined" || role == null || role.RoleId == "undefined" || role.RoleId == null) {
      ShowErrorModal("Please select a role whose rights you want to view.");
      return false;
   }

   selectedRoleIndex = roIndex;

   var methodName = "GetAllRightsForRole";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      roleID: role.RoleId
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

            selectedRights = JSON.parse(data.RRZResult);
            var rightsContainer = $("#rightChckDiv");

            if (!role.IsActive || (role.IsSysRole && !role.CanEditSysRole)) {
               isReadOnly.show();
               DisableElements(rightsContainer.find('input'));
            }
            else {
               isReadOnly.hide();
               EnableElements(rightsContainer.find('input'));
            }

            var check, ri;

            for (var i = 0; i < selectedRights.length; i++) {
               ri = selectedRights[i];
               check = $('#' + ri.ID);
               check.prop('checked', true);
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });

}

//GetAllRoles 
function GetCompanyRoles() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   var methodName = "GetAllRolesForCompany";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      getAll: true
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
            roleList = JSON.parse(data.RRZResult);
            var roleDiv = $('#roleCardDiv');
            roleDiv.children().remove();
            var ro, roleBtn;
            for (var i = 0; i < roleList.length; i++) {
               ro = roleList[i];

               var isSys = ro.IsSysRole ? ' (Sys)' : '';
               roleBtn = $('<div></div>')
                  .attr('id','role'+i)
                  .attr('data-index', i)
                  .addClass('btn btn-flat btn-lg btn-block truncate roleBtn btn-default')
                  .html('<h4>' + ro.RoleName +isSys+ '</h4><small>' + ro.Description + '</small>');

               if (ro.IsSysRole) {
                  roleBtn
               }
               roleDiv.append(roleBtn);
            }
            selectRole(0);
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

//GetAllRoles 
function GetSystemRoles() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "GetAllSysRoles";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      getAll: true
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
            roleList = JSON.parse(data.RRZResult);
            var roleDiv = $('#roleCardDiv');
            roleDiv.children().remove();
            var ro, roleBtn;
            for (var i = 0; i < roleList.length; i++) {
               ro = roleList[i];

               var isSys = ro.IsSysRole ? ' (Sys)' : '';
               roleBtn = $('<div></div>')
                  .attr('id', 'role' + i)
                  .attr('data-index', i)
                  .addClass('btn btn-flat btn-lg btn-block truncate roleBtn btn-default')
                  .html('<h4>' + ro.RoleName + isSys + '</h4><small>' + ro.Description + '</small>');

               if (ro.IsSysRole) {
                  roleBtn
               }
               roleDiv.append(roleBtn);
            }
            selectRole(0);
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function AddNewRole() {

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      //$("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   var rights = [];
   var r, checked, ri;
   for (var i = 0; i < rightsList.length; i++) {
      r = rightsList[i];
      checked = $('#' + r.ID).is(":checked");
      if (checked) {
         ri = { id: r.ID };
         rights.push(ri);
      }
   }

   var roleName = $("#roleName").val();
   var roleDescription = $("#roleDescription").val();

   var methodName = "AddRole";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      roleName: roleName,
      roleDescription: roleDescription,
      rights: JSON.stringify(rights)
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
               ShowSuccessModal("Role : <strong>" + roleName + "</strong> has been saved.");
               if (user.IsAdmin) {
                  GetSystemRoles();
               }
               else {
                  GetCompanyRoles();
               }
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}


function UpdateRole() {

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      //$("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
      return false;
   }
   var compID = '';
   if (!user.IsAdmin) {
      if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
         ShowErrorModal("Please select a company whose roles you want to view.");
         return false;
      }
      compID = curComp.compID;
   }

   if (typeof selectedRoleIndex == "undefined" || selectedRoleIndex == null) {
      ShowErrorModal("Please select a role whose rights you want to view.");
      return false;
   }
   var role = roleList[selectedRoleIndex];


   var rights = [];
   var r, checked, ri;
   for (var i = 0; i < rightsList.length; i++) {
      r = rightsList[i];
      checked = $('#' + r.ID).is(":checked");
      if(checked)
      {
         ri = { id: r.ID };
         rights.push(ri);
      }
   }

   var roleName = $("#roleName").val();
   var roleDescription = $("#roleDescription").val();

   var methodName = "UpdateRole";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: compID,
      roleID: role.RoleId,
      roleName: roleName,
      roleDescription: roleDescription,
      rights: JSON.stringify(rights)
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
               ShowSuccessModal("Role : <strong>" + roleName + "</strong> has been saved.");
               if (user.IsAdmin) {
                  GetSystemRoles();
               }
               else {
                  GetCompanyRoles();
               }
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });

}


function DeactivateRole() {

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      //$("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   if (typeof selectedRoleIndex == "undefined" || selectedRoleIndex == null) {
      ShowErrorModal("Please select a role whose rights you want to view.");
      return false;
   }

   var role = roleList[selectedRoleIndex];


   var methodName = "DeactivateRole";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      roleID: role.RoleId,
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
               ShowSuccessModal("Role : <strong>" + role.RoleName + "</strong> has been deactivated.");
               if (user.IsAdmin) {
                  GetSystemRoles();
               }
               else {
                  GetCompanyRoles();
               }
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });

}


function ReactivateRole() {

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      //$("#tblItems").html(CreateError("We were unable to authenticate your request, please try logging in again."));
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose roles you want to view.");
      return false;
   }

   if (typeof selectedRoleIndex == "undefined" || selectedRoleIndex == null) {
      ShowErrorModal("Please select a role whose rights you want to view.");
      return false;
   }

   var role = roleList[selectedRoleIndex];


   var methodName = "ReactivateRole";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      companyID: curComp.compID,
      roleID: role.RoleId,
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
               ShowSuccessModal("Role : <strong>" + role.RoleName + "</strong> has been reactivated.");
               if (user.IsAdmin) {
                  GetSystemRoles();
               }
               else {
                  GetCompanyRoles();
               }
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });

}