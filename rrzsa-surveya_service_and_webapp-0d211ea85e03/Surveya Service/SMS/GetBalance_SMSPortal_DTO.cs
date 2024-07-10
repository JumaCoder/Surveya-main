using RRZTools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Surveya_Service.SMS
{

    //response for the GetBalance_SMSPortal method
    public class GetBalance_SMSPortal_DTO
    {
        public string Token { get; set; }
        public Int64 Balance { get; set; }
        public bool IsError { get; set; }
        public string Message { get; set; }

        //create an error
        public GetBalance_SMSPortal_DTO CreateError(string message)
        {
            IsError = true;
            Message = Utils.IsError(message) ? Utils.CleanError(message) : message;
            return this;
        }
    }


}
