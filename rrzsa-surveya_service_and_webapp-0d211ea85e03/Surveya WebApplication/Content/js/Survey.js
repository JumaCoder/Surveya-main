//Global properties
var companyList = [];
var projList = [];
var nonTeamUserForSurv = [];
var TeamMembers = [];

var compUserForProj;
var projSurveys;
var curProject;

var thisSurvey;

var qIndex;
var ratingQTypeID = 'e4eebc6e-39c6-4853-8c70-007b5c256ef2';

var projID = null;
var projName = null;

var GroupTypes = ["Tab", "Table", "Normal"];
var surveyGroups = [];
var surveyQuestions = [];
var numericalQuestions = [];
var questionCalc = { GroupID: '', questionCalculations: '' };
var optCount;

var pageTree = [];

var questionDiv;

var pipingQs = null;

var defaultPurpose = '<i>Thank you for agreeing to take part in this survey.</i>';
var defaultConclusion = '<i>Thank you for completing this survey.</i>';

var ckSurveyPurpose;
var ckSurveyConclusion;
var ckDuplicatSurveyPurpose;
var ckDuplicatSurveyConclusion;

$(document).ready(function () {
    if (!$('#dontshowagain')[0]) return;
    var urlparts = location.href.split('/');
    var page = urlparts[urlparts.length - 1].split('?')[0];
    if (window.localStorage.getItem('dontPop' + page) === null || window.localStorage.getItem('dontPop' + page) === undefined) {
        window.localStorage.setItem('dontPop' + page, true);
    }
    if (window.localStorage && window.localStorage.getItem('dontPop' + page) === 'false') {
        $('#infoModal').modal();
    }
    //$('#infoModal').modal();
    $('#dontshowagain')[0].checked = window.localStorage.getItem('dontPop' + page) === 'false' ? false : true;
    $('#dontshowagain').click(function () {
        if (window.localStorage.getItem('dontPop' + page) === "false") {
            window.localStorage.setItem('dontPop' + page, true);
        } else {
            window.localStorage.setItem('dontPop' + page, false);
        }
        this.checked = window.localStorage.getItem('dontPop' + page) === 'false' ? false : true;
    });

});
$(document).on('click', '[data-widget="collapse"]', function (e) {
    var box = $(this).closest('.box');
    var id = box.data('id');
    var collapsed = box.hasClass('collapsed-box');
    for (var i = 0; i < pageTree.length; i++) {
        if (pageTree[i].id === id) {
            pageTree[i].collapsed = collapsed;
            return;
        }
    }
    pageTree.push({ id: id, collapsed: collapsed });
});

function isCollapsed(id) {
    for (var i = 0; i < pageTree.length; i++) {
        if (pageTree[i].id === id) {
            return pageTree[i].collapsed;
        }
    }
    return false;
}

