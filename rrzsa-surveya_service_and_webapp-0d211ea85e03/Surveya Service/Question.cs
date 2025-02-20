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
    
    public partial class Question
    {
        public System.Guid ID { get; set; }
        public string QuestionText { get; set; }
        public Nullable<System.Guid> QuestionType { get; set; }
        public long Position { get; set; }
        public System.Guid GroupID { get; set; }
        public Nullable<System.Guid> UpdatedBy { get; set; }
        public Nullable<System.DateTime> DateUpdated { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime DateCreated { get; set; }
        public string RegexPattern { get; set; }
        public string MinimumValue { get; set; }
        public string MaximumValue { get; set; }
        public bool RequiredQuestion { get; set; }
        public string ContainsValue { get; set; }
        public string EqualsValue { get; set; }
        public string NotEqualsValue { get; set; }
        public string StartsWithValue { get; set; }
        public string EndsWithValue { get; set; }
        public string LengthValue { get; set; }
        public string CalculationValue { get; set; }
        public Nullable<bool> HasSum { get; set; }
        public string RegexPatternError { get; set; }
        public string MinimumLength { get; set; }
        public string MaximumLength { get; set; }
    }
}
