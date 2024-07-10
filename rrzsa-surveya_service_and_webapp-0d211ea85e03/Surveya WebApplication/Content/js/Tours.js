var surveyaTours = {
    viewSurveyTop: {
        steps: [{
            element: "#StartSurvey",
            title: "Collect Responses",
            content: "If you want to start to your survey click here. However, you will not be able to make any changes to your survey once it has started.",
            placement: "left"
        }, {
            element: "#EndSurvey",
            title: "Stop Collecting",
            content: "You can click  here again to stop collecting responses. However, you will not be able to start here again.",
            placement: "bottom"
        }, {
            element: "#manageProjectBtn",
            title: "Manage Project",
            content: "Click here if you need to manage the project associated with this survey.",
            placement: "bottom"
        }, {
            element: "#duplicateSurveyBtn",
            title: "Duplicate Survey",
            content: "This will duplicate this survey and all its questions.",
            placement: "bottom"
        }, {
            element: "#addUserBtn",
            title: "Add User to Survey",
            content: "If you need some one added to this survey click here.",
            placement: "bottom"
        }, {
            element: "#usersBtn",
            title: "Users",
            content: "This show you how many users have been added to this survey.",
            placement: "bottom"
        }, {
            element: "#addQuestionBtn",
            title: "Questions",
            content: "This will allow you to add questions to this survey.",
            placement: "bottom"
        }, {
            element: "#questionBtn",
            title: "Manage Questions",
            content: "This shows you how many questions your survey has.",
            placement: "bottom"
        }, {
            element: "#ViewSurveyPreview",
            title: "Preview Survey",
            content: "This will let you view what the survey will look like to a user.",
            placement: "bottom"
        }, {
            element: "#responsesBtn",
            title: "Audited Responses",
            content: "This indicates the amount of responses that has been audited.",
            placement: "bottom"
        }, {
            element: "#ViewOriginalResponses",
            title: "Audit Responses",
            content: "Click here to view the responses.",
            placement: "bottom"
        }, {
            element: "#ViewResponsesToAuditTop",
            title: "Audit Responses",
            content: "Click here to download the responses to audit.",
            placement: "bottom"
        }, {
            element: "#deleteSurveyBtn",
            title: "Delete Survey",
            content: "If you don't need this survey anymore click here.",
            placement: "bottom",
        }
        ],},
            
    viewSurveyOverview: {
        steps: [{
            element: "#surveyOverviewBox",
            title: "Overview",
            content: "This contains the general information about the survey.",
            placement: "top"
        }, {
            element: "#editSurveyOverview",
            title: "Overview - Edit",
            content: "Click here if you need to edit the overview of this survey.",
            placement: "bottom"
        }, {
            element: "#refreshSurveyOverview",
            title: "Overview - Refresh",
            content: "Click here if you think the information is incorrect or might have changed.",
            placement: "bottom",
            onNext: function (Tour) { $('#surveyTeamBox').find('h4 a').click(); }
        }

        ],},
            
    viewSurveyUsers: {
        steps: [{
            element: "#surveyTeamBox",
            title: "Survey Users",
            content: "This contains general information about survey users.",
            placement: "top"
        }, {
            element: "#addSurveyUserBtn",
            title: "Survey Users - Add User",
            content: "Click here if you want to add a user.",
            placement: "bottom"
        }, {
            element: "#refreshSurveyTeam",
            title: "Survey Users - Refresh",
            content: "If you want to see if there were new users added recently click here.",
            placement: "left"
        }, {
            element: "#x",
            title: "Survey Users - Hide Inactive Users",
            content: "This will not allow inactive users to be listed.",
            placement: "top"
        }, {
            element: "#x1",
            title: "Survey Users - Show Inactive Users",
            content: "This will allow inactive users to be listed.",
            placement: "top"
        }, {
            element: "#tblTeamItems_length",
            title: "Survey Users - Amount listed",
            content: "This will control the amount of users listed.",
            placement: "bottom"
        }, {
            element: "#tblTeamItems_filter",
            title: "Survey Users - Search",
            content: "If you need to help finding a user them type their name here.",
            placement: "bottom"
        }, {
            element: "#tblTeamItems",
            title: "Survey Users - Users",
            content: "This contains the list of users assigned to this survey.",
            placement: "top",
        }, {
            element: "#tblTeamItems_paginate",
            title: "Survey Users - Users",
            content: "These allow you to get the next/previous list of users if it is available.",
            placement: "bottom",
        }

        ],
    },

    viewSurveyResponses: {
        steps: [{
            element: "#surveyQuestionResponsesBox",
            title: "Survey Responses",
            content: "This contains the details of the survey responses.",
            placement: "top"
        }, {
            element: "#CopyResponsesToAudit",
            title: "Survey Responses - Copy to Audit",
            content: "This will copy the responses to audit responses.",
            placement: "bottom"
        }, {
            element: "#ViewResponsesToAudit",
            title: "Survey Responses - Download Aduit Responses",
            content: "This will let you download all the audited responses.",
            placement: "bottom"
        }, {
            element: "#refreshSurveyQuestionResponses",
            title: "Survey Responses - Download Aduit Responses",
            content: "Click here if you need to want to update response details.",
            placement: "bottom"
        }, {
            element: "#NumOfUploadedResponses",
            title: "Survey Responses - Responses",
            content: "this indicates the amount of responses recieved.",
            placement: "top"
        }, {
            element: "#NumOfAuditedResponses",
            title: "Survey Responses - Audited Responses",
            content: "This indicates the amount of audited responses recieved.",
            placement: "top"
        }, {
            element: "#MainContent_excelfileUpload",
            title: "Survey Responses - Upload File Picker",
            content: "Click here to select a file to upload.",
            placement: "bottom"
        }, {
            element: "#MainContent_uploadResponse",
            title: "Survey Responses - Upload Changes",
            content: "Click here to upload the excel spreadsheet with changes. To increase processing performance please delete rows that do not contain any changes.",
            placement: "bottom",
        },

        ],
    },

    viewSurveyReports: {
        steps: [{
            element: "#surveyReportsBox",
            title: "Reports",
            content: "This contains the dynamic reports of this survey.",
            placement: "top"
        }, {
            element: "#addDynamicReportBtn",
            title: "Reports - Add Report",
            content: "This will allow you to create a report.",
            placement: "bottom"
        }, {
            element: "#refreshSurveyReports",
            title: "Reports - Refresh",
            content: "This will allow you to refresh the reports list.",
            placement: "bottom"
        }, {
            element: "#tblReportItems_length",
            title: "Reports - Amount listed",
            content: "This will control the amount of reports listed.",
            placement: "top"
        }, {
            element: "#tblReportItems_filter",
            title: "Reports - Search",
            content: "This allows you to search through the reports",
            placement: "top"
        }, {
            element: "#tblReportItems",
            title: "Reports - Reports Table",
            content: "This contains a list of all the available reports",
            placement: "top"
        }, {
            element: "#tblReportItems_paginate",
            title: "Reports - Reports Table",
            content: "These allow you to get the next/previous list of reports if it is available.",
            placement: "top"
        }

        ],
    }
}

