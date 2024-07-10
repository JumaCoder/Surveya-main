//Global properties
var couponList;
var itemCount = 10;
var itemCountDiv = $('#itemCount');

$(function () {
   companyList = [];
   checkRights('Coupon');
   itemCountDiv.html(itemCount);

   $('#GenerateCouponBtn').click(function () {
        GenerateCoupon();
   });

   $('#refreshTbl').on('click', function () {
       GetMyCoupons();
   });

});

function GenerateCoupon() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      modal.modal('hide');
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "GenerateCoupon";
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
            var response = JSON.parse(data.RRZResult);
            if (response.Status == 'Success') {
                var coupon = JSON.parse(response.Coupon)
                $('#codeHolder').html(coupon.Code);
                $('#couponCard').show('100');
               //TODO Other stuff
               GetMyCoupons();
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(d);
      }
   });
}

function GetMyCoupons() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "GetUserCoupons";
   var jsonData = JSON.stringify({
       secretKey: userCode,
       top: itemCount
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
         var tbody = $('#couponTBody');
         if (data.RRZResult) {
            if (IsError(data.RRZResult)) {
               var error = CleanError(data.RRZResult);
               ShowErrorModal(error);
               tbody.html(MakeDataTableError(error, 5));
               return;
            }
            /*
            var compList = $('#companyList');
            compList.children().remove();
            */
            var response = JSON.parse(data.RRZResult);
            couponList = JSON.parse(response.Coupons);
            $('#tblItems').dataTable().dataTable().fnClearTable();
            var coup;
            for (var i = 0; i < couponList.length; i++) {
                coup = couponList[i];

               $('#tblItems')
                     .dataTable()
                     .fnAddData(
                           [
                              {
                                 "0": coup.Code,
                                 "1": coup.DateCreated ? formatDate(coup.DateCreated.DateTimeWCF(), "yyyy-mm-dd hh:nn") : ' ',
                                 "DT_RowId": "the-Item-id-" + coup.Code,
                              }
                           ]
                        );
            }
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
         $('#couponTBody').html(MakeDataTableError(error, 5));
      }
   });
}
