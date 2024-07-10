

namespace Surveya_Service.SMS
{

   //Create a class with matching properties
   public class SMSSettings
    {

      
        public SMSSettings(){
           
        }

        public string ClientID {get; set;}
        public string APISecret {get; set;}
        public string APIBaseUrl {get; set;}
        public string SMSCreditsEmail {get; set;}
        public bool TestMode {get;set; }
        //include footer always, will override IncludeSMSFooterIfSpace if true
        public bool IncludeSMSFooterAlways { get; set; }
        //include footer only if there is space in the current credit
        public bool IncludeSMSFooterIfSpace { get; set; }
        public string SMSFooterText { get; set; }
    }
}