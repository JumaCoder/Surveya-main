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
    
    public partial class Document
    {
        public System.Guid ID { get; set; }
        public string Name { get; set; }
        public string Link { get; set; }
        public long TypeNumber { get; set; }
        public string TypeDescription { get; set; }
        public Nullable<System.DateTime> ExpiryDate { get; set; }
        public Nullable<bool> IsProjectSpecific { get; set; }
        public Nullable<System.Guid> ProjectID { get; set; }
        public Nullable<System.Guid> UserID { get; set; }
        public string FileExtension { get; set; }
    }
}