$(function () {

    qIndex = 0;
    optCount = 1;
    checkRights('User');

    $('#refreshSurveys').on('click', function () {
        GetCompanySurveys();
    });

    $('#refreshSurveyOverview').on('click', function () {
        GetThisSurvey();
    });

    $(document).find('a[href=#surveyOverview]').click(function () {
        initSurveyOverview();
    });

    $('#StartSurvey').click(function () {
        $('#StartCollectionModal').modal('show');
    });
    $('#StartCollectionBtn').click(function () {
        StartSurvey();
    });

    $('#EndSurvey').click(function () {
        $('#StopCollectionModal').modal('show');
    });

    $('#StopCollectionBtn').click(function () {
        EndSurvey();
    });

    $(document).on('click', '.DT_DeleteSurvey', function () {
        var del = $("#deleteSurveyModal");
        var delBtn = $(this);
        var id = delBtn.data('id');
        del.attr('data-id', id).data('id', id);
        del.modal('show');
    });

    $(document).on('click', '#CancelDeleteSurveyBtn', function () {
        var del = $("#deleteSurveyModal");
        del.removeAttr('data-id').removeData('id');
        del.modal('hide');
    });
    $('#deleteSurveyModal').on('hidden.bs.modal', function (e) {
        // do something...
        $(this).removeAttr('data-id').removeData('id');
    })

    $(document).on('click', '#DeleteSurveyBtn', function () {
        var del = $("#deleteSurveyModal");
        var survID = del.data('id');
        DeleteSurvey(survID);
    });

    $(document).on("mouseover", '.box-header', function () {
        var a = $(this).find('.dropdown-toggle');
        if (!a.attr('aria-expanded') || a.attr('aria-expanded') == "false")
            a.dropdown("toggle");
    });

    $(document).on("mouseout", '.box-header', function () {
        var a = $(this).find('.dropdown-toggle');
        if (a.attr('aria-expanded') || a.attr('aria-expanded') == "true")
            a.dropdown("toggle");
    });

    $(document).on('click', '.showImportQuestionsModal', function () {
        GetSurveysForImport();
    });

    $(document).on('click', '.duplicateSurveyModal', function () {

        $('#surveyToDuplicate').val(thisSurvey.SurveyTitle);

        $('#duplicatSurveyTitle').val(thisSurvey.SurveyTitle + ' - DUPLICATE');
        //$('#duplicatSurveyPurpose').val(thisSurvey.Purpose + ' - DUPLICATE');
        CKEDITOR.instances.duplicatSurveyPurpose.setData(thisSurvey.Purpose + ' - DUPLICATE');
        CKEDITOR.instances.duplicatSurveyConclusion.setData((thisSurvey.SurveyConclusion?thisSurvey.SurveyConclusion:'') + ' - DUPLICATE');
        $('#duplicateSurveyModal').modal('show');
    });

    $('#duplicatSurveyBtn').on('click', function () {
        DuplicateSurvey();
    });

    $('#editSurveyOverview').click(function () {
        EnableOverview();
    });

    $('#viewSurveyOverview').click(function () {
        DisableOverview();
    });

    $('#SaveUserDetails').click(function () {
        UpdateSurveyOverview();
    });

    $('#addSurveyUserBtn').click(function () {
        $('#addSurveyUserModal').modal();
    });

    $(document).on('click', '.addSurveyUserBtn', function () {
        $('#addSurveyUserModal').modal();
    });

    $('#updateSurveyView').click(function () {
        UpdateSurveyView();
    });

    $('#AddSurveyToProjBtn').click(function () {
        CreateSurvey();
    });

    $('#projectDDL').change(function () {
        var projID = $(this).val();
        getCurrentProject(projID);
    });

    $('#refreshSurveyTeam').click(function () {
        GetSurveyTeam();
    });

    $(document).find('a[href=#surveyTeam]').click(function () {
        hideAllBtns();
        var allBoxToolBtns = $('#surveyTeamBox').find('.box-tools .btn');
        allBoxToolBtns.show();

        GetSurveyTeam();
        GetNonTeamUsers();
    });

    $('#AddUserToProjBtn').click(function () {
        AddTeamMemberToSurvey();
    });


    $(document).find(".sortableDiv").on("sortstop", function (event, ui) {
        var groupToMove = ui.item;
        var groupBelow = $(ui.item).next();

        var isBox = groupToMove.hasClass('box');
        var isQuestion = groupToMove.hasClass('questionRow');
        var isRow = groupToMove.hasClass('rowItem');
        if (isQuestion) {
            MoveQuestion(groupToMove, groupBelow);
        }
        else if (isRow) {
            MoveQuestionRow(groupToMove, groupBelow);
        }
        else if (isBox) {
            MoveQuestionGroup(groupToMove, groupBelow);
        }
    });

    $(document).find(".questionList").on("sortstop", function (event, ui) {
        var questionToMove = ui.item;
        var questionBelow = $(ui.item).next();

    });

    $(document).on('click', '.DT_EvokeTeamActivate', function () {
        var userID = $(this).data('id');
        ActivateTeamUser(userID);
    });

    $(document).on('click', '.DT_EvokeTeamDeactivate', function () {
        var userID = $(this).data('id');
        DeactivateTeamUser(userID);
    });

    $(document).on('click', '.DT_EvokeTeamDelete', function () {
        var userID = $(this).data('id');
        RemoveTeamUser(userID);
    });


    $('#refreshSurveyQuestions').click(function () {
        GetGroupsAndQuestionsForSurvey();
    });

    $('#refreshSurveyQuestionResponses').click(function () {
        GetResponseStats();
    });

    $('#CopyResponsesToAudit, #CopyResponsesToAudit2').click(function () {
        CopyResponsesToAudit();
    });

    $('#uploadResponses,#uploadResponses2').click(function () {
        $('form').attr('novalidate', 'novalidate');
        $('#respModalPanel').show();
        /*
        var respModal = $('#uploadResponsesModal')
        respModal.modal('show');
  
        // The below is a hack for calling server side code in a bs.modal
        // -it moves the modal's from the bottom of the <body></body> to <form> </form>
        // -so that ASP knows when events fire
        respModal.on('shown.bs.modal', function (e) {
           var form = $('form');
           respModal.detach();
           form.append(respModal);
           form.attr('novalidate', 'novalidate');
        })
        */
    });

    $('#addQuestionGroupBtn').click(function () {

        $('#addGroupModal').modal();
    });

    $(document).on('click', '.addQuestionGroupBtn', function () {
        $('#addGroupModal').modal();
    });

    $(document).on('click', '.qGroupBtn', function () {
        var grID = $(this).data('id');


        var box = $(this).closest('.box');
        var gr = box.find('.myGroupTitle').find('input');
        var grTitle = gr.val();

        $('#ParentGroupName').html(grTitle);

        var innerGroup = $('#addInnerGroupModal');
        innerGroup.attr('data-parentid', grID);
        innerGroup.modal();
    });

    $('#AddGroupBtn').click(function () {
        var modal = $('#addGroupModal');
        var modalError = $('#addGroupModalError').html('');

        var gr = {
            groupName: $('#groupName').val(),
            groupType: 'Page'
        };
        if (gr.groupName && gr.groupType) {
            createQuestionGroup(modal, gr);
        }
        else {
            modalError.html('Please give group a name and select a type for it');
        }
    });

    $("#innerGroupTypeDDL").change(function () {
        $('#innerGroupHeading').val('');
        if ($(this).val() === 'Table') {
            $('#innerGroupHeadingDiv').show('800');
        } else {
            $('#innerGroupHeadingDiv').hide('800');
        }
    });

    $('#AddInnerGroupBtn').click(function () {
        var modal = $('#addInnerGroupModal');
        var modalError = $('#addInnerGroupModalError').html('');

        var gr = {
            parentGrID: modal.attr('data-parentid'),
            groupName: $('#innerGroupName').val(),
            groupType: $('#innerGroupTypeDDL :selected').val(),
            groupHeading: $('#innerGroupHeading').val()
        };
        if (gr.groupName && gr.groupType) {
            createQuestionGroup(modal, gr);
        }
        else {
            modalError.html('Please give group a name and select a type for it');
        }
    });

    var defaultGrTitle = null;

    $(document).on('click', '.GT_Edit', function () {
        //make editable
        var gr = $(this).closest('.myGroupTitle');
        var grTitle = gr.find('input');
        grTitle.removeAttr('readonly').removeAttr('disabled');
        grTitle.removeClass('view').addClass('edit');

        defaultGrTitle = grTitle.val();

        gr.find('.GT_Edit').hide();
        gr.find('.GT_Save').show();
        gr.find('.GT_Cancel').show();
    });

    $(document).on('click', '.GT_Cancel', function () {
        //make disabled
        var gr = $(this).closest('.myGroupTitle');
        var grTitle = gr.find('input');
        grTitle.attr('readonly', 'readonly').attr('disabled', 'disabled');
        grTitle.removeClass('edit').addClass('view');
        //reset the title
        grTitle.val(defaultGrTitle);
        defaultGrTitle = null;

        gr.find('.GT_Edit').show();
        gr.find('.GT_Save').hide();
        gr.find('.GT_Cancel').hide();
    });

    $(document).on('click', '.GT_Save', function () {
        updateQuestionGroup(this);
    });


    $(document).on('click', '.GT_RefreshHead', function () {
        //make disabled
        var tableDiv = $(this).closest('.tableHdiv');
        var grHead = tableDiv.find('input.tableH');
        var defaultGrHead = grHead.data('headingoriginal');

        grHead.val(defaultGrHead);
    });

    $(document).on('click', '.GT_SaveHead', function () {
        updateQuestionGroup(this);
    });

    $(document).on('click', '.addQuestion', function () {
        $('#questionTxt').val('');
        //CKEDITOR.instances.questionTxt.setData("");

        var box = $(this).closest('.box');
        var questionDiv = box.find('.questionList');

        var id = box.data('id');
        var type = $(this).data('type');

        var typeDDL = $('#typeDDL');
        typeDDL.children().remove();

        var typeOpts = getTypeOptions();
        typeDDL.html(typeOpts);

        $('#deleteQuestionBtn').hide();
        $('#viewQuestionValitionBtn').hide();
        $('#questionGroupsDiv').hide();

        var addQ = $('#questionModal').removeAttr('data-grid').removeAttr('data-grtype').removeAttr('data-qid').removeData('grid').removeData('grtype').removeData('qid');

        addQ.attr('data-grid', id).data('grid', id);
        addQ.attr('data-grtype', type).data('grtype', type);

        //addQ.modal();

        var addQTool = $('#addQuestionFromToolboxModal').removeAttr('data-grid').removeAttr('data-grtype').removeData('grid').removeData('grtype');

        addQTool.attr('data-grid', id).data('grid', id);
        addQTool.attr('data-grtype', type).data('grtype', type);
        addQTool.modal();

        var qType = getTypeByID(typeDDL.val());
        if (qType.Type == 'radio') {
            $('#addOtherOption').show();
            $('#optionsOther').data('isother', false).hide();
        } else {
            $('#addOtherOption').hide();
            $('#optionsOther').data('isother', false).hide();
        }

    });

    $(document).on('click', '.newQuesByType', function () {
        $('#addQuestionFromToolboxModal').on('hidden.bs.modal', function (e) {
            $('#addQuestionFromToolboxModal').off('hidden.bs.modal');
            $('#questionModal').modal();

            var typeID = btn.data('typeid');
            var type = btn.data('type');
            if (type == "email") {
                var emailReg = '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$';
                $('#regexTxt').val(emailReg.toString()).trigger('change');
                $('#regexErrorTxt').val('Invalid email address');
            }

            $('#typeDDL').val(typeID).trigger('change');

            var qType = getTypeByID(typeID);
            if (qType.Type == 'radio') {
                $('#addOtherOption').show();
            } else {
                $('#addOtherOption').hide();
            }

            if (qType.Type == 'calculation') {
                var qModal = $('#addQuestionFromToolboxModal');
                var grID = qModal.data('grid');
                var grType = qModal.data('grtype');
                GetCalcQuestions(grID, grType);
                $('#calcControlDiv').show();
            }
            else {
                $('#calcControlDiv').hide();
            }

            if(qType.Type == 'rating')
            {
                $('#MaxRatingDiv').show();
            }
        });


        $('#addQuestionFromToolboxModal').modal('hide');
        var btn = $(this);

    });

    $('#typeDDL').on('change', function () {
        var addQModal = $('#questionModal');
        var grType = addQModal.data('grtype');
        var gID = addQModal.data('grid');

        questionCalc = { GroupID: '', questionCalculations: '' };
        var selected = $(this).find(':selected');

        //var typeID = selected.data("typeid");
        var typeID = selected.val();
        if (!typeHasOptions(typeID)) {
            $('#optionsDiv').children().remove();
            optCount = 1;
            $('#optionsSect').hide('400');
        } else {
            $('#optionsSect').show('400');
        }

        var calDiv = $('#calcControlDiv')
        var qType = getTypeByID(typeID);
        if (qType.Type == 'radio') {
            $('#addOtherOption').show();
        } else {
            $('#addOtherOption').hide();
        }
        if (qType.Type == 'calculation') {
            GetCalcQuestions(gID, grType);
            calDiv.show();
        }
        else {
            calDiv.hide();
            $('#questionColumnDiv').hide();
            var qDDL = $('#questionsForCalcDDL');
            qDDL.children().remove();
            var optStr = '<option> No available questions</option>';

            qDDL.html(optStr);
        }

        if (qType.Type == 'rating') {
            $('#MaxRatingDiv').show();
        } else {
            $('#MaxRatingDiv').hide();
        }
    });

    $('#saveQuestionBtn').click(function () {
        var qModal = $('#questionModal');
        var grID = qModal.data('grid');
        var qID = qModal.data('qid');

        //qID is null if new question else we are editing

        if (qID) {
            UpdateQuestion();
        }
        else {
            AddQuestionToSurvey();
        }

        qModal.modal('hide');
    });

    $('#saveQuestionValidationBtn').click(function () {
        var qModal = $('#questionValidationModal');
        var grID = qModal.data('grid');
        var qID = qModal.data('qid');

        //qID is null if new question else we are editing

        if (qID) {
            UpdateQuestion();
        }
        else {
            AddQuestionToSurvey();
        }

        qModal.modal('hide');
    });

    $('#questionModal').on('hidden.bs.modal', function (e) {

        $(this).removeData('data-grid').removeData('data-qid');

        $('#questionTxt').val('');
        //CKEDITOR.instances.questionTxt.setData("");

        $('#typeDDL').val('-1');

        $('#optionsDiv').children().remove();
        $('#RequiredQuestion').prop('checked', null);
        $('#minTxt').val('');
        $('#maxTxt').val('');
        $('#EqualsValue').val('');
        $('#NotEqualsValue').val('');
        $('#StartsWithValue').val('');
        $('#EndsWithValue').val('');
        $('#ContainsValue').val('');
        $('#LengthValue').val('');
        //$('#regExDiv').val('');
        $("#regexTxt").val('');

        questionCalc = { GroupID: '', questionCalculations: [] };
        makeQuestionCalcLabels();
        $('#optionsSect').show();
        $('#requiredDiv').show();
        $('#textDiv').show();
        $('#hasSumDiv').hide();
        $('#questionColumnDiv').hide();
        $('#calcControlDiv').hide();
    });

    $(document).on('click', '.GR_Remove', function () {
        var grID = $(this).data('id');
        var grName = $(this).data('name');
        removeQuestionGroup(grID, grName);
    });

    $('#deleteGroupAndQuestionsBtn').click(function () {
        var grID = $(this).data('grid');
        var grName = $(this).data('grname');
        removeQuestionGroupAndQuestions(grID, grName);
    });

    $(document).on('click', '.qEdit', function () {
        var qID = $(this).data('qid');

        var box = $(this).closest('.box');
        var grID = box.data('id');

        GetSpecificQuestion(qID, grID);
    });

    $(document).on('click', '.qVEdit', function () {
        var qID = $(this).data('qid');

        var box = $(this).closest('.box');
        var grID = box.data('id');

        GetSpecificQuestion(qID, grID, true);
    });

    $('#viewQuestionBtn').on('click', function () {

        var qID = $(this).data('qid');
        var grID = $(this).data('grid');
        $('#questionValidationModal').on('hidden.bs.modal', function () {
            GetSpecificQuestion(qID, grID);
            $('#questionValidationModal').off('hidden.bs.modal');
        });
        $('#questionValidationModal').modal('hide');
    });

    $('#viewQuestionValitionBtn').on('click', function () {
        var qID = $(this).data('qid');
        var grID = $(this).data('grid');
        $('#questionModal').on('hidden.bs.modal', function () {
            GetSpecificQuestion(qID, grID, true);
            $('#questionModal').off('hidden.bs.modal')
        });
        $('#questionModal').modal('hide');

    });

    $(document).on('click', '.qOptions', function () {
        var qID = $(this).data('qid');

        var box = $(this).closest('.box');
        var grID = box.data('id');

        var sect = $('#optionsSect');
        GetSpecificQuestion(qID, grID, sect);
    });

    //qValidation
    $(document).on('click', '.qValidation', function () {
        var qID = $(this).data('qid');

        var box = $(this).closest('.box');
        var grID = box.data('id');

        var sect = $('#qValidation');
        GetSpecificQuestion(qID, grID, sect);
    });

    $(document).on('click', '.addQuestionRow', function () {
        var groupID = $(this).data('id');

        $('#AddRowBtn').data('gid', groupID).attr('data-gid', groupID);
        $('#addTableRowModal').modal('show');
    });


    $(document).on('click', '.rEdit', function () {
        var qID = $(this).data('rid');

        var row = $(this).closest('.rowItem');
        var input = $(row.find('input'));

        input.removeAttr('readonly').removeAttr('disabled').attr('data-init', input.val()).focus();

        var editDelete = $(row.find('.editDelete'));
        editDelete.hide();

        var saveCancel = $(row.find('.saveCancel'));
        saveCancel.show();
    });

    $(document).on('click', '.rDelete', function () {
        var rID = $(this).data('rid');
        var row = $(this).closest('.rowItem');

        RemoveQuestionRow(rID, row);
    });

    $(document).on('click', '.rSave', function () {
        var rID = $(this).data('rid');

        var row = $(this).closest('.rowItem');
        var input = $(row.find('input'));
        var rowText = input.val();

        var box = $(this).closest('.box');
        var grID = box.data('id');

        input.attr('readonly', 'readonly').attr('disabled', 'disabled').attr('data-init', input.val());

        var editDelete = $(row.find('.editDelete'));
        editDelete.show();

        var saveCancel = $(row.find('.saveCancel'));
        saveCancel.hide();

        UpdateQuestionRow(rID, rowText);
    });

    $(document).on('click', '.rCancel', function () {

        var row = $(this).closest('.rowItem');
        var input = $(row.find('input'));

        input.val(input.data('init'));

        var editDelete = $(row.find('.editDelete'));
        editDelete.show();

        var saveCancel = $(row.find('.saveCancel'));
        saveCancel.hide();
    });

    $('#AddRowBtn').on('click', function () {
        var groupID = $(this).data('gid');

        $('#AddRowBtn').removeAttr('data-gid');

        var rowText = $('#newRowText').val();

        CreateQuestionRow(groupID, rowText);
    });

    //removeOpt

    $('#addOption').on('click', function () {
        optCount++;
        makeOptionRow(optCount, null);
        //TODO   add another list item

    });

    $(document).on('click', '.removeOpt', function () {
        var id = $(this).data('opt');
        var thisRow = $('#optDiv' + id);
        thisRow.remove();
    });

    $(document).on('click', '.removeOptOther', function () {
        var otherRow = $('#optionsOther');
        otherRow.data('isother', false);
        otherRow.hide();

        $('#addOtherOption').show();
    });

    $('#addOtherOption').on('click', function () {
        var otherRow = $('#optionsOther');
        otherRow.data('isother', true);
        otherRow.show();

        $('#addOtherOption').hide();
    });

    $('#advancedRegEx').on('click', function () {
        $(this).hide();
        $('#simpleRegEx').show();
        $('#regExDiv').show('800');
        $('#regExControls').show('800');
    });

    $('#simpleRegEx').on('click', function () {
        $(this).hide();
        $('#advancedRegEx').show();
        $('#regExDiv').hide('800');
        $('#regExControls').hide('800');

        //Clear the regex
        $('#regexTxt').val('');
    });

    $('#addRegEx').click(function () {
        var selectedReg = $('#regexDDL :selected');
        //var oldReg = $('#regexTxt').val();
        $('#regexTxt').val(/*oldReg + */selectedReg.val());
        $('#regexErrorTxt').val(selectedReg[0].title);
    });

    $('#deleteQuestionBtn').click(function () {
        removeQuestion();
    });

    $('#addSurveyBtn').click(function () {
        GetCompanyProjects();
        CKEDITOR.instances.surveyPurpose.setData(defaultPurpose);
        CKEDITOR.instances.surveyConclusion.setData(defaultConclusion)
        $('#addProjectSurveyModal').modal();
    });

    $(document).on('click', '.groupLogicBtn', function () {
        var box = $(this).closest('.box');
        var controlBtnList = box.find('.controlBtnList');
        var pipingShowHide = box.find('.pipingShowHide');
        box.find('.cancelPiping').css('display', 'block');
        box.find(".box-body").css("display", "block");
        var a = $(".dropdown-toggle");
        a.attr("aria-expanded", false);

        var pipConDiv = box.find('.pipingConditionDiv');
        pipConDiv.closest('.controlBtnList').data('editMode', true);

        var innerBoxes = box.find('.box');
        if (innerBoxes && innerBoxes.length > 0) {

            var innerBoxesControlBtnList = innerBoxes.find('.controlBtnList');
            controlBtnList = controlBtnList.not(innerBoxesControlBtnList);

            var innerPipingShowHide = innerBoxes.find('.pipingShowHide');
            pipingShowHide = pipingShowHide.not(innerPipingShowHide);
        }

        pipingShowHide.parent().show();
        controlBtnList.show();

    });

    // piping
    $(document).on('click', '.controlBtn', function () {
        var btn = $(this);
        var btnID = btn.data('id');
        var btnText = btn.data('text');
        var btnType = btn.data('type');

        var box = $(btn).closest('.box');
        var grID = box.data('id');
        var pipConDiv = box.find('.pipingConditionDiv');
        var savePipConBtn = box.find('.savePiping');

        if (pipConDiv.length > 1) {
            var innerBox = box.find('.box');
            var otherPipConDiv = innerBox.find('.pipingConditionDiv');
            var otherSavePipConBtn = innerBox.find('.savePiping');

            pipConDiv = pipConDiv.not(otherPipConDiv);
            savePipConBtn = savePipConBtn.not(otherSavePipConBtn);
        }

        if (savePipConBtn && savePipConBtn.length == 1) {
            savePipConBtn = $(savePipConBtn[0]);
        }
        savePipConBtn.show();
        var group = getGroupByID(grID);   //surveyGroups

        if (typeof (group.Piping) == "undefined" || !group.Piping) {
            group.Piping = { ID: '', pipingConditions: [], Show: '' };
        }

        if (btnID == 'condition') {
            //add btn to closest '.pipingConditionDiv'
            //item.value = '';

            GetSurveyQuestionNotInGroup(grID);

        } else {

            var item = { order: group.Piping.pipingConditions.length, type: btnType, value: btnText, added: true };
            group.Piping.pipingConditions.push(item);

            pipConDiv.
               append('&nbsp;<span class="label label-info label-lg" data-order="' + item.order + '">&nbsp;' + btnText + '&nbsp;<span class="label-btn">' +
               '<i class="glyphicon glyphicon-remove removeLabel" data-order="' + item.order + '"></i></span>');
        }
    });

    $(document).on('click', '.removeLabel', function () {
        var btn = $(this);
        var btnOrder = btn.data('order');

        var box = $(btn).closest('.box');
        var grID = box.data('id');
        var pipConDiv = box.find('.pipingConditionDiv');
        var savePipConDiv = box.find('.savePiping');

        if (!pipConDiv.closest('.controlBtnList').data('editMode')) {
            var controlBtnList = box.find('.controlBtnList');
            var pipingShowHide = box.find('.pipingShowHide');
            box.find('.cancelPiping').css('display', 'block');
            box.find(".box-body").css("display", "block");
            var a = $(".dropdown-toggle");
            a.attr("aria-expanded", false);
            pipConDiv.closest('.controlBtnList').data('editMode', true);

            var innerBoxes = box.find('.box');
            if (innerBoxes && innerBoxes.length > 0) {

                var innerBoxesControlBtnList = innerBoxes.find('.controlBtnList');
                controlBtnList = controlBtnList.not(innerBoxesControlBtnList);

                var innerPipingShowHide = innerBoxes.find('.pipingShowHide');
                pipingShowHide = pipingShowHide.not(innerPipingShowHide);
            }

            pipingShowHide.parent().show();
            controlBtnList.show();
        }


        if (pipConDiv.length > 1) {
            var thisPipConDiv, thisPipBox, thisPipBoxID;
            for (var i = 0; i < pipConDiv.length; i++) {
                thisPipConDiv = $(pipConDiv[i]);
                thisPipBox = $(thisPipConDiv.closest('.box'));
                thisPipBoxID = thisPipBox.data('id');

                if (thisPipBoxID !== grID) {
                    pipConDiv.splice(i, 1);
                }
                console.log(i);
            }
        }

        if (pipConDiv.length > 1) {
            var innerBox = box.find('.box');
            var otherSavePipConBtn = innerBox.find('.savePiping');
            savePipConDiv = savePipConDiv.not(otherSavePipConBtn);
        }
        savePipConDiv.show();

        var group = getGroupByID(grID);   //surveyGroups


        if (typeof (group.Piping) == "undefined" || !group.Piping) {
            group.Piping = { ID: '', pipingConditions: [], Show: '' };
        }
        else {
            group.Piping.pipingConditions[btnOrder].remove = true;
            //group.Piping.pipingConditions.splice(btnOrder, 1);

        }

        makePipingConLabels(group, pipConDiv);
    });

    $('#PipingCompareDDL').on("change", function () {

        var val = $(this).val();

        //add option for having any value
        if (val == "hasanyvalue") {
            $(".PipingCompareDiv").hide();
        } else {
            $(".PipingCompareDiv").show();
        }


    });

    $('#PipingConditionDDL').on('change', function () {
        $(".PipingCompareDiv").show();
        var selectOpt = $(this).find(":selected");
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
        var selectedQ = getPipingQByID(selectID);
        /*
        GroupID:"f49399fd-c7b0-4192-8fa5-1b74fc327803"
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

        var qDDL = $('#PipingCompareDDL');
        qDDL.children().remove();

        var compareDiv = $('#PipingCompareDiv');
        compareDiv.html('');

        var equalOption = '<option value="equal">= (equal to)</option>';
        var hasAnyValueOption = '<option value="hasanyvalue">has any value</option>';
        if (!selectedType) {

        }
        else if (selectedType.HasOptions) {
            //ddl  checkbox   radio   ddlMultiple
            if (selectedQ.QuestionValues) {
                var allOptions = equalOption + hasAnyValueOption;
                qDDL.html(allOptions);

                var pipingValues = $('<select>').addClass('form-control compareReponse');
                var val, optStr = '';
                for (var i = 0; i < selectedQ.QuestionValues.length; i++) {
                    val = selectedQ.QuestionValues[i];
                    optStr += '<option value="' + val.ID + '">' + val.Value + '</option>';
                }
                pipingValues.html(optStr);
                compareDiv.html(pipingValues);
            }
        }
        else {
            if (selectedType.Type == 'calculation' || selectedType.Type == 'date' || selectedType.Type == 'Numerical' || selectedType.Type == 'rating') {
                //calculation   date   Numerical
                qDDL.html('<option value="less">&lt; (less than)</option>'
                   + '<option value="lessEqual">&lt;= (less or equal to)</option>'
                   + '<option value="equal">= (equal to)</option>'
                   + '<option value="moreEqual">&gt;= (greater or equal to)</option>'
                   + '<option value="more">&gt; (greater than)</option>'
                   + hasAnyValueOption
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
                //qDDL.html(equalOption);
                var allOptions = equalOption + hasAnyValueOption;
                qDDL.html(allOptions);
                compareDiv.html('<textarea rows="3" class="form-control compareReponse"></textarea>');
            }
            else if (selectedType.Type == 'text') {
                //text
                //qDDL.html(equalOption);
                var allOptions = equalOption + hasAnyValueOption;
                qDDL.html(allOptions);
                compareDiv.html('<input type="text" class="form-control compareReponse" />');
            }
            else {
                //signature   camera   location
            }
        }
    });

    $('#AddPipingConditionBtn').on('click', function () {
        var pipingModal = $('#addGroupPipingConditionModal');
        var grID = pipingModal.data('grid');

        var selectedQ = $('#PipingConditionDDL').find(':selected').val();
        var selectedQText = $('#PipingConditionDDL').find(':selected').html();
        var selectedCompare = $('#PipingCompareDDL').find(':selected').val();
        var selectedCompareText = $('#PipingCompareDDL').find(':selected').html();
        var pipingValue = $('#PipingCompareDiv').find('input, textarea');
        var pipingValue2 = $('#PipingCompareDiv').find('select');

        var error = $('#addGroupPipingConditionModalError');
        error.html('');

        if (!selectedQ || !selectedCompare || ((!pipingValue || !pipingValue[0] || !$(pipingValue[0]).val()) && (!pipingValue2 || !pipingValue2[0] || !$(pipingValue2[0]).val()))) {
            if (!selectedQ) {
                error.append('<p>Please select a question to add</p>');
            }
            if (!selectedCompare) {
                error.append('<p>Please select the condition to use</p>');
            }
            if ((!pipingValue || !pipingValue[0] || !$(pipingValue[0]).val()) && (!pipingValue2 || !pipingValue2[0] || !$(pipingValue2[0]).val())) {

                if (selectedCompare == "hasanyvalue") {
                    //ignore check
                } else {
                    error.append('<p>Please add the accepted value</p>');
                }
            }
        }
        //else {

        if (error.html() == "") {
            var box = $(document).find('.box[data-id="' + grID + '"]');
            var pipConDiv = box.find('.pipingConditionDiv');

            if (pipConDiv.length > 1) {
                var thisPipConDiv, thisPipBox, thisPipBoxID;
                for (var i = 0; i < pipConDiv.length; i++) {
                    thisPipConDiv = $(pipConDiv[i]);
                    thisPipBox = $(thisPipConDiv.closest('.box'));
                    thisPipBoxID = thisPipBox.data('id');

                    if (thisPipBoxID !== grID) {
                        pipConDiv.splice(i, 1);
                    }
                }
            }

            $(box.find('.savePiping')).show();
            var group = getGroupByID(grID);   //surveyGroups

            if (typeof (group.Piping) == "undefined" || !group.Piping) {
                group.Piping = { ID: '', pipingConditions: [], Show: '' };
            }
            var val1 = $(pipingValue[0]).val();
            var condition = {};

            if (val1) {
                condition = { qID: selectedQ, qText: selectedQText, qCondition: selectedCompare, qConditionText: selectedCompareText, pipingValue: $(pipingValue[0]).val() }
            }
            else {
                //add option for having any value
                if (selectedCompare == "hasanyvalue") {
                    condition = { qID: selectedQ, qText: selectedQText, qCondition: selectedCompare, qConditionText: selectedCompareText, pipingValue: "", pipingValueText: "" }
                } else {
                    var selected = $(pipingValue2[0]).find(':selected').html();
                    condition = { qID: selectedQ, qText: selectedQText, qCondition: selectedCompare, qConditionText: selectedCompareText, pipingValue: $(pipingValue2[0]).val(), pipingValueText: selected }
                }
            }

            var item = { order: group.Piping.pipingConditions.length, type: 'condition', value: condition, added: true };
            group.Piping.pipingConditions.push(item);

            pipConDiv.
               append(makeConditionLabel(item.order, condition));

            pipingModal.modal('hide');
            //clear
            error.html('');
            $('#PipingConditionDDL').html('');
            $('#PipingCompareDDL').html('');
            $('#PipingCompareDiv').html('');
        }
    });

    $(document).on('click', '.cancelPiping', function () {
        var btn = $(this);
        var bBody = $(btn).closest('.box-body');
        var box = $(btn).closest('.box');
        console.log(box.find('.pipingShowHide')[0].parentNode);
        $(box.find('.pipingShowHide')[0].parentNode).hide();
        $(box.find('.controlBtnList')[0]).hide();
        box.find('.savePiping').css('display', 'none');
        box.find('.cancelPiping').css('display', 'none');

        var pipConDiv = box.find('.pipingConditionDiv');
        pipConDiv.closest('.controlBtnList').data('editMode', false);
        var grID = box.data('id');

        if (pipConDiv.length > 1) {
            var thisPipConDiv, thisPipBox, thisPipBoxID;
            for (var i = 0; i < pipConDiv.length; i++) {
                thisPipConDiv = $(pipConDiv[i]);
                thisPipBox = $(thisPipConDiv.closest('.box'));
                thisPipBoxID = thisPipBox.data('id');

                if (thisPipBoxID !== grID) {
                    pipConDiv.splice(i, 1);
                }
            }
        }

        pipConDiv.html('&nbsp;');

        var group = getGroupByID(grID);
        if (group.Piping) {
            for (var i = 0; i < group.Piping.pipingConditions.length; i++) {
                if (group.Piping.pipingConditions[i].added)
                    group.Piping.pipingConditions.splice(i--, 1);
                else if (group.Piping.pipingConditions[i].remove)
                    group.Piping.pipingConditions[i].remove = false;
            }
        }
        makePipingConLabels(group, pipConDiv);
    });

    $(document).on('click', '.savePiping', function () {
        var btn = $(this);
        var bBody = $(btn).closest('.box-body');
        var box = $(btn).closest('.box');
        var grID = box.data('id');
        var hideShow = bBody.find(':selected').val();

        var pipConDiv = box.find('.pipingConditionDiv');
        pipConDiv.closest('.controlBtnList').data('editMode', false);

        var group = getGroupByID(grID);

        if (group.Piping) {
            for (var i = 0; i < group.Piping.pipingConditions.length; i++) {
                if (group.Piping.pipingConditions[i].remove)
                    group.Piping.pipingConditions.splice(i--, 1);
                else if (group.Piping.pipingConditions[i].added) {
                    group.Piping.pipingConditions[i].added = false;
                }
            }
        }

        saveGroupPiping(group, hideShow)
    });

    // Table calculation
    $(document).on('click', '.calculationBtn', function () {

        var btn = $(this);
        var btnID = btn.data('id');
        var btnText = btn.data('text');
        var btnType = btn.data('type');

        var qModal = $('#questionModal');
        var grID = qModal.data('grid');
        var grType = qModal.data('grtype');

        if (!questionCalc || !questionCalc.questionCalculations) {
            questionCalc = { GroupID: grID, questionCalculations: [] };
        }

        if (btnID == 'column') {
            var selectQuestions = [];

            var qDDL = $('#questionsForCalcDDL');
            qDDL.children().remove();

            if (grType == 'Table') {
                //btnType='Table' get only calculable (numeric or other calculation) questions for this group
                selectQuestions = GetCalculableQuestionInGroup(grID);

            }
            else if (grType == 'Normal') {
                //btnType='Normal' get ALL calculable (numeric or other calculation) questions
                selectQuestions = GetAllCalculableQuestion();
            }

            if (selectQuestions) {
                //{GroupID , QuestionID , QuestionText, QuestionTypeID ,QuestionType}

                var q, optStr = '<option> </option>', gr, grTxt = '';
                for (var i = 0; i < selectQuestions.length; i++) {
                    q = selectQuestions[i];
                    gr = getGroupByID(q.GroupID);
                    if (gr && gr.GroupName) { grTxt = gr.GroupName + ' - '; }
                    else { grTxt = ''; }
                    optStr += '<option value="' + q.QuestionID + '">' + grTxt + q.QuestionText + '</option>';
                }

                if (!selectQuestions || selectQuestions.length == 0) {
                    optStr = '<option> No available questions</option>';
                }

                qDDL.html(optStr);
            }
            $('#questionColumnDiv').show();

        } else {

            var item = { order: questionCalc.questionCalculations.length, type: btnType, value: btnText };
            questionCalc.questionCalculations.push(item);
            $('#questionCalcDiv').
               append('&nbsp;<span class="label label-info label-lg" data-order="' + item.order + '">&nbsp;' + btnText + '&nbsp;<span class="label-btn">' +
               '<i class="glyphicon glyphicon-remove removeCalcLabel" data-order="' + item.order + '"></i></span>');

            //ZIBA QUESTION BTN, Check if not
        }
    });

    $(document).on('click', '.removeCalcLabel', function () {
        var btn = $(this);
        var btnOrder = (btn.data('order') * 1);

        var calc = questionCalc.questionCalculations[btnOrder];   //surveyGroups

        questionCalc.questionCalculations.splice(btnOrder, 1);

        makeQuestionCalcLabels();

    });

    $('#addQuestionToCalc').on('click', function () {
        var qToCalcID = $('#questionsForCalcDDL').val();

        var qTo = getQuestionCalcByID(qToCalcID);
        var gr, grTxt = '';
        gr = getGroupByID(qTo.GroupID);
        if (gr && gr.GroupName) { grTxt = gr.GroupName.substring(0, 4) + ' - '; }
        else { grTxt = ''; }

        var item = { order: questionCalc.questionCalculations.length, type: 'column', value: qTo };
        questionCalc.questionCalculations.push(item);
        var btnText = (qTo.QuestionText.length > 5) ? qTo.QuestionText.substring(0, 3) + '...' : qTo.QuestionText;
        $('#questionCalcDiv').
           append('&nbsp;<span class="label label-info label-lg" data-order="' + item.order + '">&nbsp;' + grTxt + btnText + '&nbsp;<span class="label-btn">' +
           '<i class="glyphicon glyphicon-remove removeCalcLabel" data-order="' + item.order + '"></i></span>');

        $('#questionColumnDiv').hide();
    });

    // Question list 'Option Text' and 'Option Value'

    $(document).on('change', '.optTxt', function () {

        var optText = $(this).val();
        var opt = $(this).data('opt');
        var optDiv = $('#optDiv' + opt);
        if (optDiv) {
            var optValObj = optDiv.find('.optValue[data-opt="' + opt + '"]');
            var optVal = optValObj.val();
            //Remove leading number(s) and spaces
            //optText = optText.replace(/^\d/, '');
            optText = optText.replace(/\s/g, '').replace(/'/g, '').replace(/"/g, '');

            if (!optVal) {
                optValObj.val(optText);
            }
        }
    });

    $(document).on('change', '.optValue', function () {
        var optVal = $(this);
        var optText = optVal.val();
        //Remove leading number(s) and spaces
        //optText = optText.replace(/^\d/, '');
        optText = optText.replace(/\s/g, '').replace(/'/g, '').replace(/"/g, '');
        optVal.val(optText);
    });


    $(document).find('a[href=#responseList]').click(function () {
        hideAllBtns();
        var allBoxToolBtns = $('#surveyQuestionResponsesBox').find('.box-tools .btn');
        allBoxToolBtns.show();
        GetResponseStats();
    });
    $(document).find('a[href=#surveyReports], #refreshSurveyReports').click(function () {
        initReportsOverview();
    });

    $('#addDynamicReportBtn').on('click', function () {
        $('#addDynamicReportModal').modal('show');
    });

    $('#CreateDynamicReportBtn').on('click', function () {
        CreateDynamicReport();
    });


    //change events to clear regex
    $('#EqualsValue').on("change", function () {
        $("#regexTxt").val("");
    });
    $('#NotEqualsValue').on("change", function () {
        $("#regexTxt").val("");
    });
    $('#StartsWithValue').on("change", function () {
        $("#regexTxt").val("");
    });
    $('#EndsWithValue').on("change", function () {
        $("#regexTxt").val("");
    });
    $('#ContainsValue').on("change", function () {
        $("#regexTxt").val("");
    });
    $('#LengthValue').on("change", function () {
        $("#regexTxt").val("");
    });

    /* ==================================================
                   OTHER REPORTS
    ==================================================   */

    $(document).on("click", "#ViewOriginalResponses, #ViewOriginalResponses2", function () {
        var survID = getQueryParameter('id');
        if (!survID) {
            window.location.href = "Surveys.aspx";
        } else {
            window.location.href = "Responses.aspx?id=" + survID;
        }

    });

    $(document).on("click", "#DownloadGeneralReport", function () {
        var survID = getQueryParameter('id');
        if (!survID) {
            window.location.href = "Surveys.aspx";
        } else {
            window.open("../reports/View?report=GeneralReportStatic&id=" + survID, "_blank");
        }
    });

    $(document).on("click", "#DownloadSurveyResponsesMatrix", function () {
        var survID = getQueryParameter('id');
        if (!survID) {
            window.location.href = "Surveys.aspx";
        } else {
            window.open("../reports/View?report=SurveyResponsesMatrix&id=" + survID, "_blank");
        }
    });

    $(document).on("click", "#DownloadSurveyResponsesMatrix_CRM", function () {
        var survID = getQueryParameter('id');
        if (!survID) {
            window.location.href = "Surveys.aspx";
        } else {
            window.open("../reports/View?report=SurveyResponsesMatrix_CRM&id=" + survID, "_blank");
        }
    });


    $(document).on('click', '#GeneratePublicLink', function () {
        $('#GenerateSurveyEmailLinkModal').modal('show');
    });

    $(document).on('click', '#GenerateSurveyEmailLinkBtn', function () {
        var user = $('#emailLinkUsers').val();
        if (!user) {
            $('#GenerateSurveyEmailLinkModal').modal('hide');

            ShowErrorModal("Please select a user for responses to be completed by.");
            return false;
        }
        GeneratePublicLink();
    })
});

function GetCalculableQuestionInGroup(grID) {

    //{GroupID , QuestionID , QuestionText, QuestionTypeID ,QuestionType}
    var q, groupQs = [];
    for (var i = 0; i < numericalQuestions.length; i++) {
        q = numericalQuestions[i];
        if (q.GroupID == grID) {
            groupQs.push(q);
        }
    }
    return groupQs;
}

function GetAllCalculableQuestion() {
    //{GroupID , QuestionID , QuestionText, QuestionTypeID ,QuestionType}
    return numericalQuestions;
}

function getQuestionCalcByID(qID) {
    var q;
    for (var i = 0; i < numericalQuestions.length; i++) {
        q = numericalQuestions[i];
        if (q.QuestionID == qID) {
            return q;
        }
    }
    return null;
}

function showView() {
    var btn = $('.DT_EvokeView');
    if (btn) {
        btn.show();
    }
}

function showAdd() {
    var btn = $('#AddUser');
    if (btn) {
        btn.show();
    }
}

function showEdit() {
    var btn = $('#EditUser');
    if (btn) {
        btn.show();
    }
}

function showDelete() {
    var btn = $('#DeleteUser');
    if (btn) {
        btn.show();
    }
}

// Hides all buttons on accordion headers
function hideAllBtns() {
    var allBoxToolBtns = $(document).find('.box-tools .btn').not('#StartSurvey, #EndSurvey, #HelpViewSurveyTop');
    allBoxToolBtns.hide();
}
//GetMyCompanyDetails 
function setProjectDDL(ddl) {
    var proj, opt;
    ddl.html('');
    for (var i = 0; i < projList.length; i++) {
        proj = projList[i];
        opt = $('<option></option>')
        .val(proj.ID)
        .text(proj.ProjectName + ' - ' + proj.ProjectDescription);
        ddl.append(opt);
    }
}

function GetCompanyProjects() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var methodName = "GetAllProjectsForCompany";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID
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

                projList = JSON.parse(data.RRZResult);
                setProjectDDL($('#projectDDL'));
            }
        },
        error: function (a, e, d) {
            //ShowModal(e + ' ' + d, "Error Occured.");
        }
    });
}