var ManageSurveyQuestionsTour = {
    Top: {
        steps: [
            {
                element: "#StartSurvey",
                title: "Collect Responses",
                content: "If you want to start to your survey click here. However, you will not be able to make any changes to your survey once it has started.",
                placement: "left"
            }, {
                element: "#EndSurvey",
                title: "Stop Collecting",
                content: "You can click  here again to stop collecting responses. However, you will not be able to start here again.",
                placement: "bottom"
            }, {
                element: "#manageSurveyBtn",
                title: "Manage Survey",
                content: "Click here if you need to manage the overall settings of this survey.",
                placement: "bottom"
            }, {
                element: "#questionsBtn",
                title: "Questions",
                content: "This indicates how many questions have been created in this survey.",
                placement: "bottom"
            }, {
                element: "#ViewSurveyPreview",
                title: "Preview Survey",
                content: "This will let you view what the survey will look like to a user.",
                placement: "bottom"
            }, {
                element: "#responsesBtn",
                title: "Audited Responses",
                content: "This indicates the amount of responses that has been audited.",
                placement: "bottom"
            }, {
                element: "#ViewResponsesToAuditTop",
                title: "Audit Responses",
                content: "Click here if you want to audit responses.",
                placement: "bottom"
            }
        ]
    },

    Questions: {
        steps: [{
            element: "#surveyQuestionsBox",
            title: "Questions",
            content: "This contains the pages and questions of the survey.",
            placement: "top",
        }, {
            element: ".box-page:first-child",
            title: "Questions",
            content: "This contains the pages and questions of the survey.",
            placement: "top",
        }, {
            element: ".box-page:first-child .myGroupTitle a:first-child",
            title: "Questions - Collapse Page",
            content: "This will collapse the page for you.",
            placement: "top",
        }, {
            element: ".box-page:first-child .GT_Edit",
            title: "Questions - Edit Page Name",
            content: "This will allow you to edit the name.",
            placement: "top"
        }, {
            element: ".box-page:first-child .dropdown-toggle",
            title: "Questions - Page Dropdown",
            content: "This contains more options to perform on this page.",
            placement: "left"
        }, {
            element: ".box-page:first-child .box-footer .qGroupBtn",
            title: "Questions - Add Section",
            content: "Click here to create a section.",
            placement: "top"
        }
        ]
    }
}

$('#HelpViewSurveyTop').click(function () {
    var viewSurveyTop = new Tour(surveyaTours.viewSurveyTop);
    viewSurveyTop.init();
    viewSurveyTop.start();
    viewSurveyTop.restart();
});
$('#HelpViewSurveyOverview').click(function () {
    var viewSurveyOverview = new Tour(surveyaTours.viewSurveyOverview);
    viewSurveyOverview.init();
    viewSurveyOverview.start();
    viewSurveyOverview.restart();
});
$('#HelpViewSurveyUsers').click(function () {
    var viewSurveyUsers = new Tour(surveyaTours.viewSurveyUsers);
    viewSurveyUsers.init();
    viewSurveyUsers.start();
    viewSurveyUsers.restart();
});
$('#HelpViewSurveyResponses').click(function () {
    var viewSurveyResponses = new Tour(surveyaTours.viewSurveyResponses);
    viewSurveyResponses.init();
    viewSurveyResponses.start();
    viewSurveyResponses.restart();
});
$('#HelpViewSurveyReports').click(function () {
    var viewSurveyReports = new Tour(surveyaTours.viewSurveyReports);
    viewSurveyReports.init();
    viewSurveyReports.start();
    viewSurveyReports.restart();
});

$('#manageSurveyQuestionsTop').click(function () {
    var manageSurveyQuestionsTop = new Tour(ManageSurveyQuestionsTour.Top);
    manageSurveyQuestionsTop.init();
    manageSurveyQuestionsTop.start();
    manageSurveyQuestionsTop.restart();
});

$('#manageSurveyQuestionsQuestions').click(function () {
    var manageSurveyQuestionsTop = new Tour(ManageSurveyQuestionsTour.Questions);
    manageSurveyQuestionsTop.init();
    manageSurveyQuestionsTop.start();
    manageSurveyQuestionsTop.restart();
});