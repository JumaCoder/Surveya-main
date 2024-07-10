
$(function () {

    checkRights('User');

    var survID = getQueryParameter('id');

    if (!survID) {
        window.location.href = "../Administration/ViewSurveys";
        return;
    }

    $("#viewSurvey").on("click", function () {
        window.location.href = "../Administration/ViewSurvey?id=" + survID;
        return;
    });

    $("#refreshResponses").on("click", function () {
        GetResponses(survID);
    });

    GetResponses(survID);

});


function GetResponses(survID) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Please select a survey whose responses you want to view.");
        return false;
    }

    var methodName = "GetOriginalResponses";
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


                var returnItem = JSON.parse(data.RRZResult);

                $(".surveyNameTxt").html(returnItem.SurveyName);
                $(".surveyNameHolder").html(returnItem.SurveyName);

                $('#tblResponseItems').dataTable().fnClearTable();
                
                //it is not an error we are expecting a list of Items...
                $.each(eval(returnItem.Responses), function (indices, element) {

                    $('#tblResponseItems').dataTable().fnAddData(
                       [
                           {
                               "0": element.ResponseSurveyTitle, 
                               "1": GetFormattedDate(new Date(parseInt(element.ResponseDateCreated.substring(6)))),
                               "2": element.CreatedByName,
                               "3": '<a href="../Reports/View?report=ViewResponseData&id=' + element.ResponseID + '" title="View Response" target="_blank">' + DT_AddCustom(element.ResponseID, 'fa fa-eye btn text-black', 'View Response') + '</a>',
                               "DT_RowId": "the-Item-id-" + element.ResponseID,
                           }
                       ]
                   );

                });

            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

