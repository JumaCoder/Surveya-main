<%@ Page Title="Surveya | Project" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="ManageProject.aspx.cs" Inherits="Surveya_Application.Administration.ManageProject" %>

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
            <li><a href="../Administration/Projects"><i class="fa fa-suitcase"></i>&nbsp;Projects</a></li>
            <li class="active"><i class="fa fa-suitcase"></i>&nbsp;<span class="projectNameTxt">PROJECT NAME</span></li>
         </ol>
      </div>
   </section>

   <!-- Main content -->
   <section class="content">
      <!-- Main row -->
      <div class="row">
         <!-- activity-list -->
         <div class="col-md-12" id="project-controls">
            <ul class="nav nav-pills nav-justified" id="projTabs">
               <li role="presentation" class="active"><a href="#details">Details</a></li>
               <li role="presentation"><a href="#team">Team&nbsp;<span id="ProjectTeam"></span></a></li>
               <li role="presentation"><a href="#questions">Surveys&nbsp;<span id="ProjectSurveys"></span></a></li>
            </ul>
            <!-- Tab panes -->
            <div class="tab-content">
               <div role="tabpanel" class="tab-pane active" id="details">
                  <div class="box">
                     <div class="box-header">
                        <h3 class="box-title projectNameTxt">Project</h3>
                        <div class="box-tools pull-right">
                           <button id="refreshProject" type="button" class="btn btn-info" title="Refresh">
                              <i class="fa fa-refresh"></i>
                           </button>
                        </div>
                     </div>
                     <!-- /.box-header -->
                     <div class="box-body row" id="projectDiv">
                        <div class="col-xs-12">
                           <p class="text-danger">
                              <asp:Literal runat="server" ID="ErrorMessage1" />
                           </p>
                           <div class="form-group has-feedback">
                              <label for="projName">Project name</label>
                              <input type="text" id="projName" placeholder="Project name" class="form-control">
                           </div>

                           <div class="form-group has-feedback">
                              <label for="projDescription">Project description</label>
                              <textarea rows="3" id="projDescription" placeholder="Project description" class="form-control"></textarea>
                           </div>

                           <div class="form-group">
                              <label for="projContactPerson">Primary contact person</label>
                              <select id="projContactPerson" class="form-control"></select>
                           </div>


                           <div class="row">
                              <div class="col-xs-12 col-sm-6">
                                 <div class="form-group has-feedback">
                                    <label for="projCountryDDL">Country</label>
                                    <select id="projCountryDDL" class="form-control"></select>
                                 </div>
                              </div>

                              <div class="col-xs-12 col-sm-6">
                                 <div class="form-group has-feedback">
                                    <label for="projNumberOfMembers">Number of users</label>
                                    <input type="number" id="projNumberOfMembers" placeholder="Number of users" class="form-control">
                                 </div>
                              </div>
                           </div>

                           <div class="row">
                              <div class="col-xs-12 col-sm-6">
                                 <div class="form-group has-feedback">
                                    <label for="projstartDate">Start date</label>
                                    <input type="date" id="projstartDate" placeholder="Start date" class="form-control">
                                    <span class="fa fa-calendar form-control-feedback"></span>
                                 </div>
                              </div>

                              <div class="col-xs-12 col-sm-6">
                                 <div class="form-group has-feedback">
                                    <label for="projendDate">End date</label>
                                    <input type="date" id="projendDate" placeholder="End date" class="form-control">
                                    <span class="fa fa-calendar form-control-feedback"></span>
                                 </div>
                              </div>
                           </div>

                           <div class="row">
                              <div class="col-xs-12">
                                 <h4>Required user data for the project</h4>
                              </div>
                              <div class="col-xs-12"><strong>Passport</strong></div>
                              <div class="col-xs-5">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isPassportNumberRequired" value="required">
                                    Passport number
                                 </label>
                              </div>
                              <div class="col-xs-7">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isPassportExpiryDateRequired" value="required">
                                    Passport expiry date
                                 </label>
                              </div>
                              <div class="col-xs-12">
                                 <br />
                              </div>
                              <div class="col-xs-12"><strong>Medical</strong></div>
                              <div class="col-xs-5">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isBloodTypeRequired" value="required">
                                    Blood type
                                 </label>
                              </div>
                              <div class="col-xs-7">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isMedicalAidNameRequired" value="required">
                                    Medical aid name
                                 </label>
                              </div>
                              <div class="col-xs-5">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isVaccinationsRequired" value="required">
                                    Vaccinations
                                 </label>
                              </div>
                              <div class="col-xs-7">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isMedicalAidNumberRequired" value="required">
                                    Medical aid number
                                 </label>
                              </div>
                              <div class="col-xs-5">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isAllergiesRequired" value="required">
                                    Allergies
                                 </label>
                              </div>
                              <div class="col-xs-7">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isMedicalAidContactNumberRequired" value="required">
                                    Medical aid contact number
                                 </label>
                              </div>
                              <div class="col-xs-12">
                                 <br />
                              </div>
                              <div class="col-xs-12"><strong>Protective clothing</strong></div>
                              <div class="col-xs-5">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isSafetyBootsRequired" value="required">
                                    Safety boots
                                 </label>
                              </div>
                              <div class="col-xs-7">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isVestRequired" value="required">
                                    High visibility vest
                                 </label>
                              </div>
                              <div class="col-xs-12">
                                 <br />
                              </div>
                              <div class="col-xs-12"><strong>Documents</strong></div>
                              <div class="col-xs-5">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isPassportDocRequired" value="required">
                                    Passport
                                 </label>
                              </div>
                              <div class="col-xs-7">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isETicketDocRequired" value="required">
                                    E-tickets
                                 </label>
                              </div>
                              <div class="col-xs-5">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isVisaDocRequired" value="required">
                                    Visa
                                 </label>
                              </div>
                              <div class="col-xs-7">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isAccommodationDocRequired" value="required">
                                    Accommodation confirmations
                                 </label>
                              </div>
                              <div class="col-xs-5">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isVaccinationDocRequired" value="required">
                                    Vaccination certificates
                                 </label>
                              </div>
                              <div class="col-xs-7">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isDriversLicenseDocRequired" value="required">
                                    Drivers license
                                 </label>
                              </div>
                              <div class="col-xs-12">
                                 <label class="checkbox-inline">
                                    <input type="checkbox" id="isCustomsClearanceDocRequired" value="required">
                                    Customs clearance certificates
                                 </label>
                              </div>
                              <div class="col-xs-12">
                                 <br />
                              </div>
                              <div class="col-xs-12">
                                 <div class="form-group">
                                    <label for="otherInformationRequired">Other information required</label>
                                    <textarea rows="5" id="otherInformationRequired" placeholder="Other information required" class="form-control"></textarea>
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
                     <div class="box-footer">
                        <div class="col-xs-12">
                           <div class="pull-right">
                              <a id="EditProjBtn" class="btn btn-success btn-block btn-flat">Save</a>
                           </div>
                        </div>
                        <!-- /.col -->
                     </div>
                  </div>
               </div>

               <div role="tabpanel" class="tab-pane" id="team">
                  <div class="box">
                     <div class="box-header">
                        <h3 class="box-title">Project Team</h3>
                        <div class="box-tools pull-right">
                           <button id="addProjectUserBtn" type="button" class="btn btn-success btn-flat" title="Add User">
                              <i class="fa fa-plus"></i>
                           </button>
                           <button id="refreshTeamBtn" type="button" class="btn btn-info" title="Refresh">
                              <i class="fa fa-refresh"></i>
                           </button>
                        </div>
                        <div class="row">
                           <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                              <div class="switch">
                                 <input id="x" name="switch-x" type="radio" checked>
                                 <label for="x">Hide Inactive</label>

                                 <input id="x1" name="switch-x" type="radio">
                                 <label for="x1">Show Inactive</label>

                                 <span></span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <!-- /.box-header -->
                     <div class="box-body row" id="teamDiv">
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
                     <!-- /.box-body -->
                     <!-- NO box-footer -->
                  </div>
               </div>

               <div role="tabpanel" class="tab-pane" id="questions">
                  <div class="box">
                     <div class="box-header">
                        <h3 class="box-title">Project Surveys</h3>
                        <div class="box-tools pull-right">
                           <button id="addProjectSurveyBtn" type="button" class="btn btn-success btn-flat" title="Add Survey">
                              <i class="fa fa-plus"></i>
                           </button>
                           <button id="refreshSurveys" type="button" class="btn btn-info" title="Refresh">
                              <i class="fa fa-refresh"></i>
                           </button>
                        </div>
                     </div>
                     <!-- /.box-header -->
                     <div class="box-body row" id="projectListDiv">
                        <div class="col-xs-12">
                           <table id="tblSurveysItems" class="table table-bordered table-striped compact">
                              <thead>
                                 <tr>
                                    <th width="20%">Survey Title</th>
                                    <th width="20%">Purpose</th>
                                    <th width="20%">Created By</th>
                                    <th width="15%">Start Date</th>
                                    <th width="15%">End Date</th>
                                    <th width="10%"></th>
                                 </tr>
                              </thead>
                              <tbody id="projectSBody"></tbody>
                              <tfoot>
                                 <tr>
                                    <th width="20%">Survey Title</th>
                                    <th width="20%">Purpose</th>
                                    <th width="20%">Created By</th>
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
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/Project.js"></script>
   <script>
      $(function () {
         GetThisProject();
      });
   </script>
</asp:Content>
