//Global properties
var types = [{ HasOptions: null, FriendlyName: '', Type: '', ID: '' }];
var reportQs = [];
var thisReport;

var symbols = [
   { text: 'less', symbol: '<' }, { text: 'lessEqual', symbol: '<=' },
   { text: 'equal', symbol: '=' }, { text: 'notequal', symbol: '!=' },
   { text: 'greaterEqual', symbol: '>=' }, { text: 'greater', symbol: '>' }
];

$(function () {
   checkRights('User');

   var country = $('#projCountryDDL');
   if (country) { setCountryDDL($('#projCountryDDL')); }

   $('#refreshDynamicReportFilters').on('click', function () {
      GetQuestionTypes();
      GetSpecificDynamicReport();
      GetAllSurveyQuestions();
   });

   $(document).on('click', '.clearFilter', function () {
      var btn = $(this);

      var index = btn.data('index');

      var qDDL = $(document).find('.ConditionDDL[data-index="' + index + '"]');
      qDDL.val('');
      qDDL.trigger("change");
   });

   $('#importUserDocsBtn').click(function () {
      importUserDocsToProject();
   });

   $(document).on('change','.ConditionDDL', function () {

      var selectOpt = $(this).find(":selected");
      var index = selectOpt.data("index");
      var typeID = selectOpt.data("typeid");
      var selectedType = getTypeByID(typeID);

      //types [{ }...]
      /*
      Description:"Select a option in a dropdown list"
      FriendlyName:"Dropdown List"
      HasOptions:true
      ID:"6502b9e8-c756-4ffb-bee8-27dd0b0b7bf4"
      Type:"ddl"
      */

      var selectID = selectOpt.val();
      var selectedQ = getReportQByID(selectID);
      /*
      GroupID:"f49399fd-c7b0-4192-8fa5-1b74fc327803"
      GroupID:"Cool group of Qs"
      QuestionID:"698dccb1-47b2-43c9-b4e9-8b2db6969ab3"
      QuestionText:"Can you table?"
      QuestionType:"checkbox"
      QuestionTypeID:"47c41586-cbce-428b-942d-508cee462c2d"
      QuestionValues: [{ID:"5f665b6d-df4f-491c-be1d-da8cfdd03a92"
                        IsDefault:false
                        Name:"Yes"
                        Value:"True" },
                       {ID:"8822ef81-72da-48cb-9398-e6f26d5db4dd"
                        IsDefault:true
                        Name:"No"
                        Value:"False"}]
      */
      /*
      HasOptions: true||false
      ['ddl', 'textarea', 'text', 'date', 'checkbox', 'calculation', 'radio', 'location', 'ddlMultiple', 'camera', 'Numerical', 'signature']
      */

      var qDDL = $(document).find('.CompareDDL[data-index="' + index+'"]');
      qDDL.children().remove();

      var compareDiv = $(document).find('.CompareDiv[data-index="' + index + '"]');
      compareDiv.html('<div class="form-control"></div>');

      var equalOption = '<option value="equal">= (equal to)</option>';
      var notequalOption = '<option value="notequal">!= (not equal to)</option>';
      if (!selectedType) {

      }
      else if (selectedType.HasOptions) {
         //ddl  checkbox   radio   ddlMultiple
         if (selectedQ.QuestionValues) {
            qDDL.html(equalOption + notequalOption);

            var pipingValues = $('<select>').addClass('form-control compareReponse');
            var val, optStr = '';
            for (var i = 0; i < selectedQ.QuestionValues.length; i++) {
               val = selectedQ.QuestionValues[i];
               optStr += '<option value="' + val.Value + '">' + val.Name + '</option>';
            }
            pipingValues.html(optStr);
            compareDiv.html(pipingValues);
         }
      }
      else {
         if (selectedType.Type == 'calculation' || selectedType.Type == 'date' || selectedType.Type == 'Numerical') {
            //calculation   date   Numerical
            qDDL.html('<option value="less">&lt; (less than)</option>'
               + '<option value="lessEqual">&lt;= (less or equal to)</option>'
               + '<option value="equal">= (equal to)</option>'
               + '<option value="notequal">!= (not equal to)</option>'
               + '<option value="greaterEqual">&gt;= (greater or equal to)</option>'
               + '<option value="greater">&gt; (greater than)</option>'
               );
            if (selectedType.Type == 'date') {
               compareDiv.html('<input type="date" class="form-control compareReponse" />');
               initDatepicker();
            } else {
               compareDiv.html('<input type="number" class="form-control compareReponse" />');
            }
         }
         else if (selectedType.Type == 'textarea') {
            //textarea
            qDDL.html(equalOption);
            compareDiv.html('<textarea rows="3" class="form-control compareReponse"></textarea>');
         }
         else if (selectedType.Type == 'text') {
            //text
            qDDL.html(equalOption);
            compareDiv.html('<input type="text" class="form-control compareReponse" />');
         }
         else {
            //signature   camera   location
         }
      }
   });

   $(document).on('click', '.viewReportFilter', function () {

      var index = $(this).data('id');
      var filters = JSON.parse(thisReport.Filters);
      var filter = filters[index];

      $('#FilterName').val(filter.FilterName);

      qDDL = $(document).find('.ConditionDDL[data-index="' + 1 + '"]').val(filter.QuestionID1);
      qDDL.trigger("change");
      var s = getSymbolName(filter.QuestionCondition1);
      if (s) {
         $(document).find('.CompareDDL[data-index="' + 1 + '"]').val(s.text);
      }
      $(document).find('.CompareDiv[data-index="' + 1 + '"]').find('.compareReponse').val(filter.QuestionCompareValue1);

      qDDL = $(document).find('.ConditionDDL[data-index="' + 2 + '"]').val(filter.QuestionID2);
      qDDL.trigger("change");
      var s = getSymbolName(filter.QuestionCondition2);
      if (s) {
         $(document).find('.CompareDDL[data-index="' + 2 + '"]').val(s.text);
      }
      $(document).find('.CompareDiv[data-index="' + 2 + '"]').find('.compareReponse').val(filter.QuestionCompareValue2);

      qDDL = $(document).find('.ConditionDDL[data-index="' + 3 + '"]').val(filter.QuestionID3);
      qDDL.trigger("change");
      var s = getSymbolName(filter.QuestionCondition3);
      if (s) {
         $(document).find('.CompareDDL[data-index="' + 3 + '"]').val(s.text);
      }
      $(document).find('.CompareDiv[data-index="' + 3 + '"]').find('.compareReponse').val(filter.QuestionCompareValue3);


      var moda = $('#addFilterModal');
      moda.attr('data-id', filter.ID).data('id', filter.ID);
      moda.modal('show');

   });

   $('#saveFilter').on('click', function () {

      var moda = $('#addFilterModal');
      var filterID = moda.data('id');
      if (filterID) {
         UpdateDynamicReportFilter(filterID);
      }
      else { CreateDynamicReportFilter(); }

   });

   $('#addDynamicReportFilter').on('click', function () {

      var moda = $('#addFilterModal');

      $('.clearFilter').click();
      $('#FilterName').val('');
      moda.removeAttr('data-id').removeData('id');
      moda.modal('show');

   });
});

