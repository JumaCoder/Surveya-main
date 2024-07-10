using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;
using System.Web.UI;

namespace Surveya_Application
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkID=303951
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/WebFormsJs").Include(
                            "~/Scripts/WebForms/WebForms.js",
                            "~/Scripts/WebForms/WebUIValidation.js",
                            "~/Scripts/WebForms/MenuStandards.js",
                            "~/Scripts/WebForms/Focus.js",
                            "~/Scripts/WebForms/GridView.js",
                            "~/Scripts/WebForms/DetailsView.js",
                            "~/Scripts/WebForms/TreeView.js",
                            "~/Scripts/WebForms/WebParts.js"));

            // Order is very important for these files to work, they have explicit dependencies
            bundles.Add(new ScriptBundle("~/bundles/MsAjaxJs").Include(
                    "~/Scripts/WebForms/MsAjax/MicrosoftAjax.js",
                    "~/Scripts/WebForms/MsAjax/MicrosoftAjaxApplicationServices.js",
                    "~/Scripts/WebForms/MsAjax/MicrosoftAjaxTimer.js",
                    "~/Scripts/WebForms/MsAjax/MicrosoftAjaxWebForms.js"));

            // Use the Development version of Modernizr to develop with and learn from. Then, when you’re
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need
            //bundles.Add(new ScriptBundle("~/bundles/GlobalJS").Include(
            //                "~/Scripts/modernizr-*"
            //                ));

            bundles.Add(new ScriptBundle("~/bundles/thirdPartyJS").Include(
                            "~/Content/js/bootstrap.js",
                            "~/Scripts/jquery-2.1.0.min.js",
                            "~/DataTables/media/js/jquery.dataTables.min.js",
                            "~/Content/js/GlobalData.js",
                            "~/Content/js/custom.js",
                            "~/AdminLTE/plugins/datepicker/js/bootstrap-datepicker.js",
                            "~/AdminLTE/plugins/bootstrap-tour/js/bootstrap-tour.min.js"
                            ));

            /*
                    REMOVED THE FOLLOWING FORM 'thirdPartyJS'
             * 
                            "~/DataTables/media/js/TableTools.min.js",
                            "~/DataTables/media/js/ZeroClipboard.js",
                            "~/Scripts/jquery.cookie.js",
                            "Foundation/bower_components/foundation/js/vendor/fastclick.js",
                            "Foundation/bower_components/foundation/js/foundation.js",
                            "Foundation/js/app.js",
             */
            /*
            bundles.Add(new StyleBundle("~/bundles/AdminLTE").Include(
                        "~/Content/themes/AdminLTE/css/AdminLTE.css",
                         "~/Content/themes/AdminLTE/style/Skins/_all-skins.css",
                         "~/Content/themes/AdminLTE/style/Skins/skin-blue.css"
                ));
            */
            bundles.Add(new StyleBundle("~/bundles/AdminLTE").Include(
                        "~/AdminLTE/bootstrap/css/bootstrap.css",
                         "~/AdminLTE/plugins/font-awesome/css/font-awesome.min.css",
                         "~/AdminLTE/plugins/ionicons/css/ionicons.min.css"
                ));
            //admin-lte.min.css
            bundles.Add(new StyleBundle("~/bundles/AdminLTE_css").Include(
                "~/AdminLTE/bootstrap/css/bootstrap.min.css",
                "~/AdminLTE/plugins/font-awesome/css/font-awesome.min.css",
                "~/AdminLTE/dist/css/admin-lte.min.css",
                //"~/AdminLTE/dist/css/skins/_all-skins.min.css",
                "~/AdminLTE/dist/css/skins/_all-skins.css",
                "~/AdminLTE/dist/css/skin-black-light.css",
                "~/AdminLTE/documentation/css/style.css",
                "~/AdminLTE/plugins/icheck/css/all.css",
                "~/AdminLTE/plugins/datepicker/css/datepicker3.css"
                ));

            ScriptManager.ScriptResourceMapping.AddDefinition(
                "respond",
                new ScriptResourceDefinition
                {
                    Path = "~/Scripts/respond.min.js",
                    DebugPath = "~/Scripts/respond.js",
                });

            //Styles add the foundation styles
            bundles.Add(new StyleBundle("~/bundles/thirdPartyCss").Include(
                "~/DataTables/media/css/jquery.dataTables.css",
                "~/DataTables/media/css/jquery.dataTables_themeroller.css",
                "~/Content/css/site.css",
                "~/AdminLTE/plugins/icheck/css/all.css",
                "~/AdminLTE/plugins/jquery-ui/css/jquery-ui.min.css",
                "~/Content/css/icomoon.css",
                "~/AdminLTE/plugins/jvectormap/css/jquery-jvectormap-1.2.2.css",
                "~/AdminLTE/plugins/bootstrap-tour/css/bootstrap-tour.min.css"));



            /*
                    REMOVED THE FOLLOWING FORM 'thirdPartyJS'
             * 
                "~/DataTables/media/css/dataTables.bootstrap.css",
                "~/DataTables/media/css/jquery.dataTables.css",
                "~/DataTables/media/css/jquery.dataTables_themeroller.css",
                            
                "~/FontAwesome/css/font-awesome.min.css",
                "Foundation/bower_componenets/foundation/css/foundation.min.css",
                "Foundation/bower_componenets/foundation/css/normalize.css",
                "Foundation/stylesheets/app.css",
             */

            #region AdminLTE Bundles

            /*
            bundles.Add(new StyleBundle("~/bundles/AdminLTE_css").Include(
                "~/AdminLTE/bootstrap/css/bootstrap.min.css",
                "~/AdminLTE/plugins/font-awesome/css/font-awesome.min.css",
                "~/AdminLTE/dist/css/admin-lte.min.css",
                "~/AdminLTE/dist/css/skins/_all-skins.min.css",
                "~/AdminLTE/dist/css/skin-black-light.css",
                "~/AdminLTE/documentation/css/style.css",
                "~/AdminLTE/plugins/bootstrap-slider/css/slider.css",
                "~/AdminLTE/plugins/bootstrap-wysihtml5/css/bootstrap3-wysihtml5.min.css",
                "~/AdminLTE/plugins/datatables/css/dataTables.bootstrap.css",
                "~/AdminLTE/plugins/icheck/css/all.css",
                "~/AdminLTE/plugins/icheck/css/flat/flat.css",
                "~/AdminLTE/plugins/icheck/css/sqare/blue.css"
                ));
             */
            //  jquery-2.1.4.js for testing
            bundles.Add(new ScriptBundle("~/bundles/AdminLTE_js").Include(
                "~/AdminLTE/plugins/jquery/js/jQuery-2.1.4.min.js",
                "~/AdminLTE/bootstrap/js/bootstrap.min.js",
                "~/AdminLTE/dist/js/app.js",
                "~/AdminLTE/documentation/js/docs.js",
                "~/AdminLTE/plugins/bootstrap-slider/js/bootstrap-slider.js",
                "~/AdminLTE/plugins/chartjs/js/chart.min.js",
                "~/AdminLTE/plugins/colorpicker/js/bootstrap-colorpicker.min.js",
                "~/AdminLTE/plugins/datatables/js/jquery.dataTables.js",
                "~/AdminLTE/plugins/datatables/js/dataTables.bootstrap.min.js",
                "~/AdminLTE/plugins/icheck/js/icheck.min.js",
                "~/AdminLTE/plugins/slimscroll/js/jquery.slimscroll.min.js",
                "~/AdminLTE/plugins/jquery-ui/js/jquery-ui.min.js",
                            "~/AdminLTE/plugins/datepicker/js/bootstrap-datepicker.js"
                ));
            /*
                "~/AdminLTE/plugins/ckeditor/ckeditor.js",
                "~/AdminLTE/plugins/ckeditor/lang/en.js",

            // plugins | datepicker
            bundles.Add(new ScriptBundle("AdminLTE/plugins/datepicker/js").Include(
                                         "AdminLTE/plugins/datepicker/js/bootstrap-datepicker.js",
                                         "AdminLTE/plugins/datepicker/js/locales/bootstrap-datepicker*"));

            bundles.Add(new StyleBundle("AdminLTE/plugins/datepicker/css").Include(
                                        "AdminLTE/plugins/datepicker/css/datepicker3.css"));

            // plugins | daterangepicker
            bundles.Add(new ScriptBundle("AdminLTE/plugins/daterangepicker/js").Include(
                                         "AdminLTE/plugins/daterangepicker/js/moment.min.js",
                                         "AdminLTE/plugins/daterangepicker/js/daterangepicker.js"));

            bundles.Add(new StyleBundle("AdminLTE/plugins/daterangepicker/css").Include(
                                        "AdminLTE/plugins/daterangepicker/css/daterangepicker-bs3.css"));

            // plugins | fastclick
            bundles.Add(new ScriptBundle("AdminLTE/plugins/fastclick/js").Include(
                                         "AdminLTE/plugins/fastclick/js/fastclick.min.js"));

            // plugins | flot
            bundles.Add(new ScriptBundle("AdminLTE/plugins/flot/js").Include(
                                         "AdminLTE/plugins/flot/js/jquery.flot.min.js",
                                         "AdminLTE/plugins/flot/js/jquery.flot.resize.min.js",
                                         "AdminLTE/plugins/flot/js/jquery.flot.pie.min.js",
                                         "AdminLTE/plugins/flot/js/jquery.flot.categories.min.js"));
            */
            // plugins | font-awesome
            bundles.Add(new StyleBundle("~/AdminLTE/plugins/font-awesome/css").Include(
                                        "~/AdminLTE/plugins/font-awesome/css/font-awesome.min.css"));

            // plugins | fullcalendar
            bundles.Add(new ScriptBundle("~/AdminLTE/plugins/fullcalendar/js").Include(
                                         "~/AdminLTE/plugins/fullcalendar/js/fullcalendar.min.js"));

            bundles.Add(new StyleBundle("~/AdminLTE/plugins/fullcalendar/css").Include(
                                        "~/AdminLTE/plugins/fullcalendar/css/fullcalendar.min.css"));

            bundles.Add(new StyleBundle("~/AdminLTE/plugins/fullcalendar/css/print").Include(
                                        "~/AdminLTE/plugins/fullcalendar/css/print/fullcalendar.print.css"));
            /*
            // plugins | input-mask
            bundles.Add(new ScriptBundle("AdminLTE/plugins/input-mask/js").Include(
                                         "AdminLTE/plugins/input-mask/js/jquery.inputmask.js",
                                         "AdminLTE/plugins/input-mask/js/jquery.inputmask.date.extensions.js",
                                         "AdminLTE/plugins/input-mask/js/jquery.inputmask.extensions.js"));

            // plugins | ionicons
            bundles.Add(new StyleBundle("AdminLTE/plugins/ionicons/css").Include(
                                        "AdminLTE/plugins/ionicons/css/ionicons.min.css"));

            // plugins | ionslider
            bundles.Add(new ScriptBundle("AdminLTE/plugins/ionslider/js").Include(
                                         "AdminLTE/plugins/ionslider/js/ion.rangeSlider.min.js"));

            bundles.Add(new StyleBundle("AdminLTE/plugins/ionslider/css").Include(
                                        "AdminLTE/plugins/ionslider/css/ion.rangeSlider.css",
                                        "AdminLTE/plugins/ionslider/css/ion.rangeSlider.skinNice.css"));
            */
            // plugins | jquery
            bundles.Add(new ScriptBundle("~/AdminLTE/plugins/jquery/js").Include(
                                         "~/AdminLTE/plugins/jquery/js/jQuery-2.1.4.js"));

            // plugins | jquery-validate
            bundles.Add(new ScriptBundle("~/AdminLTE/plugins/jquery-validate/js").Include(
                                         "~/AdminLTE/plugins/jquery-validate/js/jquery.validate*"));

            // plugins | jquery-ui
            bundles.Add(new ScriptBundle("~/AdminLTE/plugins/jquery-ui/js").Include(
                                         "~/AdminLTE/plugins/jquery-ui/js/jquery-ui.min.js"));
            /*
            // plugins | jvectormap
            bundles.Add(new ScriptBundle("AdminLTE/plugins/jvectormap/js").Include(
                                         "AdminLTE/plugins/jvectormap/js/jquery-jvectormap-1.2.2.min.js",
                                         "AdminLTE/plugins/jvectormap/js/jquery-jvectormap-world-mill-en.js"));

            bundles.Add(new StyleBundle("AdminLTE/plugins/jvectormap/css").Include(
                                        "AdminLTE/plugins/jvectormap/css/jquery-jvectormap-1.2.2.css"));

            // plugins | knob
            bundles.Add(new ScriptBundle("AdminLTE/plugins/knob/js").Include(
                                         "AdminLTE/plugins/knob/js/jquery.knob.js"));

            // plugins | morris
            bundles.Add(new StyleBundle("AdminLTE/plugins/morris/css").Include(
                                        "AdminLTE/plugins/morris/css/morris.css"));

            // plugins | momentjs
            bundles.Add(new ScriptBundle("AdminLTE/plugins/momentjs/js").Include(
                                         "AdminLTE/plugins/momentjs/js/moment.min.js"));

            // plugins | pace
            bundles.Add(new ScriptBundle("AdminLTE/plugins/pace/js").Include(
                                         "AdminLTE/plugins/pace/js/pace.min.js"));

            bundles.Add(new StyleBundle("AdminLTE/plugins/pace/css").Include(
                                        "AdminLTE/plugins/pace/css/pace.min.css"));

            // plugins | sparkline
            bundles.Add(new ScriptBundle("AdminLTE/plugins/sparkline/js").Include(
                                         "AdminLTE/plugins/sparkline/js/jquery.sparkline.min.js"));

            // plugins | timepicker
            bundles.Add(new ScriptBundle("AdminLTE/plugins/timepicker/js").Include(
                                         "AdminLTE/plugins/timepicker/js/bootstrap-timepicker.min.js"));

            bundles.Add(new StyleBundle("AdminLTE/plugins/timepicker/css").Include(
                                        "AdminLTE/plugins/timepicker/css/bootstrap-timepicker.min.css"));

            // plugins | raphael
            bundles.Add(new ScriptBundle("AdminLTE/plugins/raphael/js").Include(
                                         "AdminLTE/plugins/raphael/js/raphael-min.js"));

            // plugins | select2
            bundles.Add(new ScriptBundle("AdminLTE/plugins/select2/js").Include(
                                         "AdminLTE/plugins/select2/js/select2.full.min.js"));

            bundles.Add(new StyleBundle("AdminLTE/plugins/select2/css").Include(
                                        "AdminLTE/plugins/select2/css/select2.min.css"));

            // plugins | morris
            bundles.Add(new ScriptBundle("AdminLTE/plugins/morris/js").Include(
                                         "AdminLTE/plugins/morris/js/morris.min.js"));
            */

            #endregion
        }
    }
}