$(function () {

    
    

   $('#resetUserPasswordUserBtn').click(function () {
      ForgotMyPassword();
   });

   $('#confirmPassword').change(function () {

      var pWordInp = $('#newPassword');
      var pWordConfInp = $('#confirmPassword');

      if (pWordConfInp.val()) {
         if (pWordInp.val() !== pWordConfInp.val()) {
            pWordInp.closest('.form-group').removeClass('has-success').addClass('has-error');
            pWordConfInp.closest('.form-group').removeClass('has-success').addClass('has-error');

            //$('#confirmResetBtn').addClass('disabled').attr('disabled', 'disabled');
         }
         else {
            pWordInp.closest('.form-group').removeClass('has-error').addClass('has-success');
            pWordConfInp.closest('.form-group').removeClass('has-error').addClass('has-success');

            //$('#confirmResetBtn').removeClass('disabled').removeAttr('disabled');
            window.setTimeout(
               function () {
                  $('#newPassword').closest('.form-group').removeClass('has-success');
                  $('#confirmPassword').closest('.form-group').removeClass('has-success');
               }, 2000);
         }
      }
   });

   $('#confirmResetBtn').click(function () {
      ResetMyPassword();
   });
});
var resetID = null;




function ForgotMyPassword() {
   var emailAddress = $('#resetPassword').val();
   var myModal = $('#resetUserPasswordModal');

   if (typeof emailAddress == "undefined" || emailAddress == null || emailAddress.length <= 0) {
      ShowErrorModal("Please provide your email address.");
      return false;
   }

   var methodName = "ForgotMyPassword";
   var jsonData = JSON.stringify({
      emailAddress: emailAddress
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
         //myModal.modal('hide');
         if (data.RRZResult) {
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult);
               ShowErrorModal(error);
               return;
            }
            //TODO success stuff
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //User added
               ShowSuccessModal('A reset email has been sent to <strong>' + emailAddress + '</strong>');
            }
         }
      },
      error: function (a, e, d) {
         myModal.modal('hide');
         ShowErrorModal(d);
      }
   });
}

function checkParam()
{
   resetID = getQueryParameter('id');
   if(resetID==false)
   {
      ShowErrorModal('Invalid url, please ensure you copied the full hyperlink.');
      $('#newPassword').addClass('diabled').attr('disabled', 'disabled');
      $('#confirmPassword').addClass('diabled').attr('disabled', 'disabled');
      $('#confirmResetBtn').addClass('diabled').attr('disabled', 'disabled');
   }
}

function ResetMyPassword() {

   var pWordInp = $('#newPassword').val();
   var pWordConfInp = $('#confirmPassword').val();

   if (pWordInp == null || pWordConfInp == null || (pWordInp !== pWordConfInp)) {
      ShowErrorModal("Please enter and confirm your new password");
      return false;
   }

   var methodName = "ResetMyPassword";
   var jsonData = JSON.stringify({
      resetID: resetID,
      newPassword: pWordInp
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
         //myModal.modal('hide');
         if (data.RRZResult) {
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult);
               ShowErrorModal(error);
               return;
            }
            //TODO success stuff
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
               //User added
               ShowSuccessModal('Your password has been reset, please try logging in.');
               window.location = '/Account/Login';
            }
         }
      },
      error: function (a, e, d) {
         //myModal.modal('hide');
         ShowErrorModal(d);
      }
   });
}