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
    
    public partial class QuestionGroup
    {
        public System.Guid ID { get; set; }
        public string GroupType { get; set; }
        public string GroupName { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime DateCreated { get; set; }
        public Nullable<System.Guid> UpdatedBy { get; set; }
        public Nullable<System.DateTime> DateUpdated { get; set; }
        public long Position { get; set; }
        public System.Guid SurveyID { get; set; }
        public Nullable<System.Guid> ParentGroupID { get; set; }
        public string GroupHeading { get; set; }
    }
}
