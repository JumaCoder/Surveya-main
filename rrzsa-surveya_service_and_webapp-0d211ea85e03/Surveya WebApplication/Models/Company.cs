//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Surveya_Application.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Company
    {
        public System.Guid ID { get; set; }
        public string CompanyName { get; set; }
        public string RegistrationNumber { get; set; }
        public string VatNumber { get; set; }
        public byte[] Logo { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<System.DateTime> DateCreated { get; set; }
        public Nullable<System.Guid> CreatedBy { get; set; }
        public Nullable<System.DateTime> DateUpdated { get; set; }
        public Nullable<System.Guid> UpdatedBy { get; set; }
        public string PhysicalAddress { get; set; }
        public string billEmail { get; set; }
        public string alternateBillEmail { get; set; }
        public string postalCode { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public byte[] LogoSM { get; set; }
        public string SelectedSkin { get; set; }
        public string MobileAppThemeName { get; set; }
    }
}
