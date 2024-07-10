<%@ Page Title="Surveya | Profile" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="Profile.aspx.cs" Inherits="Surveya_Application.Administration.Profile" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="navbarControls" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <!-- Content Header (Page header) -->
   <section class="content-header clearfix">
      <div class="pull-right">
         <ol class="breadcrumb">
            <li><a href="../Administration/"><i class="fa icon-dashboard"></i> Home</a></li>
            <li class="active"><i class="fa fa-user"></i> Profile</li>
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
                  <h3 class="box-title">Profile</h3>
                  <div class="box-tools pull-right">
                     <span id="moreBtnSpan"></span>
                     <button id="refreshProfile" type="button" class="btn btn-info" title="Refresh">
                        <i class="fa fa-refresh"></i>
                     </button>
                  </div>
               </div>
               <!-- /.box-header -->
               <div class="box-body" id="profileDiv">
                  <p class="text-danger">
                     <asp:Literal runat="server" ID="ErrorMessage" />
                  </p>
                  <div class="row">

                  </div>
                  <div class="row">
                     <div class="col-xs-12 col-md-6">
                        <div class="form-group">
                           <label for="userFirstname">First name(s)</label>
                           <input type="text" id="userFirstname" placeholder="First name(s)" class="form-control" required="required">
                        </div>
                     </div>
                     <div class="col-xs-12 col-md-6">
                        <div class="form-group">
                           <label for="userLastname">Last name</label>
                           <input type="text" id="userLastname" placeholder="Last name" class="form-control" required="required">
                        </div>
                     </div>
                  </div>
                  
                  <div class="row">
                     <div class="col-xs-12 col-md-6">
                        <div class="form-group has-feedback">
                           <label for="userContactNumber">Contact number</label>
                           <input type="text" id="userContactNumber" placeholder="Contact number" class="form-control" required="required">
                           <span class="glyphicon glyphicon-earphone form-control-feedback"></span>
                        </div>
                     </div>
                     <div class="col-xs-12 col-md-6">
                        <div class="form-group has-feedback">
                           <label for="userEmailAddress">Email</label>
                           <input type="email" id="userEmailAddress" placeholder="Email" class="form-control" disabled="disabled">
                           <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                        </div>
                     </div>
                  </div>

                  <div class="form-group has-feedback">
                     <label for="userCountry">Country</label>
                     <select id="userCountry" class="form-control" required="required"></select>
                  </div>

                  <div class="form-group has-feedback">
                     <label for="userAddress">Physical address</label>
                     <textarea rows="5" id="userAddress" placeholder="Physical address" class="form-control" required="required"></textarea>
                     <span class="glyphicon glyphicon-globe form-control-feedback"></span>
                  </div>

                  <div class="row">
                     <div class="col-xs-12 col-md-8">
                        <div class="form-group has-feedback">
                           <label for="userPassportNumber">Passport number</label>
                           <input type="text" id="userPassportNumber" placeholder="Passport number" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-md-4">
                        <div class="form-group has-feedback">
                           <label for="userPassportExpiryDate">Passport expiry date</label>
                           <input type="date" id="userPassportExpiryDate" placeholder="Passport expiry date" class="form-control">
                           <span class="fa fa-calendar form-control-feedback"></span>
                        </div>
                     </div>
                  </div>

                  <div class="row">
                     <div class="col-xs-12 col-md-4">
                        <div class="form-group">
                           <label for="userMedicalAidName">Medical aid name</label>
                           <input type="text" id="userMedicalAidName" placeholder="Medical aid name" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-md-4">
                        <div class="form-group">
                           <label for="userMedicalAidNumber">Medical aid number</label>
                           <input type="number" id="userMedicalAidNumber" placeholder="Medical aid number" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-md-4">
                        <div class="form-group">
                           <label for="userMedicalAidContactNumber">Medical aid contact number</label>
                           <input type="number" id="userMedicalAidContactNumber" placeholder="Medical aid contact number" class="form-control">
                        </div>
                     </div>
                  </div>

                  <div class="row">
                     <div class="col-xs-12 col-md-6">
                        <div class="form-group has-feedback">
                           <label for="userBloodType">Blood type</label>
                           <select id="userBloodType" class="form-control">
                              <option value="O-">O-</option>
                              <option value="O+">O+</option>
                              <option value="A-">A-</option>
                              <option value="A+">A+</option>
                              <option value="B-">B-</option>
                              <option value="B+">B+</option>
                              <option value="AB-">AB-</option>
                              <option value="AB+">AB+</option>
                           </select>
                        </div>
                     </div>

                     <div class="col-xs-12">
                        <div class="form-group has-feedback">
                           <br />
                           <label class="checkbox-inline">
                              <input type="checkbox" id="userHasAllergy"> 
                              Allergies
                           </label>
                        </div>
                     </div>
                  </div>

                  <div class="row" id="userAllergyDescDiv">
                     <div class="col-xs-12">
                        <div class="form-group has-feedback">
                           <label for="userAllergyDescription">Allergy description</label>
                           <textarea rows="3" id="userAllergyDescription" placeholder="Allergy description" class="form-control"></textarea>
                        </div>
                     </div>
                  </div>

                  <div class="row">
                     <div class="col-xs-12 col-md-6">
                        <div class="form-group">
                           <label for="userSafetyBootsSize">Safety boots size</label>
                           <input type="number" id="userSafetyBootsSize" placeholder="Safety boots size" class="form-control">
                        </div>
                     </div>
                     <div class="col-xs-12 col-md-6">
                        <div class="form-group">
                           <label for="highVisibilityVestSize">High visibility vest size</label>
                           <select id="highVisibilityVestSize" class="form-control">
                              <option value="XS">XS</option>
                              <option value="S">S</option>
                              <option value="M">M</option>
                              <option value="L">L</option>
                              <option value="XL">XL</option>
                           </select>
                        </div>
                     </div>
                     <div class="col-xs-12">
                        <div class="form-group has-feedback">
                           <fieldset>
                              <legend>Emergency contact(s)</legend>
                              <h4>Primary contact <small>required</small></h4>
                              <div class="row">
                                 <div class="col-xs-12">
                                    <div class="form-group has-feedback">
                                       <label for="emergencyContact1Fullname">Full name</label>
                                       <input type="text" id="emergencyContact1Fullname" placeholder="Full name" class="form-control" required="required">
                                    </div>
                                 </div>
                              </div>

                              <div class="row">
                                 <div class="col-xs-12 col-md-6">
                                    <div class="form-group has-feedback">
                                       <label for="emergencyContact1ContactNumber">Contact number</label>
                                       <input type="text" id="emergencyContact1ContactNumber" placeholder="Contact number" class="form-control" required="required">
                                       <span class="glyphicon glyphicon-earphone form-control-feedback"></span>
                                    </div>
                                 </div>
                                 <div class="col-xs-12 col-md-6">
                                    <div class="form-group has-feedback">
                                       <label for="emergencyContact1Relationship">Relationship</label>
                                       <input type="text" id="emergencyContact1Relationship" placeholder="Relationship" class="form-control" required="required">
                                    </div>
                                 </div>
                              </div>
                              
                              <h4>Secondary contact <small>optional</small></h4>
                              <div class="row">
                                 <div class="col-xs-12">
                                    <div class="form-group has-feedback">
                                       <label for="emergencyContact2Fullname">Full name</label>
                                       <input type="text" id="emergencyContact2Fullname" placeholder="Full name" class="form-control">
                                    </div>
                                 </div>
                              </div>

                              <div class="row">
                                 <div class="col-xs-12 col-md-6">
                                    <div class="form-group has-feedback">
                                       <label for="emergencyContact2ContactNumber">Contact number</label>
                                       <input type="text" id="emergencyContact2ContactNumber" placeholder="Contact number" class="form-control">
                                       <span class="glyphicon glyphicon-earphone form-control-feedback"></span>
                                    </div>
                                 </div>
                                 <div class="col-xs-12 col-md-6">
                                    <div class="form-group has-feedback">
                                       <label for="emergencyContact2Relationship">Relationship</label>
                                       <input type="text" id="emergencyContact2Relationship" placeholder="Relationship" class="form-control">
                                    </div>
                                 </div>
                              </div>
                           </fieldset>
                        </div>
                     </div>
                     <div class="col-xs-12">
                        <div class="form-group">
                           <fieldset>
                              <legend>Vaccinations</legend>
                              <div class="row">
                                 <div class="col-xs-6">
                                    <label>Vaccination Name</label>
                                 </div>
                                 <div class="col-xs-6">
                                    <label>Vaccination Expiry Date</label>
                                 </div>
                              </div>
                              <div id="vaccinationsDiv" class="row">
                              </div>
                              <div class="col-xs-12 text-center">
                                 <a id="addVaccination" class="btn btn-sm btn-flat btn-primary" title="Add a Vaccination"><i class="fa fa-plus"></i></a>
                              </div>
                           </fieldset>
                        </div>
                     </div>
                  </div>
                  <div class="row" id="DocumentList">
                     <div class="col-xs-12">
                        <div class="form-group has-feedback">
                           <fieldset>
                              <legend>Documents</legend>
                              <div class="row">
                                 <div class="col-xs-6">
                                    <label>Document Name</label>
                                 </div>
                                 <div class="col-xs-6">
                                    <label>Document Date</label>
                                 </div>
                              </div>
                              <div id="documentsDiv" class="row">
                              </div>
                              <div class="col-xs-12 text-center">
                                 <a id="addDocument" target="_blank" class="btn btn-sm btn-flat btn-primary" title="Add a Document"><i class="fa fa-plus"></i></a>
                              </div>
                           </fieldset>
                        </div>
                     </div>
                  </div>
                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="errorLbl" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>
               </div>
               <!-- /.box-body -->

               <div class="box-footer">
                  <div class="col-xs-12">
                     <div class="pull-right">
                        <a id="SaveUserDetails" class="btn btn-success btn-block btn-flat" title="Save Changes">Save</a>
                     </div>
                  </div>
                  <!-- /.col -->
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
   
   <div class="modal fade" id="viewDocumentModal">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
               <span id="viewDocumentModalHead" class="modal-title">Document</span>
            </div>
            
            <div class="modal-body row">
               <div class="col-xs-12">

                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="errorLbl1" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>

                  <%--<div class="form-group">
                     <label for="docFolder">Folder to upload document to: </label>
                     <strong>
                        <label id="docFolder"></label>
                     </strong>
                  </div>--%>

                  <div class="form-group">
                     <label for="docName">Document name</label>
                     <small>required</small>
                     <input type="text" id="docName" placeholder="Document name" class="form-control" />
                  </div>

                  <div class="form-group">
                     <label for="docTypeNum">Document Type</label>
                     <select id="docTypeNum" class="form-control">
                        <option value="0" selected="selected">Other</option>
                        <option value="1">Passport</option>
                        <option value="2">Visa</option>
                        <option value="3">Vaccination Certificates</option>
                        <option value="4">Customs Clearance Certificates</option>
                        <option value="5">ETickets</option>
                        <option value="6">Accommodation Confirmation</option>
                        <option value="7">Drivers License</option>
                     </select>
                  </div>

                  <div class="form-group">
                     <label for="docTypeDesc">Document Description</label>
                     <textarea id="docTypeDesc" placeholder="Document Description" rows="4" class="form-control"></textarea>
                  </div>

                  <div class="form-group">
                     <asp:Label runat="server" AssociatedControlID="docExpiryDate" Text="Expiry Date"></asp:Label>
                     <asp:TextBox runat="server" ID="docExpiryDate" TextMode="Date" placeholder="Expiry Date" CssClass="form-control"></asp:TextBox>
                  </div>

                  <div class="form-group">
                     <label>
                        <input type="checkbox" id="docIsProjectSpecific" />
                        Is Project Specific
                     </label>
                  </div>

                  <div class="form-group">
                     <label for="companyProjects">Company Projects</label>
                     <select id="companyProjects" class="form-control"></select>
                  </div>


                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="uploadErrorLbl" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>
               </div>
            </div>

            <div class="modal-footer">
               <a id="updateDocDetailsBtn" class="btn btn-success btn-flat pull-right">Save</a>
            </div>
         </div>
      </div>
   </div>

   <script type="text/template" id="docTypeSelectTemplate">
      <select class="form-control" data-doc="doctype[index]" disabled="disabled" readonly="readonly">
         <option value="0">Other</option>
         <option value="1">Passport</option>
         <option value="2">Visa</option>
         <option value="3">Vaccination Certificates</option>
         <option value="4">Customs Clearance Certificates</option>
         <option value="5">ETickets</option>
         <option value="6">Accommodation Confirmation</option>
         <option value="7">Drivers License</option>
      </select>
   </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/Profile.js"></script>
   <script>
      $(function () {
         GetMyDetails();
         GetMyCompanyDetails();
      });
   </script>
</asp:Content>
