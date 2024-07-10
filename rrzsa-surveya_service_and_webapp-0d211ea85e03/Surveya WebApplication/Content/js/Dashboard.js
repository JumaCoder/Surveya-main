$(function () {

   GetUsersFilter();
   GetProjectsFilter();
   GetSurveysFilter();
   GetProjectActivityStream(true);

   $('#projectDDL').change(function () {
      var grID = $(this).val();
      addSurveyOptions(grID)
   })

   $('#filterBtn, #refreshTimelineBtn').click(function () {
      GetProjectActivityStream(true);
   });
});
var userList;
// GetUsersFilter(string secretKey)
function GetUsersFilter() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "GetUsersFilter";
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
            //If we reach the first post in the timeline then we stop
            userList = JSON.parse(data.RRZResult);
            // { UserId, Firstnames, Lastname , Email}
            var userDDL = $('#userDDL');
            userDDL.children().remove();
            userDDL.append('<option value="">Any</option>');
            var u;
            for (var i = 0; i < userList.length; i++) {
               u = userList[i];
               userDDL.append('<option value="' + u.UserId + '">' + u.Firstnames + ' ' + u.Lastname + '</option>');
            }

         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

// GetProjectsFilter(string secretKey)
function GetProjectsFilter() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "GetProjectsFilter";
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
            //If we reach the first post in the timeline then we stop
            projectList = JSON.parse(data.RRZResult);
            // {ID,ProjectName }
            var projDDL = $('#projectDDL');
            projDDL.children().remove();
            projDDL.append('<option value="">Any</option>');
            var u;
            for (var i = 0; i < projectList.length; i++) {
               u = projectList[i];
               projDDL.append('<option value="' + u.ID + '">' + u.ProjectName + '</option>');
            }

         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

// GetSurveysFilter(string secretKey)
function GetSurveysFilter() {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   var methodName = "GetSurveysFilter";
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
            //If we reach the first post in the timeline then we stop
            surveyList = JSON.parse(data.RRZResult);
            addSurveyOptions();
         }
      },
      error: function (a, e, d) {
         ShowErrorModal(e + ' ' + d);
      }
   });
}

function addSurveyOptions(grID)
{
   // {  ProjectID , SurveyID , SurveyTitle }
   var surveyDDL = $('#surveyDDL');
   surveyDDL.children().remove();
   surveyDDL.append('<option value="">Any</option>');
   var u;
   for (var i = 0; i < surveyList.length; i++) {
      u = surveyList[i];
      if (grID) {
         if (u.ProjectID == grID) {
            surveyDDL.append('<option value="' + u.SurveyID + '">' + u.SurveyTitle + '</option>');
         }
      }
      else {
         surveyDDL.append('<option value="' + u.SurveyID + '">' + u.SurveyTitle + '</option>');
      }
   }
}

//FilterActivityStream(secretKey, dateToViewFrom, userID, projectID, surveyID)
function GetProjectActivityStream(clear) {
   if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
      ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
      return false;
   }

   if (clear) {
      lastDateTime = new Date();
   }

   var userFilter = $('#userDDL').val();
   var projFilter = $('#projectDDL').val();
   var survFilter = $('#surveyDDL').val();
   ///////////////////////////////
   // Date fix

   //lastDateTime = removeTimezoneOffset(lastDateTime);

   ///////////////////////////////

   var methodName = "FilterActivityStream";
   var jsonData = JSON.stringify({
      secretKey: userCode, dateToViewFrom: lastDateTime,
      userID: userFilter, projectID: projFilter, surveyID: survFilter
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

function makeTimelineItem(obj) {

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

   switch (obj.ActivityType) {
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
      case 'File':
         return makeFileItem(obj);
         break;
   }

}

function makeUserItem(obj) {
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
      + ' <a href="/Administration/ViewProject?id=' + obj.ProjectID + '">' + obj.ProjectName + '</a></h3>');


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

   var link1 = '';
   var link2 = '';
   var text1 = '';
   var text2 = '';
   if (obj.ActivityMessage) {
       if (obj.ActivityMessage.indexOf('generated a email link') != -1) {
           var fullText = obj.ActivityMessage;
           var linkPos = fullText.indexOf('link');
           var start = fullText.indexOf('(');
           var end = fullText.indexOf(')');
           text1 = fullText.substring(0, linkPos);
           var url = fullText.substring(start + 1, end);
           link1 = ' <a href="' + url + '">link</a>';
           text2 = fullText.substring(end + 1);
       }
       else if (!obj.ActivityMessage.includes('deleted')) {
           link2 = ' <a href="/Administration/ManageSurveyQuestions?id='
          + obj.SurveyID + '">' + obj.SurveyName + '</a>';
           text1 = obj.ActivityMessage;
       }
   }

   var tl = $('<div>')
      .addClass('timeline-item')
      .append('<span class="time"><i class="fa fa-clock-o"></i>' + date + '</span>')
      .append('<h3 class="timeline-header"><a href="/Administration/Users?id='
      + obj.PerformedByUserID + '">' + obj.PerformedByUserFullName + '</a> ' + text1 + link1 + text2
      + link2+'</h3>');


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

function timelineDate(date) {
   return formatDate(date, "dd mmm yyyy");
}