//GetAllSurveysForProject
function GetCompanySurveys() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose surveys you want to view.");
        return false;
    }

    var getAll = $('#x').is(':checked');

    var methodName = "GetAllSurveysForMyCompany";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        getAll: getAll
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
                projSurveys = JSON.parse(data.RRZResult);
                var surv;
                var name = '/' + user.Firstnames + '%20' + user.Lastname;
                var theme = '/' + user.SelectedSkin;
                var key = '/' + encodeURIComponent(userCode);

                $('#tblSurveysItems').dataTable().fnClearTable();
                for (var i = 0; i < projSurveys.length; i++) {
                    surv = projSurveys[i];
                    var survID = '/' + surv.SurveyID;
                    $('#tblSurveysItems')
                        .dataTable()
                        .fnAddData(
                               [
                                   {
                                       "0": surv.SurveyTitle,
                                       "1": '<a href="ViewProject?id=' + surv.ProjectID + '" title="View Project">' + surv.ProjectName + '</a>',
                                       "2": surv.DateCreated ? surv.DateCreated.DateWCF() : ' ',
                                       "3": surv.CreatedByName ? surv.CreatedByName : ' ',
                                       "4": surv.StartDate ? surv.StartDate.DateWCF() : 'Has not Started',
                                       "5": surv.EndDate ? surv.StartDate.DateWCF() : 'Has not Ended',
                                       "6": //'<a href="ViewSurvey?id=' + surv.SurveyID + '"title="Manage Survey">' + DT_AddCustom(surv.SurveyID, 'fa fa-cogs btn text-black', '') + '</a>' +
                                          '  ' + '<a href="ManageSurveyQuestions?id=' + surv.SurveyID + '"title="Edit Questions">' + DT_AddCustom(surv.SurveyID, 'fa fa-question-circle-o btn text-black', '') + '</a>'
                                             + '<a target="_blank" href="' + surveyPreviewURL + survID + name + theme + key + '" title="Preview Survey">' + DT_AddCustom(surv.SurveyID, 'fa icon-surveys btn text-black', '') + '</a>'
                                             + '<a class="DT_DeleteSurvey" data-id="' + surv.SurveyID + '" data-name="' + surv.SurveyTitle + '" title="Delete this survey">' + DT_AddCustom(surv.SurveyID, 'fa fa-times btn', 'text-yellow') + '</a>',
                                       "DT_RowId": surv.SurveyID,
                                   }
                               ]
                           );
                    //'<a href="/Administration/Survey?id=' + surv.ID + '" title="Edit User">' + DT_AddCustom(surv.ID, 'fa fa-pencil btn', 'DT_EvokeView') + '</a>'
                }
                $('#tblSurveysItems tbody tr').click(function (event) {
                    if ($(event.originalEvent.target).closest('td')[0] == $(event.originalEvent.target).closest('tr')[0].lastChild) return;

                    location.href = "ViewSurvey?id=" + event.currentTarget.id;
                });
                initTooltip();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function CreateSurvey() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }
    /*
    public string AddSurvey(string secretKey, string companyID, string surveyTitle, string projectID, string purpose)
 
    */
    //get all the details
    var projID = $('#projectDDL').val();
    var title = $('#surveyTitle').val();
    //var purpose = $('#surveyPurpose').val();
    //var surveyConclusion = $('#surveyConclusion').val();

    var purpose = CKEDITOR.instances.surveyPurpose.getData();
    var surveyConclusion = CKEDITOR.instances.surveyConclusion.getData();

    var methodName = "AddSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, projectID: projID,
        surveyTitle: title, purpose: purpose, conclusion: surveyConclusion,
        isPageView: 'true', theme: ''
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
                    ShowErrorModal(error, false, $('#addProjectSurveyModal'));
                    return false;
                }
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    $('#addProjectSurveyModal').modal('hide');
                    //Project updated
                    location.href = "ManageSurveyQuestions?id=" + response.SurveyID;
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(d, false, $('#addProjectSurveyModal'));
        }
    });
}

function initSurveyOverview() {
    hideAllBtns();
    var allBoxToolBtns = $('#surveyOverviewBox').find('.box-tools .btn');
    allBoxToolBtns.show();

    CKEDITOR.on('instanceReady', function (ev) {
        switch (ev.editor.name) {
            case 'surveyPurpose':
                ckSurveyPurpose = ev.editor;
                break
            case 'surveyConclusion':
                ckSurveyConclusion = ev.editor;
                break
            case 'duplicatSurveyPurpose':
                ckDuplicatSurveyPurpose = ev.editor;
                break
            case 'duplicatSurveyConclusion':
                ckDuplicatSurveyConclusion = ev.editor;
                break
        }
    });

    var sp = document.getElementById('surveyPurpose');
    if (sp && !CKEDITOR.instances.surveyPurpose) {
        CKEDITOR.replace('surveyPurpose', {
            language: 'en',
            toolbarCanCollapse: true
        });
    }

    var sc = document.getElementById('surveyConclusion');
    if (sc && !CKEDITOR.instances.surveyConclusion) {
        CKEDITOR.replace('surveyConclusion', {
            language: 'en',
            toolbarCanCollapse: true
        });
    }

    var dsp = document.getElementById('duplicatSurveyPurpose');
    if (dsp && !CKEDITOR.instances.duplicatSurveyPurpose) {
        CKEDITOR.replace('duplicatSurveyPurpose', {
            language: 'en',
            toolbarCanCollapse: true
        });
    }
    var dsc = document.getElementById('duplicatSurveyConclusion');
    if (dsc && !CKEDITOR.instances.duplicatSurveyConclusion) {
        CKEDITOR.replace('duplicatSurveyConclusion', {
            language: 'en',
            toolbarCanCollapse: true
        });
    }

    /*CKEDITOR.replace('questionTxt', {
        language: 'en',
        toolbarCanCollapse: true
    });*/

    GetThisSurvey();
}

function GetThisSurvey() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find a survey to view.");
        return false;
    }

    var methodName = "GetSpecificSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
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
                thisSurvey = JSON.parse(data.RRZResult);
                projID = thisSurvey.ProjectID;
                projName = thisSurvey.ProjectName;

                $('#surveyTitle').val(thisSurvey.SurveyTitle);
                $(document).find('.surveyNameTxt').html(thisSurvey.SurveyTitle);
                if (thisSurvey.SurveyTheme) {
                    thisSurveyTheme = JSON.parse(thisSurvey.SurveyTheme);

                    $('#themePrimary').val(thisSurveyTheme.PrimaryColor);
                    $('#themeSecondary').val(thisSurveyTheme.SecondaryColor);

                    $('#headerColor').val(thisSurveyTheme.HeaderColor);
                    $('#controlColor').val(thisSurveyTheme.ControlColor);
                    $('#buttonColor').val(thisSurveyTheme.ButtonColor);
                    $('#submitButtonColor').val(thisSurveyTheme.SubmitButtonColor);
                }

                //$('#surveyPurpose').val(thisSurvey.Purpose);
                var sp = document.getElementById('surveyPurpose');
                if (sp && ckSurveyPurpose) {
                    try {
                        //CKEDITOR
                        ckSurveyPurpose.setReadOnly(false);
                        ckSurveyPurpose.setData(thisSurvey.Purpose);
                    }
                    catch (ex) {
                    }
                }
                var sc = document.getElementById('surveyConclusion');
                if (sc && ckSurveyConclusion) {
                    try {
                        //CKEDITOR
                        ckSurveyConclusion.setReadOnly(false);
                        ckSurveyConclusion.setData(thisSurvey.SurveyConclusion);
                    }
                    catch (ex) {
                    }
                }
                $('#projectName').html(thisSurvey.ProjectName);

                DisableOverview();
                GetNonTeamUsers();
                GetEmailLinkUsers();

                var userNum = (thisSurvey.NumberOfSurveyUsers || thisSurvey.NumberOfSurveyUsers == 0) ? thisSurvey.NumberOfSurveyUsers : '?';
                var qNum = (thisSurvey.NumberOfQuestions || thisSurvey.NumberOfQuestions == 0) ? thisSurvey.NumberOfQuestions : '?';
                var respNum = (thisSurvey.NumberOfResponses || thisSurvey.NumberOfResponses == 0) ? thisSurvey.NumberOfResponses : '?';
                var surTitle = thisSurvey.SurveyTitle.replaceAll(' ', '_');

                var emailLink = {
                    EmailedSurveyLink: thisSurvey.EmailedSurveyLink,
                    EmailedUniqueID: thisSurvey.EmailedUniqueID,
                    EmailedUserIDForResponses: thisSurvey.EmailedUserIDForResponses,
                    IsEmailed: thisSurvey.IsEmailed
                }
                //GenerateSurveyEmailLink(..)


                /* var project = '<a href="ViewProject?id=' + projID + '" class="btn btn-default manageQuestionGroupBtn" title="Manage Project">'
                       + '<i class="fa fa-suitcase"></i></a>';
     
                 //var importSurvey = '<a class="showImportQuestionsModal btn btn-default manageQuestionGroupBtn" title="Import questions"><i class="fa fa-download"></i></a>';
     
                 var duplicateSurvey = '<a class="duplicateSurveyModal btn btn-default manageQuestionGroupBtn" title="Duplicate This Survey"><i class="fa fa-copy"></i></a>';
     
                 var users = '<a class="btn btn-app2" btn-sm title="Number of actual users"> <span class="badge bg-purple">'
                    + userNum + '</span><i class="fa fa-user"></i></a>';
                 var addUser = '<a class="btn btn-default addSurveyUserBtn" title="Add User">'
                    + '<i class="fa fa-plus text-purple hidden-md"></i><span class="hidden-xs hidden-sm text-purple"> Add User</span></a>';
     
                 var question = '<a class="btn btn-app2" title="Number of questions"> <span class="badge bg-teal">'
                    + qNum + '</span><i class="fa fa-list-alt"></i></a>';
                 var addQuestion = '<a href="ManageSurveyQuestions?id=' + survID + '" class="btn btn-default manageQuestionGroupBtn" title="Manage Questions">'
                       + '<span class="text-teal"> Manage Questions</span></a>';
     
                 var responses = '<a class="btn btn-app2" title="Number of responses"> <span class="badge bg-primary">'
                    + respNum + '</span><i class="fa fa-list"></i></a>';
     
                 var lbls = $('#surveyLabels');
                 if (lbls) {
                    lbls.html('&nbsp;&nbsp;' + project + '&nbsp;&nbsp;&nbsp;&nbsp;' + duplicateSurvey + '&nbsp;&nbsp;&nbsp;&nbsp;' + users + '&nbsp;&nbsp;&nbsp;&nbsp;' + addUser + '&nbsp;&nbsp;&nbsp;&nbsp;' + question + '&nbsp;&nbsp;&nbsp;&nbsp;' + addQuestion + '&nbsp;&nbsp;&nbsp;&nbsp;' + responses);
                 }*/

                loadSurveyLabels(projID, userNum, qNum, survID, surTitle, respNum, emailLink);

                /*var manageSurvey = '<a href="ViewSurvey?id=' + survID + '" class="btn btn-default manageQuestionGroupBtn" title="Manage Questions">'
                      + '<span class="text-teal"> Manage Survey</span></a>';
                var lbls2 = $('#surveyLabels2');
                if (lbls2) {
                   lbls2.html('&nbsp;&nbsp;' + manageSurvey);
                }*/

                loadSurveyLabels2(projID, userNum, qNum, survID, surTitle, respNum, emailLink);

                initTooltip('surveyLabels');

                //Show Start/End survey buttons

                var startBtn = $('#StartSurvey');
                var endBtn = $('#EndSurvey');

                if (thisSurvey.StartDate !== null && thisSurvey.EndDate !== null) {
                    //We hide the buttons, the project has ended
                    startBtn.hide();
                    endBtn.hide();
                }
                else {
                    if (thisSurvey.StartDate !== null && thisSurvey.EndDate == null) {
                        //Has started but has not ended
                        startBtn.hide();
                        endBtn.show();
                    }
                    else if (thisSurvey.StartDate == null && thisSurvey.EndDate == null) {
                        //Has not started yet
                        startBtn.show();
                        endBtn.hide();
                    }
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function loadSurveyLabels2(projectID, numberOfUsers, numberOfQuestions, surveyID, surveyTitle, numberOfResponses, emailLink) {
    var manageSurvey = '<a id="manageSurveyBtn" href="ViewSurvey?id=' + surveyID + '" class="btn btn-default manageQuestionGroupBtn" title="Manage Survey">'
                      + '<i class="fa icon-surveys text-teal" ></i><span class="hidden-md hidden-sm hidden-xs"> Manage Survey</span></a>';

    var question = '<a id="questionsBtn" href="#questionDiv" class="btn btn-app2" btn-sm title="Number of questions"> <span class="badge bg-orange">'
      + numberOfQuestions + '</span><i class="fa fa-question-circle-o text-orange"></i></a>';

    var surTitle = '/' + surveyTitle;
    var survID = '/' + surveyID;
    var name = '/' + user.Firstnames + '%20' + user.Lastname;
    var theme = '/' + user.SelectedSkin;
    var key = '/' + encodeURIComponent(userCode);
    var href = "' + surveyPreviewURL + survID + name + theme + key + '";

    var previewResp = '<a id="ViewSurveyPreview" target="_blank" class="btn btn-default" title="" data-original-title="Preview Survey" '
    + 'href="' + surveyPreviewURL + survID + name + theme + key + '">'
       + '<i class="fa icon-surveys text-teal"></i><span class="hidden-md hidden-sm hidden-xs"> Preview Survey</span></a>';

    var responses = '<a id="responsesBtn" href="ViewSurvey?id=' + surveyID + '#responseDiv" class="btn btn-app2" btn-sm title="Number of responses"> <span class="badge bg-primary">'
      + numberOfResponses + '</span><i class="fa fa-list text-green"></i></a>';


    var auditResp = '<a id="ViewResponsesToAuditTop" target="_blank" class="btn btn-default" title="" data-original-title="Audit Responses" '
    + 'href="../Reports/View?report=SurveyResponses&type=xlsx&id=' + surveyID + '">'
       + '<i class="fa fa-table text-green"></i><span class="hidden-md hidden-sm hidden-xs"> Audit Responses</span></a>';

    var publicLink = '';
    if (emailLink.IsEmailed || emailLink.EmailedUniqueID) {
        publicLink = '<a target="_blank" class="btn btn-default" title="" data-original-title="View Public Survey" '
    + 'href="' + publicSurveyURL + emailLink.EmailedUniqueID + surTitle + '">'
       + '<i class="fa fa-link text-aqua"></i><span id="GeneratePublicLinkText" class="hidden-md hidden-sm hidden-xs"> View Public Survey</span></a>';
    }
    else {
        publicLink = '<a id="GeneratePublicLink" target="_blank" class="btn btn-default" title="" data-original-title="Generate Public Link">'
       + '<i class="fa fa-link text-aqua"></i><span id="GeneratePublicLinkText" class="hidden-md hidden-sm hidden-xs"> Generate Public Link</span></a>';
    }

    var lbls2 = $('#surveyLabels2');
    if (lbls2 && lbls2.length > 0) {
        lbls2.html(manageSurvey + '&nbsp;&nbsp;&nbsp;&nbsp;' + question + '&nbsp;&nbsp;&nbsp;&nbsp;' + previewResp + '&nbsp;&nbsp;' +
            responses + '&nbsp;&nbsp;&nbsp;&nbsp;' + auditResp + '&nbsp;&nbsp;&nbsp;&nbsp;' + publicLink);
    }

}


function loadSurveyLabels(projectID, numberOfUsers, numberOfQuestions, surveyID, surveyTitle, numberOfResponses, emailLink) {

    var project = '<a id="manageProjectBtn" href="ViewProject?id=' + projectID + '" class="btn btn-default manageQuestionGroupBtn" title="Manage Project">'
                  + '<i class="fa icon-projects text-aqua"></i><span class="hidden-md hidden-sm hidden-xs"> Manage Project</span></a>';

    //var importSurvey = '<a class="showImportQuestionsModal btn btn-default manageQuestionGroupBtn" title="Import questions"><i class="fa fa-download"></i></a>';

    var duplicateSurvey = '<a id="duplicateSurveyBtn" class="duplicateSurveyModal btn btn-default manageQuestionGroupBtn" title="Duplicate This Survey">'
        + '<i class="fa fa-copy text-teal"></i><span class="hidden-md hidden-sm hidden-xs"> Duplicate Survey</span></a>';

    var deleteSurvey = '<a id="deleteSurveyBtn" class="DT_DeleteSurvey btn btn-default" data-id="' + surveyID + '" data-name="' + thisSurvey.SurveyTitle + '" title="Delete This Survey">'
        + '<i class="fa fa-trash text-danger"></i><span class="hidden-md hidden-sm hidden-xs"> Delete Survey</span></a>';

    /*var users = '<a class="btn btn-app2" btn-sm title="Number of actual users"> <span class="badge bg-purple">'
       + numberOfUsers + '</span><i class="fa fa-user"></i></a>';*/

    var users = '<a id="usersBtn" class="btn btn-app2" btn-sm title="Number of actual users"> <span class="badge bg-purple">'
       + numberOfUsers + '</span><i class="fa icon-users text-purple"></i></a>';

    /*var addUser = '<a class="btn btn-default addSurveyUserBtn" title="Add User">'
       + '<i class="fa fa-plus text-purple hidden-md"></i><span class="hidden-xs hidden-sm text-purple"> Add User</span></a>';*/

    var addUser = '<a id="addUserBtn" class="btn btn-default addSurveyUserBtn" title="Add User">'
       + '<i class="fa fa-plus text-purple"></i><span class="hidden-md hidden-sm hidden-xs"> Add User</span></a>';



    /*var question = '<a class="btn btn-app2" title="Number of questions"> <span class="badge bg-teal">'
       + numberOfQuestions + '</span><i class="fa fa-list-alt"></i></a>';*/

    var question = '<a id="questionBtn" class="btn btn-app2" btn-sm title="Number of questions"> <span class="badge bg-orange">'
      + numberOfQuestions + '</span><i class="fa fa-question-circle-o text-orange"></i></a>';


    /*var addQuestion = '<a href="ManageSurveyQuestions?id=' + surveyID + '" class="btn btn-default manageQuestionGroupBtn" title="Manage Questions">'
          + '<span class="text-teal"> Manage Questions</span></a>';*/

    var addQuestion = '<a id="addQuestionBtn" href="ManageSurveyQuestions?id=' + surveyID + '" class="btn btn-default manageQuestionGroupBtn" title="Manage Questions">'
      + '<i class="fa fa-question-circle-o text-orange"></i><span class="hidden-md hidden-sm hidden-xs"> Manage Questions</span></a>';


    /* var responses = '<a class="btn btn-app2" title="Number of responses"> <span class="badge bg-primary">'
        + numberOfResponses + '</span><i class="fa fa-list"></i></a>';*/

    var PageOrQuestion = "Change to " + (!thisSurvey.IsPageView ? "Page" : "Question") + " View";
    var icon = (!!thisSurvey.IsPageView ? 'fa-question-circle-o' : 'fa-list-alt');

    $("#updateSurveyView").data('original-title', PageOrQuestion)
        .html('<i class="fa ' + icon + ' text-purple"></i><span class="hidden-md hidden-sm hidden-xs"> ' + PageOrQuestion + '</span></a>')
        .show();
    initTooltip('box-tools');


    var surTitle = '/' + surveyTitle;
    var survID = '/' + surveyID;
    var name = '/' + user.Firstnames + '%20' + user.Lastname;
    var theme = '/' + user.SelectedSkin;
    var key = '/' + encodeURIComponent(userCode);
    var href = "' + surveyPreviewURL + survID + name + theme + key + '";

    var previewResp = '<a id="ViewSurveyPreview" target="_blank" class="btn btn-default" title="" data-original-title="Preview Survey" '
    + 'href="' + surveyPreviewURL + survID + name + theme + key + '">'
       + '<i class="fa icon-surveys text-teal"></i><span class="hidden-md hidden-sm hidden-xs"> Preview Survey</span></a>';

    var responses = '<a id="responsesBtn" href="#responseDiv" class="btn btn-app2" btn-sm title="Number of responses"> <span class="badge bg-primary">'
      + numberOfResponses + '</span><i class="fa fa-list text-green"></i></a>';

    var viewResponses = '<a id="ViewOriginalResponses" class="btn btn-default" href="#" title="" data-original-title="View Original Responses" >'
       + '<i class="fa fa-list text-green"></i><span class="hidden-md hidden-sm hidden-xs"> Original Responses</span></a>';

    var auditResp = '<a id="ViewResponsesToAuditTop" target="_blank" class="btn btn-default" title="" data-original-title="Audit Responses" '
    + 'href="../Reports/View?report=SurveyResponses&type=xlsx&id=' + surveyID + '">'
       + '<i class="fa fa-table text-green"></i><span class="hidden-md hidden-sm hidden-xs"> Audit Responses</span></a>';

    var publicLink = '';

    if (emailLink.IsEmailed || emailLink.EmailedUserIDForResponses) {
        publicLink = '<a target="_blank" class="btn btn-default" title="" data-original-title="View Public Survey" '
    + 'href="' + publicSurveyURL + emailLink.EmailedUniqueID + surTitle + '">'
       + '<i class="fa fa-link text-aqua"></i><span id="GeneratePublicLinkText" class="hidden-md hidden-sm hidden-xs"> View Public Survey</span></a>';
    }
    else {
        publicLink = '<a id="GeneratePublicLink" target="_blank" class="btn btn-default" title="" data-original-title="Generate Public Link">'
       + '<i class="fa fa-link text-aqua"></i><span id="GeneratePublicLinkText" class="hidden-md hidden-sm hidden-xs"> Generate Public Link</span></a>';
    }


    var lbls = $('#surveyLabels');
    if (lbls) {
        lbls.html(project + '&nbsp;&nbsp;' + duplicateSurvey + '&nbsp;&nbsp;' + addUser + '&nbsp;&nbsp;'
           + users + '&nbsp;&nbsp;&nbsp;&nbsp;' + addQuestion + '&nbsp;&nbsp;' + question + '&nbsp;&nbsp;' + previewResp + '&nbsp;&nbsp;' + responses
            + '&nbsp;&nbsp;&nbsp;&nbsp;' + viewResponses + '&nbsp;&nbsp;' + auditResp + '&nbsp;&nbsp;' + deleteSurvey + '&nbsp;&nbsp;' + publicLink);
    }


}

//StartSurvey(string secretKey, string companyID, string surveyID)
function StartSurvey() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose roles you want to view.");
        return false;
    }

    var surveyID = getQueryParameter('id');

    if (typeof surveyID == "undefined" || surveyID == null || surveyID.length <= 0) {
        ShowErrorModal("Could not find project id to update.");
        return false;
    }

    var methodName = "StartSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        surveyID: surveyID
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

                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //User deactivated
                    ShowSuccessModal("Survey has been started.");
                    GetThisSurvey();
                }
            }
        },
        error: function (a, e, d) {
            //ShowModal(e + ' ' + d, "Error Occured.");
        }
    });
}

