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
    
    public partial class GetSurveyDetails_Result
    {
        public System.Guid ID { get; set; }
        public string SurveyTitle { get; set; }
        public System.DateTime DateCreated { get; set; }
        public System.Guid CreatedBy { get; set; }
        public string Purpose { get; set; }
        public Nullable<System.Guid> UpdatedBy { get; set; }
        public Nullable<System.DateTime> DateUpdated { get; set; }
        public Nullable<System.DateTime> StartDate { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
        public Nullable<System.Guid> StartedByUserID { get; set; }
        public Nullable<System.Guid> EndedByUserID { get; set; }
        public string SurveyConclusion { get; set; }
        public Nullable<bool> IsPageView { get; set; }
        public string SurveyTheme { get; set; }
        public System.Guid ProjectID { get; set; }
        public string ProjectName { get; set; }
        public System.Guid CompanyID { get; set; }
        public Nullable<int> NumberOfSurveyUsers { get; set; }
        public Nullable<int> NumberOfQuestions { get; set; }
        public Nullable<int> NumberOfResponses { get; set; }
        public Nullable<bool> IsEmailed { get; set; }
        public Nullable<System.Guid> EmailedUniqueID { get; set; }
        public Nullable<System.Guid> EmailedUserIDForResponses { get; set; }
        public string EmailedSurveyLink { get; set; }
    }
}
