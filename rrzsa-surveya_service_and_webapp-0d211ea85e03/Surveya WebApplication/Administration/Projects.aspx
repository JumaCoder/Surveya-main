<%@ Page Title="Surveya | Projects" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="Projects.aspx.cs" Inherits="Surveya_Application.Administration.Projects" %>

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
         <li><a href="../Administration"><i class="fa icon-dashboard"></i> Home</a></li>
         <li class="active"><i class="fa icon-projects"></i> Projects</li>
         </ol>
      </div>
   </section>

   <!-- Main content -->
   <section class="content">
      <!-- Main row -->
      <div class="row">
         <!-- activity-list -->
         <div class="col-md-12" id="activity-list">
            <div class="box">
               <div class="box-header">
                  <h3 class="box-title"><span class="companyNameHolder"></span> Projects</h3>
                  <div class="box-tools pull-right">
                     <button id="AddProj" type="button" class="btn btn-success btn-flat" title="Add Project">
                        <i class="fa fa-plus"></i>
                     </button>
                     <button id="refreshTbl" type="button" class="btn btn-info" title="Refresh">
                        <i class="fa fa-refresh"></i>
                     </button>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body">
                  <table id="tblItems" class="table table-bordered table-striped compact">
                     <thead>
                        <tr>
                           <th width="30%">Name</th>
                           <th width="30%">Description</th>
                           <th width="15%">Start Date</th>
                           <th width="15%">End Date</th>
                           <th></th>
                        </tr>
                     </thead>
                     <tbody id="projectTBody"></tbody>
                     
                  </table>
               </div>
               <!-- /.box-body -->
            </div>
            <!-- /.box -->
         </div>
         <!-- /.activity-list-->
         <!-- /.col -->
      </div>
      <!-- /.row -->
   </section>
   <!-- /.content -->

   
   <div class="modal fade" id="addEditProjectModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <h4 id="addEditProjectrModalHead" class="modal-title">New Project</h4>
            </div>
            
            <div class="modal-body row">
               <div class="col-xs-12">
                  <p class="text-danger">
                     <asp:Literal runat="server" ID="ErrorMessage1" />
                  </p>
                  <div class="form-group">
                     <label for="projName">Project name</label>
                     <input type="text" id="projName" placeholder="Project name" class="form-control">
                  </div>

                  <div class="form-group">
                     <label for="projDescription">Project description</label>
                     <textarea rows="3" id="projDescription" placeholder="Project description" class="form-control"></textarea>
                  </div>

                  <div class="form-group">
                     <label for="projContactPerson">Primary Contact person</label>
                     <select id="projContactPerson" class="form-control"></select>
                  </div>

                  <div class="form-group">
                     <label for="projCountryDDL">Project Location</label>
                     <select id="projCountryDDL" class="form-control"></select>
                  </div>

                  <div class="form-group">
                     <label for="projNumberOfMembers">Number of users</label>
                     <input type="number" id="projNumberOfMembers" title="Number of users" class="form-control">
                  </div>

                  <div class="row">
                     <div class="col-xs-12 col-sm-6">
                        <div class="form-group has-feedback">
                           <label for="projstartDate">Start date</label>
                           <input type="date" id="projstartDate" title="Start date" class="form-control">
                           <span class="fa fa-calendar form-control-feedback"></span>
                        </div>
                     </div>

                     <div class="col-xs-12 col-sm-6">
                        <div class="form-group has-feedback">
                           <label for="projendDate">End date</label>
                           <input type="date" id="projendDate" title="End date" class="form-control">
                           <span class="fa fa-calendar form-control-feedback"></span>
                        </div>
                     </div>
                  </div>

                  <div class="row">
                     <div class="col-xs-12"><h4>Required user data for the project</h4></div>
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
                     <div class="col-xs-12"><br /></div>
                     <div class="col-xs-12"><strong>Passport</strong></div>
                     <div class="col-xs-5">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isPassportNumberRequired" value="required"> Passport number
                        </label>
                     </div>
                     <div class="col-xs-7">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isPassportExpiryDateRequired" value="required"> Passport expiry date
                        </label>
                     </div>
                     <div class="col-xs-12"><br /></div>
                     <div class="col-xs-12"><strong>Medical</strong></div>
                     <div class="col-xs-5">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isBloodTypeRequired" value="required"> Blood type
                        </label>
                     </div>
                     <div class="col-xs-7">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isMedicalAidNameRequired" value="required"> Medical aid name
                        </label>
                     </div>
                     <div class="col-xs-5">
                        <label class="checkbox-inline">
                          <input type="checkbox" id="isVaccinationsRequired" value="required"> Vaccinations
                        </label>
                     </div>
                     <div class="col-xs-7">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isMedicalAidNumberRequired" value="required"> Medical aid number
                        </label>
                     </div>
                     <div class="col-xs-5">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isAllergiesRequired" value="required"> Allergies
                        </label>
                     </div>
                     <div class="col-xs-7">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isMedicalAidContactNumberRequired" value="required"> Medical aid contact number
                        </label>
                     </div>
                     <div class="col-xs-12"><br /></div>
                     <div class="col-xs-12"><strong>Protective clothing</strong></div>
                     <div class="col-xs-5">
                        <label class="checkbox-inline">
                          <input type="checkbox" id="isSafetyBootsRequired" value="required"> Safety boots
                        </label>
                     </div>
                     <div class="col-xs-7">
                        <label class="checkbox-inline">
                          <input type="checkbox" id="isVestRequired" value="required"> High visibility vest
                        </label>
                     </div>
                     <div class="col-xs-12"><br /></div>
                     <div class="col-xs-12"><strong>Documents</strong></div>
                     <div class="col-xs-5">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isPassportDocRequired" value="required"> Passport
                        </label>
                     </div>
                     <div class="col-xs-7">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isETicketDocRequired" value="required"> E-tickets
                        </label>
                     </div>
                     <div class="col-xs-5">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isVisaDocRequired" value="required"> Visa
                        </label>
                     </div>
                     <div class="col-xs-7">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isAccommodationDocRequired" value="required"> Accommodation confirmations
                        </label>
                     </div>
                     <div class="col-xs-5">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isVaccinationDocRequired" value="required"> Vaccination certificates
                        </label>
                     </div>
                     <div class="col-xs-7">
                        <label class="checkbox-inline">
                           <input type="checkbox" id="isDriversLicenseDocRequired" value="required"> Drivers license
                        </label>
                     </div>
                     <div class="col-xs-12">
                        <label class="checkbox-inline">
                          <input type="checkbox" id="isCustomsClearanceDocRequired" value="required"> Customs clearance certificates
                        </label>
                     </div>
                     <div class="col-xs-12"><br /></div>
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

            <div class="modal-footer">
               <a id="AddEditProjBtn" class="btn btn-success btn-flat">Save</a>
            </div>
         </div>
         
         <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
   </div>
   <!-- /.modal -->
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/Project.js"></script>
   <script>
      $(function () {
         GetCompanyProjects();
         GetCompany();
      });
   </script>
</asp:Content>
