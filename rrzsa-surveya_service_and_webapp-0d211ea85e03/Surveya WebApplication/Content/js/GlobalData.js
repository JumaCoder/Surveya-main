
//var baseServicePath = 'http://localhost/surveyaservice/Surveya_Service.svc';
//var baseServicePath = 'http://localhost:53688/Surveya_Service.svc';
var baseServicePath = 'https://surveyaservice.rrzdev.co.za/Surveya_Service.svc';
//var baseServicePath = 'https://service.surveya.global/Surveya_Service.svc';

//var paymentURL = 'http://192.168.7.3:4357/RRZPaymentHandler.aspx';
var paymentURL = 'https://surveyapayments.rapidresultz.com/RRZPaymentHandler.aspx';

var selectAnotherPackageURL = 'https://www.surveya.global/pricing/';
//var selectAnotherPackageURL = 'https://www.surveya.global/wordpress/pricing/';

//var documentsPath = 'http://localhost/surveyaservice/DocumentManager';
//var documentsPath = 'http://localhost:53688/DocumentManager';
//var documentsPath = 'http://192.168.7.3:4356/DocumentManager';
var documentsPath = 'https://surveyaservice.rrzdev.co.za/DocumentManager';


//var surveyPreviewURL = 'http://127.0.0.1:5500/#/preview';
var surveyPreviewURL = 'https://surveyapreview.rrzdev.co.za/#/preview';
//var publicSurveyURL = '../../public/index.html?guid=';
//var publicSurveyURL = '../../public/v2/#/landing/';
var publicSurveyURL = 'https://surveya.rrzdev.co.za/public/v2/#/landing/';

var baseWebAppPath = 'http://localhost:61916/';
//var baseWebAppPath = 'https://surveya.rrzdev.co.za/';
//var baseWebAppPath = 'https://app.surveya.global/';
/*
p1 = secretKey
p2 = companyPackageID
*/

var currency = 'R';
var packageInvoiceURL = '/Reports/View';

var dataTableOptions = {
   "paging": true,
   "lengthChange": false,
   "searching": false,
   "ordering": true,
   "info": true,
   "autoWidth": false,
   "select": 'single' 
};

//Used to create an error Paragraph(a paragraph with a label that has the error class).
function CreateError(msg)
{
    return "<p><label  class='error'>" + msg + "</label></p>";
}

function CreateSuccess(msg)
{
    return '<div data-alert class="alert-box">' + msg + '<a href="#" class="close">&times;</a></div>';
}

//the following function is used to make service calls via ajax, the result is passed back to the calling function
function CallServiceMethod(jsonData, methodName, fullPath)
{
    if (!fullPath) {
        fullPath = baseServicePath + "/" + methodName;
    }
    $.support.cors = true;
    $.ajax({
        data: jsonData,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url: fullPath,
        success: function (data) {
            return data;
            //alert("test");
            //for (i = 0; i < data.GetNamesResult.length; i++) {
            //    alert(data.GetNamesResult);
            //    hideModal();
            //}
        },
        error: function (a, e, d) {
            return 'error - '+e + ' ' + d;
        }

    });
}
//the following function is used to make service calls via ajax, the result is passed back to the calling function
function getImage() {

   var id = getQueryParameter(variable);
   $.support.cors = true;
   $.ajax({
      data: { companyID: id },
      type: "POST",
      dataType: "json",
      contentType: "application/json;charset=utf-8",
      url: baseServicePath + "/GetEmailImage",
      success: function (data) {
         $('#imageHolder').attr('src', data.RRZResult)
      },
      error: function (a, e, d) {
         return 'error - ' + e + ' ' + d;
      }

   });
}


//the following function is used to check if an object is a string and contains an error
function IsError(data)
{
    if ((typeof data) == 'string') {
        if(data.indexOf("<error>") == 0)
        {
            return true;
        } else {
            return false;
        }
    }
}

//the following method is used to clean <error></error> tags from a string
function CleanError(data) {
    var cleanedData = data.replace("<error>", "");
    cleanedData = cleanedData.replace("</error>", "");
    return cleanedData;
}

//the following function is used to validate inputs
function customValidate(elementArray)
{
    var valid = true;
    $.each(Foundation.libs.abide.parse_patterns(elementArray), function (indices, element) {
       
        if (!element) {
            valid = false;
            //returning false is the equivalent of break.
            return false;
            
        }
    });
    return valid;
}

//Used to clear all data that are in input tags, textareas and selects
function ClearData(parentElement)
{
    $(parentElement).find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });
}

