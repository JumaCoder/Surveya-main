<%@ Page Title="Surveya | Dynamic Reports" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="DynamicReport.aspx.cs" Inherits="Surveya_Application.Administration.DynamicReport" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
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
            <li><a class="surveyLink"><i class="fa fa-list-alt"></i>&nbsp;<span class="surveyNameTxt"></span></a></li>
            <li class="active"><i class="fa fa-list-alt"></i>&nbsp;<span class="reportNameTxt"></span></li>
         </ol>
      </div>
   </section>

   <!-- Main content -->
   <section class="content">
      <!-- Main row -->
      <div class="row">
         <!-- activity-list -->
         <div class="col-md-12" id="project-controls">
            <div class="box box-primary">
               <div class="box-header">
                  <h4 class="box-title">Dynamic Report for <a class="surveyLink"><span class="surveyNameTxt"></span></a></h4>
                  <span id="surveyLabels2"></span>
                  <div class="box-tools pull-right">
                     <a id="addDynamicReportFilter" class="btn btn-success btn-flat" title="Add Report Filter">
                        <i class="fa fa-plus"></i>
                     </a>
                     <a id="refreshDynamicReportFilters" class="btn btn-info" title="Refresh">
                        <i class="fa fa-refresh"></i>
                     </a>
                     <a id="viewDynamicReport" target="_blank" class="btn btn-primary" title="View Report">
                        <i class="fa fa-bar-chart"></i>
                     </a>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body" id="reportFilterList">
                  <div class="col-xs-12">

                     <div class="box-body">
                        <table id="tblFiltersItems" class="table table-bordered table-striped compact">
                           <thead>
                              <tr>
                                 <th width="60%">Filter</th>
                                 <th width="30%">Count</th>
                                 <th></th>
                              </tr>
                           </thead>
                           <tbody id="filterTBody"></tbody>

                        </table>
                     </div>
                     <!-- Filter 4 -->
                     <%--<div class="box box-default col-xs-12 col-lg-6">
                        <div class="col-xs-10">
                           <h4>Filter 4</h4>
                        </div>
                        <div class="col-xs-2 text-right"><a class="btn clearFilter text-danger" data-index="4" title="Clear filter"><i class="fa fa-times textX2"></i></a></div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Select Question</label>
                              <select data-index="4" class="form-control ConditionDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-2">
                           <div class="form-group">
                              <label>Condition</label>
                              <select data-index="4" class="form-control CompareDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Value</label>
                              <div data-index="4" class="CompareDiv">
                                 <div class="form-control"></div>
                              </div>
                           </div>
                        </div>
                     </div>--%>
                     <!-- Filter 4 END-->
                     <!-- Filter 5 -->
                     <%--<div class="box box-default col-xs-12 col-lg-6">
                        <div class="col-xs-10">
                           <h4>Filter 5</h4>
                        </div>
                        <div class="col-xs-2 text-right"><a class="btn clearFilter text-danger" data-index="5" title="Clear filter"><i class="fa fa-times textX2"></i></a></div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Select Question</label>
                              <select data-index="5" class="form-control ConditionDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-2">
                           <div class="form-group">
                              <label>Condition</label>
                              <select data-index="5" class="form-control CompareDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Value</label>
                              <div data-index="5" class="CompareDiv">
                                 <div class="form-control"></div>
                              </div>
                           </div>
                        </div>
                     </div>--%>
                     <!-- Filter 5 END-->
                     <!-- Filter 6 -->
                     <%--<div class="box box-default col-xs-12 col-lg-6">
                        <div class="col-xs-10">
                           <h4>Filter 6</h4>
                        </div>
                        <div class="col-xs-2 text-right"><a class="btn clearFilter text-danger" data-index="6" title="Clear filter"><i class="fa fa-times textX2"></i></a></div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Select Question</label>
                              <select data-index="6" class="form-control ConditionDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-2">
                           <div class="form-group">
                              <label>Condition</label>
                              <select data-index="6" class="form-control CompareDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Value</label>
                              <div data-index="6" class="CompareDiv">
                                 <div class="form-control"></div>
                              </div>
                           </div>
                        </div>
                     </div>--%>
                     <!-- Filter 6 END-->
                  </div>
                  <!-- TODO Panel content -->
                  <div class="col-xs-12">
                     <div>
                     </div>
                     <div class="emptyFilter">
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <!-- /.activity-list-->
         <!-- /.col -->
      </div>
      <!-- /.row -->
   </section>
   <!-- /.content -->

   <div class="modal fade" id="addFilterModal">
      <div class="modal-dialog modal-lg">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="addFilterModalHead" class="modal-title">Add Filter to Report</h4>
            </div>

            <div class="modal-body row">
               <div class="col-xs-12">
                  <p class="text-red">
                     <span id="addFilterModalError"></span>
                  </p>
                     <div class="col-xs-12 col-md-5">
                        <div class="form-group">
                           <label>Filter Name</label>
                           <input id="FilterName" type="text" class="form-control" />
                        </div>
                     </div>
                     <!-- Filter 1 -->
                     <div class="box box-default col-xs-12 col-lg-6">
                        <div class="col-xs-10">
                           <h4>Filter 1</h4>
                        </div>
                        <div class="col-xs-2 text-right"><a class="btn clearFilter text-danger" data-index="1" title="Clear filter"><i class="fa fa-times textX2"></i></a></div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Select Question</label>
                              <select data-index="1" class="form-control ConditionDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-2">
                           <div class="form-group">
                              <label>Condition</label>
                              <select data-index="1" class="form-control CompareDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Value</label>
                              <div data-index="1" class="CompareDiv">
                                 <div class="form-control"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <!-- Filter 1 END-->
                     <!-- Filter 2 -->
                     <div class="box box-default col-xs-12 col-lg-6">
                        <div class="col-xs-10">
                           <h4>Filter 2</h4>
                        </div>
                        <div class="col-xs-2 text-right"><a class="btn clearFilter text-danger" data-index="2" title="Clear filter"><i class="fa fa-times textX2"></i></a></div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Select Question</label>
                              <select data-index="2" class="form-control ConditionDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-2">
                           <div class="form-group">
                              <label>Condition</label>
                              <select data-index="2" class="form-control CompareDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Value</label>
                              <div data-index="2" class="CompareDiv">
                                 <div class="form-control"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <!-- Filter 2 END-->
                     <!-- Filter 3 -->
                     <div class="box box-default col-xs-12 col-lg-6">
                        <div class="col-xs-10">
                           <h4>Filter 3</h4>
                        </div>
                        <div class="col-xs-2 text-right"><a class="btn clearFilter text-danger" data-index="3" title="Clear filter"><i class="fa fa-times textX2"></i></a></div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Select Question</label>
                              <select data-index="3" class="form-control ConditionDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-2">
                           <div class="form-group">
                              <label>Condition</label>
                              <select data-index="3" class="form-control CompareDDL"></select>
                           </div>
                        </div>
                        <div class="col-xs-12 col-md-5">
                           <div class="form-group">
                              <label>Value</label>
                              <div data-index="3" class="CompareDiv">
                                 <div class="form-control"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <!-- Filter 3 END-->

                  <div class="row">
                     <div class="col-xs-12">
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer">
               <a id="saveFilter" class="btn btn-success btn-flat" title="Save filter">Save</a>
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
               <h4 id="addInnerGroupModalHead" class="modal-title">Add Question Group</h4>
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
                        <label for="innerGroupName">Group name</label>
                        <input type="text" id="innerGroupName" placeholder="Group name" class="form-control" />
                     </div>
                  </div>

                  <div class="col-xs-12">
                     <div class="form-group row">
                        <label for="innerGroupTypeDDL">Group type</label>
                        <select id="innerGroupTypeDDL" class="form-control">
                           <option value="Table">Table</option>
                           <option value="Normal">Normal</option>
                        </select>
                     </div>
                  </div>

                  <div class="row">
                     <div class="col-xs-12">
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
               <h4 id="deleteGroupModalHead" class="modal-title">Are you sure you want to delete this group?</h4>
            </div>

            <div class="modal-body row">
               <div class="col-xs-12">
                  <p>
                     Group <strong id="groupNameToDelete"></strong> will be deleted along with any subgroups and questions in it
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


</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/DynamicReport.js"></script>
   <script>
      $(function () {
         GetQuestionTypes();
         GetSpecificDynamicReport();
         GetAllSurveyQuestions();
         $('form').attr('novalidate', 'novalidate');
      });
   </script>
</asp:Content>
