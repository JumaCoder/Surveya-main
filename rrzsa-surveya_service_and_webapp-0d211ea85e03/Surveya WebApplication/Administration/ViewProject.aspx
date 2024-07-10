<%@ Page Title="Surveya | Project" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="ViewProject.aspx.cs" Inherits="Surveya_Application.Administration.ViewProject" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
   <%--<style>
      .dataTables_filter, .dataTables_length{
          visibility:collapse;
      }
   </style>--%>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><a href="../Administration/"><i class="fa icon-dashboard"></i>&nbsp;Home</a></li>
            <li><a href="../Administration/Projects"><i class="fa icon-projects"></i>&nbsp;Projects</a></li>
            <li class="active"><i class="fa fa-suitcase"></i>&nbsp;<span class="projectNameTxt"></span></li>
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
                  <h3 class="box-title projectNameTxt">Project</h3>
                  <span class="hidden-md"><br /><br /></span>
                  <span id="projectLabels"></span>
                  <div class="box-tools pull-right">
                     <a id="StartProject" class="btn btn-default btn-flat" title="Start Project" style="display: none;">
                        <i class="fa fa-play"></i>
                     </a>
                     <a id="EndProject" class="btn btn-default btn-flat" title="Stop Project" style="display: none;">
                        <i class="fa fa-stop"></i>
                     </a>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body row" id="projectDiv">
                  <div class="col-xs-12">
                     <p class="text-danger">
                        <asp:Literal runat="server" ID="ErrorMessage1" />
                     </p>

                     <div class="box-group" id="accordion">
                        <!-- we are adding the .panel class so bootstrap.js collapse plugin detects it -->

                        <div id="overviewBox" class="panel box box-primary">
                           <div class="box-header with-border">
                              <h4 class="box-title">
                                 <a data-toggle="collapse" data-parent="#accordion" href="#projectOverview" aria-expanded="true">Project Overview
                                 </a>
                              </h4>
                              <div class="box-tools pull-right">
                                 <a id="viewProjectOverview" class="btn btn-default btn-flat" title="View" style="display: none;">
                                    <i class="fa fa-ban"></i>
                                 </a>
                                 <a id="editProjectOverview" class="btn btn-default btn-flat" title="Edit" style="display: none;">
                                    <i class="fa fa-pencil"></i>
                                 </a>
                                 <button id="refreshProjectToView" type="button" class="btn btn-info" title="Refresh" style="display: none;">
                                    <i class="fa fa-refresh"></i>
                                 </button>
                              </div>
                           </div>
                           <div id="projectOverview" class="panel-collapse collapse" aria-expanded="true">
                              <div class="box-body">
                                 <div class="row">
                                    <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                       <label for="projName">Project name</label>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                       <input id="projName" class="form-control" title="Project name" placeholder="Project name">
                                    </div>
                                 </div>
                                 <div class="row">
                                    <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                       <label for="projDescription">Project description</label>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                       <input id="projDescription" class="form-control" title="Project description" placeholder="Project description">
                                    </div>
                                 </div>
                                 <div class="row">
                                    <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                       <label for="projContactPerson">Primary contact person</label>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                       <select id="projContactPerson" class="form-control" title="Primary contact person"></select>
                                    </div>
                                 </div>
                                 <div class="row">
                                    <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                       <label for="projNumberOfMembers">Number of allocated users</label>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                       <input id="projNumberOfMembers" class="form-control" title="Number of allocated users" placeholder="Number of allocated users">
                                    </div>
                                 </div>
                                 <div class="row">
                                    <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                       <label for="projCountry">Country</label>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                       <select id="projCountryDDL" class="form-control" title="Country"></select>
                                    </div>
                                 </div>
                                 <div class="row">
                                    <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                       <label for="projstartDate">Start date</label>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                       <input type="date" id="projstartDate" class="form-control" title="Start date" placeholder="Start date">
                                    </div>
                                 </div>
                                 <div class="row">
                                    <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                       <label for="projendDate">End date</label>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                       <input type="date" id="projendDate" class="form-control" title="End date" placeholder="End date">
                                    </div>
                                 </div>
                              </div>
                              <div id="projectOverviewFooter" class="box-footer" style="display: none;">
                                 <div class="pull-right">
                                    <button id="saveProjectToView" type="button" class="btn btn-success btn-flat" title="Save">
                                       Save
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div id="requiredDataBox" class="panel box box-primary">
                           <div class="box-header with-border">
                              <h4 class="box-title">
                                 <a data-toggle="collapse" data-parent="#accordion" href="#requiredUserData" aria-expanded="false" class="collapsed">Required user data for the project
                                 </a>
                              </h4>
                              <div class="box-tools pull-right">
                                 <a id="viewRequiredUserData" class="btn btn-default btn-flat" title="View" style="display: none;">
                                    <i class="fa fa-ban"></i>
                                 </a>
                                 <a id="editRequiredUserData" class="btn btn-default btn-flat" title="Edit" style="display: none;">
                                    <i class="fa fa-pencil"></i>
                                 </a>
                                 <button id="refreshRequiredUserData" type="button" class="btn btn-info" title="Refresh" style="display: none;">
                                    <i class="fa fa-refresh"></i>
                                 </button>
                              </div>
                           </div>
                           <div id="requiredUserData" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                              <div class="box-body">
                                 <div class="row">
                                    <div class="col-xs-12"><strong>Emergency contact</strong></div>
                                    <div class="col-xs-5">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isPrimaryContactRequired" value="required"> Primary contact
                                       </label>
                                    </div>
                                    <div class="col-xs-7">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isSecondaryContactRequired" value="required"> Secondary contact 
                                       </label>
                                    </div>
                                    <div class="col-xs-12">
                                       <br />
                                    </div>
                                    <div class="col-xs-12"><strong>Passport</strong></div>
                                    <div class="col-xs-5">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isPassportNumberRequired" disabled="disabled">
                                          Passport number
                                       </label>
                                    </div>
                                    <div class="col-xs-7">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isPassportExpiryDateRequired" disabled="disabled">
                                          Passport expiry date
                                       </label>
                                    </div>
                                    <div class="col-xs-12">
                                       <br />
                                    </div>
                                    <div class="col-xs-12"><strong>Medical</strong></div>
                                    <div class="col-xs-5">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isBloodTypeRequired" disabled="disabled">
                                          Blood type
                                       </label>
                                    </div>
                                    <div class="col-xs-7">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isMedicalAidNameRequired" disabled="disabled">
                                          Medical aid name
                                       </label>
                                    </div>
                                    <div class="col-xs-5">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isVaccinationsRequired" disabled="disabled">
                                          Vaccinations
                                       </label>
                                    </div>
                                    <div class="col-xs-7">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isMedicalAidNumberRequired" disabled="disabled">
                                          Medical aid number
                                       </label>
                                    </div>
                                    <div class="col-xs-5">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isAllergiesRequired" disabled="disabled">
                                          Allergies
                                       </label>
                                    </div>
                                    <div class="col-xs-7">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isMedicalAidContactNumberRequired" disabled="disabled">
                                          Medical aid contact number
                                       </label>
                                    </div>
                                    <div class="col-xs-12">
                                       <br />
                                    </div>
                                    <div class="col-xs-12"><strong>Protective clothing</strong></div>
                                    <div class="col-xs-5">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isSafetyBootsRequired" disabled="disabled">
                                          Safety boots
                                       </label>
                                    </div>
                                    <div class="col-xs-7">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isVestRequired" disabled="disabled">
                                          High visibility vest
                                       </label>
                                    </div>
                                    <div class="col-xs-12">
                                       <br />
                                    </div>
                                    <div class="col-xs-12"><strong>Documents</strong></div>
                                    <div class="col-xs-5">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isPassportDocRequired" disabled="disabled">
                                          Passport
                                       </label>
                                    </div>
                                    <div class="col-xs-7">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isETicketDocRequired" disabled="disabled">
                                          E-tickets
                                       </label>
                                    </div>
                                    <div class="col-xs-5">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isVisaDocRequired" disabled="disabled">
                                          Visa
                                       </label>
                                    </div>
                                    <div class="col-xs-7">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isAccommodationDocRequired" disabled="disabled">
                                          Accommodation confirmations
                                       </label>
                                    </div>
                                    <div class="col-xs-5">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isVaccinationDocRequired" disabled="disabled">
                                          Vaccination certificates
                                       </label>
                                    </div>
                                    <div class="col-xs-7">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isDriversLicenseDocRequired" disabled="disabled">
                                          Drivers license
                                       </label>
                                    </div>
                                    <div class="col-xs-12">
                                       <label class="checkbox-inline">
                                          <input type="checkbox" id="isCustomsClearanceDocRequired" disabled="disabled">
                                          Customs clearance certificates
                                       </label>
                                    </div>
                                    <div class="col-xs-12">
                                       <br />
                                    </div>
                                    <div class="col-xs-12"><label for="otherInformationRequired"><strong>Other information required</strong></label></div>
                                    <div class="col-xs-12">
                                       <div class="form-group">
                                          <textarea rows="5" id="otherInformationRequired" placeholder="Other information required" class="form-control"></textarea>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div id="requiredUserDataFooter" class="box-footer" style="display: none;">
                                 <div class="pull-right">
                                    <button id="saveRequiredUserData" type="button" class="btn btn-success btn-flat" title="Save">
                                       Save
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div id="projectTeamBox" class="panel box box-primary">
                           <div class="box-header with-border">
                              <h4 class="box-title">
                                 <a id="projectTeamHead" data-toggle="collapse" data-parent="#accordion" href="#projectTeam" aria-expanded="false" class="collapsed">Project Team
                                 </a>
                              </h4>
                              <div class="box-tools pull-right">
                                 <button id="sendProjectUserBtn" type="button" class="btn btn-default btn-flat" title="Send Team Email" style="display: none;"><!-- Resend welcome/profile completion email -->
                                    <i class="fa fa-send"></i><!-- fa-envelope -->
                                 </button>
                                 <button id="addProjectUserBtn" type="button" class="btn btn-success btn-flat" title="Add User" style="display: none;">
                                    <i class="fa fa-plus"></i>
                                 </button>
                                 <button id="refreshProjectTeam" type="button" class="btn btn-info" title="Refresh" style="display: none;">
                                    <i class="fa fa-refresh"></i>
                                 </button>
                              </div>
                           </div>
                           <div id="projectTeam" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                              <div class="box-body row" id="teamDiv">
                                 <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                                    <div class="switch">
                                       <input id="x1" name="switch-x" type="radio" checked>
                                       <label for="x1">Hide Inactive</label>

                                       <input id="x" name="switch-x" type="radio">
                                       <label for="x">Show Inactive</label>
                                       <span></span>
                                    </div>
                                 </div>
                                 <div class="col-xs-12">
                                    <table id="tblTeamItems" class="table table-bordered table-striped compact">
                                       <thead>
                                          <tr>
                                             <th width="25%">Name</th>
                                             <th width="20%">Role</th>
                                             <th width="20%">Email</th>
                                             <th width="20%">Cell No</th>
                                             <th width="15%"></th>
                                          </tr>
                                       </thead>
                                       <tbody id="projectTBody"></tbody>
                                       <tfoot>
                                          <tr>
                                             <th width="25%">Name</th>
                                             <th width="20%">Role</th>
                                             <th width="20%">Email</th>
                                             <th width="20%">Cell No</th>
                                             <th width="15%"></th>
                                          </tr>
                                       </tfoot>
                                    </table>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div id="surveysBox" class="panel box box-primary">
                           <div class="box-header with-border">
                              <h4 class="box-title">
                                 <a id="projectSurveyHead" data-toggle="collapse" data-parent="#accordion" href="#projectSurvey" aria-expanded="false" class="collapsed">Project Surveys
                                 </a>
                              </h4>
                              <div class="box-tools pull-right">
                                 <button id="addProjectSurveyBtn" type="button" class="btn btn-success btn-flat" title="Add Survey" style="display: none;">
                                    <i class="fa fa-plus"></i>
                                 </button>
                                 <button id="refreshSurveys" type="button" class="btn btn-info" title="Refresh" style="display: none;">
                                    <i class="fa fa-refresh"></i>
                                 </button>
                              </div>
                           </div>
                           <div id="projectSurvey" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                              <div class="box">
                                 <div class="box-body row" id="projectListDiv">
                                    <div class="col-xs-12">
                                       <table id="tblSurveysItems" class="table table-bordered table-striped compact">
                                          <thead>
                                            <tr>
                                               <th width="15%">Survey Title</th>
                                               <th width="15%">Date Created</th>
                                               <th width="15%">Created By</th>
                                               <th width="15%">Start Date</th>
                                               <th width="15%">End Date</th>
                                               <th width="10%"></th>
                                            </tr>
                                         </thead>
                                         <tbody id="SurveyBody"></tbody>
                                         <tfoot>
                                            <tr>
                                               <th width="15%">Survey Title</th>
                                               <th width="15%">Date Created</th>
                                               <th width="15%">Created By</th>
                                               <th width="15%">Start Date</th>
                                               <th width="15%">End Date</th>
                                               <th width="10%"></th>
                                            </tr>
                                         </tfoot>
                                       </table>
                                    </div>
                                 </div>
                                 <!-- /.box-body -->
                                 <!-- NO box-footer -->
                              </div>
                           </div>
                        </div>

                        <div id="timelineBox" class="panel box box-primary">
                           <div class="box-header with-border">
                              <h4 class="box-title">
                                 <a data-toggle="collapse" data-parent="#accordion" href="#projectTimeline" aria-expanded="false" class="collapsed">Timeline
                                 </a>
                              </h4>
                              <div class="box-tools pull-right">
                                 <button id="refreshProjectTimeline" type="button" class="btn btn-info" title="Refresh" style="display:none;">
                                    <i class="fa fa-refresh"></i>
                                 </button>
                              </div>
                           </div>
                           <div id="projectTimeline" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                              <div class="box-body">
                                 <div class="row">
                                    <div class="col-md-12">
                                       <!-- The time line -->
                                       <ul class="timeline">
                                          <!-- timeline time label -->
                                          <li class="time-label first">
                                             <span class="bg-red">01 Jan. 2000</span>
                                          </li>
                                          <!-- END timeline item -->
                                          <!-- timeline item -->
                                          <li class="moreInfo">
                                             <div class="text-center">
                                                <a class="viewMoreTimeBtn btn btn-default">View more</a>
                                             </div>
                                          </li>
                                          <!-- END timeline item -->
                                          <!-- timeline item -->
                                          <li class="time-label last">
                                             <i class="fa fa-clock-o bg-gray"></i>
                                          </li>
                                       </ul>
                                    </div>
                                    <!-- /.col -->
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div class="row">
                        <div class="col-xs-12">
                           <asp:Label ID="errorLbl1" runat="server" CssClass="text-red" Visible="false" />
                        </div>
                     </div>
                  </div>
               </div>
               <!-- /.box-body -->
               <!-- / NO BOX FOOTER -->
            </div>
            <!-- /.box -->
         </div>
         <!-- /.activity-list-->
         <!-- /.col -->
      </div>
      <!-- /.row -->
   </section>
   <!-- /.content -->

   <div class="modal fade" id="addProjectUserModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="addProjectUserModalHead" class="modal-title">Add User to Project</h4>
            </div>

            <div class="modal-body row">
               <div class="col-xs-12">
                  <p class="text-red">
                     <span id="addProjectUserModalError"></span>
                  </p>

                  <div class="col-xs-12 col-sm-5">
                     <div class="form-group row">
                        <label for="NonTeamUserDDL">Select user</label>
                        <select id="NonTeamUserDDL" class="form-control"></select>
                     </div>
                  </div>
                  <div class="col-xs-1">
                     OR
                  </div>
                  <div class="col-xs-12 col-sm-6">
                     <div class="form-group row">
                        <label for="UserEmail">Invite user</label>
                        <input type="email" id="UserEmail" placeholder="User Email" class="form-control">
                     </div>
                  </div>

                  <div class="col-xs-12">
                     <div class="form-group row">
                        <label for="roleDDL">Role</label>
                        <select id="roleDDL" class="form-control"></select>
                     </div>
                  </div>

                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="Label1" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer">
               <a id="AddUserToProjBtn" class="btn btn-success btn-flat">Save</a>
            </div>
         </div>

         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>

   <div class="modal fade" id="addProjectSurveyModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="addProjectSurveyModalHead" class="modal-title">Create Survey</h4>
            </div>

            <div class="modal-body row">
               <div class="col-xs-12">
                  <p class="text-danger">
                     <asp:Literal runat="server" ID="Literal2" />
                  </p>

                  <div class="col-xs-12">
                     <div class="form-group row">
                        <label for="surveyTitle">Survey Title</label>
                        <input type="text" id="surveyTitle" placeholder="Survey Title" class="form-control">
                     </div>
                  </div>

                  <div class="col-xs-12">
                     <div class="form-group row">
                        <label for="surveyPurpose">Survey Purpose</label>
                        <textarea rows="5" id="surveyPurpose" placeholder="Survey Purpose" class="form-control"></textarea>
                     </div>
                  </div>

                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="Label2" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer">
               <a id="AddSurveyToProjBtn" class="btn btn-success btn-flat">Save</a>
            </div>
         </div>

         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>
   

   <div class="modal fade" id="importTeamsModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="importTeamsModalHead" class="modal-title">Import team from another project</h4>
            </div>

            <div class="modal-body row">
               <div class="col-xs-12">
                  <p class="text-red">
                     <span id="importTeamsModalError"></span>
                  </p>

                  <div class="col-xs-12">
                     <div class="form-group row">
                        <label for="projectsToImportList">Select project to import from</label>
                        <select id="projectsToImportList" class="form-control"></select>
                     </div>
                  </div>

                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="Label5" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer">
               <a id="importTeamsBtn" class="btn btn-success btn-flat">Import Team</a>
            </div>
         </div>

         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>

   <div class="modal fade" id="sendProjectTeamMailModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="sendProjectTeamMailModalHead" class="modal-title">(Re)send welcome/document request email</h4>
            </div>

            <div class="modal-body row">
               <div class="col-xs-12">
                  <p>An email will be sent to the project team requesting any outstanding documents</p>
               </div>
            </div>
            <div class="modal-footer">
               <a id="sendProjectTeamMailBtn" class="btn btn-success btn-flat">Send To Team</a>
            </div>
         </div>

         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>

   <div class="modal fade" id="importUserDocsModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="importUserDocsHead" class="modal-title">Import user documents to project</h4>
            </div>

            <div class="modal-body row">
               <div class="col-xs-12">
                  <p>Do you want to replace existing user documents in the project folder?</p>
               </div>
               <div class="col-xs-12">
                  <label>
                     <input type="checkbox" id="replaceExisting" /> Replace existing documents
                  </label>
               </div>
            </div>
            <div class="modal-footer">
               <a id="importUserDocsBtn" class="btn btn-success btn-flat">Import</a>
            </div>
         </div>

         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/Project.js"></script>
   <script>
      $(function () {
         //TODO get project timeline
         //GetProjectActivityStream(true);
         GetThisProjectToView();
         /*
         GetNonTeamUsers();
         GetCompanyRoles();
         */
      });
   </script>
</asp:Content>
