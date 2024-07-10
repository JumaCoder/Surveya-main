

namespace Surveya_Service.SMS
{

   //Create a class with matching properties in appsettings.json file
   public class AppSettings
    {

      
        public AppSettings(){
           
        }

        public string LogFilePath {get; set; }
        public string EmailTemplateBasePath { get; set; }

        public string AspNetApplicationName { get; set; }
        public string AppName { get; set; }
        public string APIVersion { get; set; }

        public string RRZAdminRole {get; set; }
        public string AdminRole { get; set; }

        public string CompanyLogo {get; set;}
        public string ResetPasswordLink {get;set;}
        public string LoginLink {get; set;}
        public string BaseUploadDirectory { get; set; }


    }
}