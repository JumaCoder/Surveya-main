//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Surveya_Service
{
    using System;
    using System.Collections.Generic;
    
    public partial class ActivityStream
    {
        public System.Guid ID { get; set; }
        public Nullable<System.Guid> CompanyID { get; set; }
        public Nullable<System.Guid> AffectedUserID { get; set; }
        public string AffectedUserFullName { get; set; }
        public Nullable<System.Guid> PerformedByUserID { get; set; }
        public string PerformedByUserFullName { get; set; }
        public string link { get; set; }
        public Nullable<System.Guid> ProjectID { get; set; }
        public string ProjectName { get; set; }
        public Nullable<System.Guid> SurveyID { get; set; }
        public string SurveyName { get; set; }
        public string ActivityMessage { get; set; }
        public Nullable<System.DateTime> ActivityDate { get; set; }
        public string ActivityType { get; set; }
        public Nullable<System.Guid> DocumentID { get; set; }
    }
}