function getTypeOptions() {
   var optionTxt = '';
   for (var i = 0; i < types.length; i++) {
      var t = types[i];
      optionTxt += '<option value="' + t.ID + '" >' + t.FriendlyName + '</option>';
   }
   return optionTxt;
}
function getSymbolName(chars) {
   var s;
   for (var i = 0; i < symbols.length; i++) {
      s = symbols[i];
      if(s.symbol==chars)
      { return s;}
   }
   return null;
}
function getSymbol(Name) {
   var s;
   for (var i = 0; i < symbols.length; i++) {
      s = symbols[i];
      if (s.text == Name)
      { return s; }
   }
   return null;
}
function getTypeByID(id) {
   var t;
   for (var i = 0; i < types.length; i++) {
      t = types[i];
      if (t.ID == id) { return t }
   }
   return null;
}
function getReportQByID(id) {
   var q;
   for (var i = 0; i < reportQs.length; i++) {
      q = reportQs[i];
      if (q.QuestionID == id) { return q }
   }
   return null;
}

//  string GetQuestionTypes(secretKey)
function GetQuestionTypes() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "GetQuestionTypes";
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

            types = JSON.parse(data.RRZResult);
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}
//  GetAllSurveyQuestions(secretKey, surveyID)
function GetAllSurveyQuestions() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var survID = getQueryParameter('surveyid');

   if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
      ShowErrorModal("Could not find a survey to view.");
      return false;
   }

   var methodName = "GetAllSurveyQuestions";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      surveyID: survID
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
            reportQs = JSON.parse(data.RRZResult);
            sortBy(reportQs, 'Group');

            var qDDL = $(document).find('.ConditionDDL');
            qDDL.children().remove();
            var gr, grName;
            var q, optStr = '<option> </option>';
            for (var i = 0; i < reportQs.length; i++) {
               grName = '';
               q = reportQs[i];
               if (q.GroupName) { grName = q.GroupName.substring(0, 10) + ' - '; }
               optStr += '<option data-typeid="' + q.QuestionTypeID + '" value="' + q.QuestionID + '">' + grName + q.QuestionText + '</option>';
            }
            var index;
            qDDL.html(optStr);
            /*if (!$.isArray(qDDL)) {
               qDDL = $(qDDL);
               index = qDDL.data('index');
               qDDL.find('option').attr('data-index', index).data('index', index);
            }
            else {*/
               $.each(qDDL, function (key, value) {
                  value = $(value);
                  index = value.data('index');
                  value.find('option').attr('data-index', index).data('index', index);
               });
            //}
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function sortBy(array, param) {
    if(param){
        param = param.toUpperCase();
    }
    else{
        param="GROUP";
    }
    if (array && array.length > 0) {
        var sortByGroupName = function (a, b) {
            var nameA = a.GroupName.toUpperCase(); // ignore upper and lowercase
            var nameB = b.GroupName.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        }

        var sortByQuestionText = function (a, b) {
            var nameA = a.GroupName.toUpperCase(); // ignore upper and lowercase
            var nameB = b.GroupName.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        }

        var sortByQuestionType = function (a, b) {
            var nameA = a.GroupName.toUpperCase(); // ignore upper and lowercase
            var nameB = b.GroupName.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        }

        switch (param) {
            case 'GROUP':
                array.sort(sortByGroupName);
                break;
            case 'TEXT':
                array.sort(sortByQuestionText);
                break;
            case 'TEXT':
                array.sort(sortByQuestionType);
                break;
            default:
                array.sort(sortByGroupName);
                break;
        }
    }
}

