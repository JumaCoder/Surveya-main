<%@ Page Title="Surveya | Branding" Language="C#" MasterPageFile="~/SiteLayout.Master" AutoEventWireup="true" CodeBehind="CompanyBranding.aspx.cs" Inherits="Surveya_Application.Administration.CompanyBranding" %>
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
            <li class="active"><i class="fa icon-branding"></i> Branding</li>
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
                  <h3 class="box-title">Branding</h3>
                  <div class="box-tools pull-right">
                     <span id="moreBtnSpan"></span>
                  </div>
               </div>

                

               <!-- /.box-header -->
               <div class="box-body">
                  <p class="text-danger">
                     <asp:Literal runat="server" ID="ErrorMessage" />
                  </p>
                  
                   <div class="well well-sm">
                     <p>
                         For branding changes to completely take effect, you will be required to re login<br />
                     </p>
                  </div>
                   <br />
                  <div class="row form-group">
                     <div class="col-xs-12 col-sm-6 image-with-controls text-center">
                        <label for="compImg">Company Landscape Logo <a class="badge bg-aqua" title="Logo will be shown on the top-left corner of this web app, on emails, and reports"><i class="fa fa-question"></i></a></label>
                        <img src="../Content/Images/placeholder_thumb.png" id="compImg" class="img-responsive logo-lg" alt="Company Logo">
                        <div class="input-group logo-lg">
                           <input id="compLogoTxt" type="text" class="form-control" placeholder="Choose Landscape Logo" readonly="readonly" disabled="disabled">
                           <span class="input-group-btn">
                              <a class="btn btn-default hiddenfile" title="Upload Logo"><i class="fa fa-paperclip"></i>
                                 <input id="compLogoUp" type="file" aria-invalid="false"> <!--  name="ctl00$MainContent$fileUploader" id="MainContent_fileUploader" -->
                              </a>
                              <button id="compLogoBtn" class="btn btn-default" disabled="disabled" type="button" title="Reset"><i class="fa fa-times"></i></button>
                           </span>
                        </div><!-- /input-group -->
                     </div><!-- /.col-lg-6 -->
                     <div class="col-xs-12 col-sm-6 image-with-controls text-center">
                        <label for="compImg">Company Square Logo <a class="badge bg-aqua" title="Logo will be shown on the top-left corner of this web app when the sidebar is minimised"><i class="fa fa-question"></i></a></label>
                        <img src="../Content/Images/placeholder_pin.png" id="compSqImg" class="img-responsive logo-mini" alt="Company Logo">
                        <div class="input-group logo-lg">
                           <input id="comSqLogoTxt" type="text" class="form-control" placeholder="Choose Square Logo" readonly="readonly" disabled="disabled">
                           <span class="input-group-btn">
                              <a class="btn btn-default hiddenfile" title="Upload Logo"><i class="fa fa-paperclip"></i>
                                 <input id="compSqLogoUp" type="file" aria-invalid="false"> <!--  name="ctl00$MainContent$fileUploader" id="MainContent_fileUploader" -->
                              </a>
                              <button id="compSqLogoBtn" class="btn btn-default" disabled="disabled" type="button" title="Reset"><i class="fa fa-times"></i></button>
                           </span>
                        </div><!-- /input-group -->
                     </div><!-- /.col-lg-6 -->

                  </div>

                  <div class="well well-sm">
                     <p>Landscape Logo will be resized to a maximum of 800px(width) and 500px(height)<br />
                        Square Logo will be resized to a maximum of 500px(width) and 500px(height)
                     </p>
                  </div>
                  
                  
                  <div class="col-xs-12">
                     <h3>Skins</h3>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-black" class="clearfix theme-block">
                           <div style="box-shadow: 0 0 2px rgba(0,0,0,0.1)" class="clearfix">
                              <span style="display: block; width: 20%; float: left; height: 22px; background: #fefefe;"></span>
                              <span style="display: block; width: 80%; float: left; height: 22px; background: #fefefe;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #222;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin">Black</p>
                     </div>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-black-light" class="clearfix theme-block">
                           <div style="box-shadow: 0 0 2px rgba(0,0,0,0.1)" class="clearfix">
                              <span style="display: block; width: 20%; float: left; height: 22px; background: #fefefe;"></span>
                              <span style="display: block; width: 80%; float: left; height: 22px; background: #fefefe;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #f9fafc;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin">Black Light</p>
                     </div>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-blue" class="clearfix theme-block">
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 22px; background: #367fa9;"></span>
                              <span class="bg-light-blue" style="display: block; width: 80%; float: left; height: 22px;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #222d32;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin">Blue</p>
                     </div>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-blue-light" class="clearfix theme-block">
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 22px; background: #367fa9;"></span>
                              <span class="bg-light-blue" style="display: block; width: 80%; float: left; height: 22px;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #f9fafc;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin">Blue Light</p>
                     </div>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-green" class="clearfix theme-block">
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 22px;" class="bg-green-active"></span>
                              <span class="bg-green" style="display: block; width: 80%; float: left; height: 22px;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #222d32;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin">Green</p>
                     </div>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-green-light" class="clearfix theme-block">
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 22px;" class="bg-green-active"></span>
                              <span class="bg-green" style="display: block; width: 80%; float: left; height: 22px;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #f9fafc;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin">Green Light</p>
                     </div>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-purple" class="clearfix theme-block">
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 22px;" class="bg-purple-active"></span>
                              <span class="bg-purple" style="display: block; width: 80%; float: left; height: 22px;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #222d32;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin">Purple</p>
                     </div>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-purple-light" class="clearfix theme-block">
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 22px;" class="bg-purple-active"></span>
                              <span class="bg-purple" style="display: block; width: 80%; float: left; height: 22px;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #f9fafc;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin">Purple Light</p>
                     </div>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-red" class="clearfix theme-block">
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 22px;" class="bg-red-active"></span>
                              <span class="bg-red" style="display: block; width: 80%; float: left; height: 22px;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #222d32;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin">Red</p>
                     </div>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-red-light" class="clearfix theme-block">
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 22px;" class="bg-red-active"></span>
                              <span class="bg-red" style="display: block; width: 80%; float: left; height: 22px;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #f9fafc;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin" style="font-size: 12px">Red Light</p>
                     </div>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-yellow" class="clearfix theme-block">
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 22px;" class="bg-yellow-active"></span>
                              <span class="bg-yellow" style="display: block; width: 80%; float: left; height: 22px;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #222d32;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin">Yellow</p>
                     </div>
                     <div class="col-xs-6 col-sm-4 col-md-3">
                        <a href="javascript:void(0);" data-skin="skin-yellow-light" class="clearfix theme-block">
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 22px;" class="bg-yellow-active"></span>
                              <span class="bg-yellow" style="display: block; width: 80%; float: left; height: 22px;"></span>
                           </div>
                           <div>
                              <span style="display: block; width: 20%; float: left; height: 50px; background: #f9fafc;"></span>
                              <span style="display: block; width: 80%; float: left; height: 50px; background: #f4f5f7;"></span>
                           </div>
                        </a>
                        <p class="text-center no-margin">Yellow Light</p>
                     </div>
                  </div>

                  <div>
                      <h3>Survey Theme</h3>
                      
                      <div class="row">
                          <div class="col-xs-12 col-sm-6 col-md-4">
                             <div class="form-group">
                                <label for="themePrimary">Primary Color (Header/Primary Button)</label>
                                <input type="color" id="themePrimary" value="#3c8dbc" class="form-control">
                             </div>
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4">
                             <div class="form-group">
                                <label for="themeSecondary">Secondary Color (Subsection)</label>
                                <input type="color" id="themeSecondary" value="#605ca8" class="form-control">
                             </div>
                          </div>
                      </div>

                  </div>
                  <div class="row">
                     <div class="col-xs-12">
                        <asp:Label ID="errorLbl" runat="server" CssClass="text-red" Visible="false" />
                     </div>
                  </div>
               </div>

               <div class="box-footer">
                  <div class="row">
                     <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 pull-right">
                        <div class="">
                           <a id="saveWhiteLabelling" class="btn btn-success btn-block btn-flat" title="Save Changes">Save</a>
                        </div>
                     </div>
                  </div>
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


</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="CustomScriptHolder" runat="server">
   <script src="../Content/js/Company.js"></script>
   <script>
      $(function () {
         if (user && user.LogoSM) {
            $('#compSqImg').attr('src', reBase64Data(user.LogoSM));
            smallPinNoBase = user.LogoSM;
         }
         if (user && user.LogoLG) {
            $('#compImg').attr('src', reBase64Data(user.LogoLG));
            smallThumbNoBase = user.LogoLG;
         }
         if (user && user.SelectedSkin) {
             selectedSkin = user.SelectedSkin;
         }
      })
   </script>
</asp:Content>