//the following function is used to show an error and disable elements
function ShowErrorAndDisableElements(errorMessage, errorParent, elementsToDisable)
{
    errorParent.html(CreateError(errorMessage));
    elementsToDisable.attr('disabled', '');
}

//the following function is used to hide an error and enable elements
function HideErrorAndEnableElements(errorParent, elementsToEnable)
{
    errorParent.html('');
    elementsToEnable.removeAttr('disabled');
}


function DisableElements(elements) {
   elements.attr('disabled', 'disabled');
}
function EnableElements(elements) {
   elements.removeAttr('disabled');
}

function MakeReadonly(elements) {
   elements.attr('readonly', 'readonly');
}
function RemoveReadonly(elements) {
   elements.removeAttr('readonly');
}


//used just to show and error
function ShowError(errorMessage, errorParent)
{
    errorParent.html(CreateError(errorMessage));
}

//used to hide the error
function HideError(errorParent) {
    errorParent.html('');
}

function MakeDataTable(theTable) {
    
    if (typeof theTable.dataTable() == 'undefined' || theTable.dataTable() == null)
    {
        theTable.dataTable({
            "sDom": 'T<"clear">lfrtip',
            "oTableTools": {
                "aButtons": [
                    "print"//,
                    //{
                   //     "sExtends": "collection",
                    //    "sButtonText": "Save",
                     //   "aButtons": ["csv", "xls", "pdf"]
                    //}
                ]
            }
        });
    } else {
        //theTable.dataTable().fnStandingRedraw();
    }
    
    theTable.parent().find('.DTTT_button_print').removeClass('.DTTT_button_print').removeClass('DTTT_button').addClass('button').addClass('tiny').addClass('success').css('margin-top', '21px').css('padding-top', '11px').css('padding-top', '12px').css('padding-bottom', '11px');
}

function MakeDataTableError(errorMessage, cols)
{
   var tr = $('<tr></tr>')
   .addClass('odd');

   var td = $('<td></td>')
   .attr('valgn', 'top')
   .attr('colspan', cols)
   .addClass('dataTables_empty text-red')
   .html(errorMessage);

   tr.append(td);
   return tr;
}


//gets a date formatted as a string
function GetFormattedDate(theDate) {
   return formatDate(theDate, "dd mmm yyyy hh:nn");
}

//Formats a date
var formatDate = function (formatDate, formatString) {
   if (formatDate instanceof Date) {
      var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
      var yyyy = formatDate.getFullYear();
      var yy = yyyy.toString().substring(2);
      var m = formatDate.getMonth();
      var mIncreased = m + 1;
      var mm = mIncreased < 10 ? "0" + mIncreased : mIncreased;
      var mmm = months[m];
      var d = formatDate.getDate();
      var dd = d < 10 ? "0" + d : d;

      var h = formatDate.getHours();
      var hh = h < 10 ? "0" + h : h;
      var n = formatDate.getMinutes();
      var nn = n < 10 ? "0" + n : n;
      var s = formatDate.getSeconds();
      var ss = s < 10 ? "0" + s : s;

      formatString = formatString.replace(/ss/i, ss);
      formatString = formatString.replace(/s/i, s);
      formatString = formatString.replace(/nn/i, nn);
      formatString = formatString.replace(/n/i, n);
      formatString = formatString.replace(/hh/i, hh);
      formatString = formatString.replace(/h/i, h);
      formatString = formatString.replace(/dd/i, dd);
      formatString = formatString.replace(/d/i, d);
      formatString = formatString.replace(/yyyy/i, yyyy);
      formatString = formatString.replace(/yy/i, yy);
      formatString = formatString.replace(/mmm/, mmm);
      formatString = formatString.replace(/mm/, mm);
      formatString = formatString.replace(/m/, m);

      return formatString;
   } else {
      return "";
   }
}

String.prototype.DateWCF = function () {
   if (!this) { return null }
   var date = new Date(parseInt(this.substr(6)));
   return formatDate(date, "yyyy-mm-dd");
};

String.prototype.DateTimeWCF = function () {
   if (!this) { return null }
   var date = new Date(parseInt(this.substr(6)));
   return date; // formatDate(date, "yyyy-mm-dd hh:nn");
};

function removeTimezoneOffset(date) {
   if (!date)
   { return null }

   var rightHourInMin = (date.getMinutes() + date.getHours() * 60 + (date.getTimezoneOffset() * (-1)));

   date.setMinutes(0);
   date.setHours(0);

   date.setMinutes(rightHourInMin);
   return date;
}