//  GetSpecificDynamicReport(secretKey, reportID)
function GetSpecificDynamicReport() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose surveys you want to view.");
      return false;
   }

   var repID = getQueryParameter('id');

   if (typeof repID == "undefined" || repID == null || repID.length <= 0) {
      ShowErrorModal("Could not find a project to view.");
      return false;
   }

   var methodName = "GetSpecificDynamicReport";
   var jsonData = JSON.stringify({
      secretKey: userCode,
      reportID: repID
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
            thisReport = JSON.parse(data.RRZResult);

            $('.surveyNameTxt').html(thisReport.SurveyName);
            $('.reportNameTxt').html(thisReport.ReportName);
            $('.surveyLink').attr('href', '../Administration/ViewSurvey?id=' + thisReport.SurveyID);

            $('#viewDynamicReport').attr('href', '../reports/View?report=DynamicReport&id=' + thisReport.SurveyID + '&id2=' + repID);

            var filters = JSON.parse(thisReport.Filters);
            
            var f;
            $('#tblFiltersItems').dataTable().fnClearTable();
            for (var i = 0; i < filters.length; i++) {
               f = filters[i];
               $('#tblFiltersItems')
                      .dataTable()
                      .fnAddData(
                             [
                                 {
                                    "0": f.FilterName,
                                    "1": f.FilterCount,
                                    "2": DT_AddCustom(i, 'fa fa-pencil btn text-black', 'viewReportFilter'),
                                    "DT_RowId": f.ID,
                                 }
                             ]
                         );
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}


function CreateDynamicReportFilter() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
      ShowErrorModal("Please select a company whose employees you want to view.");
      return false;
   }

   var surveyID = getQueryParameter('surveyid');

   if (typeof surveyID == "undefined" || surveyID == null || surveyID.length <= 0) {
      ShowErrorModal("Could not find survey id to add to.");
      return false;
   }

   var reportID = getQueryParameter('id');

   if (typeof reportID == "undefined" || reportID == null || reportID.length <= 0) {
      ShowErrorModal("Could not find report id to add to.");
      return false;
   }

   var moda = $('#addFilterModal');
   /*
   
   CreateDynamicReportFilter(secretKey, reportID, surveyID, filterName, companyToAddTo,
      questionID1, questionCondition1, questionCompareValue1,
      questionID2, questionCondition2, questionCompareValue2,
      questionID3, questionCondition3, questionCompareValue3)

   */
   //get all the details
   var fName = $('#FilterName').val();
   var q1ID = $(document).find('.ConditionDDL[data-index="1"]').val();
   var q1Con = $(document).find('.CompareDDL[data-index="1"]').val();
   q1Con = getSymbol(q1Con) ? getSymbol(q1Con).symbol : null;
   var q1Val = $(document).find('.CompareDiv[data-index="1"]').find('.compareReponse').val();
   var q2ID = $(document).find('.ConditionDDL[data-index="2"]').val();
   var q2Con = $(document).find('.CompareDDL[data-index="2"]').val();
   q2Con = getSymbol(q2Con) ? getSymbol(q2Con).symbol : null;
   var q2Val = $(document).find('.CompareDiv[data-index="2"]').find('.compareReponse').val();
   var q3ID = $(document).find('.ConditionDDL[data-index="3"]').val();
   var q3Con = $(document).find('.CompareDDL[data-index="3"]').val();
   q3Con = getSymbol(q3Con) ? getSymbol(q3Con).symbol : null;
   var q3Val = $(document).find('.CompareDiv[data-index="3"]').find('.compareReponse').val();

   var methodName = "CreateDynamicReportFilter";
   var jsonData = JSON.stringify({
      'questionID1': q1ID, 'questionCondition1': q1Con, 'questionCompareValue1': q1Val,
      'questionID2': q2ID, 'questionCondition2': q2Con, 'questionCompareValue2': q2Val,
      'questionID3': q3ID, 'questionCondition3': q3Con, 'questionCompareValue3': q3Val,
      'secretKey': userCode, 'reportID': reportID, 'surveyID': surveyID, 'filterName': fName
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
               var error = CleanError(data.RRZResult, false, $('#addFilterModal'));
               ShowErrorModal(error);
               return false;
            }
            $('#addFilterModal').modal('hide');
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {

               ShowSuccessModal("Report filter has been created");
               GetSpecificDynamicReport();
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(d, false, $('#addProjectSurveyModal'));
      }
   });
}