//EndSurvey(string secretKey, string companyID, string surveyID)
function EndSurvey() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose roles you want to view.");
        return false;
    }

    var surveyID = getQueryParameter('id');

    if (typeof surveyID == "undefined" || surveyID == null || surveyID.length <= 0) {
        ShowErrorModal("Could not find project id to update.");
        return false;
    }

    var methodName = "EndSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        surveyID: surveyID
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

                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //User deactivated
                    ShowSuccessModal("Survey has been ended.");
                    GetThisSurvey();
                }
            }
        },
        error: function (a, e, d) {
            //ShowModal(e + ' ' + d, "Error Occured.");
        }
    });
}


function GetSurveysForImport() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose surveys you want to view.");
        return false;
    }

    var methodName = "GetAllSurveysForMyCompany";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        getAll: true
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
                var surveysToImportList = $('#surveysToImportList');
                projSurveys = JSON.parse(data.RRZResult);
                var surv, sStart, sEnd, survOpt;


                for (var i = 0; i < projSurveys.length; i++) {
                    surv = projSurveys[i];
                    sStart = surv.StartDate ? surv.StartDate.DateWCF() : 'Has not Started';
                    sEnd = surv.EndDate ? surv.StartDate.DateWCF() : 'Has not Ended';
                    survOpt = '<option value="' + surv.SurveyID + '">' + surv.SurveyTitle + ' (' + sStart + ' - ' + sEnd + ')</option>';

                    surveysToImportList.append(survOpt);
                    //$('#importQuestionsModal').modal('show');
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

//DuplicateSurvey(secretKey, fromSurveyID, surveyTitle, purpose)
function DuplicateSurvey() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose surveys you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    var survTitle = $('#duplicatSurveyTitle').val();
    //var survPurpose = $('#duplicatSurveyPurpose').val();
    var survPurpose = CKEDITOR.instances.duplicatSurveyPurpose.getData();
    var surveyConclusion = CKEDITOR.instances.duplicatSurveyConclusion.getData();

    //DuplicateSurvey(secretKey, fromSurveyID, surveyTitle, purpose)
    var methodName = "DuplicateSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        fromSurveyID: survID,
        surveyTitle: survTitle,
        purpose: survPurpose,
        conclusion: surveyConclusion,
        isPageView: 'true',
        theme: ''
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
                    ShowErrorModal(error, false, $('#duplicateSurveyModal'));
                    return;
                }
                //TODO
                var response = JSON.parse(data.RRZResult);
                ShowSuccessModal('Team has been successfully imported');
                if (response.NewSurveyID) {
                    window.location = "ViewSurvey?id=" + response.NewSurveyID;
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

//DeleteSurvey(string secretKey, string surveyID)
function DeleteSurvey(surveyID) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (!surveyID) {
        surveyID = getQueryParameter('id');
    }

    if (typeof surveyID == "undefined" || surveyID == null || surveyID.length <= 0) {
        ShowErrorModal("Could not find survey id to delete.");
        return false;
    }

    var methodName = "DeleteSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        surveyID: surveyID
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

                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //User deactivated
                    ShowSuccessModal("Survey has been deleted.");
                    window.location = './Surveys';
                }
            }
        },
        error: function (a, e, d) {
            //ShowModal(e + ' ' + d, "Error Occured.");
        }
    });
}


function EnableOverview() {
    $('#viewSurveyOverview').show();
    $('#editSurveyOverview').hide();
    $('#surveyOverviewFooter').show('800');

    var overviewBox = $('#surveyOverview');
    EnableElements(overviewBox.find('input, select'));

    try {
        //CKEDITOR
        ckSurveyPurpose.setReadOnly(false);
    }
    catch (ex) {
    }
    try {
        //CKEDITOR
        ckSurveyConclusion.setReadOnly(false);
    }
    catch (ex) {
    }
}

function DisableOverview() {
    $('#viewSurveyOverview').hide();
    if ($($('#surveyOverviewBox a')[0]).hasClass('collapsed'))
        $('#editSurveyOverview').hide();
    else
        $('#editSurveyOverview').show();
    $('#surveyOverviewFooter').hide('800');

    var overviewBox = $('#surveyOverview');
    DisableElements(overviewBox.find('input, select'));


    try {
        //CKEDITOR
        ckSurveyPurpose.setReadOnly(true);
    }
    catch (ex) {
    }
    try {
        //CKEDITOR
        ckSurveyConclusion.setReadOnly(true);
    }
    catch (ex) {
    }
}

function getCurrentProject(projID) {
    var proj;
    for (var i = 0; i < projList.length; i++) {
        proj = projList[i];
        if (proj.ID == projID) {
            curProject = proj;
            return;
        }
    }
    return null;
}

function UpdateSurveyOverview() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find project id to update.");
        return false;
    }

    //get all the details
    var surveyTitle = $('#surveyTitle').val();
    var themePrimary = $('#themePrimary').val();
    var themeSecondary = $('#themeSecondary').val();
    var headerColor = $('#headerColor').val();
    var controlColor = $('#controlColor').val();
    var buttonColor = $('#buttonColor').val();
    var submitButtonColor = $('#submitButtonColor').val();
    var surveyTheme = '';
    if (themePrimary && themeSecondary) {
        surveyTheme = JSON.stringify({
            PrimaryColor:themePrimary,
            SecondaryColor: themeSecondary,
            HeaderColor: headerColor,
            ControlColor: controlColor,
            ButtonColor: buttonColor,
            SubmitButtonColor: submitButtonColor
        })
    }
    var surveyPurpose = CKEDITOR.instances.surveyPurpose.getData();
    var surveyConclusion = CKEDITOR.instances.surveyConclusion.getData();

    var methodName = "UpdateSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID,
        surveyTitle: surveyTitle, purpose: surveyPurpose, conclusion: surveyConclusion,
        isPageView: 'true', theme: surveyTheme
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
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Project updated
                    ShowSuccessModal("Survey <strong>" + surveyTitle + "</strong> has been updated.");

                    DisableOverview();

                    GetThisSurvey();
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function UpdateSurveyView() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find project id to update.");
        return false;
    }

    //get all the details

    var methodName = "UpdateSurveyView";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID,
        isPageView: !thisSurvey.IsPageView,
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
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Project updated
                    ShowSuccessModal("Survey has been updated.");

                    GetThisSurvey();
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function GetSurveyTeam() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose team you want to view.");
        return false;
    }

    if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
        ShowErrorModal("Could not find a project to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find a survey to view.");
        return false;
    }

    var getAll = $('#x1').is(':checked');

    var methodName = "GetTeamMembersForSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        projectID: projID,
        surveyID: survID,
        getAll: getAll
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

                GetNonTeamUsers();

                TeamMembers = JSON.parse(data.RRZResult);
                loadEmailLinkUsersDDL();
                var member;

                $('#tblTeamItems').dataTable().fnClearTable();
                for (var i = 0; i < TeamMembers.length; i++) {
                    member = TeamMembers[i];
                    var active = null;
                    if (!member.IsActive) {
                        active = DT_AddCustom(member.UserId, 'fa fa-user-plus', 'DT_EvokeTeamActivate btn text-green', 'Activate user');
                    }
                    else {
                        active = DT_AddCustom(member.UserId, 'fa fa-user-times', 'DT_EvokeTeamDeactivate btn text-yellow', 'Deactivate user');
                    }
                    var ComReg = '';
                    /*
                    var ComReg = null;
                    if (member.CompletedRegistration) {
                       ComReg = ''
                    } else {
                       ComReg = DT_AddCustom(member.UserId, 'fa fa-warning', 'text-red', 'This user has not completed registration');
                    }
                    */

                    member.Firstnames = member.Firstnames ? member.Firstnames : '';
                    member.Lastname = member.Lastname ? member.Lastname : '';

                    $('#tblTeamItems')
                        .dataTable()
                        .fnAddData(
                               [
                                   {
                                       "0": member.Firstnames + ' ' + member.Lastname,
                                       "1": member.RoleName,
                                       "2": member.Email,
                                       "3": member.ContactNumber,
                                       "4": /*'<a href="/Administration/Users?id=' + member.UserId + '" title="Edit User">' + DT_AddCustom(member.UserId, 'fa fa-pencil btn text-black', 'DT_EvokeView') + '</a>' + ' ' +*/
                                          active + ' ' +
                                          DT_AddCustom(member.UserId, 'fa fa-trash-o btn text-black', 'DT_EvokeTeamDelete', 'Remove team user from survey') + ' ' +
                                          ComReg,
                                       "DT_RowId": "" + member.UserId,
                                   }
                               ]
                           );

                    //'<a class="btn" href="/Administration/Users?id=' + proj.ID + '" title="Edit User">' + DT_AddCustom(member.UserId, 'fa fa-pencil btn', 'DT_EvokeView') + '</a>'
                    //DT_AddCustom(appr.key, appr.icon, appr.cssClass, appr.toolTip) +' '+
                }
                $('#tblTeamItems tr').click(function (event) {
                    if ($(event.originalEvent.target).closest('td')[0] == $(event.originalEvent.target).closest('tr')[0].lastChild) return;

                    location.href = "/Administration/Users?id=" + event.currentTarget.id;
                });
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}


function loadNonTeamUsersDDL() {
    var ddl = $('#availableUsers');
    ddl.children().remove();
    for (var i = 0; i < nonTeamUserForSurv.length; i++) {
        person = nonTeamUserForSurv[i];

        if (person.Firstnames || person.Lastname) {
            opt = $('<option></option>')
            .val(person.UserId)
            .text(person.Firstnames + ' ' + person.Lastname);
            ddl.append(opt);
        }
        else {
            opt = $('<option></option>')
            .val(person.UserId)
            .text(person.Email);
            ddl.append(opt);
        }

    }
    if (nonTeamUserForSurv.length == 0) {
        // No available users can be added to the drop down list

        opt = $('<option></option>')
           .val('')
           .text('No available users');
        ddl.append(opt);
    }
}

function GeneratePublicLink() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find a survey to view.");
        return false;
    }

    var userID = $('#emailLinkUsers').val();
    if (!userID) {
        ShowErrorModal("Please select a user for responses to be completed by.");
        return false;
    }

    var methodName = "GenerateSurveyEmailLink";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        surveyID: survID,
        userID: userID
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
                var result = JSON.parse(data.RRZResult);

                //  TODO    Recreate generate link btn
                var btn = $('#GeneratePublicLink');
                var url = decodeURI(result.SurveyLink);
                btn.attr('href', url);
                btn.removeAttr('id');
                $('#GeneratePublicLinkText').text('View Public Survey');
                $('#GenerateSurveyEmailLinkModal').modal('hide');
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function GetEmailLinkUsers() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose team you want to view.");
        return false;
    }

    if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
        ShowErrorModal("Could not find a project to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find a survey to view.");
        return false;
    }

    var methodName = "GetTeamMembersForSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        projectID: projID,
        surveyID: survID,
        getAll: true
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
                TeamMembers = JSON.parse(data.RRZResult);
                loadEmailLinkUsersDDL();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function loadEmailLinkUsersDDL() {
    var ddl = $('#emailLinkUsers');
    ddl.children().remove();
    for (var i = 0; i < TeamMembers.length; i++) {
        person = TeamMembers[i];

        if (person.Firstnames || person.Lastname) {
            opt = $('<option></option>')
            .val(person.UserId)
            .text(person.Firstnames + ' ' + person.Lastname);
            ddl.append(opt);
        }
        else {
            opt = $('<option></option>')
            .val(person.UserId)
            .text(person.Email);
            ddl.append(opt);
        }
    }
    if (TeamMembers.length == 0) {
        // No available users can be added to the drop down list

        opt = $('<option></option>')
           .val('')
           .text('No available users');
        ddl.append(opt);
    }
}

function GetNonTeamUsers() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
        ShowErrorModal("Could not find project to check for.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    var methodName = "GetActiveProjectUsersNotInSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        projectID: projID,
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

                nonTeamUserForSurv = JSON.parse(data.RRZResult);
                loadNonTeamUsersDDL();
            }
        },
        error: function (a, e, d) {
            //ShowModal(e + ' ' + d, "Error Occured.");
        }
    });
}

