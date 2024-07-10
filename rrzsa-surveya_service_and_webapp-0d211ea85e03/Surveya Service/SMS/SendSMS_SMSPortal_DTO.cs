using RRZTools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Surveya_Service.SMS
{
    //response for the SendSMS_SMSPortal method
    public class SendSMS_SMSPortal_DTO
    {
        public string Token { get; set; }
        public bool IsError { get; set; }
        public string Message { get; set; }

        public Int64 Cost { get; set; }
        public string CostBreakdown_Network { get; set; }
        public Int64 CostBreakdown_Cost { get; set; }
        public Int64 CostBreakdown_Quantity { get; set; }
        public Int64 ErrorReport_NoNetwork { get; set; }
        public Int64 ErrorReport_NoContents { get; set; }
        public Int64 ErrorReport_Duplicates { get; set; }
        public Int64 ErrorReport_OptedOuts { get; set; }
        public string ErrorReport_Faults { get; set; }
        public Int64 EventID { get; set; }
        public Int64 Messages { get; set; }
        public Int64 Parts { get; set; }
        public Int64 RemainingBalance { get; set; }
        public string Sample { get; set; }


        //create an error
        public SendSMS_SMSPortal_DTO CreateError(string message)
        {
            IsError = true;
            Message = Utils.IsError(message) ? Utils.CleanError(message) : message;
            return this;
        }
    }
}