// UpdateDynamicReportFilter(secretKey, filterID, filterName, companyToAddTo,
//    questionID1, questionCondition1, questionCompareValue1,
//    questionID2, questionCondition2, questionCompareValue2,
//    questionID3, questionCondition3, questionCompareValue3)
function UpdateDynamicReportFilter(filterID) {
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

   var moda = $('#addFilterModal');
   /*
   
   UpdateDynamicReportFilter(secretKey, filterID, filterName, companyToAddTo,
      questionID1, questionID1, questionCompareValue1,
      questionID2, questionCondition2, questionCompareValue2,
      questionID3, questionCondition3, questionCompareValue3)

   */
   //get all the details
   var fName = $('#FilterName').val();
   var q1ID = $(document).find('.ConditionDDL[data-index="1"]').val();
   var q1Con = $(document).find('.CompareDDL[data-index="1"]').val();
   q1Con = getSymbol(q1Con) ? getSymbol(q1Con).symbol : null;
   var q1Val = $(document).find('.CompareDiv[data-index="1"]').find('.compareReponse').val();
   var q2ID = $(document).find('.ConditionDDL[data-index="2"]').val();
   var q2Con = $(document).find('.CompareDDL[data-index="2"]').val();
   q2Con = getSymbol(q2Con) ? getSymbol(q2Con).symbol : null;
   var q2Val = $(document).find('.CompareDiv[data-index="2"]').find('.compareReponse').val();
   var q3ID = $(document).find('.ConditionDDL[data-index="3"]').val();
   var q3Con = $(document).find('.CompareDDL[data-index="3"]').val();
   q3Con = getSymbol(q3Con) ? getSymbol(q3Con).symbol : null;
   var q3Val = $(document).find('.CompareDiv[data-index="3"]').find('.compareReponse').val();

   var methodName = "UpdateDynamicReportFilter";
   var jsonData = JSON.stringify({
      secretKey: userCode, filterID: filterID, filterName: fName,
      questionID1: q1ID, questionCondition1: q1Con, questionCompareValue1: q1Val,
      questionID2: q2ID, questionCondition2: q2Con, questionCompareValue2: q2Val,
      questionID3: q3ID, questionCondition3: q3Con, questionCompareValue3: q3Val
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
               var error = CleanError(data.RRZResult, false, $('#addFilterModal'));
               ShowErrorModal(error);
               return false;
            }
            $('#addFilterModal').modal('hide');
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {

               ShowSuccessModal("Report filter has been updated");
               GetSpecificDynamicReport();
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