function AddTeamMemberToSurvey() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    //get all the details
    var selectedUser = $('#availableUsers').find(':selected');
    var userID = selectedUser.val();
    var userName = selectedUser.html();

    if (!userID) {
        $('#addSurveyUserModalError').html('Select a user to add');
        return false;
    }

    var methodName = "AddTeamMemberToSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID,
        userID: userID
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
                    ShowErrorModal(error, false, $('#addSurveyUserModal'));
                    return false;
                }
                $('#addSurveyUserModal').modal('hide');
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Project updated
                    var proj = projName ? "Project: <strong>" + projName + "</strong>." : "this project.";
                    ShowSuccessModal("User: <strong>" + userName + "</strong> has been added to " + proj);
                    GetSurveyTeam();
                    GetThisSurvey();
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d, false, $('#addSurveyUserModal'));
        }
    });
}

//DeactivateTeamMemberForSurvey(string secretKey, string companyID, string surveyID, string userID)
function DeactivateTeamUser(userID) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose roles you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    if (typeof userID == "undefined" || userID == null) {
        ShowErrorModal("Please select user you want to view.");
        return false;
    }

    var methodName = "DeactivateTeamMemberForSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        surveyID: survID,
        userID: userID
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

                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //User deactivated
                    ShowSuccessModal("User has been deactivated.");
                }
                GetSurveyTeam();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}


//ReactivateTeamMemberForSurvey(string secretKey, string companyID, string surveyID, string userID)
function ActivateTeamUser(userID) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose roles you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    if (typeof userID == "undefined" || userID == null) {
        ShowErrorModal("Please select user you want to reactivate.");
        return false;
    }

    var methodName = "ReactivateTeamMemberForSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        surveyID: survID,
        userID: userID
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

                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //User deactivated
                    ShowSuccessModal("User has been activated.");
                }
                GetSurveyTeam();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

//RemoveTeamMemberFromSurvey(string secretKey, string companyID, string surveyID, string userID)
function RemoveTeamUser(userID) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose roles you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    if (typeof userID == "undefined" || userID == null) {
        ShowErrorModal("Please select user you want to view.");
        return false;
    }

    var methodName = "RemoveTeamMemberFromSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        surveyID: survID,
        userID: userID
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

                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //User activated
                    ShowSuccessModal("User has been removed from project.");
                }
                GetSurveyTeam();
                GetThisSurvey();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d, "Error Occured.");
        }
    });
}


//GetResponseStats(secretKey, surveyID)
function GetResponseStats() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }
    var resp = $('#ViewResponsesToAudit');
    if (resp) {
        resp.attr('href', "../Reports/View?report=SurveyResponses&type=xlsx&id=" + survID);
    }

    //GetResponseStats(secretKey, surveyID)
    var methodName = "GetResponseStats";
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
                var response = JSON.parse(data.RRZResult);
                $('#NumOfUploadedResponses').html(response.NumOfUploadedResponses);
                $('#NumOfAuditedResponses').html(response.NumOfAuditedResponses);
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}


//CopyResponsesToAudit(secretKey, surveyID)
function CopyResponsesToAudit() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    //CopyResponsesToAudit(secretKey, surveyID)
    var methodName = "CopyResponsesToAudit";
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
                GetResponseStats();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function initGroupSortable() {
    var sortableDiv = $(".sortableDiv");

    if (typeof (sortableDiv.sortable) == 'function') {
        //sortableDiv UI sortable for the todo list
        sortableDiv.sortable({
            placeholder: "sort-highlight",
            handle: ".box-header",
            forcePlaceholderSize: true,
            zIndex: 999999,
            opacity: 0.5,
            scroll: true,
            scrollSensitivity: 10
        });
        $(".sortableDiv .box-header").css("cursor", "move");
    }

    /*
    //Make the dashboard widgets sortable Using jquery UI
    $(".connectedSortable").sortable({
       placeholder: "sort-highlight",
       connectWith: ".connectedSortable",
       handle: ".box-header, .nav-tabs",
       forcePlaceholderSize: true,
       zIndex: 999999
    });
    $(".connectedSortable .box-header, .connectedSortable .nav-tabs-custom").css("cursor", "move");
 
    //jQuery UI sortable for the todo list
    $(".todo-list").sortable({
       placeholder: "sort-highlight",
       handle: ".handle",
       forcePlaceholderSize: true,
       zIndex: 999999
    });
    */

}

function initInnerGroupSortable() {
    var groupListDiv = $(".groupList");

    if (typeof (groupListDiv.sortable) == 'function') {
        //jQuery UI sortable for the todo list
        groupListDiv.sortable({
            placeholder: "sort-highlight",
            handle: ".box-header",
            forcePlaceholderSize: true,
            zIndex: 999999,
            opacity: 0.5,
            scroll: true,
            scrollSensitivity: 10
        });
        $(".groupList .box-header").css("cursor", "move");
    }
}

function initQuestionSortable() {
    var questionListDiv = $(".questionList");

    if (typeof (questionListDiv.sortable) == 'function') {
        //jQuery UI sortable for the todo list
        questionListDiv.sortable({
            placeholder: "sort-highlight",
            handle: ".handle",
            forcePlaceholderSize: true,
            zIndex: 999999,
            opacity: 0.5,
            scroll: true,
            scrollSensitivity: 10
        });
        $(".questionList .handle").css("cursor", "move");
    }
}

function initQuestionRowSortable() {
    var questionRowListDiv = $(".rowList");

    if (typeof (questionRowListDiv.sortable) == 'function') {
        //jQuery UI sortable for the todo list
        questionRowListDiv.sortable({
            placeholder: "sort-highlight",
            handle: ".handle",
            forcePlaceholderSize: true,
            zIndex: 999999,
            opacity: 0.5,
            scroll: true,
            scrollSensitivity: 10
        });
        $(".rowList .handle").css("cursor", "move");
    }
}
//string CreateQuestionGroup(string secretKey, string companyID, string groupType, string groupName, string surveyID, string parentGroupID)

function createQuestionGroup(modal, gr) {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    //get all the details

    var methodName = "CreateQuestionGroup";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID,
        groupName: gr.groupName, groupType: gr.groupType, parentGroupID: gr.parentGrID, groupHeading: gr.groupHeading
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
                    if (modal) {
                        ShowErrorModal(error, false, modal);
                    }
                    else {
                        ShowErrorModal(error);
                    }
                    return false;
                }
                var response = JSON.parse(data.RRZResult);
                modal.modal('hide');
                if (response.Status == 'Success') {
                    //Project updated
                    if (gr.parentGrID)
                        ShowSuccessModal("Group: <strong>" + gr.groupName + "</strong> has been added.");
                    else
                        ShowSuccessModal("Page: <strong>" + gr.groupName + "</strong> has been added.");

                    $('#groupName').val('');
                    $('#innerGroupName').val('');

                    GetGroupsAndQuestionsForSurvey(response.ID);
                    //Group will either be on the top level or within another
                    /*
                    var parentDiv = gr.parentGrID? getGroupDivByID(gr.parentGrID) : $('#groupList');
     
                    var group = {
                       GroupID: response.ID,
                       GroupName: gr.groupName,
                       GroupType: gr.groupType,
                       GroupPosition: surveyGroups.length
                    }
                    surveyGroups.push(group);
     
                    //Add new group to the DOM
                    makeGroupBox(parentDiv, group);
     
                    //If this Survey or nested Group was empty, remove the empty placeholder
                    var empty = parentDiv.find('.emptyQuestions');
                    if (empty) {
                       empty.detach();
                       empty.remove();
                    }
                    */
                }
            }
        },
        error: function (a, e, d) {
            if (modal) {
                ShowErrorModal(e + ' ' + d, false, modal);
            }
            else {
                ShowErrorModal(e + ' ' + d);
            }
        }
    });
}

//string UpdateQuestionGroup(string secretKey, string companyID, string groupID, string groupName)
function updateQuestionGroup(btn) {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    var gr = $(btn).closest('.box');
    var grID = gr.data('id');
    var grT = $(btn).closest('.myGroupTitle')

    var grTitle = '';
    var grTitle1 = grT.find('input.view');
    var grTitle2 = grT.find('input.edit');

    grTitle = grTitle1.length > 0 ? grTitle1 : grTitle2;
    var groupName = grTitle.val();

    var groupHead = '';
    var grHead = gr.find('input.tableH');
    if (grHead) {
        groupHead = grHead.val();
    }

    var methodName = "UpdateQuestionGroup";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, groupID: grID,
        groupName: groupName, groupHeading: groupHead
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

                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Group updated

                    grTitle.attr('readonly', 'readonly').attr('disabled', 'disabled');
                    grTitle.removeClass('edit').addClass('view');

                    gr.find('.GT_Edit').show();
                    gr.find('.GT_Save').hide();
                    gr.find('.GT_Cancel').hide();

                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}


//string RemoveQuestionGroup(string secretKey, string companyID, string groupID)
function removeQuestionGroup(grID, groupName) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    //get all the details
    var methodName = "RemoveQuestionGroup";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID, groupID: grID
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
            $('#questionModal').modal('hide');
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);

                    if (error = "This group cannot be removed because there are questions assigned to it") {
                        //groupName
                        $('#groupNameToDelete').html(groupName);
                        $('#deleteGroupAndQuestionsBtn').attr('data-grid', grID).attr('data-grname', groupName).data('grid', grID).data('grname', groupName);
                        $('#deleteGroupModal').modal();
                    }
                    else {
                        ShowErrorModal(error);
                    }
                    return false;
                }
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Group removed
                    ShowSuccessModal("Group: <strong>" + groupName + "</strong> has been removed.");
                    GetGroupsAndQuestionsForSurvey();
                }
            }
        },
        error: function (a, e, d) {
            $('#questionModal').modal('hide');
            ShowErrorModal(e + ' ' + d);
        }
    });
}


//string RemoveQuestionGroupAndQuestions(string secretKey, string companyID, string groupID)
function removeQuestionGroupAndQuestions(grID, groupName) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    //get all the details
    var methodName = "RemoveQuestionGroupAndQuestions";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID, groupID: grID
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
            $('#deleteGroupModal').modal('hide');
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);

                    if (error = "This group cannot be removed because there are questions assigned to it") {
                        //groupName
                        $('#groupNameToDelete').html(groupName);
                        $('#deleteGroupModal').modal();
                    }
                    else {
                        ShowErrorModal(error, false, $('#deleteGroupModal'));
                    }
                    return false;
                }
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Group removed
                    ShowSuccessModal("Group: <strong>" + groupName + "</strong> has been removed.");
                    GetGroupsAndQuestionsForSurvey();
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d, false, $('#deleteGroupModal'));
        }
    });
}


//string GetGroupsAndQuestionsForSurvey(string secretKey, string companyID, string surveyID)
function GetGroupsAndQuestionsForSurvey(groupToNavigateTo) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    var methodName = "GetGroupsAndQuestionsForSurvey";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID
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

                surveyGroups = JSON.parse(data.RRZResult);

                //All Groups are on the top level (Subgroups are within)
                var parentDiv = $('#groupList');
                if (surveyGroups.length > 0) {
                    parentDiv.children().remove();
                }

                for (var i = 0; i < surveyGroups.length; i++) {
                    var gr = surveyGroups[i];
                    if (gr.Piping && gr.Piping.pipingConditions) {
                        gr.Piping.pipingConditions = JSON.parse(gr.Piping.pipingConditions);

                    }
                    //Add new group to the DOM
                    var newGrDiv = makeGroupBox(parentDiv, gr);
                    var listDiv1, listDiv2;

                    //Add piping labels
                    //gr.GroupID
                    var pipConDiv = newGrDiv.find('.pipingConditionDiv');

                    // don't add to subgroups
                    if (pipConDiv.length > 1) {
                        var thisPipConDiv, thisPipBox, thisPipBoxID;
                        for (var i = 0; i < pipConDiv.length; i++) {
                            thisPipConDiv = $(pipConDiv[i]);
                            thisPipBox = $(thisPipConDiv.closest('.box'));
                            thisPipBoxID = thisPipBox.data('id');

                            if (thisPipBoxID !== gr.GroupID) {
                                pipConDiv.splice(i, 1);
                            }
                        }
                    }
                    var bBody = $(pipConDiv).closest('.box-body');
                    makePipingConLabels(gr, pipConDiv);
                    if (gr.Piping) {
                        bBody.find('selected').val(gr.Piping.Show);
                    }

                    if (gr.GroupType == "Page") {
                        listDiv1 = (newGrDiv.find('.groupList'));
                    }
                    else if (gr.GroupType == "Table") {
                        listDiv1 = (newGrDiv.find('.questionList'));
                        listDiv2 = (newGrDiv.find('.rowList'));
                    }
                    else {
                        listDiv1 = (newGrDiv.find('.questionList'));
                    }
                    if (i == 0) {
                        //newGrDiv.scrollIntoView();
                        listDiv1.focus();
                    }

                    if (gr.Questions.length > 0 || gr.Rows.length > 0) {
                        for (var j = 0; j < gr.Questions.length; j++) {
                            var question = gr.Questions[j];
                            question.ParentGroupID = gr.GroupID;
                            makeQuestionRow(listDiv1, question.QuestionPosition, question);
                        }
                        if (gr.Questions.length > 0) {
                            //If this Survey or nested Group was empty, remove the empty placeholder
                            var empty = listDiv1.parent().find('.emptyQuestions');
                            if (empty) {
                                empty.detach();
                                empty.remove();
                            }
                        }
                        for (var k = 0; k < gr.Rows.length; k++) {
                            var row = gr.Rows[k];
                            row.ParentGroupID = gr.GroupID;
                            makeTableRow(listDiv2, row.RowPosition, row);
                        }
                        if (gr.Rows.length > 0) {
                            //If this Survey or nested Group was empty, remove the empty placeholder
                            var empty = listDiv2.parent().find('.emptyQuestions');
                            if (empty) {
                                empty.detach();
                                empty.remove();
                            }
                        }
                    }
                    else if (gr.Subgroups.length > 0) {
                        for (var j = 0; j < gr.Subgroups.length; j++) {
                            var gr2 = gr.Subgroups[j];
                            if (gr2.Piping && gr2.Piping.pipingConditions) {
                                gr2.Piping.pipingConditions = JSON.parse(gr2.Piping.pipingConditions);
                            }
                            var newGrDiv2 = makeGroupBox(listDiv1, gr2);
                            //Add piping labels
                            //gr.GroupID
                            var pipConDiv = newGrDiv2.find('.pipingConditionDiv');
                            makePipingConLabels(gr2, pipConDiv);

                            var bBody = $(pipConDiv).closest('.box-body');
                            if (gr2.Piping) {
                                bBody.find('selected').val(gr2.Piping.Show);
                            }
                            //Add new group to the DOM
                            var innerListDiv1, innerListDiv2;

                            if (gr2.GroupType == "Table") {
                                innerListDiv1 = (newGrDiv2.find('.questionList'));
                                innerListDiv2 = (newGrDiv2.find('.rowList'));
                            }
                            else {
                                innerListDiv1 = (newGrDiv2.find('.questionList'));
                            }

                            for (var k = 0; k < gr2.Questions.length; k++) {
                                var question2 = gr2.Questions[k];
                                makeQuestionRow(innerListDiv1, question2.QuestionPosition, question2);
                            }
                            if (gr2.Questions.length > 0) {
                                //If this Survey or nested Group was empty, remove the empty placeholder
                                var empty = innerListDiv1.parent().find('.emptyQuestions');
                                if (empty) {
                                    empty.detach();
                                    empty.remove();
                                }
                            }

                            for (var l = 0; l < gr2.Rows.length; l++) {
                                var row = gr2.Rows[l];
                                row.ParentGroupID = gr2.GroupID;
                                makeTableRow(innerListDiv2, row.RowPosition, row);
                            }
                            if (gr2.Rows.length > 0) {
                                //If this Survey or nested Group was empty, remove the empty placeholder
                                var empty = innerListDiv2.parent().find('.emptyQuestions');
                                if (empty) {
                                    empty.detach();
                                    empty.remove();
                                }
                            }
                        }

                        if (gr.Subgroups.length > 0) {
                            //If this Survey or nested Group was empty, remove the empty placeholder
                            var empty = listDiv1.find('.emptyQuestions');
                            if (empty) {
                                var innerBoxEmpties = listDiv1.find('.box').find('.emptyQuestions');
                                empty = empty.not(innerBoxEmpties);

                                empty.detach();
                                empty.remove();
                            }
                        }
                    }
                }

                $('#groupList .dropdown-toggle').dropdown();

                /*
                var pipingShowHideDDLs = $(document).find('select.pipingShowHide');
                var slct, showHide;
                for (var i = 0; i < pipingShowHideDDLs.length; i++) {
                   slct = $(pipingShowHideDDLs[i]);
                   showHide = slct.data('show');
                   slct[0].value = showHide;
                }
                */

                initTooltip();
                initGroupSortable();
                initInnerGroupSortable();
                initQuestionSortable();
                initQuestionRowSortable();

                if (groupToNavigateTo) { document.getElementById(groupToNavigateTo).scrollIntoView(); }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}


// GetSurveyQuestionNotInGroup(string secretKey, string companyID, string surveyID, string groupID)
function GetSurveyQuestionNotInGroup(grID) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find a survey to view.");
        return false;
    }

    var methodName = "GetSurveyQuestionNotInGroup";
    var jsonData = JSON.stringify({
        secretKey: userCode,
        companyID: curComp.compID,
        surveyID: survID,
        groupID: grID
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
                pipingQs = JSON.parse(data.RRZResult);

                var qDDL = $('#PipingConditionDDL');
                qDDL.children().remove();
                var gr, grName;
                var q, optStr = '<option> </option>';
                for (var i = 0; i < pipingQs.length; i++) {
                    grName = '';
                    q = pipingQs[i];
                    gr = getGroupByID(q.GroupID);
                    if (gr) { grName = gr.GroupName.substring(0, 15) + ' - '; }
                    optStr += '<option data-typeid="' + q.QuestionTypeID + '" value="' + q.QuestionID + '">' + grName + q.QuestionText + '</option>';
                }
                qDDL.html(optStr);

                var pipingModal = $('#addGroupPipingConditionModal');
                pipingModal.attr('data-grid', grID).data('grid', grID);
                pipingModal.modal();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function makeConditionLabel(order, item) {
    /*
    item.qCondition: 
       less
       lessEqual
       equal
       moreEqual
       more
    */
    var btnText, btnTitle;
    if (item.qText.length > 5) {
        btnText = item.qText.substring(0, 3) + '... ';
    } else {
        btnText = item.qText + ' ';
    }
    btnTitle = item.qText + ' ';

    switch (item.qCondition) {
        case 'less':
            btnText += '< ';
            btnTitle += '< ';
            break;
        case 'lessEqual':
            btnText += '<= ';
            btnTitle += '<= ';
            break;
        case 'equal':
            btnText += '= ';
            btnTitle += '= ';
            break;
        case 'moreEqual':
            btnText += '>= ';
            btnTitle += '>= ';
            break;
        case 'more':
            btnText += '> ';
            btnTitle += '> ';
            break;
    }

    if (typeof (item.pipingValueText) != 'undefined') {
        if (item.qText.length > 5) {
            btnText += item.pipingValueText.substring(0, 3) + '... ';
        } else {
            btnText += item.pipingValueText;
        }
        btnTitle += item.pipingValueText;
    } else {
        if (item.qText.length > 5) {
            btnText += item.pipingValue.substring(0, 3) + '... ';
        } else {
            btnText += item.pipingValue;
        }
        btnTitle += item.pipingValue;
    }


    return ('&nbsp;<span class="label label-info label-lg" data-order="' + order + '" title="' + btnTitle + '">&nbsp;' + btnText + '&nbsp;<span class="label-btn">' +
             '<i class="glyphicon glyphicon-remove removeLabel" data-order="' + order + '"></i></span>');
}

function makeCalcConditionLabel(order, item) {
    /*
    item.qCondition: 
       less
       lessEqual
       equal
       moreEqual
       more
 
       GroupID,QuestionID,QuestionText,QuestionType,QuestionTypeID
       QuestionType Numerical"
    */
    var btnText, btnTitle;
    if (item.QuestionText.length > 5) {
        btnText = item.QuestionText.substring(0, 3) + '... ';
    } else {
        btnText = item.QuestionText + ' ';
    }
    btnTitle = item.QuestionText;


    var gr, grTxt = '';
    gr = getGroupByID(item.GroupID);
    if (gr && gr.GroupName) { grTxt = gr.GroupName + ' - '; }
    else { grTxt = ''; }

    return ('&nbsp;<span class="label label-info label-lg" data-order="' + order + '" title="' + grTxt + btnTitle + '">&nbsp;' + btnText + '&nbsp;<span class="label-btn">' +
             '<i class="glyphicon glyphicon-remove removeLabel" data-order="' + order + '"></i></span>');
}

//public string MoveQuestionGroup(string secretKey, string companyID, string groupIDToMove, string groupIDBelow)
//groupIDToMove - the ID of the group that is being moved
//groupIDBelow - the ID of the group that is below the group that is being moved (null if the new group is moved right to the bottom

function MoveQuestionGroup(groupToMove, groupBelow) {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }


    var groupIDToMove = groupToMove.data('id');
    var groupIDBelow = null;
    if (groupBelow) {
        groupIDBelow = groupBelow.data('id');
    }

    var methodName = "MoveQuestionGroup";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID,
        groupIDToMove: groupIDToMove, groupIDBelow: groupIDBelow
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
                    $(".sortableDiv").sortable("cancel");
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return false;
                }

                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Group order updated
                    GetGroupsAndQuestionsForSurvey(groupIDToMove);
                }
            }
        },
        error: function (a, e, d) {
            $(".sortableDiv").sortable("cancel");
            ShowErrorModal(e + ' ' + d);
        }
    });
}
//questionList
function getGroupDivByID(GrID) {
    var grBox = $('#groupList').find('.box[data-id="' + GrID + '"]');

    return grBox.find('.groupList');
}