function addTimezoneOffset(date) {
   if (!date)
   { return null }

   var rightHourInMin = (date.getMinutes() + date.getHours() * 60 + (date.getTimezoneOffset()));

   date.setMinutes(0);
   date.setHours(0);

   date.setMinutes(rightHourInMin);
   return date;
}


//the following function is used to add an edit button with a data-id attribute
function DT_AddEdit(key)
{
    return '<i class="fa fa-pencil DT_EvokeEdit" style="padding-right:3px" data-id="' + key + '"></i>';
}

function DT_AddDelete(key)
{
    return '<i class="fa fa-trash-o DT_EvokeDelete" style="padding-right:3px" data-id="' + key + '"></i>';
}

function DT_AddCustom(key, icon, cssClass, toolTip) {
   toolTip = toolTip ? toolTip : '';
   return '<i ' + (toolTip?'data-toggle="tooltip"':'')+' title="' + toolTip + '" class="' + icon + ' ' + cssClass + '" style="padding-left: 6px;padding-right: 6px" data-id="' + key + '"></i>';
}

function DT_AddEditAndDelete(key)
{
    var edit = DT_AddEdit(key);
    var remove = DT_AddDelete(key);
    return edit + ' ' + remove;
}

function DT_AllCustoms(key, iconParams, classParams) {
    //Get the first item
    var returnObj = DT_AddCustom(key, iconParams[0], classParams[0]);

    //Append the rest
    if (iconParams.length > 0) {
        for (var i = 1; i < iconParams.length; i++) {
            returnObj += (' ' + DT_AddCustom(key, iconParams[i], classParams[i]));
        }
    }
    return returnObj;
}


//the following is used to get param from query string
function getQueryParameter(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
   }
   return (false);
}


//      Use this service to resize an image to
function ResizeImg(file, maxWidth, maxHeight, callback) {
   if (file != undefined || file != null) {
      var reader = new FileReader();
      reader.onloadend = function () {

         var tempImg = new Image();
         tempImg.onload = function () {
            maxWidth == null ? 800 : maxWidth;
            maxHeight == null ? 500 : maxHeight;
            resizedImg = resize(tempImg, maxWidth, maxHeight);
            if (callback) {
               callback(resizedImg);
            }
         }
         tempImg.src = reader.result;
      }
      reader.readAsDataURL(file);
   } else return null;
};

function resize(img, maxWidth, maxHeight) {
   var tempW = img.width;
   var tempH = img.height;
   var wRatio = 1.0, hRatio = 1.0, maxRatio = 1.0;
   if (tempW > maxWidth || tempH > maxHeight) {
      wRatio = tempW / maxWidth;
      hRatio = tempH / maxHeight;

      maxRatio = (wRatio > hRatio) ? wRatio : hRatio;
   }
   var canvas = document.createElement('canvas');
   canvas.width = (tempW / maxRatio);
   canvas.height = (tempH / maxRatio);

   var ctx = canvas.getContext("2d");
   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
   var dataURL = canvas.toDataURL("image/jpg",1);

   //return dataURL;
   var cleanData = cleanBase64Data(dataURL);
   return cleanData;
}

function cleanBase64Data(data) {
   if (!data)
      return null;
   return data.replace(/^data:image\/(png|jpg|jpeg|jif|jfif|tif|tiff|jp2|jpx|j2k|j2c);base64,/, "");
}

function reBase64Data(data) {
   data.replace(/^data:image\/(png|jpg|jpeg|jif|jfif|tif|tiff|jp2|jpx|j2k|j2c);base64,/, "");
   return ("data:image/jpg;base64," + data);
}


var currentModal = null;
var currentScroll = 0;
$(document).ready(function () {
    $('.modal').on('hidden.bs.modal', function () {
        currentModal = null;
    })
    $('.modal').on('shown.bs.modal', function () {
        currentModal = this;
        currentScroll = currentModal.scrollTop;
    })
    $('.modal').scroll(
        function (e, x) {
            currentModal = this;
            var date = $('.datepicker');
            if (date.css('top')) {
                var dateTop = date.css('top');
                var dateTop = parseInt(dateTop.substring(0, dateTop.length - 2));
                var diff = currentScroll - currentModal.scrollTop + dateTop;
                date.css('top', diff + 'px')
            }
            currentScroll = currentModal.scrollTop;
        }
    );
});

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function replaceAll(target, search, replacement) {
    if (!target) return '';
    return target.replace(new RegExp(search, 'g'), replacement);
};

function changebackground() {
    var x = Math.floor(Math.random(22) * 10);
    $("body").css('background', 'url(' + baseWebAppPath +'Content/Images/Backgrounds/' + x + '.jpg)');

}