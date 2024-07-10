
//show the version
var version = "2.015";
$(".version").text("Version " + version);


//Global properties

/*var defaultLogos = {
    mini: '../../Content/Images/Surveyor_pin.png',
    lg: '../../Content/Images/Surveyor_thumb.png'
}
*/

var defaultLogos = {
    mini: '../../Content/Images/placeholder_pin.png',
    lg: '../../Content/Images/placeholder_thumb.png'
}

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

var curComp;
var userCompanyList;
var roles = [];
var rights = [];

var logos = null;
var sideBar = null;

var table = null;
var previousModal = null;

$(function () {

   setUpCountries();

   var dateNow = new Date();
   $('#currentYear').html(dateNow.getFullYear());

   //used to display the modal for every ajax call             Pace.restart(); 
   $(document).on({
      ajaxStart: function () { $('body').addClass("loading"); },
      ajaxStop: function () { $('body').removeClass("loading"); }
   });

   window.setInterval(function () { $.get(packageInvoiceURL); }, 1140000); //1140000 = 1 minute before end of the session

   var modal = $('.modal');
   if (modal) {
      modal.on('hidden.bs.modal', function (e) {
         /*
          jQuery sometimes adds a padding right on the body when you close a modal...
          THIS REMOVES IT
         */
         var body = $('body');
         if(body)
         {
            body.css('padding', '0px');
         }
      })
   }

   $('tbody tr').on('click', function () {
      var tr = $(this);
      tr.find('.DT_EvokeView').click();
      tr.toggleClass('selected');
   });

    var table = $('#tblItems');
    if(table)
    {
        table.DataTable(dataTableOptions);
       $('#DT_global_filter').on('keyup click', function () {
          var filter = $(this);
          filterGlobal(filter);
       });
    }
    if (typeof(user)!="undefined")
    {
       //userName
       $(document).find('.userName').html(user.Firstnames + ' ' + user.Lastname);

       if (user.Company) {
          curComp = JSON.parse(user.Company);
          if (curComp && curComp != null && curComp.compLogos == null)
          {
             curComp.compLogos = {
                mini: '../../Content/Images/placeholder_pin.png',
                lg: '../../Content/Images/placeholder_thumb.png'
             }
          }
          saveJObjToStore('curComp', curComp);
       }
       if (curComp == null || curComp.compName == null) {
          curComp = setDefaultComp();

          companies = [];
          companies.push(curComp);
       }

       if (curComp.compID) {
          setCompany();
       }

       if (curComp.compID == 'd5776053-a787-4e86-a7e2-b063cb3063dd') {
           $('#newCoupon').show();
       }

       //systemCompanyLink
       if(user.IsAdmin)
       {
          $('#newSignupsLink').show();
          $('#systemCompanyLink').show();
          $('#systemPackageLink').show();
       }

       if (user.IsEmailVerified)
       {
          $('#emailUnvalidated').hide();
       }
       else {
          $('#emailUnvalidated').show();
       }

       if (user.NotificationMessage) {
          $('#packageExpiryDateDiv').show();
          $('#packageExpiryDate').html(user.NotificationMessage);
       } else {
          $('#packageExpiryDateDiv').hide();
          $('#packageExpiryDate').html('');
       }
    }
    else if (typeof (userCode) == "undefined" || userCode == null || userCode.length <= 0) {
       var str = location.href.toLowerCase();

       //only test if browsing the logged in session
       var notLogged = '/administration'
       var loginReturn = 'login?returnurl';
       if (str.indexOf(notLogged) != -1 && str.indexOf(loginReturn) == -1) {
          ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
          return false;
       }
    }
    setAppWhiteLabelling();
   
    sideBar = loadJObjFromStore('sideBar');
    logos = loadJObjFromStore('logos');
    countries = loadJObjFromStore('countries');
   /*
    rights = loadJObjFromStore('rights');
    companies = loadJObjFromStore('companies');
    people = loadJObjFromStore('people');
    roles = loadJObjFromStore('roles');
    */

    collapseSidebar(sideBar == 'sidebar-collapse');


    if (!roles) roles = [];
    else if (!$.isArray(roles)) {
       roles = [];
    }

    if (!rights) rights = [];
    else if (!$.isArray(rights)) {
       rights = [];
    }

    if (typeof (user) !== "undefined" && user.Rights) {
       rights = JSON.parse(user.Rights);
    }


    if (!countries)
    { setUpCountries(); }

    //setCountryDDL();
    //setCompanyDDL();
    //setRoleDDL();

    $('#setTeamBtn').on('click', function () {
        setTeam();
    });


    $('#saveNewUser').on('click', function () {
        addUser();
    });

    $('#companyDDL').on('change',
    function () {
        var ddl = $('#companyDDL :selected');
        var selectedID = ddl.attr('value');
        setPeopleDDL(selectedID);
    });

    $('#teamBox').addClass('hidden');

    $('#errorDiv').addClass('hidden');

    $('#showUserActivity').on('click', function (e, a, b, c, d) {
       var sidebarControl = $.AdminLTE.controlSidebar;
       var sidebar = $('.control-sidebar');
       if ($('body').hasClass('control-sidebar-open') || sidebar.hasClass('control-sidebar-open')) {
          sidebarControl.close();
          //sidebar.removeClass('control-sidebar-open');
          //$('body').removeClass('control-sidebar-open');
          //e.stopPropagation();
       }
       else {
          GetUserActivityStream();
          sidebarControl.open();
       }
    });
    $(document).on('click', '.content-wrapper', function () {
       var sidebar = $('.control-sidebar-open');
       if (sidebar.hasClass('control-sidebar-open'))
       {
          var sidebarControl = $.AdminLTE.controlSidebar;
          sidebarControl.close();
          sidebar.removeClass('control-sidebar-open');
          $('body').removeClass('control-sidebar-open');
       }
    });

    //$("#showUserActivity").on('click', function () {
    //   var slide = !$.AdminLTE.options.controlSidebarOptions.slide;
    //   $.AdminLTE.options.controlSidebarOptions.slide = slide;
    //   if (!slide)
    //      $('.control-sidebar').removeClass('control-sidebar-open');
    //});

    /*
        toggle sidebar-collapse

        if ($('body').hasClass('sidebar-collapse')) {
      $("[data-layout='sidebar-collapse']").attr('checked', 'checked');
    }
    $('#isSideCollapsed').on('change', function () {
        var collapse = $(this).is(':checked');
        collapseSidebar(collapse);
    });
    */
    //$('#showUserActivity').on('click', function () {
    //   var sidebar = $(document).find('.control-sidebar');
    //   if (sidebar) {
    //      if (sidebar.hasClass('control-sidebar-open')) { return false; }
    //      else { GetUserActivityStream(); }
    //   }
    //});

    $('#resendEmailBtn').on('click', function () { RequestVerifyEmailAddress(); });

    highlightPagelink();

    /*$("[data-enable='expandOnHover']").on('click', function () {
       $(this).attr('disabled', true);
       $.AdminLTE.pushMenu.expandOnHover();
       if (!$('body').hasClass('sidebar-collapse'))
          $("[data-layout='sidebar-collapse']").click();
    });*/
    //initCheck();
    initTooltip();
    initDatepicker();
    window.setTimeout(initDatepicker, 10000);
});