function getQuestionDivByID(GrID) {
    var grBox = $('#groupList').find('.box[data-id="' + GrID + '"]');

    return grBox.find('.questionList');
}

function makeGroupBox(container, group) {
    /*
 
    var group = {
                   GroupID: response.ID,
                   GroupName: groupName,
                   GroupType: groupType,
                   GroupPosition: surveyGroups.length
                }
 
                ["Page", "Table", "Normal"]
    */
    // ZIBA ROXY
    var newBox = null;
    switch (group.GroupType) {
        case "Page":
            newBox = makePageGroupBox(group);
            break;
        case "Table":
            newBox = makeTableGroupBox(group);
            break;
        case "Normal":
            newBox = makeNormalGroupBox(group);
            break;
    }

    if (container) {
        container.append(newBox);
        return newBox;
    }
}

function makePageGroupBox(group) {
    var show = 'none';
    if (group.Piping) { show = group.Piping.Show; }
    var pipingDiv = makePipingBox(show, true);
    //pipingDiv +        this was after    <!-- /.box-header -->      and before    <div class="box-body">

    var newBox = $('<div>')
       .addClass('box box-page box-solid ' + (isCollapsed(group.GroupID) ? '' : 'collapsed-box'))
       .attr('data-index', group.GroupPosition)
       .attr('id', group.GroupID)
       .attr('data-id', group.GroupID)
       .html('<div class="box-header with-border">' +
       '<div class="col-xs-11 col-md-8 col-lg-6">' +
       '<div class="myGroupTitle">' +
       '<a class="btn btn-sm btn-default" data-widget="collapse" title="Expand"><i class="' + (isCollapsed(group.GroupID) ? 'fa fa-arrow-down' : 'fa fa-arrow-right') + '"></i></a>&nbsp;' +
       (group.ParentGroupID ? 'Section-' : 'Page-') + '<input class="view" value="' + group.GroupName + '"/>&nbsp;' +
       '<a class="btn btn-xs btn-flat btn-default GT_Edit" title="Edit Name"><i class="fa fa-pencil"></i></a>' +
       '<a class="btn btn-xs btn-flat btn-success GT_Save" style="display: none;"><i class="fa fa-check"></i></a>&nbsp;' +
       '<a class="btn btn-xs btn-flat btn-danger GT_Cancel" style="display: none;"><i class="fa fa-times"></i></a>' +
       '</div>' +
       '</div>' +
       '<div class="box-tools pull-right">' +
       makePageDropdown(group.GroupID) +
       '</div>' +
       '<!-- /.box-tools -->' +
       '</div>' +
       '<!-- /.box-header -->' +
       '</div>' +
       pipingDiv +
       '<div class="box-body">' +
       '<div class="col-xs-12 groupList ui-sortable" class="box-body sortableDiv">' +
       '<div class="emptyQuestions">' +
       '<span class="icon"><i class="fa fa-list-alt text-warning"></i></span>' +
       '<span class="header">No section yet</span>' +
       '<span class="subheader">Tap \'Add Section\' below to add a section</span>' +
       '</div>' +
       '</div>' +
       '</div>' +
       '<!-- /.box-body -->' +
       '<div class="box-footer text-center">' +
       '<a class="qGroupBtn btn btn-info btn-flat" title="Add inner section" data-id="' + group.GroupID + '">Add Section</a>' +
       '</div>');

    return newBox;
}

function makeTableGroupBox(group) {
    var show = 'none';
    if (group.Piping) { show = group.Piping.Show; }
    var pipingDiv = makePipingBox(show, false);
    //pipingDiv +        this was after    <!-- /.box-header -->      and before    <div class="box-body">
    group.GroupHeading = group.GroupHeading == null ? '' : group.GroupHeading;

    var newBox = $('<div>')
       .addClass('box box-table box-solid ' + (isCollapsed(group.GroupID) ? '' : 'collapsed-box'))
       .attr('data-index', group.GroupPosition)
       .attr('id', group.GroupID)
       .attr('data-id', group.GroupID)
       .html('<div class="box-header with-border">' +
       '<div class="col-xs-11 col-md-8 col-lg-6">' +
       '<div class="myGroupTitle">' +
       '<a class="btn btn-sm btn-default" data-widget="collapse"><i class="' + (isCollapsed(group.GroupID) ? 'fa fa-arrow-down' : 'fa fa-arrow-right') + '"></i></a>&nbsp;' +
       (group.ParentGroupID ? 'Section-' : 'Page-') + '<input class="view" value="' + group.GroupName + '"/>&nbsp;' +
       '<a class="btn btn-xs btn-flat btn-default GT_Edit" title="Edit Name"><i class="fa fa-pencil"></i></a>' +
       '<a class="btn btn-xs btn-flat btn-success GT_Save" style="display: none;"><i class="fa fa-check"></i></a>&nbsp;' +
       '<a class="btn btn-xs btn-flat btn-danger GT_Cancel" style="display: none;"><i class="fa fa-times"></i></a>' +
       '</div>' +
       '</div>' +
       '<div class="box-tools pull-right">' +
       makeTableDropdown(group.GroupID) +
       '</div>' +
       '<!-- /.box-tools -->' +
       '</div>' +
       '<!-- /.box-header -->' +
       '</div>' +
       pipingDiv +
       '<div class="box-body"><div class="col-xs-12">' +
       '<div class="col-xs-12"><h4>Table Heading</h4></div>' +
       '<div class="col-xs-10 col-md-8 col-lg-7">' +
       '<input class="form-control tableH" placeholder="Table Heading" value="' + group.GroupHeading + '" data-headingOriginal="' + group.GroupHeading + '"/>' +
       '</div>' +
       '<div class="col-xs-2 col-md-3">' +
       '<a class="btn btn-sm btn-flat btn-success GT_SaveHead"><i class="fa fa-check"></i></a>&nbsp;' +
       '<a class="btn btn-sm btn-flat btn-info GT_RefreshHead"><i class="fa fa-refresh"></i></a>' +
       '</div>' +
       '</div></div>' +
       '<div class="box-body">' +
       '<div class="col-xs-12 questionLabels">' +
       '<div class="col-xs-12 col-md-6 col-lg-6">' +
       '<h4>Columns</h4>' +
       '</div>' +
       '<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">' +
       '<h4>Type</h4>' +
       '</div>' +
       '</div>' +
       '<div class="col-xs-12 questionList">' +
       '</div>' +
       '<div class="emptyQuestions">' +
       '<span class="icon"><i class="fa fa-list-alt text-warning"></i></span>' +
       '<span class="header">No questions yet</span>' +
       '<span class="subheader">Tap \'Add Column Question\' bellow to add a new question</span>' +
       '</div>' +
       '</div>' +
       '<!-- /.box-body -->' +
       '<div class="box-footer text-center">' +
       '<a class="addQuestion btn btn-success btn-flat btn-sm" title="Add column question" data-id="' + group.GroupID + '" data-type="' + group.GroupType + '">Add Column Question</a>' +
       '</div>' +
       '<div class="box-body">' +
       '<div class="col-xs-12 rowLabels">' +
       '<div class="col-xs-10">' +
       '<h4>Rows</h4>' +
       '</div>' +
       '<div class="col-xs-12 rowList">' +
       '</div>' +
       '<div class="emptyQuestions">' +
       '<span class="icon"><i class="fa fa-list-alt text-warning"></i></span>' +
       '<span class="header">No rows yet</span>' +
       '<span class="subheader">Tap \'Add Row\' bellow to add a new row</span>' +
       '</div>' +
       '</div>' +
       '<!-- /.box-body for rows -->' +
       '<div class="box-footer text-center">' +
       '<a class="addQuestionRow btn btn-success btn-flat btn-sm" title="Add row" data-id="' + group.GroupID + '">Add Row</a>' +
       '</div>');

    return newBox;
}

function makeNormalGroupBox(group) {

    var show = 'none';
    if (group.Piping) { show = group.Piping.Show; }
    var pipingDiv = makePipingBox(show, false);
    //pipingDiv +        this was after    <!-- /.box-header -->      and before    <div class="box-body">

    var newBox = $('<div>')
       .addClass('box box-normal box-solid ' + (isCollapsed(group.GroupID) ? '' : 'collapsed-box'))
       .attr('data-index', group.GroupPosition)
       .attr('id', group.GroupID)
       .attr('data-id', group.GroupID)
       .html('<div class="box-header with-border">' +
       '<div class="col-xs-11 col-md-8 col-lg-6">' +
       '<div class="myGroupTitle">' +
       '<a class="btn btn-sm btn-default" data-widget="collapse"><i class="' + (isCollapsed(group.GroupID) ? 'fa fa-arrow-down' : 'fa fa-arrow-right') + '"></i></a>&nbsp;' +
       (group.ParentGroupID ? 'Section-' : 'Page-') + '<input class="view" value="' + group.GroupName + '"/>&nbsp;' +
       '<a class="btn btn-xs btn-flat btn-default GT_Edit" title="Edit Name"><i class="fa fa-pencil"></i></a>' +
       '<a class="btn btn-xs btn-flat btn-success GT_Save" style="display: none;"><i class="fa fa-check"></i></a>&nbsp;' +
       '<a class="btn btn-xs btn-flat btn-danger GT_Cancel" style="display: none;"><i class="fa fa-times"></i></a>' +
       '</div>' +
       '</div>' +
       '<div class="box-tools pull-right">' +
       makeNormalGroupDropdown(group.GroupID) +
       '</div>' +
       '<!-- /.box-tools -->' +
       '</div>' +
       '<!-- /.box-header -->' +
       '</div>' +
       pipingDiv +
       '<div class="box-body">' +
       '<div class="col-xs-12 questionLabels">' +
       '<div class="col-xs-12 col-md-5 col-lg-6">' +
       '<h4>Question</h4>' +
       '</div>' +
       '<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">' +
       '<h4>Type</h4>' +
       '</div>' +
       '</div>' +
       '<div class="col-xs-12 questionList">' +
       '</div>' +
       '<div class="emptyQuestions">' +
       '<span class="icon"><i class="fa fa-list-alt text-warning"></i></span>' +
       '<span class="header">No questions yet</span>' +
       '<span class="subheader">Tap \'Add Question\' bellow to add a new question</span>' +
       '</div>' +
       '</div>' +
       '<!-- /.box-body -->' +
       '<div class="box-footer text-center">' +
       '<a class="addQuestion btn btn-success btn-flat btn-sm" title="Add question" data-id="' + group.GroupID + '" data-type="' + group.GroupType + '">Add Question</a>' +
       '</div>');

    return newBox;
}

function makePageDropdown(PageID) {
    var ddb = '<div class="btn-group dropdown">';
    ddb += '<a class="btn btn-sm btn-flat btn-default dropdown-toggle" data-target="#" data-toggle="dropdown"><i style="font-size: 20px;margin-top: 6px;" class="fa fa-bars"></i></a>';
    ddb += '<ul class="dropdown-menu dropdown-menu-right" role="menu">';// aria-labelledby="dLabel"
    //ddb += '<li><a class="pointer addQuestion" data-id="' + PageID + '">Add Question</a></li>';
    ddb += '<li><a class="pointer qGroupBtn" data-id="' + PageID + '">Add Question Section</a></li>';
    ddb += '<li><a class="pointer groupLogicBtn" data-id="' + PageID + '">Manage Logic</a></li>';
    ddb += '<li class="divider"></li>';
    ddb += '<li><a class="pointer GR_Remove" data-id="' + PageID + '">Delete Page</a></li>';
    ddb += '</ul></div>';

    return ddb;
}

function makeTableDropdown(TableID) {
    var ddb = '<div class="btn-group dropdown">';
    ddb += '<a class="btn btn-sm btn-flat btn-default dropdown-toggle" data-target="#" data-toggle="dropdown"><i style="font-size: 20px;margin-top: 6px;" class="fa fa-bars"></i></a>';
    ddb += '<ul class="dropdown-menu dropdown-menu-right" role="menu">';// aria-labelledby="dLabel"
    ddb += '<li><a class="pointer addQuestion" data-id="' + TableID + '">Add Column Question</a></li>';
    ddb += '<li><a class="pointer addQuestionRow" data-id="' + TableID + '">Add Row</a></li>';
    ddb += '<li><a class="pointer groupLogicBtn" data-id="' + TableID + '">Manage Logic</a></li>';
    ddb += '<li class="divider"></li>';
    ddb += '<li><a class="pointer GR_Remove" data-id="' + TableID + '">Delete Table</a></li>';
    ddb += '</ul></div>';

    return ddb;
}

function makeNormalGroupDropdown(NormalID) {
    var ddb = '<div class="btn-group dropdown">';
    ddb += '<a class="btn btn-sm btn-flat btn-default dropdown-toggle" data-target="#" data-toggle="dropdown"><i style="font-size: 20px;margin-top: 6px;" class="fa fa-bars"></i></a>';
    ddb += '<ul class="dropdown-menu dropdown-menu-right" role="menu">';// aria-labelledby="dLabel"
    ddb += '<li><a class="pointer addQuestion" data-id="' + NormalID + '">Add Question</a></li>';
    ddb += '<li><a class="pointer groupLogicBtn" data-id="' + NormalID + '">Manage Logic</a></li>';
    ddb += '<li class="divider"></li>';
    ddb += '<li><a class="pointer GR_Remove" data-id="' + NormalID + '">Delete Section</a></li>';
    ddb += '</ul></div>';

    return ddb;
}

function makePipingBox(show, page) {
    var selected = 'selected="selected"';
    var showOpt = '', hideOpt = '';
    if (show) { showOpt = selected; } else { hideOpt = selected; }
    var boxBody = '<div class="box-body" style="display:' + show + '"><div class="col-xs-12 controlBtnList" style="display: none;"> <div class="col-xs-12 col-sm-5 col-md-4 col-lg-3"><h4>Logic Controls</h4></div>' +
       '<span class="control-list col-xs-12 col-sm-6 col-md-7 col-lg-8">' +
       '<span class="btn btn-info btn-sm controlBtn" data-id="open" data-text="(" data-type="symbol"> ( </span>&nbsp;' +
       '<span class="btn btn-info btn-sm controlBtn" data-id="and" data-text="AND" data-type="bitwise" > AND </span>&nbsp;' +
       '<span class="btn btn-info btn-sm controlBtn" data-id="or" data-text="OR" data-type="bitwise" > OR </span>&nbsp;' +
       '<span class="btn btn-info btn-sm controlBtn" data-id="close" data-text=")" data-type="symbol" > ) </span>&nbsp;' +
       '<span class="btn btn-info btn-sm controlBtn" data-id="condition" data-text="Condition" data-type="condition" > Condition </span></span></div>' +
       '<div class="col-xs-12 controlBtnList" style="display:' + show + '"> <div class="col-xs-12"><h4>Logic Conditions</h4></div>' +
       '<div class="logicConditions"><div class="col-xs-12 col-sm-4 col-md-3 col-lg-2" style="display:none;"><select class="form-control pipingShowHide" data-show="' + show + '"><option ' + hideOpt + ' value="false">' + (page ? 'Page' : 'Section') + ' Hidden When</option><option ' + showOpt + ' value="true">' + (page ? 'Page' : 'Section') + ' Shown When</option></select></div>' +
       '<div class="col-xs-12 col-sm-5 col-md-7 col-lg-9"><div class="pipingConditionDiv">&nbsp;</div></div>' +
       '<div class="col-xs-12 col-sm-3 col-md-2 col-lg-1 left2 text-right"><a class="btn btn-success btn-flat savePiping" style="display:none;">Save</a><a class="btn btn-success btn-flat cancelPiping" style="display:none;">Cancel</a></div><div class="col-xs-12 col-sm-3 col-md-2 col-lg-1 left2 text-right"></div></div></div></div>';

    /*
    var boxBody = '<div class="box-body">'+
       '<div class="col-xs-12"> <div class="col-xs-12"><h4>Piping Conditions</h4></div>' +
       '<div class="col-xs-12 col-sm-4 col-md-3 col-lg-2"><select class="form-control pipingShowHide" disabled="disabled" data-show="' + show + '"><option value="false">Hide when</option><option value="true">Show when</option></select></div>' +
       '<div class="col-xs-12 col-sm-5 col-md-7 col-lg-9"><div class="pipingConditionDiv">&nbsp;</div></div>' +
       '<div class="col-xs-12 col-sm-3 col-md-2 col-lg-1 left2 text-right"><a class="btn btn-success btn-flat savePiping" style="display:none;">Save</a></div></div></div>';
    */

    return boxBody;
}

function getGroupByID(grID) {
    //surveyGroups
    var gr, subGr;
    for (var i = 0; i < surveyGroups.length; i++) {
        gr = surveyGroups[i];
        if (gr.GroupID == grID)
        { return gr }
        else if (gr.Subgroups && gr.Subgroups.length > 0) {
            for (var j = 0; j < gr.Subgroups.length; j++) {
                subGr = gr.Subgroups[j];
                if (subGr.GroupID == grID)
                { return subGr }
            }
        }
    } return null;
}

function makePipingConLabels(group, pipConDiv) {
    if (!pipConDiv.closest('.controlBtnList').data('editMode'))
        pipConDiv.closest('.controlBtnList').hide();
    if (group.Piping && group.Piping.pipingConditions) {
        pipConDiv.children().remove();
        pipConDiv.html('&nbsp;');

        var item;
        for (var i = 0; i < group.Piping.pipingConditions.length; i++) {
            pipConDiv.closest('.controlBtnList').show();
            (group.Piping.pipingConditions[i]).order = i;

            if ((group.Piping.pipingConditions[i]).type == 'condition' && !(group.Piping.pipingConditions[i]).remove) {
                //get condition obj
                pipConDiv.
                   append(makeConditionLabel((group.Piping.pipingConditions[i]).order, (group.Piping.pipingConditions[i]).value));
            } else if (!(group.Piping.pipingConditions[i]).remove) {
                pipConDiv.
                   append('&nbsp;<span class="label label-info label-lg" data-order="' + (group.Piping.pipingConditions[i]).order + '">&nbsp;' + (group.Piping.pipingConditions[i]).value + '&nbsp;<span class="label-btn">' +
                   '<i class="glyphicon glyphicon-remove removeLabel" data-order="' + (group.Piping.pipingConditions[i]).order + '"></i></span>');
            }
        }
    }
}

