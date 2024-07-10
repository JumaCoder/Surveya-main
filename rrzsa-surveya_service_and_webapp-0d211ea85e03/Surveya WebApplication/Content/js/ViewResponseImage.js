
$(function () {

    var auditedResponseID = getQueryParameter("AuditedResponseID");
    var responseID = getQueryParameter("ResponseID");

    if (!auditedResponseID && !responseID) {
        $("#ErrorMessage").html("ID was not provided");
        return;
    }

    //if there is a audited response
    if (auditedResponseID) {
        //get the image for the response id
        GetAuditedResponseImage(auditedResponseID);
    }
    else {
        //get the image for the response id
        GetResponseImage(responseID);
    }
});


function GetAuditedResponseImage(auditedResponseID) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    var methodName = "GetAuditedResponseImage";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        auditedResponseID: auditedResponseID
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
                    $("#ErrorMessage").html(error);
                    return;
                }

                response = JSON.parse(data.RRZResult);
                if (!response.ResponseValue) {
                    response.ResponseValue = '../Content/Images/empty_placeholder.png';
                }
                else if (response.ResponseValue.indexOf('data:image') == -1) {
                    response.ResponseValue = 'data:image/jpeg;base64,' + response.ResponseValue;
                }
                $("#responseImg").html('<img src="' + response.ResponseValue + '" id="responseImg" alt="Response Image"  height="150">');
            }
        },
        error: function (a, e, d) {
            $("#ErrorMessage").html(e + ' ' + d);
        }
    });
}


function GetResponseImage(responseID) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    var methodName = "GetOriginalResponseImage";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        responseID: responseID
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
                    $("#ErrorMessage").html(error);
                    return;
                }

                response = JSON.parse(data.RRZResult);

                if (!!response.SurveyTitle) {
                    $('#responseTitle').html('for <strong>' + response.SurveyTitle + '</strong>');
                }

                if (!response.ResponseValue) {
                    response.ResponseValue = '../Content/Images/empty_placeholder.png';
                }
                else if (response.ResponseValue.indexOf('data:image') == -1) {
                    response.ResponseValue = 'data:image/jpeg;base64,' + response.ResponseValue;
                }
                $("#responseImg").html('<img src="' + response.ResponseValue + '" id="responseImg" alt="Response Image" class="img-responsive">');
            }
        },
        error: function (a, e, d) {
            $("#ErrorMessage").html(e + ' ' + d);
        }
    });
}
