//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SurveyaMapping
{
    using System;
    using System.Collections.Generic;
    
    public partial class AuditedRespons
    {
        public System.Guid ID { get; set; }
        public System.DateTime DateCreated { get; set; }
        public System.Guid CreatedBy { get; set; }
        public Nullable<System.DateTime> DateUpdated { get; set; }
        public Nullable<System.Guid> UpdatedBy { get; set; }
        public System.Guid SurveyID { get; set; }
        public System.Guid ResponseID { get; set; }
        public System.Guid ResponseCreatedBy { get; set; }
        public System.DateTime ResponseDateCreated { get; set; }
        public System.Guid ResponseValueID { get; set; }
        public string ResponseValue { get; set; }
        public System.Guid ResponseValueQuestionID { get; set; }
        public string ResponseValueQuestionText { get; set; }
    }
}