function addVersioning() {
    var tags = document.getElementsByTagName('head')[0].children;
    var tag;
    for (var i = 0; i < tags.length; i++) {
        tag = tags[i]

        if (tag.localName == 'script') {
            if (tag.src.indexOf('?') == -1) {
                tag.src += ('&v=' + version);
            } else {
                tag.src += ('?v=' + version);
            }
        }
        else if (tag.localName == "link") {
            if (tag.src.indexOf('?') == -1) {
                tag.href += ('&v=' + version);
            } else {
                tag.href += ('?v=' + version);
            }
        }
    }
}

function initCheck()
{
   //iCheck for checkbox and radio inputs
   $('input[type="checkbox"], input[type="radio"]').not('input[disabled]').iCheck({
      checkboxClass: 'icheckbox_square-aero',
      radioClass: 'iradio_square-aero'
   });
}

function initTooltip(container)
{
    if (typeof $(document).tooltip !== 'undefined' && $.isFunction($(document).tooltip)) {
        if (!!container) {
            $('#' + container)
                .find('a, input, button, textarea, label, .checkbox, .radio')
                .tooltip();
        } else {
            $('a, input, button, textarea, label, .checkbox, .radio').tooltip();
        }
   }
}

function initDatepicker() {
   var pageDates = $('input[type="date"]');
   pageDates.datepicker({
      autoclose: true,
      format: "yyyy-mm-dd",
   });
   //remove the default browser date controls
   pageDates.attr('type', 'text');
}

function setDefaultComp()
{
   var newCo ={
       compID: null,
       compName: null,
      compLogos: defaultLogos
   };
   logos = {
      mini: '../../Content/Images/placeholder_pin.png',
      lg: '../../Content/Images/placeholder_thumb.png'
   }
   return newCo;
}

function setCompany()
{
   $('#companyName, .companyNameHolder')
   .html(curComp.compName);
}


function setAppWhiteLabelling()
{
   if (document.getElementById("logoMini") && document.getElementById("logoLg")) {
      if (user.LogoLG != null && user.LogoLG) {
         document.getElementById("logoLg").src = reBase64Data(user.LogoLG);
      }
      else {
         document.getElementById("logoLg").src = defaultLogos.lg;
      }
      if (user.LogoSM != null && user.LogoSM) {
         document.getElementById("logoMini").src = reBase64Data(user.LogoSM);
      }
      else {
         document.getElementById("logoMini").src = defaultLogos.mini;
      }
   }

   if (typeof(user)!='undefined' && user) {
      change_skin(user.SelectedSkin);
   }
   else {
      change_skin(null);   // will set the default skin
   }
}

function filterGlobal(filter) {
   var table = $('#tblItems');
   if (table && filter) {
      table
         .DataTable()
         .search(
          filter.val()
      ).draw();
   }
}