// AddPiping(secretKey, surveyID, groupID, pipingConditions, show)
function saveGroupPiping(gr, hideSow) {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    //get all the details
    var pipingConditions = JSON.stringify(gr.Piping.pipingConditions);

    var methodName = "AddPiping";
    if (gr.Piping.ID && gr.Piping.ID.length > 1) {
        methodName = "UpdatePiping";
    }
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID,
        groupID: gr.GroupID, pipingConditions: pipingConditions, show: hideSow, pipingID: gr.Piping.ID
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
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Project updated
                    ShowSuccessModal("Section logic condition(s) saved.");

                    GetGroupsAndQuestionsForSurvey(gr.GroupID);
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function makeQuestionRow(container, index, question) {
    var id = '', name = '', type = 'text', typeID = '';

    if (question) {
        id = question.QuestionID;
        name = question.QuestionName ? question.QuestionName : question.QuestionText;
        type = question.QuestionTypeName ? question.QuestionTypeName : question.QuestionType;
        typeID = question.QuestionType ? question.QuestionType : question.QuestionTypeID;
    }

    /*
    <span class="handle ui-sortable-handle">
       <i class="fa fa-ellipsis-v"></i>
       <i class="fa fa-ellipsis-v"></i>
    </span>
    */

    var qRow = $('<div></div>')
       .addClass('col-xs-12 questionRow')
       .attr('data-qID', id)
       .attr('data-index', index);

    var div1 = $('<div></div>')
       .addClass('col-xs-12 col-md-5 left2')
    .html('<span class="handle pull-left"><i class="fa fa-hand-paper-o"></i></span>' +
    '<div class="col-xs-11"><div class="form-group">' +
    '<input type="text" value="' + name + '" data-qID="' + id + '" placeholder="Enter question"' +
    'title="Question" class="qText form-control" readonly="readonly" disabled="disabled" />' +
      //'<div id="txtQText-'+id+'"  data-qID="' + id + '" placeholder="Enter question"' +
      //'title="question" class="qtext form-control overflow-overlay" contenteditable="false" disabled="disabled" >' + name + '</div>' +
    '</div></div>');

    qRow.append(div1);

    var select = $('<select class="form-control qType" data-qID="' + id + '" readonly="readonly" disabled="disabled">' + getTypeOptions() + '</select>');

    var formGroup = $('<div></div>')
       .addClass('form-group')
       .append(select);

    var div2 = $('<div></div>')
       .addClass('col-xs-12 col-sm-8 col-md-4 left2')
       .append(formGroup);

    qRow.append(div2);

    var div3 = $('<div></div>')
       .addClass('col-xs-12 col-sm-4 col-md-3 text-right')
    .html('<a data-qID="' + id + '" class="btn btn-sm btn-flat bg-blue qEdit" title="Edit question"><span class="hidden-xs"><i class="fa fa-pencil"></i> | </span>Edit</a>&nbsp;' +
          '<a data-qID="' + id + '" class="btn btn-sm btn-flat bg-green qVEdit" title="Custom Validation"><span class="hidden-xs"><i class="fa fa-check"></i> | </span><span class="hidden-xs hidden-sm hidden-md">Question </span>Options</a>');

    qRow.append(div3);

    container.append(qRow);
    select.val(typeID);

    //CKEDITOR.disableAutoInline = false;
    //CKEDITOR.inline('txtQText-' + id);

    var showTypeOptions = typeHasOptions(typeID);
    if (!showTypeOptions) {
        div3.find('a.qOptions').hide();
    }
}

function makeTableRow(container, index, row) {
    var id = '', name = '';

    if (row) {
        id = row.RowID;
        name = row.RowName ? row.RowName : '';
    }

    var qRow = $('<div></div>')
       .addClass('col-xs-12 rowItem')
       .attr('data-qID', id)
       .attr('data-index', index);

    var div1 = $('<div></div>')
       .addClass('col-xs-12 col-sm-10 col-md-9 col-lg-8 left2')
    .html('<span class="handle pull-left"><i class="fa fa-hand-paper-o"></i></span>' +
    '<div class="col-xs-11"><div class="form-group">' +
    '<input type="text" value="' + name + '" data-rID="' + id + '" placeholder="Row"' +
    'title="Row" class="qText form-control" readonly="readonly" disabled="disabled" />' +
    '</div></div>');

    qRow.append(div1);

    var div2 = $('<div></div>')
       .addClass('col-xs-10 col-sm-2')
    .html('<div class="editDelete"><a data-rID="' + id + '" class="btn btn-sm btn-flat btn-default rEdit" title="Edit"><i class="fa fa-pencil text-black"></i></a>&nbsp;' +
    '<a data-rID="' + id + '" class="btn btn-sm btn-flat btn-danger rDelete" title="Delete"><i class="fa fa-trash text-black"></i></a></div>' +
    '<div class="saveCancel" style="display:none;"><a data-rID="' + id + '" class="btn btn-sm btn-flat btn-success rSave" title="Save"><i class="fa fa-floppy-o text-black"></i></a>&nbsp;' +
    '<a data-rID="' + id + '" class="btn btn-sm btn-flat btn-warning rCancel" title="Cancel""><i class="fa fa-times text-black"></i></a></div>');

    qRow.append(div2);

    container.append(qRow);
}

var types = [
   { HasOptions: null, FriendlyName: '', Type: '', ID: '' }];
/*
{ HasOptions: true, FriendlyName: 'Checkbox (Group)', Type: 'checkbox', ID: '47c41586-cbce-428b-942d-508cee462c2d' },
   { HasOptions: true, FriendlyName: 'Radio (Group)', Type: 'radio', ID: '8abdc140-a41e-46dd-b0dc-a5a0e29103dd' },
   { HasOptions: false, FriendlyName: 'Textbox', Type: 'text', ID: '316e3a95-c1cc-4edf-b7b4-32accaa2adbf' },
   { HasOptions: false, FriendlyName: 'Multi-line Textbox', Type: 'textarea', ID: '85826014-c25c-4223-a9bf-28413a402718' },
   { HasOptions: false, FriendlyName: 'Date', Type: 'date', ID: '921b8333-8651-4911-960b-4100876774d5' },
   { HasOptions: true, FriendlyName: 'Dropdown List', Type: 'ddl', ID: '6502b9e8-c756-4ffb-bee8-27dd0b0b7bf4' },
   { HasOptions: true, FriendlyName: 'Dropdown List Multiple Options', Type: 'ddlMultiple', ID: 'b74be861-00f2-4f48-a0b6-baffdc3c964e' },
   { HasOptions: false, FriendlyName: 'Location', Type: 'location', ID: '051f6215-123e-4ffe-9f56-adb7ba3a5020' },
   { HasOptions: false, FriendlyName: 'Camera', Type: 'camera', ID: 'a4dcca9e-5ff7-4fcc-86b4-c91200441978' },
   { HasOptions: false, FriendlyName: 'Signature', Type: 'signature', ID: 'fb10ac75-1604-4cef-92a6-f71e6733ca29' }
*/
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

//{ r.ID,Pattern,FriendlyName,Description,QuestionTypeID }
var regExList = [
   { ID: '', Pattern: '', FriendlyName: '', Description: '', QuestionTypeID: '' }];

//GetQuestionRegex(string secretKey, string questionTypeID)
function GetQuestionRegExList() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    var methodName = "GetQuestionRegex";
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

                //{ r.ID,Pattern,FriendlyName,Description,QuestionTypeID }
                regExList = JSON.parse(data.RRZResult);

                // We'll filter through the list by 'QuestionTypeID' then add options to $('#regexDDL');
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function getTypeOptions() {
    var optionTxt = '';
    for (var i = 0; i < types.length; i++) {
        var t = types[i];
        optionTxt += '<option value="' + t.ID + '" >' + t.FriendlyName + '</option>';
    }
    return optionTxt;
}

function getTypeByID(id) {
    var t;
    for (var i = 0; i < types.length; i++) {
        t = types[i];
        if (t.ID == id) { return t }
    }
    return null;
}
function getPipingQByID(id) {
    var q;
    for (var i = 0; i < pipingQs.length; i++) {
        q = pipingQs[i];
        if (q.QuestionID == id) { return q }
    }
    return null;
}

//{ r.ID,Pattern,FriendlyName,Description,QuestionTypeID }
function getRegExOptions(qTypeID) {
    var optionTxt = '';
    for (var i = 0; i < regExList.length; i++) {
        var rEx = regExList[i];
        if (rEx.QuestionTypeID == qTypeID) {
            optionTxt += '<option value="' + rEx.Pattern + '"  title="' + rEx.Description + '" >' + rEx.FriendlyName + '</option>';
        }
    }
    return optionTxt;
}

function typeHasOptions(typeID) {
    for (var i = 0; i < types.length; i++) {
        var t = types[i];
        if (t.ID == typeID) {
            return t.HasOptions;
        }
    }
    return false;
}

//string GetSpecificQuestion(string secretKey, string companyID, string questionID)

/* 
   QuestionID, QuestionText,QuestionType,Position,GroupID,RegexPattern,MinimumValue,MaximumValue,
   RequiredQuestion,ContainsValue,EqualsValue,NotEqualsValue,StartsWithValue,EndsWithValue,
   LengthValue,
   QuestionValues = {ID,Name,Value,IsDefault}
   CalculationValue= {GroupID,
                      questionCalculations=[{order,type,value},...]}

   if(CalculationValue.questionCalculations[i].type=="column")
   {
      CalculationValue.questionCalculations[i].value = {GroupID, QuestionID, QuestionText, QuestionType, QuestionTypeID};
   }
}
*/

function GetSpecificQuestion(qID, grID, onlyValidation) {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var qModal = $('#questionModal');
    qModal.data('grid', grID);
    qModal.data('qid', qID);

    var qVModal = $('#questionValidationModal');
    qVModal.data('grid', grID);
    qVModal.data('qid', qID);

    if (onlyValidation) {
        qVModal.modal();
    }
    else {
        qModal.modal();
    }

    var methodName = "GetSpecificQuestion";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, questionID: qID
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

                var response = JSON.parse(data.RRZResult);

                $('#questionModal').removeData('grid').removeData('qid');
                $('#questionValidationModal').removeData('grid').removeData('qid');


                if (response.CalculationValue) {
                    response.CalculationValue = JSON.parse(response.CalculationValue);
                    questionCalc = response.CalculationValue;

                    if (questionCalc.GroupID) {
                        $('#calcControlDiv').show();
                        makeQuestionCalcLabels();
                    }
                    else {
                        $('#calcControlDiv').hide();
                    }
                }
                else {
                    $('#calcControlDiv').hide();
                }

                /* 
                   QuestionID, QuestionText,QuestionType,Position,GroupID,RegexPattern,MinimumValue,MaximumValue,
                   RequiredQuestion,ContainsValue,EqualsValue,NotEqualsValue,StartsWithValue,EndsWithValue,
                   LengthValue,
                   QuestionValues = {ID,Name,Value,IsDefault}
                }
                */

                $('#questionTxt').val(response.QuestionText);
                //CKEDITOR.instances.questionTxt.setData(response.QuestionText);

                var qType = getTypeByID(response.QuestionType);
                if (qType.Type == 'radio') {
                    $('#addOtherOption').show();
                } else {
                    $('#addOtherOption').hide();
                }

                //addOtherOption

                //Hide type option control if the type has no options
                if (!typeHasOptions(response.QuestionType)) {
                    $('#optionsDiv').children().remove();
                    $('#optionsDiv')
                    optCount = 1;
                    $('#optionsSect').hide();
                } else {
                    $('#optionsSect').show();
                }

                var optionsDiv = $('#optionsDiv');
                optionsDiv.children().remove();

                optCount = response.QuestionValues.length;
                for (var i = 0; i < optCount; i++) {
                    var thisOpt = response.QuestionValues[i];
                    if (thisOpt.IsOther) {
                        $('#optionsOther').data('isother', true).show();
                        $('#addOtherOption').hide();
                    }
                    else {
                        makeOptionRow(i + 1, thisOpt);
                    }
                }

                if (response.HasSum || response.MinimumValue || response.MaximumValue) {
                    $('#hasSumDiv').show();
                    $('#textDiv').hide();
                }

                $('#RequiredQuestion').prop('checked', response.RequiredQuestion);
                $('#hasSumCheck').prop('checked', response.HasSum);
                $('#minTxt').val(response.MinimumValue);
                $('#maxTxt').val(response.MaximumValue);
                $('#EqualsValue').val(response.EqualsValue);
                $('#NotEqualsValue').val(response.NotEqualsValue);
                $('#StartsWithValue').val(response.StartsWithValue);
                $('#EndsWithValue').val(response.EndsWithValue);
                $('#ContainsValue').val(response.ContainsValue);
                $('#LengthValue').val(response.LengthValue);
                //$('#regExDiv').val(response.RegexPattern);
                $("#regexTxt").val(response.RegexPattern);
                $("#regexErrorTxt").val(response.RegexPatternError);

                $('#deleteQuestionBtn').show();
                $('#viewQuestionValitionBtn').show();
                $('#viewQuestionValitionBtn, #saveQuestionBtn, #viewQuestionBtn, #saveQuestionValidationBtn')
                   .data('grid', grID).data('qid', qID);

                var qModal = $('#questionModal');
                qModal.data('grid', grID);
                qModal.data('qid', qID);

                var qVModal = $('#questionValidationModal');
                qVModal.data('grid', grID);
                qVModal.data('qid', qID);


                $('#typeDDL')
                   .html(getTypeOptions())
                   .val(response.QuestionType);

                $('#typeDDL').trigger('change');

                if (onlyValidation) {
                    $('#questionNameLbl').html(response.QuestionText);
                    $('#questionTypeLbl').html(qType.FriendlyName);
                    showHideValidation(grID, qType.ID, qType.FriendlyName);
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });

}


function showHideValidation(grID, typeID, typeName) {

    //Min/Max only show for number and date
    var min = $('#minTxt');
    var max = $('#maxTxt');

    var hasSumDiv = $('#hasSumDiv');
    var hasSum = $('#hasSumCheck');

    var requiredDiv = $('#requiredDiv');
    var MinMaxRow = $('#MinMaxRow');
    var textDiv = $('#textDiv');
    var calcContrDiv = $('#calcControlDiv');

    hasSumDiv.hide();
    calcContrDiv.hide();
    requiredDiv.show();
    MinMaxRow.show();
    textDiv.show();

    if (typeName == 'Date') {
        min.prop('type', 'date');
        max.prop('type', 'date');
        MinMaxRow.show();
        textDiv.hide();
    }
    else if (typeName == 'Number' || typeName == 'Numerical') {
        min.prop('type', 'number');
        max.prop('type', 'number');
        MinMaxRow.show();
        hasSum.val('');
        hasSumDiv.show();
        textDiv.hide();
    }
    else {
        min.val('');
        max.val('');
        MinMaxRow.hide();
        textDiv.show();
    }

    if (typeName == 'Calculation') {
        questionCalc = { GroupID: grID, questionCalculations: [] };
        hasSum.val('');
        hasSumDiv.show();
        calcContrDiv.show();
        requiredDiv.hide();
        MinMaxRow.hide();
        textDiv.hide();
        GetSurveyQuestionNumerical();
    } else {

        calcContrDiv.hide();
    }

    var regEx = $('#regexDDL');
    regEx.children().remove();

    var options = getRegExOptions(typeID);
    if (!options) {
        regEx.html('<option value="">None</option>');
    }
    else {
        regEx.html(options);
    }

    if (['Rating', 'Location', 'Camera', 'Signature',
        'Dropdown List', 'Radio Buttons', 'Check Boxes', 'Email',
        'Dropdown List Multiple Options'].indexOf(typeName) != -1) {
        hasSumDiv.hide();
        calcContrDiv.hide();
        requiredDiv.show();
        MinMaxRow.hide();
        textDiv.hide();
    }
}

function makeOptionRow(index, opt) {
    var optListDiv = $('#optionsDiv');
    var name = '', value = '', checked = '';

    if (opt) {
        name = opt.name ? opt.name : opt.Name;
        value = opt.value ? opt.value : opt.Value;
        checked = opt.isDefault ? 'checked' : (opt.IsDefault ? 'checked' : '');
    }

    var optDiv = $('<div></div>')
       .addClass('col-xs-12 form-group')
       .attr('id', 'optDiv' + index);

    var div1 = $('<div></div>')
       .addClass('col-xs-6')
       .html(
          '<div class="input-group">' +
             '<span class="input-group-addon">' +
                '<input type="radio" name="defaultOptions" ' + checked + ' data-opt="' + index + '" title="Start with this selected" class="optRadio">' +
             '</span>' +
             '<input type="text" value="' + name + '" data-opt="' + index + '" placeholder="Option Name" title="Option Name" class="optTxt form-control">' +
          '</div>');

    optDiv.append(div1);

    var div2 = $('<div></div>')
       .addClass('col-xs-5')
       .html('<input type="text" value="' + value + '" data-opt="' + index + '" placeholder="Option Value" title="Option Value" class="optValue form-control">');

    optDiv.append(div2);

    var div3 = $('<div></div>')
       .addClass('col-xs-1')
    .html('<a data-opt="' + index + '" class="btn btn-sm btn-flat btn-danger removeOpt"><i class="fa fa-times"></i></a>');

    optDiv.append(div3);

    optListDiv.append(optDiv);
}

/* 
string CreateQuestion(string secretKey, string companyID, string questionText, string questionTypeID, string questionValues, string groupID,
string regexPattern, string minimumValue, string maximumValue,
string requiredQuestion, string containsValue, string equalsValue, string notEqualsValue,
string startsWithValue, string endsWithValue, string lengthValue)
*/

function makeQuestionCalcLabels() {
    var questionCalcDiv = $('#questionCalcDiv');

    /*
    
          questionCalc = { GroupID: gID, questionCalculations: [] };
          var item = { order: questionCalc.questionCalculations.length, type: btnType, value: btnText };
    */
    questionCalcDiv.children().remove();
    questionCalcDiv.html('');
    var item;
    for (var i = 0; i < questionCalc.questionCalculations.length; i++) {
        (questionCalc.questionCalculations[i]).order = i;

        if ((questionCalc.questionCalculations[i]).type == 'column') {
            //get condition obj
            questionCalcDiv.
               append(makeCalcConditionLabel((questionCalc.questionCalculations[i]).order, (questionCalc.questionCalculations[i]).value));
        } else {
            questionCalcDiv.
               append('&nbsp;<span class="label label-info label-lg" data-order="' + (questionCalc.questionCalculations[i]).order + '">&nbsp;' + (questionCalc.questionCalculations[i]).value + '&nbsp;<span class="label-btn">' +
               '<i class="glyphicon glyphicon-remove removeCalcLabel" data-order="' + (questionCalc.questionCalculations[i]).order + '"></i></span>');
        }
    }
}

// GetSurveyQuestionNumerical(secretKey, companyID, surveyID)
function GetSurveyQuestionNumerical() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id.");
        return false;
    }

    var methodName = "GetSurveyQuestionNumerical";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID
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
                // {GroupID , QuestionID , QuestionText, QuestionTypeID ,QuestionType}
                numericalQuestions = JSON.parse(data.RRZResult);
                makeQuestionCalcLabels();
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}


