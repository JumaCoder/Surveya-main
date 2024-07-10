
//Reset Password Function
function resetPassword(newPassword){
    $.support.cors=true;
    var userID = getQueryParameter("uid");
    $.ajax({        
        data:JSON.stringify({userID:userID,newPassword:newPassword}),
        type:"POST",
        dataType:"json",
        contentType:"application/json;charset=utf-8",
        url:"http://exhibidservice.rapidresultz.com/Exhibid_Service.svc/ResetPassword",
        success:function(data){
                if(!IsError(data.RRZResult)){
                    //Success
                    $("#setPasswordGUI").hide();
                    HideError();
                    $("#msgSuccess").show();                    
                }
                else{
                    //Error
                    //hideModal();
                    //showDialog(CleanError(data.RRZResult),"Attention","#");
                    $("#msgSuccess").html(CleanError(data.RRZResult));
                    $("#msgSuccess").show();  
                }
            },
            //Error
            error:function(a,e,d){
                //hideModal();
                //showDialog(e+" "+d,"Service Error","#");
            }
    });
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


//used just to show an error
function ShowError(errorMessage, errorParent)
{
    errorParent.html(CreateError(errorMessage));
}

//used to hide the error
function HideError(errorParent) {
    errorParent.html('');
}

/*Functions for effects*/
//custom show loading method
function showLoader(sender)
{

    showModal();
    $(function(){
        var 
            theme = sender.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
            msgText = sender.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
            textVisible = sender.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
            textonly = !!sender.jqmData( "textonly" ),
            html = sender.jqmData( "html" ) || "";

        $.mobile.loading( "show", {
            text: msgText,
            textVisible: textVisible,
            theme: theme,
            textonly: textonly,
            html: html
        })
    });
}

//the following function is to show a dialog page.
//msg = the message, title = the title of the popup, url = the address the popup should link to when closed
function showDialog(msg, title, url)
{
    //set the message
    $(function()
        {
            $("#popMessage").html(msg);
            $("#popHeader").html(title);
            $("#popLink").attr("href", url)
            if(url == "#")
            {
                $("#popLink").attr("data-rel", "back");
            }else{
                $("#popLink").attr("data-rel", "none");
            }
        });
    $(":mobile-pagecontainer").pagecontainer("change","#myPopup", {transition:"pop"});
}

$(document).ready(function(){
    $("#msgSuccess").hide();

    $("#frmReset").validate({
        onkeyup:false,
        rules:{
            txtNewPassword: {
                required: true            
            },
            txtConfirmPassword: {
                required: true,
                equalTo: "#txtNewPassword"
            }
        },
        messages:{
            txtNewPassword: {
                required:"Required Field"
            },
            txtConfirmPassword: {
                required:"Required Field",
                equalTo:"Passwords do not match"
            }
        },
        errorClass: "validationError",
        errorPlacement: function(error,element){
            element.val('');
            element.attr("placeholder",error.text());
        },
        submitHandler: function(form){
            //showLoader($("#btnSubmit"));
            resetPassword($("#txtNewPassword").val());
            return false;
        }
    });
})

//Click Events
$("#btnSubmit").on("click",function(){
    $("#frmReset").submit();
});