function highlightPagelink()
{
   var str = location.href.toLowerCase();
   var links = $('.sidebar-menu li a');
   var thisLink = '';
   for (var i = 0; i < links.length; i++) {
      thisLink = $(links[i]);
      thisLink.parent().removeClass('active');
      if(str.indexOf(thisLink.attr("href").toLowerCase())>-1)
      {
         thisLink.parent().addClass('active');
      }
   }
}
//RequestVerifyEmailAddress
function RequestVerifyEmailAddress() {

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "RequestVerifyEmailAddress";
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
               return false;
            }
            //TODO success stuff
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //User added
               ShowSuccessModal('Verification email has been resent.');
            }

         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

//VerifyEmailAddress
function VerifyEmailAddress() {

   var verifyID = getQueryParameter('verifyID');
   if (typeof verifyID == "undefined" || verifyID == null || !verifyID) {
      ShowErrorModal("Invalid validation ID, ensure you followed the correct link.", true);
      return false;
   }

   var methodName = "VerifyEmailAddress";
   var jsonData = JSON.stringify({
      verifyID: verifyID
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

            window.location = '../Account/Login?ReturnUrl=/Administration/';

         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

//--------------Rights functions START------------------------

function hasRight(rightList, rightName) {
    if (rightName && typeof (rightName) === 'string') {
        var r = null;
        for (var i = 0; i < rightList.length; i++) {
            r = rightList[i];
            if (r.Name && (r.Name.toLowerCase()).indexOf(rightName.toLowerCase()) !== -1)
                return true;
        }
    }
    return false;
}


function checkRights(page)
{
    if (page && typeof (page) === 'string') {
        var pageRights = getRightsFor(page);
        if (hasRight(pageRights, 'View')) {

            showView();
        }
        if (hasRight(pageRights, 'Add')) {

        }
        if (hasRight(pageRights, 'Edit')) {

        }
        if (hasRight(pageRights, 'Delete')) {

        }
    }
}

function getRightsFor(page)
{
    //pull rights for page
    var r = null;
    var tempRights = [];
    for (var i = 0; i < rights.length; i++) {
        r = rights[i];
        if (r.Name && (r.Name.toLowerCase()).indexOf(page.toLowerCase()) !== -1)
        {
            tempRights.push(r)
        }
    }
    return tempRights;
   //return [{ RightID:"b0318685-e44f-4e0d-8735-b7ac1797a0a4", RightName:"GetAllProjectsForCompany" },...];
}


//--------------Rights functions END------------------------
function addUser() {
    var name = $('#nameTbx').val();
    var surname = $('#surnameTbx').val();
    var email = $('#emailTbx').val();
    var cell = $('#cellTbx').val();

    var comp = $("#companyDDL");
    var selComp = $("#companyDDL :selected");
    var compID = selComp == null ? null : selComp.attr("value");

    var selRole = $("#roleDDL option:selected");
    var roleID = selRole == null ? null : selRole.attr("value");

    var selCou = $("#countryDDL option:selected");
    var countryID = selCou == null ? null : selCou.attr("value");

    if (name && surname && email && cell && compID && roleID && countryID) {
        saveUser(name, surname, email, cell, compID, roleID, countryID);
        $('#newModal').modal('hide');
    }
    else {
        $('#errorDiv').removeClass('hidden');
    }
}

function addProject() {
    var name = $('#nameTbx').val();
    var surname = $('#surnameTbx').val();
    var email = $('#emailTbx').val();
    var cell = $('#cellTbx').val();

    var comp = $("#companyDDL");
    var selComp = $("#companyDDL :selected");
    var compID = selComp == null ? null : selComp.attr("value");

    var selRole = $("#roleDDL option:selected");
    var roleID = selRole == null ? null : selRole.attr("value");

    var selCou = $("#countryDDL option:selected");
    var countryID = selCou == null ? null : selCou.attr("value");

    if (name && surname && email && cell && compID && roleID && countryID) {
        saveUser(name, surname, email, cell, compID, roleID, countryID);
        $('#newModal').modal('hide');
    }
    else {
        $('#errorDiv').removeClass('hidden');
    }
}

function saveUser(name, surname, email, cell, compID, roleID, countryID) {
    var newUser = {
        "name": name,
        "surname": surname,
        "email": email,
        "cell": cell,
        "countryCode": countryID,
        "compID": compID,
        "roleID": roleID
    };

    people.splice(people.length, 0, newUser);
    saveJObjToStore('people', people);
    showUserTable();
}


function findRoleNameByID(roleID) {
    var ro;
    for (var i = 0; i < roles.length; i++) {
        ro = roles[i];
        if (ro.roleID == roleID) {
            return ro.name;
        }
    }
    return null;
}

function findCountryCodeByName(countyName) {
   var country;
   for (var i = 0; i < countries.length; i++) {
      country = countries[i];
      if (country.name == countyName) {
         return country.code;
      }
   }
   return null;
}
function setPeopleDDL(compID) {
    var ddl = $('#teamDDL');
    ddl.children('option').remove();

    var person, opt;
    opt = $('<option></option>')
        .val(-1)
        .attr('selected', 'selected')
        .text('-- Select person(s) for team --');
    ddl.append(opt);
    for (var i = 0; i < people.length; i++) {
        person = people[i];
        if (person.compID == compID) {
            opt = $('<option></option>')
            .val(i)
            .text(person.name + ' ' + person.surname);
            ddl.append(opt);
        }
    }
}

function setCompanyDDL() {
    var ddl = $('#companyDDL');
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

function setCountryDDL(ddl) {
   //var ddl = $('#userCountry');
   var cou, opt;
   if (ddl) {

       //clear the items that are currently in the ddl
       ddl.html();
      for (var i = 0; i < countries.length; i++) {
         cou = countries[i];
         opt = $('<option></option>')
         .val(cou.code)
         .text(cou.name);
         ddl.append(opt);
      }
   }
}

function setRoleDDL(ddl) {
    //var ddl = $('#roleDDL');
    var ro, opt;
    for (var i = 0; i < roles.length; i++) {
       ro = roles[i];
       if (ro.roleID != "RRZAdministrator") {
          opt = $('<option></option>')
          .val(ro.roleID)
          .text(ro.name);
          ddl.append(opt);
       }
    }
}

function setTeam() {
    var selectedOpts = $("#teamDDL option:selected");
    var selectedPeople = [], person;
    for (var i = 0; i < selectedOpts.length; i++) {
        var opt = selectedOpts[i];
        var index = opt.value;
        if (index != -1) {
            person = people[index];
            selectedPeople.splice(selectedPeople.lastIndexOf, 0, person);
        }
    }
    if (selectedPeople.length > 0) {
        $('#teamBox').removeClass('hidden');
        showTeam(selectedPeople);
    }
    else {
        $('#teamBox').addClass('hidden');
    }
}

function showTeam(selectedList) {
    /*
        <div id="selectedTeam" class="col-xs-12">
            <!-- radio -->
            <div class="row">
                <div class="col-sm-9">
                    <h5>{Person}</h5>
                </div>
                <div class="col-sm-2">
                    <div class="radio">
                        <label>
                            <input type="radio" name="optRa" id="opt{index}" value="{index}">
                            Primary
                        </label>
                    </div>
                </div>
            </div>
        </div>
    */
    var person;
    var row, col9, h5, col2, rad, lbl, inpRad;
    var selectedTeam = $('#selectedTeam');
    selectedTeam.children().remove();

    for (var i = 0; i < selectedList.length; i++) {
        person = selectedList[i];
        row = $('<div></div>')
            .addClass('row');

        col9 = $('<div></div>')
            .addClass('col-sm-9');

        h5 = $('<h5></h5>')
            .text(person.name + ' ' + person.surname);

        col9.append(h5);
        row.append(col9);

        col2 = $('<div></div>')
            .addClass('col-sm-2');

        rad = $('<div></div>')
            .addClass('radio');

        lbl = $('<label></label>');

        inpRad = $('<input/>')
            .attr('type', 'radio')
            .attr('name', 'optRa')
            .attr('id', 'opt' + i)
            .attr('value', i);

        lbl.append(inpRad);
        lbl.append('Primary');
        rad.append(lbl);
        col2.append(rad);
        row.append(col2);

        selectedTeam.append(row);
    }



}

function saveJObjToStore(key, JObj) {
    if (typeof JObj === 'boolean' || typeof JObj === 'number' || typeof JObj === 'string') {
        localStorage.setItem(key, JObj);
    }
    else {
        var dataToStore = JSON.stringify(JObj);
        localStorage.setItem(key, dataToStore);
    }
}

function ShowConfirmModal(header, msg, continueFunc) {
   $('#ConfirmationHeader').html(header);
   $('#ConfirmationContent').html(msg);
   $('#continueBtn').off('click');
   $('#continueBtn').on('click', function () {
      $('#ConfirmationModal').modal('hide');
      continueFunc();
   });
   $('#myModal').on('hidden.bs.modal', function (e) {
      $('#continueBtn').off('click');
   });
   $('#ConfirmationModal').modal(); //'show'
}

function HideConfirmModal() {
   $('#ConfirmationModal').modal('hide'); //'hide'
}

function ShowSuccessModal(msg) {
   $('#SuccessContent').html(msg);
   $('#SuccessModal').modal(); //'show'
}


function ShowErrorModal(msg, isLoggedOut, prevModal) {
   $('#ErrorContent').html(msg);
   $('#ErrorModal').modal(); //'show'
   if(isLoggedOut)
   {
      var returnUrl = encodeURI(window.location.pathname + window.location.search + window.location.hash);

      $('#errorModalBtn').on('click', function () {
         window.location = '/Account/Login?ReturnUrl=' + returnUrl;
      });

      $('#ErrorModal').on('hidden.bs.modal', function () {
         window.location = '/Account/Login?ReturnUrl=' + returnUrl;
      })
   }

   else if (prevModal) {
      previousModal = prevModal;
      prevModal.modal('hide');
      $('#ErrorModal').on('hidden.bs.modal', function () {
         if (previousModal) {
            prevModal = previousModal;
            prevModal.modal('show');
            previousModal = null;
         }
      })
   }
}

function loadJObjFromStore(key) {
    var localData = null;
    var obj = localStorage.getItem(key);
    if (obj) {
        if (IsJsonString(obj)) {
            localData = JSON.parse(obj);
        }
        else {
            return obj
        }
    }
    return localData;
}


function change_skin(cls) {
    $.each(my_skins, function (i) {
        $("body").removeClass(my_skins[i]);
    });

    if (cls) {
       $("body").addClass(cls);
    }
    else
    {
       $('body').addClass('skin-black-light');
    }
    return false;
}

function collapseSidebar(collapse) {
    if (collapse) {
        $('body').addClass('sidebar-collapse');
        saveJObjToStore('sideBar', 'sidebar-collapse');
    }
    else {
        $('body').removeClass('sidebar-collapse');
        saveJObjToStore('sideBar', null);
    }
}


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function setUpCountries()
{
   countries = [
    { "name": "", "code": "" },
    { "name": "South Africa", "code": "ZA" },
    { "name": "Afghanistan", "code": "AF" },
    { "name": "Åland Islands", "code": "AX" },
    { "name": "Albania", "code": "AL" },
    { "name": "Algeria", "code": "DZ" },
    { "name": "American Samoa", "code": "AS" },
    { "name": "Andorra", "code": "AD" },
    { "name": "Angola", "code": "AO" },
    { "name": "Anguilla", "code": "AI" },
    { "name": "Antarctica", "code": "AQ" },
    { "name": "Antigua and Barbuda", "code": "AG" },
    { "name": "Argentina", "code": "AR" },
    { "name": "Armenia", "code": "AM" },
    { "name": "Aruba", "code": "AW" },
    { "name": "Australia", "code": "AU" },
    { "name": "Austria", "code": "AT" },
    { "name": "Azerbaijan", "code": "AZ" },
    { "name": "Bahamas", "code": "BS" },
    { "name": "Bahrain", "code": "BH" },
    { "name": "Bangladesh", "code": "BD" },
    { "name": "Barbados", "code": "BB" },
    { "name": "Belarus", "code": "BY" },
    { "name": "Belgium", "code": "BE" },
    { "name": "Belize", "code": "BZ" },
    { "name": "Benin", "code": "BJ" },
    { "name": "Bermuda", "code": "BM" },
    { "name": "Bhutan", "code": "BT" },
    { "name": "Bolivia", "code": "BO" },
    { "name": "Bosnia and Herzegovina", "code": "BA" },
    { "name": "Botswana", "code": "BW" },
    { "name": "Bouvet Island", "code": "BV" },
    { "name": "Brazil", "code": "BR" },
    { "name": "British Indian Ocean Territory", "code": "IO" },
    { "name": "Brunei Darussalam", "code": "BN" },
    { "name": "Bulgaria", "code": "BG" },
    { "name": "Burkina Faso", "code": "BF" },
    { "name": "Burundi", "code": "BI" },
    { "name": "Cambodia", "code": "KH" },
    { "name": "Cameroon", "code": "CM" },
    { "name": "Canada", "code": "CA" },
    { "name": "Cape Verde", "code": "CV" },
    { "name": "Cayman Islands", "code": "KY" },
    { "name": "Central African Republic", "code": "CF" },
    { "name": "Chad", "code": "TD" },
    { "name": "Chile", "code": "CL" },
    { "name": "China", "code": "CN" },
    { "name": "Christmas Island", "code": "CX" },
    { "name": "Cocos (Keeling) Islands", "code": "CC" },
    { "name": "Colombia", "code": "CO" },
    { "name": "Comoros", "code": "KM" },
    { "name": "Congo", "code": "CG" },
    { "name": "Congo, The Democratic Republic of the", "code": "CD" },
    { "name": "Cook Islands", "code": "CK" },
    { "name": "Costa Rica", "code": "CR" },
    { "name": "Cote D'Ivoire", "code": "CI" },
    { "name": "Croatia", "code": "HR" },
    { "name": "Cuba", "code": "CU" },
    { "name": "Cyprus", "code": "CY" },
    { "name": "Czech Republic", "code": "CZ" },
    { "name": "Denmark", "code": "DK" },
    { "name": "Djibouti", "code": "DJ" },
    { "name": "Dominica", "code": "DM" },
    { "name": "Dominican Republic", "code": "DO" },
    { "name": "Ecuador", "code": "EC" },
    { "name": "Egypt", "code": "EG" },
    { "name": "El Salvador", "code": "SV" },
    { "name": "Equatorial Guinea", "code": "GQ" },
    { "name": "Eritrea", "code": "ER" },
    { "name": "Estonia", "code": "EE" },
    { "name": "Ethiopia", "code": "ET" },
    { "name": "Falkland Islands (Malvinas)", "code": "FK" },
    { "name": "Faroe Islands", "code": "FO" },
    { "name": "Fiji", "code": "FJ" },
    { "name": "Finland", "code": "FI" },
    { "name": "France", "code": "FR" },
    { "name": "French Guiana", "code": "GF" },
    { "name": "French Polynesia", "code": "PF" },
    { "name": "French Southern Territories", "code": "TF" },
    { "name": "Gabon", "code": "GA" },
    { "name": "Gambia", "code": "GM" },
    { "name": "Georgia", "code": "GE" },
    { "name": "Germany", "code": "DE" },
    { "name": "Ghana", "code": "GH" },
    { "name": "Gibraltar", "code": "GI" },
    { "name": "Greece", "code": "GR" },
    { "name": "Greenland", "code": "GL" },
    { "name": "Grenada", "code": "GD" },
    { "name": "Guadeloupe", "code": "GP" },
    { "name": "Guam", "code": "GU" },
    { "name": "Guatemala", "code": "GT" },
    { "name": "Guernsey", "code": "GG" },
    { "name": "Guinea", "code": "GN" },
    { "name": "Guinea-Bissau", "code": "GW" },
    { "name": "Guyana", "code": "GY" },
    { "name": "Haiti", "code": "HT" },
    { "name": "Heard Island and Mcdonald Islands", "code": "HM" },
    { "name": "Holy See (Vatican City State)", "code": "VA" },
    { "name": "Honduras", "code": "HN" },
    { "name": "Hong Kong", "code": "HK" },
    { "name": "Hungary", "code": "HU" },
    { "name": "Iceland", "code": "IS" },
    { "name": "India", "code": "IN" },
    { "name": "Indonesia", "code": "ID" },
    { "name": "Iran, Islamic Republic Of", "code": "IR" },
    { "name": "Iraq", "code": "IQ" },
    { "name": "Ireland", "code": "IE" },
    { "name": "Isle of Man", "code": "IM" },
    { "name": "Israel", "code": "IL" },
    { "name": "Italy", "code": "IT" },
    { "name": "Jamaica", "code": "JM" },
    { "name": "Japan", "code": "JP" },
    { "name": "Jersey", "code": "JE" },
    { "name": "Jordan", "code": "JO" },
    { "name": "Kazakhstan", "code": "KZ" },
    { "name": "Kenya", "code": "KE" },
    { "name": "Kiribati", "code": "KI" },
    { "name": "Democratic People's Republic of Korea", "code": "KP" },
    { "name": "Korea, Republic of", "code": "KR" },
    { "name": "Kosovo", "code": "XK" },
    { "name": "Kuwait", "code": "KW" },
    { "name": "Kyrgyzstan", "code": "KG" },
    { "name": "Lao People's Democratic Republic", "code": "LA" },
    { "name": "Latvia", "code": "LV" },
    { "name": "Lebanon", "code": "LB" },
    { "name": "Lesotho", "code": "LS" },
    { "name": "Liberia", "code": "LR" },
    { "name": "Libyan Arab Jamahiriya", "code": "LY" },
    { "name": "Liechtenstein", "code": "LI" },
    { "name": "Lithuania", "code": "LT" },
    { "name": "Luxembourg", "code": "LU" },
    { "name": "Macao", "code": "MO" },
    { "name": "Macedonia, The Former Yugoslav Republic of", "code": "MK" },
    { "name": "Madagascar", "code": "MG" },
    { "name": "Malawi", "code": "MW" },
    { "name": "Malaysia", "code": "MY" },
    { "name": "Maldives", "code": "MV" },
    { "name": "Mali", "code": "ML" },
    { "name": "Malta", "code": "MT" },
    { "name": "Marshall Islands", "code": "MH" },
    { "name": "Martinique", "code": "MQ" },
    { "name": "Mauritania", "code": "MR" },
    { "name": "Mauritius", "code": "MU" },
    { "name": "Mayotte", "code": "YT" },
    { "name": "Mexico", "code": "MX" },
    { "name": "Micronesia, Federated States of", "code": "FM" },
    { "name": "Moldova, Republic of", "code": "MD" },
    { "name": "Monaco", "code": "MC" },
    { "name": "Mongolia", "code": "MN" },
    { "name": "Montenegro", "code": "ME" },
    { "name": "Montserrat", "code": "MS" },
    { "name": "Morocco", "code": "MA" },
    { "name": "Mozambique", "code": "MZ" },
    { "name": "Myanmar", "code": "MM" },
    { "name": "Namibia", "code": "NA" },
    { "name": "Nauru", "code": "NR" },
    { "name": "Nepal", "code": "NP" },
    { "name": "Netherlands", "code": "NL" },
    { "name": "Netherlands Antilles", "code": "AN" },
    { "name": "New Caledonia", "code": "NC" },
    { "name": "New Zealand", "code": "NZ" },
    { "name": "Nicaragua", "code": "NI" },
    { "name": "Niger", "code": "NE" },
    { "name": "Nigeria", "code": "NG" },
    { "name": "Niue", "code": "NU" },
    { "name": "Norfolk Island", "code": "NF" },
    { "name": "Northern Mariana Islands", "code": "MP" },
    { "name": "Norway", "code": "NO" },
    { "name": "Oman", "code": "OM" },
    { "name": "Pakistan", "code": "PK" },
    { "name": "Palau", "code": "PW" },
    { "name": "Palestinian Territory, Occupied", "code": "PS" },
    { "name": "Panama", "code": "PA" },
    { "name": "Papua New Guinea", "code": "PG" },
    { "name": "Paraguay", "code": "PY" },
    { "name": "Peru", "code": "PE" },
    { "name": "Philippines", "code": "PH" },
    { "name": "Pitcairn", "code": "PN" },
    { "name": "Poland", "code": "PL" },
    { "name": "Portugal", "code": "PT" },
    { "name": "Puerto Rico", "code": "PR" },
    { "name": "Qatar", "code": "QA" },
    { "name": "Reunion", "code": "RE" },
    { "name": "Romania", "code": "RO" },
    { "name": "Russian Federation", "code": "RU" },
    { "name": "Rwanda", "code": "RW" },
    { "name": "Saint Helena", "code": "SH" },
    { "name": "Saint Kitts and Nevis", "code": "KN" },
    { "name": "Saint Lucia", "code": "LC" },
    { "name": "Saint Pierre and Miquelon", "code": "PM" },
    { "name": "Saint Vincent and the Grenadines", "code": "VC" },
    { "name": "Samoa", "code": "WS" },
    { "name": "San Marino", "code": "SM" },
    { "name": "Sao Tome and Principe", "code": "ST" },
    { "name": "Saudi Arabia", "code": "SA" },
    { "name": "Senegal", "code": "SN" },
    { "name": "Serbia", "code": "RS" },
    { "name": "Seychelles", "code": "SC" },
    { "name": "Sierra Leone", "code": "SL" },
    { "name": "Singapore", "code": "SG" },
    { "name": "Slovakia", "code": "SK" },
    { "name": "Slovenia", "code": "SI" },
    { "name": "Solomon Islands", "code": "SB" },
    { "name": "Somalia", "code": "SO" },
    { "name": "South Georgia and the South Sandwich Islands", "code": "GS" },
    { "name": "Spain", "code": "ES" },
    { "name": "Sri Lanka", "code": "LK" },
    { "name": "Sudan", "code": "SD" },
    { "name": "Suriname", "code": "SR" },
    { "name": "Svalbard and Jan Mayen", "code": "SJ" },
    { "name": "Swaziland", "code": "SZ" },
    { "name": "Sweden", "code": "SE" },
    { "name": "Switzerland", "code": "CH" },
    { "name": "Syrian Arab Republic", "code": "SY" },
    { "name": "Taiwan", "code": "TW" },
    { "name": "Tajikistan", "code": "TJ" },
    { "name": "Tanzania, United Republic of", "code": "TZ" },
    { "name": "Thailand", "code": "TH" },
    { "name": "Timor-Leste", "code": "TL" },
    { "name": "Togo", "code": "TG" },
    { "name": "Tokelau", "code": "TK" },
    { "name": "Tonga", "code": "TO" },
    { "name": "Trinidad and Tobago", "code": "TT" },
    { "name": "Tunisia", "code": "TN" },
    { "name": "Turkey", "code": "TR" },
    { "name": "Turkmenistan", "code": "TM" },
    { "name": "Turks and Caicos Islands", "code": "TC" },
    { "name": "Tuvalu", "code": "TV" },
    { "name": "Uganda", "code": "UG" },
    { "name": "Ukraine", "code": "UA" },
    { "name": "United Arab Emirates", "code": "AE" },
    { "name": "United Kingdom", "code": "GB" },
    { "name": "United States", "code": "US" },
    { "name": "United States Minor Outlying Islands", "code": "UM" },
    { "name": "Uruguay", "code": "UY" },
    { "name": "Uzbekistan", "code": "UZ" },
    { "name": "Vanuatu", "code": "VU" },
    { "name": "Venezuela", "code": "VE" },
    { "name": "Viet Nam", "code": "VN" },
    { "name": "Virgin Islands, British", "code": "VG" },
    { "name": "Virgin Islands, U.S.", "code": "VI" },
    { "name": "Wallis and Futuna", "code": "WF" },
    { "name": "Western Sahara", "code": "EH" },
    { "name": "Yemen", "code": "YE" },
    { "name": "Zambia", "code": "ZM" },
    { "name": "Zimbabwe", "code": "ZW" }
   ];
}

function getCountryCode(countryName) {
   var cou;
   for (var i = 0; i < countries.length; i++) {
      cou = countries[i];

      if (cou.name == countryName)
         return cou.code;
      opt = $('<option></option>')
   }
   return null;
}

function getUserActivity() {

   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "ChangeMyPassword";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      oldPassword: "Stuff",
      newPassword: "OtherStuff"
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

         }
      },
      error: function (a, e, d) {
         //ShowModal(e + ' ' + d, "Error Occured.");
      }
   });
}

