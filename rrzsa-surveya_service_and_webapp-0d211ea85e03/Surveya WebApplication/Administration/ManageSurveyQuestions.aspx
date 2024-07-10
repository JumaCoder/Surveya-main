<%@ Page Title="Surveya | Survey Questions" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="ManageSurveyQuestions.aspx.cs" Inherits="Surveya_Application.Administration.ManageSurveyQuestions" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
    <style>
        /*this stops the CKEDITOR buttons from jumping around*/
       .cke_toolgroup .tooltip,
        .cke_toolbox_main .tooltip {
            display:none !important;
        }
       .overflow-overlay{
           overflow-y: scroll;
           overflow: overlay;
       }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Content Header (Page header) -->
    <section class="content-header clearfix">
        <div class="pull-right">
            <ol class="breadcrumb">
                <li><a href="../Administration/"><i class="fa icon-dashboard"></i>&nbsp;Home</a></li>
                <li><a href="../Administration/Surveys"><i class="fa icon-surveys"></i>&nbsp;Surveys</a></li>
                <li class="active"><i class="fa fa-list-alt"></i>&nbsp;<span class="surveyNameTxt"></span></li>
            </ol>
        </div>
    </section>

    <!-- Main content -->
    <section class="content">
        <!-- Main row -->
        <div class="row">
            <!-- activity-list -->
            <div class="col-md-12" id="project-controls">
                <div class="box">
                    <div class="box-header">
                        <%--<h4 class="box-title">Survey Questions</h4>--%>
                        <span class="hidden-md">
                            <br>
                            <br>
                        </span>
                        <span id="surveyLabels2"></span>
                        <div class="box-tools pull-right">
                            <a id="StartSurvey" class="btn btn-default btn-flat" title="Collect Responses" style="display: none;">
                                <i class="fa fa-play"></i>
                            </a>
                            <a id="EndSurvey" class="btn btn-default btn-flat" title="Stop Collection" style="display: none;">
                                <i class="fa fa-stop"></i>
                            </a>
                            <a id="updateSurveyView" class="btn btn-default" title="">
                                <i class="fa fa-list-alt text-purple"></i>
                                <span id="updateSurveyViewText" class="hidden-md hidden-sm hidden-xs"></span>
                            </a>
                            <a id="manageSurveyQuestionsTop" class="btn btn-default btn-flat" title="Help me!">
                                <i class="fa fa-info-circle"></i> Help
                            </a>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body row" id="questionDiv">
                        <p></p>
                        <div class="col-xs-12">
                            <p class="text-danger">
                                <asp:Literal runat="server" ID="ErrorMessage1" />
                            </p>

                            <div class="box-group">
                                <!-- we are adding the .panel class so bootstrap.js collapse plugin detects it -->

                                <div id="surveyQuestionsBox" class="panel box box-primary">
                                    <div class="box-header with-border">
                                        <h4 class="box-title surveyNameTxt">Survey</h4>
                                        <div class="box-tools pull-right">
                                            <a id="addQuestionGroupBtn" class="btn btn-success btn-flat" title="Add Page">
                                                <i class="fa fa-plus"></i>
                                            </a>
                                            <a id="refreshSurveyQuestions" class="btn btn-info" title="Refresh">
                                                <i class="fa fa-refresh"></i>
                                            </a>
                                            <a id="manageSurveyQuestionsQuestions" class="btn btn-default btn-flat" title="Help me!">
                                                <i class="fa fa-info-circle"></i>Help
                                            </a>
                                        </div>
                                    </div>
                                    <div id="groupList" class="box-body sortableDiv">
                                        <!-- TODO Panel content -->
                                        <div class="emptyQuestions">
                                            <span class="icon"><i class="fa fa-list-alt"></i></span>
                                            <span class="header">No question group(s) yet</span>
                                            <span class="subheader">Tap '+' to add section</span>
                                        </div>
                                    </div>

                                    <div class="addQuestionGroupBtn" style="border: dashed 1px #666666; border-radius: 5px; height: 50px; color: #666666; cursor: pointer;">
                                        <center style="margin-top: 14px;">Add Page <i style="vertical-align: middle;" class="fa fa-plus"></i></center>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <%--<div class="box-body row" id="responseDiv">
                  <div class="col-xs-12">
                     <div class="box-group">
                        <!-- we are adding the .panel class so bootstrap.js collapse plugin detects it -->

                              <div id="surveyQuestionResponsesBox" class="panel box box-primary">
                                 <div class="box-header with-border">
                                    <h4 class="box-title">Responses</h4>
                                    <div class="box-tools pull-right">
                                       <a id="ViewResponsesToAudit" target="_blank" class="btn btn-primary" title="Download Audit Responses">
                                          <i class="fa fa-table"></i>
                                       </a>
                                       <a id="CopyResponsesToAudit" class="btn btn-success" title="Copy Responses To Audit">
                                          <i class="fa fa-copy"></i>
                                       </a>
                                       <%- - <a id="uploadResponses" class="btn btn-primary" title="Upload Audited Responses">
                                          <i class="fa fa-upload"></i>
                                       </a>- - %>
                                       <% - -<asp:LinkButton runat="server" ID="uploadResponses" OnClick="showUploadDiv" CssClass="btn bg-aqua" ToolTip="Upload Audited Responses" Text="<i class='fa fa-upload'></i>"></asp:LinkButton> - - %>
                                       <a id="refreshSurveyQuestionResponses" class="btn btn-info" title="Refresh">
                                          <i class="fa fa-refresh"></i>
                                       </a>
                                    </div>
                                 </div>
                                 <div id="responseList" class="box-body">
                                    <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                       <!-- small box -->
                                       <div class="small-box bg-purple disabled ">
                                          <div class="inner">
                                             <h3 id="NumOfUploadedResponses">0</h3>
                                             <p>Uploaded Responses</p>
                                          </div>
                                          <div class="icon">
                                             <i class="fa fa-pie-chart"></i>
                                          </div>
                                          <span class="small-box-footer">Total Responses</span>
                                       </div>
                                    </div>
                                    <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                       <!-- small box -->
                                       <div class="small-box bg-green disabled ">
                                          <div class="inner">
                                             <h3 id="NumOfAuditedResponses">0</h3>
                                             <p>Audit Responses</p>
                                          </div>
                                          <div class="icon">
                                             <i class="fa fa-copy"></i>
                                          </div>
                                          <a id="CopyResponsesToAudit2" class="small-box-footer btn">Copy Responses To Audit</a>
                                       </div>
                                    </div>
                                    <div class="col-xs-12">
                                       <hr />
                                    </div>
                                    <asp:UpdatePanel runat="server">
                                       <Triggers>
                                          <asp:PostBackTrigger ControlID="uploadResponse" />
                                       </Triggers>
                                       <ContentTemplate>
                                          <div id="respModalPanel">
                                             <div class="col-xs-12">
                                                <h3>
                                                   <i class="fa fa-upload"></i> Upload Audited Responses
                                                </h3>
                                                <asp:Panel runat="server" ID="lblError" class="col-xs-12">
                                                   <small>
                                                      <asp:Label runat="server" ID="excelLbl" Text=""></asp:Label>
                                                   </small>
                                                </asp:Panel>

                                                <div class="form-group">
                                                   <asp:Label runat="server" AssociatedControlID="excelfileUpload" Text="Select File"></asp:Label>
                                                   <small>required</small>
                                                   <asp:FileUpload ID="excelfileUpload" runat="server" CssClass="form-control" />
                                                </div>

                                                <div class="col-xs-12">
                                                   <h4 class="text-yellow"><i class="icon fa fa-info"></i> Note</h4>
                                                   To speed up the audited response processing, you can delete all rows that have not been changed in the Excel file.
                                                </div>
                                             </div>
                                             <br />
                                             <div class="col-xs-12">
                                                <asp:Button ID="uploadResponse" runat="server" CssClass="btn btl-flat bg-light-blue pull-right"
                                                   OnClick="uploadResponse_Click" Text="Upload Response"/>
                                             </div>
                                          </div>
                                       </ContentTemplate>
                                    </asp:UpdatePanel>
                                 </div>
                              </div>
                     </div>
                  </div>
               </div>--%>
                </div>
            </div>
            <!-- /.activity-list-->
            <!-- /.col -->
        </div>
        <!-- /.row -->
    </section>
    <!-- /.content -->

    <div class="modal fade" id="addGroupModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="addGroupModalHead" class="modal-title">Add Page to Survey</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="addGroupModalError"></span>
                        </p>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="groupName">Page name</label>
                                <input type="text" id="groupName" placeholder="Page name" class="form-control" />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-xs-12">
                                <asp:Label ID="Label3" runat="server" CssClass="text-red" Visible="false" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="AddGroupBtn" class="btn btn-success btn-flat">Save</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="addInnerGroupModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="addInnerGroupModalHead" class="modal-title">Add Question Section</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="addInnerGroupModalError"></span>
                        </p>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="ParentGroupName">Page name</label>
                                <label id="ParentGroupName" class="form-control"></label>
                            </div>
                        </div>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="innerGroupName">Section name</label>
                                <input type="text" id="innerGroupName" placeholder="Section name" class="form-control" />
                            </div>
                        </div>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="innerGroupTypeDDL">Section Layout</label>
                                <select id="innerGroupTypeDDL" class="form-control">
                                    <option value="Table">Table</option>
                                    <option value="Normal">Normal</option>
                                </select>
                            </div>
                        </div>

                        <div id="innerGroupHeadingDiv" class="col-xs-12">
                            <div class="form-group row">
                                <label for="innerGroupHeading">Table Heading</label>
                                <input type="text" id="innerGroupHeading" placeholder="Table Heading" class="form-control" />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-xs-12">
                                <asp:Label ID="Label4" runat="server" CssClass="text-red" Visible="false" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="AddInnerGroupBtn" class="btn btn-success btn-flat">Save</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="deleteGroupModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="deleteGroupModalHead" class="modal-title">Are you sure you want to delete this Section?</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p>
                            Section <strong id="groupNameToDelete"></strong>will be deleted along with any subsections and questions in it
                 
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="deleteGroupAndQuestionsBtn" class="btn btn-danger btn-flat">Delete</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="questionModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="questionModalHead" class="modal-title">Add Question</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="questionModalError"></span>
                        </p>

                        <div class="form-group">
                            <label for="questionTxt">Question</label>
                            <input type="text" id="questionTxt" placeholder="Question" class="form-control" required="required">
                        </div>

                        <div class="form-group">
                            <label for="typeDDL">Type</label>
                            <select id="typeDDL" class="form-control">
                            </select>
                        </div>
                        
                        <div id="MaxRatingDiv" style="display: none;">
                            <label for="maxValue">Maximum rating</label>
                            <input id="maxValue" type="number" class="form-control" value="10" />
                        </div>

                        <div class="form-group" id="optionsSect">
                            <fieldset>
                                <legend>Type Options</legend>
                                <div class="col-xs-6"><small>Default | <a class="text-black" title="'Option Display Text' will be displayed">Option Display Text <i class="fa fa-question"></i></a></small></div>
                                <div class="col-xs-6"><small><a class="text-black" title="'Option Value' will be used for validation and/or calculations">Option Value <i class="fa fa-question"></i></a></small></div>
                                <div id="optionsDiv" class="row">
                                </div>
                                <div id="optionsOther" data-isother="false" class="row" style="display: none;">
                                    <div class="col-xs-12 form-group">
                                        <div class="col-xs-6">
                                            <div class="input-group">
                                                <span class="input-group-addon">
                                                    <a class="text-black" title="This option will allow users to type in another response"><i class="fa fa-question"></i></a>
                                                </span>
                                                <input type="text" value="Other" placeholder="Other" title="This option will allow users to type a different response to the provided" readonly="readonly" class="form-control">
                                            </div>
                                        </div>
                                        <div class="col-xs-5">
                                            <input type="text" value="Other" placeholder="Othere" title="This option will allow users to type a different response to the provided" readonly="readonly" class="form-control">
                                        </div>
                                        <div class="col-xs-1">
                                            <a class="btn btn-sm btn-flat btn-danger removeOptOther" title="Remove 'Other' option"><i class="fa fa-times"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12 col-md-2 col-md-offset-5 text-center">
                                        <a id="addOption" title="Add an answer option for Type" class="btn btn-sm btn-flat btn-primary"><i class="fa fa-plus"></i></a>
                                    </div>
                                    <div class="col-xs-12 col-md-5 text-right">
                                        <a id="addOtherOption" style="display: none;" title="Will allow users to type in another response" class="btn btn-sm btn-flat btn-info text-white">Add "Other"</a>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div class="form-group" id="calcControlDiv" style="display: none;">
                            <fieldset>
                                <legend>Calculation Controls</legend>
                                <div class="col-xs-12">
                                    <div class="col-xs-12 col-sm-5 col-md-4 col-lg-4">
                                        <h4>Question Controls</h4>
                                    </div>
                                    <span class="control-list col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                        <span class="btn btn-info btn-sm calculationBtn" data-id="open" data-text="(" data-type="symbol">( </span>&nbsp;
                             
                                        <span class="btn btn-info btn-sm calculationBtn" data-id="divide" data-text="/" data-type="symbol">/ </span>&nbsp;
                             
                                        <span class="btn btn-info btn-sm calculationBtn" data-id="multiply" data-text="*" data-type="symbol">* </span>&nbsp;
                             
                                        <span class="btn btn-info btn-sm calculationBtn" data-id="add" data-text="+" data-type="symbol">+ </span>&nbsp;
                             
                                        <span class="btn btn-info btn-sm calculationBtn" data-id="subtract" data-text="-" data-type="symbol">- </span>&nbsp;
                             
                                        <span class="btn btn-info btn-sm calculationBtn" data-id="close" data-text=")" data-type="symbol">) </span>&nbsp;
                             
                                        <span class="btn btn-info btn-sm calculationBtn" data-id="column" data-text="Column" data-type="column">Column </span>
                                    </span>
                                </div>
                                <div class="col-xs-12" id="questionColumnDiv">
                                    <div class="col-xs-9">
                                        <select id="questionsForCalcDDL" class="form-control"></select>
                                    </div>
                                    <div class="col-xs-2"><a id="addQuestionToCalc" class="btn btn-flat btn-block btn-success">Add</a></div>
                                </div>
                                <div class="col-xs-12">
                                    <div id="questionCalcDiv" class="questionCalcDiv" style="margin-top: 5px;"></div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <!-- /.modal-content -->

                <div class="modal-footer">
                    <a id="viewQuestionValitionBtn" class="btn bg-purple btn-flat pull-left" style="display: none;">Question Validation</a>
                    <a id="deleteQuestionBtn" class="btn btn-danger btn-flat" style="display: none;">Delete</a>
                    <a id="saveQuestionBtn" class="btn btn-success btn-flat">Save</a>
                </div>
            </div>

        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="questionValidationModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="questionValidationModalHead" class="modal-title">Manage Question Options</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="questionValidationModalError"></span>
                        </p>

                        <div class="form-group">
                            <h5>Question: <strong><span id="questionNameLbl"></span></strong></h5>
                            <h5>Type: <strong><span id="questionTypeLbl"></span></strong></h5>
                        </div>

                        <div class="form-group" id="validationSect">
                            <fieldset>
                                <legend>Question Parameters</legend>
                                <div id="validationDiv" class="row form-group">
                                    <div id="hasSumDiv" class="col-xs-12" style="display: none;">
                                        <div class="form-group">
                                            <input type="checkbox" id="hasSumCheck" />
                                            <label for="hasSumCheck">Question has sum</label>
                                        </div>
                                    </div>
                                    <div id="requiredDiv" class="col-xs-12">
                                        <div class="form-group">
                                            <input type="checkbox" id="RequiredQuestion" />
                                            <label for="RequiredQuestion">Question is Compulsory</label>
                                        </div>
                                    </div>
                                    <div id="MinMaxRow" style="display: none;">
                                        <div class="col-xs-12 col-md-6">
                                            <label for="minTxt">Minimum value</label>
                                            <input id="minTxt" class="form-control" />
                                        </div>
                                        <div class="col-xs-12 col-md-6">
                                            <label for="maxTxt">Maximum value</label>
                                            <input id="maxTxt" class="form-control" />
                                        </div>
                                    </div>
                                    <div id="textDiv" style="display: none;">
                                        <div class="col-xs-12 col-md-6">
                                            <label for="EqualsValue">Must be EQUAL to</label>
                                            <input id="EqualsValue" class="form-control" />
                                        </div>
                                        <div class="col-xs-12 col-md-6">
                                            <label for="NotEqualsValue">Must NOT be EQUAL to</label>
                                            <input id="NotEqualsValue" class="form-control" />
                                        </div>
                                        <div class="col-xs-12 col-md-6">
                                            <label for="StartsWithValue">Must START with</label>
                                            <input id="StartsWithValue" class="form-control" />
                                        </div>
                                        <div class="col-xs-12 col-md-6">
                                            <label for="EndsWithValue">Must END with</label>
                                            <input id="EndsWithValue" class="form-control" />
                                        </div>
                                        <div class="col-xs-12 col-md-6">
                                            <label for="ContainsValue">Must contain this value</label>
                                            <input id="ContainsValue" class="form-control" />
                                        </div>
                                        <div class="col-xs-12 col-md-6">
                                            <label for="LengthValue">Answer must be of length</label>
                                            <input type="text" id="LengthValue" class="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12 form-group">
                                        <div class="pull-left row" id="regExControls" style="display: none;">
                                            <div class="col-xs-12">
                                                <label for="regexDDL">Add more validation rules</label>
                                            </div>
                                            <div class="col-xs-10">
                                                <select id="regexDDL" class="form-control">
                                                    <option value="[a-zA-Z]+">Only letters</option>
                                                    <option value="^[A-Z]+">Starts with uppercase letter</option>
                                                    <option>Three</option>
                                                </select>
                                            </div>
                                            <div class="col-xs-1"><a id="addRegEx" class="btn btn-flat btn-primary"><i class="fa fa-plus"></i></a></div>
                                        </div>
                                        <div class="pull-right">
                                            <a id="advancedRegEx" class="btn btn-flat bg-purple">Show Advanced</a>
                                            <a id="simpleRegEx" class="btn btn-flat bg-purple" style="display: none;">Hide Advanced</a>
                                        </div>
                                    </div>
                                    <div id="regExDiv" class="col-xs-12" style="display: none;">
                                        <label for="regexTxt">Type out the validation rules</label>
                                        <textarea id="regexTxt" class="form-control" rows="5"></textarea>
                                        <label for="regexErrorTxt">Type out the validation error</label>
                                        <input type="text" id="regexErrorTxt" class="form-control" />
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <!-- /.modal-content -->

                <div class="modal-footer">
                    <a id="viewQuestionBtn" class="btn btn-primary btn-flat pull-left">Edit Question</a>
                    <a id="saveQuestionValidationBtn" class="btn btn-success btn-flat">Save</a>
                </div>
            </div>

        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="addTableRowModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="addTableRowModalHead" class="modal-title">Add Section to Survey</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="addTableRowModalError"></span>
                        </p>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="newRowText">Row text</label>
                                <input type="text" id="newRowText" placeholder="Row text" class="form-control" />
                            </div>
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <a id="AddRowBtn" class="btn btn-success btn-flat">Save</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- /.modal .fade -->

    <!--
   <div class="modal fade" id="addGroupPipingConditionModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="addGroupPipingConditionModalHead" class="modal-title">Add Piping Condition</h4>
            </div>

            <div class="modal-body row">
               <div class="col-xs-12">
                  <p class="text-red">
                     <span id="addGroupPipingConditionModalError"></span>
                  </p>

                  <div class="box-body">
                     <span class="control-list col-xs-12 col-sm-6 col-md-7 col-lg-8">
                        <span class="btn btn-info btn-sm controlBtn" data-id="open" data-text="(" data-type="symbol"> ( </span>&nbsp;
                        <span class="btn btn-info btn-sm controlBtn" data-id="and" data-text="AND" data-type="bitwise"> AND </span>&nbsp;
                        <span class="btn btn-info btn-sm controlBtn" data-id="or" data-text="OR" data-type="bitwise"> OR </span>&nbsp;
                        <span class="btn btn-info btn-sm controlBtn" data-id="close" data-text=")" data-type="symbol"> ) </span>&nbsp;
                        <span class="btn btn-info btn-sm controlBtn" data-id="condition" data-text="Condition" data-type="condition"> Condition </span>
                     </span>

                     <div id="conditionDiv" style="display:none;">
                        <div class="col-xs-12">
                           <div class="form-group row">
                              <label for="PipingConditionDDL">Select Question</label>
                              <select id="PipingConditionDDL" class="form-control"></select>
                           </div>
                        </div>

                        <div class="col-xs-12">
                           <div class="form-group row">
                              <label for="PipingCompareDDL">Condition</label>
                              <select id="PipingCompareDDL" class="form-control"></select>
                           </div>
                        </div>
                        <div class="col-xs-12">
                           <div class="row">
                              <label>Value</label>
                           </div>
                           <div id="PipingCompareDiv" class="row">
                           </div>
                        </div>
                     </div>

                     <div class="col-xs-12"> 
                        <div class="col-xs-12"><h4>Piping Conditions</h4></div>
                        <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
                           <select class="form-control pipingShowHide" data-show="none">
                              <option value="false">Hide when</option>
                              <option value="true">Show when</option>
                           </select>
                        </div>
                        <div class="col-xs-12 col-sm-5 col-md-7 col-lg-9">
                           <div class="pipingConditionDiv">&nbsp;</div>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-2 col-lg-1 left2 text-right">
                           <a class="btn btn-success btn-flat savePiping" style="display:none;" data-original-title="" title="">Save</a>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
            <div class="modal-footer">
               <a id="AddPipingConditionBtn" class="btn btn-success btn-flat">Add</a>
            </div>
         </div>

         <!-- /.modal-content - ->
      </div>
      <!-- /.modal-dialog - ->
   </div>
   -->

    <div class="modal fade" id="addGroupPipingConditionModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="addGroupPipingConditionModalHead" class="modal-title">Add Piping Condition</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="addGroupPipingConditionModalError"></span>
                        </p>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="PipingConditionDDL">Select Question</label>
                                <select id="PipingConditionDDL" class="form-control"></select>
                            </div>
                        </div>

                        <div class="col-xs-12">
                            <div class="form-group row">
                                <label for="PipingCompareDDL">Condition</label>
                                <select id="PipingCompareDDL" class="form-control"></select>
                            </div>
                        </div>
                        <div class="col-xs-12 PipingCompareDiv">
                            <div class="row">
                                <label>Value</label>
                            </div>
                            <div id="PipingCompareDiv" class="row">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="AddPipingConditionBtn" class="btn btn-success btn-flat">Add</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>


    <div class="modal fade" id="addQuestionFromToolboxModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-light-blue">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="addQuestionFromToolboxModalHead" class="modal-title text-center">Question Toolbox</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-red">
                            <span id="addQuestionFromToolboxModalError"></span>
                        </p>
                        <p class="text-center">Select a question options</p>

                        <div class="col-xs-12 col-md-5 col-md-offset-1">
                            <a class="btn text-black newQuesByType" data-type="rating" data-typeid="e4eebc6e-39c6-4853-8c70-007b5c256ef2"><i class="fa fa-star-half-empty"></i>&nbsp;&nbsp;Rating</a><br />
                            <a class="btn text-black newQuesByType" data-type="ddl" data-typeid="6502b9e8-c756-4ffb-bee8-27dd0b0b7bf4"><i class="fa icon-Dropdown-List"></i>&nbsp;&nbsp;Dropdown List</a><br />
                            <a class="btn text-black newQuesByType" data-type="textarea" data-typeid="85826014-c25c-4223-a9bf-28413a402718"><i class="fa icon-Multi-line-Textbox"></i>&nbsp;&nbsp;Multi-line Textbox</a><br />
                            <a class="btn text-black newQuesByType" data-type="text" data-typeid="316e3a95-c1cc-4edf-b7b4-32accaa2adbf"><i class="fa icon-Textbox"></i>&nbsp;Textbox</a><br />
                            <a class="btn text-black newQuesByType" data-type="date" data-typeid="921b8333-8651-4911-960b-4100876774d5"><i class="fa icon-Date"></i>&nbsp;&nbsp;Date</a><br />
                            <a class="btn text-black newQuesByType" data-type="checkbox" data-typeid="47c41586-cbce-428b-942d-508cee462c2d"><i class="fa icon-Check-Boxes"></i>&nbsp;&nbsp;Check Boxes</a><br />
                            <a class="btn text-black newQuesByType" data-type="calculation" data-typeid="525d9a3a-99a5-46b4-b5b3-958a2a723989"><i class="fa icon-Calculation"></i>&nbsp;&nbsp;Calculation</a><br />
                        </div>

                        <div class="col-xs-12 col-md-6 text-left">
                            <a class="btn text-black newQuesByType" data-type="radio" data-typeid="8abdc140-a41e-46dd-b0dc-a5a0e29103dd"><i class="fa fa-check-circle"></i>&nbsp;&nbsp;Radio Buttons</a><br />
                            <a class="btn text-black newQuesByType" data-type="location" data-typeid="051f6215-123e-4ffe-9f56-adb7ba3a5020"><i class="fa icon-Location"></i>&nbsp;&nbsp;Location</a><br />
                            <a class="btn text-black newQuesByType" data-type="camera" data-typeid="a4dcca9e-5ff7-4fcc-86b4-c91200441978"><i class="fa icon-Camera"></i>&nbsp;Camera</a><br />
                            <a class="btn text-black newQuesByType" data-type="numerical" data-typeid="2296589d-f6a9-4cad-ac36-d83414cd9429"><i class="fa icon-Number"></i>&nbsp;&nbsp;Number</a><br />
                            <a class="btn text-black newQuesByType" data-type="signature" data-typeid="fb10ac75-1604-4cef-92a6-f71e6733ca29"><i class="fa icon-Signature"></i>&nbsp;Signature</a><br />
                            <a class="btn text-black newQuesByType" data-type="email" data-typeid="b17754ca-ed3a-41c4-8a0a-21bd5beff666"><i class="fa icon-Email"></i>&nbsp;Email</a>
                            <a class="btn text-black newQuesByType" data-type="ddlMultiple" data-typeid="b74be861-00f2-4f48-a0b6-baffdc3c964e"><i class="fa icon-Multi-line-Textbox"></i>&nbsp;&nbsp;Dropdown List Multiple Options</a>
                        </div>

                        <div class="form-group text-center">
                        </div>

                        <div id="questionGroupsDiv" class="col-xs-12 text-center">
                            <a id="addQuestionGroup" class="btn btn-primary">Question Group</a>
                            <a id="addTableGroup" class="btn btn-primary">Table</a>
                        </div>

                        <select id="typeDDLL" class="form-control" style="display: none;">
                            <option value="e4eebc6e-39c6-4853-8c70-007b5c256ef2">Ratingz</option>
                            <option value="6502b9e8-c756-4ffb-bee8-27dd0b0b7bf4">Dropdown List</option>
                            <option value="85826014-c25c-4223-a9bf-28413a402718">Multi-line Textbox</option>
                            <option value="316e3a95-c1cc-4edf-b7b4-32accaa2adbf">Textbox</option>
                            <option value="921b8333-8651-4911-960b-4100876774d5">Date</option>
                            <option value="47c41586-cbce-428b-942d-508cee462c2d">Check Boxes</option>
                            <option value="525d9a3a-99a5-46b4-b5b3-958a2a723989">Calculation</option>
                            <option value="8abdc140-a41e-46dd-b0dc-a5a0e29103dd">Radio Buttons</option>
                            <option value="051f6215-123e-4ffe-9f56-adb7ba3a5020">Location</option>
                            <option value="b74be861-00f2-4f48-a0b6-baffdc3c964e">Dropdown List Multiple Options</option>
                            <option value="a4dcca9e-5ff7-4fcc-86b4-c91200441978">Camera</option>
                            <option value="2296589d-f6a9-4cad-ac36-d83414cd9429">Number</option>
                            <option value="fb10ac75-1604-4cef-92a6-f71e6733ca29">Signature</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="StartCollectionModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="StartCollectionModalHead" class="modal-title">
                        <i class="fa fa-question-circle text-aqua"></i>Are you sure you want to start collecting responses?
                    </h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <ul>
                            <li>You will no longer be able to edit questions if you continue.</li>
                            <li>You will still be able to add/remove users to this survey</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="StartCollectionBtn" data-dismiss="modal" class="btn bg-purple btn-flat">Collect</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="StopCollectionModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="StopCollectionModalHead" class="modal-title">
                        <i class="fa fa-question-circle text-orange"></i>Are you sure you want to stop collecting responses?
                    </h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <ul>
                            <li>You will no longer be able to collect responses for this survey.</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="StopCollectionBtn" data-dismiss="modal" class="btn bg-orange btn-flat">Stop Collection</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="infoModal">
        <div class="modal-dialog">

            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="infoModalHead" class="modal-title">Survey Creation</h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <h5>Things you can do...</h5>
                        <ul>
                            <li>Questionnaire is divided into pages</li>
                            <li>Pages are divided into sections (Normal layout OR Table layout)</li>
                            <li>Normal section lists questions sequentially.</li>
                            <li>Table section lists questions in grid format (Columns for questions and Rows for respondants)</li>
                            <li>Logic/Piping can be applied to pages or sections</li>
                            <li>Logic/Piping apply to current page/section and based on questions outside current page/section</li>
                            <li>Logic/Piping cannot be based on questions within page or section</li>
                            <li>Logic/Piping should be tested using the survey preview before starting the survey</li>
                        </ul>
                    </div>
                </div>

                <div class="modal-footer">
                    <label for="dontshowagain">Don't show this again.
                        <input type="checkbox" id="dontshowagain" class="icheckbox_minimal-blue" /></label>
                    <button type="button" class="btn btn-flat" data-dismiss="modal" aria-label="Close">Close</button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <div class="modal fade" id="GenerateSurveyEmailLinkModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id="GenerateSurveyEmailLinkModalHead" class="modal-title">
                        <i class="fa fa-question-circle text-aqua"></i>Make this survey publicly available?
                    </h4>
                </div>

                <div class="modal-body row">
                    <div class="col-xs-12">
                        <p class="text-warning">
                            <small>All reponses completed using this link will appear as being completed by a specific user, please specify this user.
                            </small>
                        </p>
                        <div class="form-group">
                            <label for="emailLinkUsers">Select user</label>
                            <select id="emailLinkUsers" class="form-control"></select>
                        </div>
                        <p>
                            Ensure the user you want to specify is active for the project this survey is part of.
                   
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="GenerateSurveyEmailLinkBtn" class="btn bg-purple btn-flat">Generate</a>
                </div>
            </div>

            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

    <%--<div class="modal fade" id="uploadResponsesModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <asp:Panel runat="server" ID="respModalPanel">

               <div class="modal-header bg-light-blue">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 id="uploadResponsesModalHead" class="modal-title text-center">Upload Responses</h4>
               </div>

               <div class="modal-body row">
                  <div class="col-xs-12">
                     <p class="text-red">
                        <span id="uploadResponsesModalError"></span>
                     </p>

                     <asp:Panel runat="server" ID="lblError" class="col-xs-12">
                        <asp:Label runat="server" ID="excelLbl"></asp:Label>
                     </asp:Panel>

                     <div class="form-group">
                        <asp:Label runat="server" AssociatedControlID="excelfileUpload" Text="Select File"></asp:Label>
                        <small>required</small>
                        <asp:FileUpload ID="excelfileUpload" runat="server" CssClass="form-control" />
                     </div>

                     <div class="col-xs-12">
                        <h4 class="text-yellow"><i class="icon fa fa-info"></i>Note</h4>
                        To speed up the audited response processing, you can delete all rows that have not been changed.
                     </div>
                  </div>
               </div>

               <div class="modal-footer">
                  <asp:Button ID="uploadResponse" runat="server" CssClass="btn btl-flat bg-light-blue" Text="Upload Response" OnClick="uploadResponse_Click" />
               </div>

            </asp:Panel>
         </div>

         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>--%>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
    <script src="../Content/js/Survey.js"></script>
    <script src="../Content/js/Tours.js"></script>
    <script>
        $(function () {
            initForQuestions();
        });
    </script>
</asp:Content>