function GetCalcQuestions(grID, grType) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id.");
        return false;
    }

    var methodName = "GetSurveyQuestionNumerical";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID
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

                numericalQuestions = JSON.parse(data.RRZResult);


                var selectQuestions = [];

                var qDDL = $('#questionsForCalcDDL');
                qDDL.children().remove();

                if (grType == 'Table') {
                    //btnType='Table' get only calculable (numeric or other calculation) questions for this group
                    selectQuestions = GetCalculableQuestionInGroup(grID);

                }
                else if (grType == 'Normal') {
                    //btnType='Normal' get ALL calculable (numeric or other calculation) questions
                    selectQuestions = GetAllCalculableQuestion();
                }

                if (selectQuestions) {
                    //{GroupID , QuestionID , QuestionText, QuestionTypeID ,QuestionType}

                    var q, optStr = '<option> </option>', gr, grTxt = '';
                    for (var i = 0; i < selectQuestions.length; i++) {
                        q = selectQuestions[i];
                        gr = getGroupByID(q.GroupID);
                        if (gr && gr.GroupName) { grTxt = gr.GroupName + ' - '; }
                        else { grTxt = ''; }
                        optStr += '<option value="' + q.QuestionID + '">' + grTxt + q.QuestionText + '</option>';
                    }

                    if (!selectQuestions || selectQuestions.length == 0) {
                        optStr = '<option> No available questions</option>';
                    }

                    qDDL.html(optStr);
                }


                if (!questionCalc || !questionCalc.questionCalculations) {
                    questionCalc = { GroupID: grID, questionCalculations: [] };
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function AddQuestionToSurvey() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    var qModal = $('#questionModal');
    var qVModal = $('#questionValidationModal');

    //get all the details
    var qModal = $('#questionModal');
    var grID = qModal.data('grid');

    var qText = $('#questionTxt').val();
    //var qText = CKEDITOR.instances.questionTxt.getData();
    var qTypeID = $('#typeDDL :selected').val();

    var typeOptions = [];

    var inpTxtList = $('#optionsDiv').find('input.optTxt');
    var inpValList = $('#optionsDiv').find('input.optValue');
    var inpRdList = $('#optionsDiv').find('input.optRadio');
    var typeOpt, txt, val, checked;
    for (var i = 0; i < inpTxtList.length; i++) {
        txt = $(inpTxtList[i]);
        val = $(inpValList[i]);
        checked = $(inpRdList[i]);

        typeOpt = {
            order: txt.data('opt'),
            name: txt.val(),
            value: val.val(),
            isDefault: checked.is(':checked'),
            isOther: false
        };
        typeOptions.push(typeOpt);
    }
    var optOtherDiv = $('#optionsOther');
    if (optOtherDiv.data('isother')) {
        typeOpt = {
            order: typeOptions.length,
            name: 'Other',
            value: '|RRZOTHER|',
            isDefault: false,
            isOther: true
        };
        typeOptions.push(typeOpt);
    }
    // typeOptions;

    var isReq = $('#RequiredQuestion').is(':checked');
    var minTxt = $('#minTxt').val();
    var maxTxt = $('#maxTxt').val();
    var EqualsValue = $('#EqualsValue').val();
    var NotEqualsValue = $('#NotEqualsValue').val();
    var StartsWithValue = $('#StartsWithValue').val();
    var EndsWithValue = $('#EndsWithValue').val();
    var ContainsValue = $('#ContainsValue').val();
    var LengthValue = $('#LengthValue').val();
    var regExDiv = $("#regexTxt").val();//dont use any regex @ the start //$("#regexTxt").val();//$('#regExDiv').val();
    var regExError = $("#regexErrorTxt").val()
    var calVal = JSON.stringify(questionCalc);
    var hasSum = $('#hasSumCheck').is(':checked');

    var methodName = "CreateQuestion";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID,
        questionText: qText, questionTypeID: qTypeID, questionValues: JSON.stringify(typeOptions), groupID: grID,
        regexPattern: regExDiv, regexError: regExError, minimumValue: minTxt, maximumValue: maxTxt,
        requiredQuestion: isReq, containsValue: ContainsValue, equalsValue: EqualsValue, notEqualsValue: NotEqualsValue,
        startsWithValue: StartsWithValue, endsWithValue: EndsWithValue, lengthValue: LengthValue, calculationValue: calVal, hasSum: hasSum
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
                    ShowErrorModal(error, false, qModal);
                    return false;
                }
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    $('#questionTxt').val('');
                    //CKEDITOR.instances.questionTxt.setData("");
                    //$('#regExDiv').val('');
                    $("#regexTxt").val('');

                    qModal.data('grid', '').data('grtype', '').data('qid', '')
                    .removeAttr('data-grid').removeAttr('data-grtype').removeAttr('data-qid');

                    qVModal.data('grid', '').data('grtype', '').data('qid', '')
                    .removeAttr('data-grid').removeAttr('data-grtype').removeAttr('data-qid');

                    GetGroupsAndQuestionsForSurvey(grID);

                    //ShowSuccessModal("Question: <strong>" + qText + "</strong> has been added to this group.");
                    ShowSuccessModal("Your question has been added to this group.");

                    qModal.modal('hide');
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d, false, qModal);
        }
    });
}
/* 
 string UpdateQuestion(string secretKey, string companyID, string questionID, string questionText, string questionTypeID, string questionValues,
string regexPattern, string minimumValue, string maximumValue,
string requiredQuestion, string containsValue, string equalsValue, string notEqualsValue,
string startsWithValue, string endsWithValue, string lengthValue)
*/

function UpdateQuestion() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }

    var qModal = $('#questionModal');
    var qVModal = $('#questionValidationModal');

    //get all the details
    var grID = $('#questionModal').data('grid');
    var qID = $('#questionModal').data('qid');

    var qText = $('#questionTxt').val();
    //var qText = CKEDITOR.instances.questionTxt.getData();
    var qTypeID = $('#typeDDL :selected').val();

    var typeOptions = [];

    var inpTxtList = $('#optionsDiv').find('input.optTxt');
    var inpValList = $('#optionsDiv').find('input.optValue');
    var inpRdList = $('#optionsDiv').find('input.optRadio');
    var typeOpt, txt, val, checked, largestOrder = 0;
    for (var i = 0; i < inpTxtList.length; i++) {
        txt = $(inpTxtList[i]);
        val = $(inpValList[i]);
        checked = $(inpRdList[i]);
        if (largestOrder < txt.data('opt')) {
            largestOrder = txt.data('opt');
        }
        typeOpt = {
            order: txt.data('opt'),
            name: txt.val(),
            value: val.val(),
            isDefault: checked.is(':checked'),
            isOther: false
        };
        typeOptions.push(typeOpt);
    }
    var optOtherDiv = $('#optionsOther');
    if (optOtherDiv.data('isother')) {
        typeOpt = {
            order: largestOrder + 1,
            name: 'Other',
            value: '|RRZOTHER|',
            isDefault: false,
            isOther: true
        };
        typeOptions.push(typeOpt);
    }
    // typeOptions;

    var isReq = $('#RequiredQuestion').is(':checked');
    var minTxt = $('#minTxt').val();
    var maxTxt = $('#maxTxt').val();
    if (qTypeID == ratingQTypeID) {
        maxTxt = $('#maxValue').val();
    }
    var EqualsValue = $('#EqualsValue').val();
    var NotEqualsValue = $('#NotEqualsValue').val();
    var StartsWithValue = $('#StartsWithValue').val();
    var EndsWithValue = $('#EndsWithValue').val();
    var ContainsValue = $('#ContainsValue').val();
    var LengthValue = $('#LengthValue').val();
    var regExDiv = $("#regexTxt").val(); //$('#regExDiv').val();
    var regExError = $("#regexErrorTxt").val(); //$('#regExDiv').val();
    var calVal = JSON.stringify(questionCalc);
    var hasSum = $('#hasSumCheck').is(':checked');

    var methodName = "UpdateQuestion";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID, groupID: grID, questionID: qID,
        questionText: qText, questionTypeID: qTypeID, questionValues: JSON.stringify(typeOptions),
        regexPattern: regExDiv, regexError: regExError, minimumValue: minTxt, maximumValue: maxTxt,
        requiredQuestion: isReq, containsValue: ContainsValue, equalsValue: EqualsValue, notEqualsValue: NotEqualsValue,
        startsWithValue: StartsWithValue, endsWithValue: EndsWithValue, lengthValue: LengthValue, calculationValue: calVal, hasSum: hasSum
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
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Question added
                    /*
                    var question = {
                       QuestionID: qID,
                       QuestionPosition: response.QuestionPosition,
                       QuestionTypeID: qTypeID,
                       QuestionName: qText,
                       QuestionTypeName: qTypeID,
                       ParentGroupID: grID
                    };
     
                    var questionDiv = getQuestionDivByID(grID);
                    replaceQuestionRow(questionDiv, question);
                    */
                    qModal.data('grid', '').data('grtype', '').data('qid', '')
                    .removeAttr('data-grid').removeAttr('data-grtype').removeAttr('data-qid');

                    qVModal.data('grid', '').data('grtype', '').data('qid', '')
                    .removeAttr('data-grid').removeAttr('data-grtype').removeAttr('data-qid');

                    //ShowSuccessModal("Question: <strong>" + qText + "</strong> has been updated.");
                    ShowSuccessModal("Your question has been updated.");

                    GetGroupsAndQuestionsForSurvey(grID);
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}


function replaceQuestionRow(container, question) {
    var id = '', name = '', type = 'text', typeID = '';

    if (question) {
        id = question.QuestionID;
        name = question.QuestionName ? question.QuestionName : question.QuestionText;
        type = question.QuestionTypeName ? question.QuestionTypeName : question.QuestionType;
        typeID = question.QuestionType ? question.QuestionType : question.QuestionTypeID;
    }

    var oldQ = container.find('.questionRow[data-qid="' + id + '"]');

    var index = oldQ.data('index');

    var qRow = $('<div></div>')
       .addClass('col-xs-12 questionRow')
       .attr('data-qID', id)
       .attr('data-index', index);

    var div1 = $('<div></div>')
       .addClass('col-xs-12 col-md-5 col-lg-6 left2')
    .html('<span class="handle pull-left"><i class="fa fa-hand-paper-o"></i></span>' +
    '<div class="col-xs-11"><div class="form-group">' +
    '<input type="text" value="' + name + '" data-qID="' + id + '" placeholder="Enter question"' +
    'title="Question" class="qText form-control" readonly="readonly" disabled="disabled" />' +
    '</div></div>');

    qRow.append(div1);

    var select = $('<select class="form-control qType" data-qID="' + id + '" readonly="readonly" disabled="disabled">' + getTypeOptions() + '</select>');

    var formGroup = $('<div></div>')
       .addClass('form-group')
       .append(select);

    var div2 = $('<div></div>')
       .addClass('col-xs-12 col-sm-5 col-md-3 col-lg-3 left2')
       .append(formGroup);

    qRow.append(div2);

    var div3 = $('<div></div>')
       .addClass('col-xs-12 col-sm-7 col-md-4 col-lg-3 left2 text-right')
    .html('<a data-qID="' + id + '" class="btn btn-sm btn-flat bg-maroon qOptions" title="Type Options"><i style="font-size: 20px;margin-top: 6px;" class="fa fa-bars"></i> | Type Options</a>' +
    ' <a data-qID="' + id + '" class="btn btn-sm btn-flat bg-blue qValidation" title="Validation">Validation</a>' +
    ' <a data-qID="' + id + '" class="btn btn-sm btn-flat btn-default qEdit"><i class="fa fa-pencil"></i></a>');

    qRow.append(div3);

    //Add the updated question row before
    oldQ.before(qRow);
    oldQ.remove();

    select.val(typeID);

    var showTypeOptions = typeHasOptions(typeID);
    if (!showTypeOptions) {
        div3.find('a.qOptions').hide();
    }
}

function addQuestionToGroup(question) {
    //ParentGroupID: grID
    //Check surveyGroups.GroupID   ->    surveyGroups.Subgroups.GroupID

    var gr, gr2;
    for (var i = 0; i < surveyGroups.length; i++) {
        gr = surveyGroups[i];

        if (gr.GroupID == question.ParentGroupID) {
            if (gr.Questions && $.isArray(gr.Questions)) {
                gr.Questions.push(question);
            }
            else {
                gr.Questions = [];
                gr.Questions.push(question);
            }
            return true;
        }
        else if (surveyGroups.Subgroups && surveyGroups.Subgroups.length > 0) {
            for (var j = 0; j < surveyGroups.Subgroups.length; j++) {
                gr2 = surveyGroups.Subgroups[j];

                if (gr2.GroupID == question.ParentGroupID) {
                    gr2.Questions.push(question);
                    return true;
                }
            }
        }
    }
    return false;
}

function clearQuestionModal() {
    $('#questionModal').removeAttr('data-grid').removeAttr('data-qid').removeData('grid').removeData('qid');
    $('#questionTxt').val('');
    //CKEDITOR.instances.questionTxt.setData("");
    $('#typeDDL :selected').val('');

    $('#optionsDiv').children().remove();

    $('#RequiredQuestion').removeAttr('checked');
    $('#minTxt').val('');
    $('#maxTxt').val('');
    $('#EqualsValue').val('');
    $('#NotEqualsValue').val('');
    $('#StartsWithValue').val('');
    $('#EndsWithValue').val('');
    $('#ContainsValue').val('');
    $('#LengthValue').val('');
    //$('#regExDiv').val('');
    $("#regexTxt").val('');

    $('#questionModal').modal('hide');
}

/*
string MoveQuestion(string secretKey, string companyID, string groupID, string questionIDToMove, string questionIDBelow)
//questionIDToMove - the ID of the question that is being moved
//questionIDBelow - the ID of the question that is below the question that is being moved (null if the new question is moved right to the bottom)
*/

function initForQuestions() {
    var sp = document.getElementById('surveyPurpose');
    if (sp && !CKEDITOR.instances.surveyPurpose) {
        CKEDITOR.replace('surveyPurpose', {
            language: 'en',
            toolbarCanCollapse: true
        });
    }
    var sc = document.getElementById('surveyConclusion');
    if (sc && !CKEDITOR.instances.surveyConclusion) {
        CKEDITOR.replace('surveyConclusion', {
            language: 'en',
            toolbarCanCollapse: true
        });
    }
    
    GetThisSurvey();
    GetGroupsAndQuestionsForSurvey();
    GetQuestionTypes();
    GetQuestionRegExList();
}

function MoveQuestion(questionToMove, questionBelow) {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var groupID = questionToMove.closest('.box').data('id');

    var questionIDToMove = questionToMove.data('qid');
    var questionIDBelow = null;
    if (questionBelow) {
        questionIDBelow = questionBelow.data('qid');
    }

    var methodName = "MoveQuestion";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, groupID: groupID,
        questionIDToMove: questionIDToMove, questionIDBelow: questionIDBelow
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
                    $(".groupList").sortable("cancel");
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return false;
                }

                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Group order updated
                    GetGroupsAndQuestionsForSurvey(groupID);
                }
            }
        },
        error: function (a, e, d) {
            $(".groupList").sortable("cancel");
            ShowErrorModal(e + ' ' + d);
        }
    });
}

//string RemoveQuestion(string secretKey, string companyID, string questionID)

function removeQuestion() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find survey id to update.");
        return false;
    }
    var qModal = $('#questionModal');
    //get all the details
    var grID = $('#questionModal').data('grid');
    var qID = $('#questionModal').data('qid');

    var qText = $('#questionTxt').val();
    //var qText = CKEDITOR.instances.questionTxt.getData();

    var methodName = "RemoveQuestion";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, surveyID: survID, groupID: grID, questionID: qID
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
            qModal.modal('hide');
            if (data.RRZResult) {
                if (IsError(data.RRZResult)) {
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return false;
                }
                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Question removed
                    qModal.data('grid', '').data('grtype', '').data('qid', '')
                    .removeAttr('data-grid').removeAttr('data-grtype').removeAttr('data-qid');

                    var questionDiv = getQuestionDivByID(grID);
                    removeQuestionRow(questionDiv, qID);
                    //ShowSuccessModal("Question: <strong>" + qText + "</strong> has been removed.");
                    ShowSuccessModal("Your question has been removed.");
                }
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

//string CreateQuestionRow(secretKey, companyID, groupID, rowText, position)
function CreateQuestionRow(groupID, rowText) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    if (typeof groupID == "undefined" || groupID == null || groupID.length <= 0) {
        ShowErrorModal("Could not find group id to update.");
        return false;
    }

    var methodName = "CreateQuestionRow";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, groupID: groupID, rowText: rowText
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
            }

            $('#addTableRowModal').modal('hide');
            $('#refreshSurveyQuestions').click();

            $('#newRowText').val('');
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

function removeQuestionRow(container, qID) {
    if (qID) {
        var oldQ = container.find('.questionRow[data-qid="' + qID + '"]');
        if (oldQ) {
            oldQ.remove();
        }
    }
}

//string UpdateQuestionRow(secretKey, companyID, rowID,rowText)
function UpdateQuestionRow(rowID, rowText) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    if (typeof rowID == "undefined" || rowID == null || rowID.length <= 0) {
        ShowErrorModal("Could not find row id to update.");
        return false;
    }

    if (typeof rowText == "undefined" || rowText == null || rowText.length <= 0) {
        ShowErrorModal("Please specify the row text or delete the row.");
        return false;
    }

    var methodName = "UpdateQuestionRow";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, rowID: rowID, rowText: rowText
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
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

//string RemoveQuestionRow(secretKey, companyID, questionRowID)
function RemoveQuestionRow(rowID, rowDiv) {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    if (typeof rowID == "undefined" || rowID == null || rowID.length <= 0) {
        ShowErrorModal("Could not find row id to update.");
        return false;
    }

    var methodName = "RemoveQuestionRow";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, questionRowID: rowID
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
            }

            rowDiv.remove();
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

/*
string MoveQuestionRow(string secretKey, string companyID, string groupID, string rowIDToMove, string rowIDBelow)
//rowIDToMove - the ID of the question that is being moved
//rowIDBelow - the ID of the question that is below the question that is being moved (null if the new question is moved right to the bottom)
*/

function MoveQuestionRow(questionToMove, questionBelow) {

    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose employees you want to view.");
        return false;
    }

    var groupID = questionToMove.closest('.box').data('id');

    var questionIDToMove = questionToMove.data('qid');
    var questionIDBelow = null;
    if (questionBelow) {
        questionIDBelow = questionBelow.data('qid');
    }

    var methodName = "MoveQuestionRow";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyID: curComp.compID, groupID: groupID,
        rowIDToMove: questionIDToMove, rowIDBelow: questionIDBelow
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
                    $(".rowList").sortable("cancel");
                    var error = CleanError(data.RRZResult);
                    ShowErrorModal(error);
                    return false;
                }

                var response = JSON.parse(data.RRZResult);
                if (response.Status == 'Success') {
                    //Group order updated
                    GetGroupsAndQuestionsForSurvey(groupID);
                }
            }
        },
        error: function (a, e, d) {
            $(".rowList").sortable("cancel");
            ShowErrorModal(e + ' ' + d);
        }
    });
}



function initReportsOverview() {
    hideAllBtns();
    var allBoxToolBtns = $('#surveyReportsBox').find('.box-tools .btn');
    allBoxToolBtns.show();

    GetSurveyDynamicReports();
}

function GetSurveyDynamicReports() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company whose team you want to view.");
        return false;
    }

    if (typeof projID == "undefined" || projID == null || projID.length <= 0) {
        ShowErrorModal("Could not find a project to view.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find a survey to view.");
        return false;
    }

    var methodName = "GetDynamicReports";
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

                var reports = JSON.parse(data.RRZResult);
                var rep, userStr;

                $('#tblReportItems').dataTable().fnClearTable();
                for (var i = 0; i < reports.length; i++) {
                    rep = reports[i];
                    userStr = '';
                    if (rep.CreatedByID && rep.CreatedByName) {
                        userStr = '<a href="/Administration/Users?id=' + rep.CreatedByID + '" title="Edit User">' + rep.CreatedByName + '</a>';
                    }

                    $('#tblReportItems')
                        .dataTable()
                        .fnAddData(
                               [
                                   {
                                       "0": rep.ReportName,
                                       "1": userStr,
                                       "2": rep.DateCreated ? rep.DateCreated.DateWCF() : '',
                                       "3": '<a href="/Administration/DynamicReport?id=' + rep.ID + "&surveyid=" + survID + '" title="Edit Report">' + DT_AddCustom(rep.ID, 'fa fa-pencil btn text-black', 'DT_EvokeView') + '</a>' +
                                          '  ' + '<a target="_blank" href="../reports/View?report=DynamicReport&id=' + survID + '&id2=' + rep.ID + '" title="View Report">' + DT_AddCustom(rep.ID, 'fa fa-bar-chart btn text-black', 'DT_EvokeView') + '</a>',
                                       "DT_RowId": rep.ID,
                                   }
                               ]
                           );
                    //    'DynamicReport?id=' + newReportID + "&surveyid=" + survID
                }
                $('#tblReportItems tr').click(function (event) {
                    if ($(event.originalEvent.target).closest('td')[0] == $(event.originalEvent.target).closest('tr')[0].lastChild) return;

                    //location.href = "/Administration/Users?id=" + event.currentTarget.id;
                });
            }
        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}

// CreateDynamicReport(secretKey, ReportName, surveyID, companyToAddTo)
function CreateDynamicReport() {
    if (typeof userCode == "undefined" || userCode == null || userCode.length <= 0) {
        ShowErrorModal("We were unable to authenticate your request, please try logging in again.", true);
        return false;
    }

    if (typeof curComp == "undefined" || curComp == null || curComp.compID == "undefined" || curComp.compID == null) {
        ShowErrorModal("Please select a company to add report to.");
        return false;
    }

    var survID = getQueryParameter('id');

    if (typeof survID == "undefined" || survID == null || survID.length <= 0) {
        ShowErrorModal("Could not find a survey to add report to.");
        return false;
    }
    var newReportName = $('#newReportName').val();

    if (typeof newReportName == "undefined" || newReportName == null || newReportName.length <= 0) {
        ShowErrorModal("Could not find a report to view.");
        return false;
    }

    // CreateDynamicReport(secretKey, ReportName, surveyID, companyToAddTo)
    var methodName = "CreateDynamicReport";
    var jsonData = JSON.stringify({
        secretKey: userCode, companyToAddTo: curComp.compID, surveyID: survID, ReportName: newReportName
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

                var result = JSON.parse(data.RRZResult);

                var newReportID = result.ID;
                window.location.href = 'DynamicReport?id=' + newReportID + "&surveyid=" + survID;
            }

        },
        error: function (a, e, d) {
            ShowErrorModal(e + ' ' + d);
        }
    });
}