var packages = [
    { "name": "Free", "ID": "1D2F5C8A-C310-4C4C-9D44-1A9B93E547F3" },
    { "name": "Pro", "ID": "D9CF32CE-C646-47A0-BD7F-6F06D0CE6690" },
    { "name": "Enterprise", "ID": "9758FF8B-AAEF-4D88-88AA-8B5EDADF7F0E" },
    { "name": "Custom", "ID": "6AC61C3B-E4CC-4188-98F4-F1BE9B8CB7CA" }
];

/*
saveJObjToStore('curComp', countries);
*/


//ViewUserActivityStream
function GetUserActivityStream() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   lastDateTime = new Date();

   ///////////////////////////////
   // Date fix

   //lastDateTime = removeTimezoneOffset(lastDateTime);

   ///////////////////////////////

   var methodName = "ViewUserActivityStream";
   var jsonData = JSON.stringify({
      secretKey: userCode,
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
               appendToUserTimeline();
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function appendToUserTimeline() {
   var timelineUL = $('#userActivityList');
   timelineUL.children().remove();
   var item, content;
   for (var i = 0; i < activityStream.length; i++) {
      item = activityStream[i];
      content = makeTimelineContent(item);
      timelineUL.append(content);
   }
   /*
   <li>
      <a>
         <i class="menu-icon fa fa-birthday-cake bg-red"></i>
         <div class="menu-info">
            <h4 class="control-sidebar-subheading">Langdon's Birthday</h4>
            <p>Will be 23 on April 24th</p>
         </div>
      </a>
   </li>
   */
}

function makeTimelineContent(obj) {

   /*
      
ActivityDate:"/Date(1479823557327)/"
ActivityMessage:"added project user"
ActivityType:"User"
AffectedUserFullName:"Ciaran Prince (ciaran@rrzsa.com)"
AffectedUserID:"3a5d95bf-c0d9-421d-bb2c-70f303e87fe4"
CompanyID:"d0035300-a2bb-4fea-833d-25c4aeab4086"
ID:"29291db5-8eb3-42dd-a345-9a302ae0221f"
IsYours:true
PerformedByUserFullName:"Ciaran Prince (ciaran@rrzsa.com)"
PerformedByUserID:"3a5d95bf-c0d9-421d-bb2c-70f303e87fe4"
ProjectID:"acd9918c-99f6-445a-8e5f-600d52392a18"
ProjectName:"Wrong dates?"
SurveyID:null
SurveyName:null
link:null
   */

   var li = $('<li>');
   var a = $('<a>');
   var icon = '';
   var h4 = $('<h4>').addClass('control-sidebar-subheading');
   var p = $('<p>');
   var projOrSurv='';
   if(obj.SurveyID)
   {
      projOrSurv = '<a href="/Administration/ViewSurvey?id=' + obj.SurveyID + '">' + obj.SurveyName + '</a>';
   }
   else if (obj.ProjectID) {
      projOrSurv = '<a href="/Administration/ViewProject?id=' + obj.ProjectID + '">' + obj.ProjectName + '</a>';
   }

   switch (obj.ActivityType) {
      case 'User':
         icon = '<i class="menu-icon fa fa-user bg-aqua"></i>';
         if (obj.IsYours) {
            h4.html('<strong>You</strong> ' + obj.ActivityMessage);
            if (obj.PerformedByUserID == obj.AffectedUserID) {
               p.html('<strong>Yourself</strong> to ' + projOrSurv);
            }
            else {
               p.html('<a href="/Administration/Users?id=' + obj.AffectedUserID + '">' + obj.AffectedUserFullName + '</a> to ' + projOrSurv);
            }
         }
         else {
            h4.html('<a href="/Administration/Users?id=' + obj.PerformedByUserID + '">' + obj.PerformedByUserFullName + '</a> ' + obj.ActivityMessage);
            p.html('<strong>You</strong> to ' + projOrSurv);
         }
         break;
      case 'Document':
         //TODO
         break;
      case 'Video':
         //TODO
         break;
      case 'Photo':
         //TODO
         break;
      case 'Project':
         icon = '<i class="menu-icon fa fa-suitcase bg-blue"></i>';
         h4.html('<strong>You</strong> ' + obj.ActivityMessage);
         p.html(projOrSurv);
         break;
      case 'Survey':
         icon = '<i class="menu-icon fa fa-list-alt bg-yellow"></i>';
         h4.html('<strong>You</strong> ' + obj.ActivityMessage);
         p.html(projOrSurv);
         break;
   }
   a.append(icon);

   var info = $('<div>').addClass('menu-info').append(h4).append(p);
   a.append(info);
   li.append(a);
   /*
   <li>
      <a>
         <i class="menu-icon fa fa-birthday-cake bg-red"></i>
         <div class="menu-info">
            <h4 class="control-sidebar-subheading">Langdon's Birthday</h4>
            <p>Will be 23 on April 24th</p>
         </div>
      </a>
   </li>
   */

   return li;
}


if (!Array.prototype.includes) {
    Object.defineProperty(Object.prototype, 'includes', {
        value: function (searchElement, fromIndex) {

            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}