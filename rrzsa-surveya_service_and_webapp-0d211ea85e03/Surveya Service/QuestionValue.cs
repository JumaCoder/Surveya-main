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
    
    public partial class QuestionValue
    {
        public System.Guid ID { get; set; }
        public System.Guid QuestionID { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public bool IsDefault { get; set; }
        public Nullable<long> Position { get; set; }
        public Nullable<bool> IsOther { get; set; }
    }
}
