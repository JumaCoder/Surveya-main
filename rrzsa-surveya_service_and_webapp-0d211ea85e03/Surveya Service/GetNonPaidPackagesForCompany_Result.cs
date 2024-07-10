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
    
    public partial class GetNonPaidPackagesForCompany_Result
    {
        public System.Guid ID { get; set; }
        public Nullable<System.DateTime> DateSignedUp { get; set; }
        public Nullable<System.DateTime> DateStart { get; set; }
        public string PaymentType { get; set; }
        public Nullable<decimal> Price { get; set; }
        public Nullable<System.DateTime> DateExpires { get; set; }
        public Nullable<int> NumberMonthsSignedUpFor { get; set; }
        public bool IsActive { get; set; }
        public bool IsCompleted { get; set; }
        public Nullable<int> NumberOfSurveys { get; set; }
        public Nullable<int> NumberOfQuestions { get; set; }
        public Nullable<int> NumberOfUsers { get; set; }
        public Nullable<int> NumberOfResponses { get; set; }
        public string PackageName { get; set; }
        public string Description { get; set; }
        public Nullable<int> NumberOfProjects { get; set; }
        public Nullable<bool> BasicReporting { get; set; }
        public Nullable<bool> AdvancedReporting { get; set; }
        public Nullable<bool> Excel { get; set; }
        public Nullable<bool> PDF { get; set; }
        public Nullable<bool> CSV { get; set; }
        public Nullable<bool> Piping { get; set; }
        public Nullable<bool> Summing { get; set; }
        public string PaymentStatus { get; set; }
        public Nullable<bool> WhiteLabelling { get; set; }
        public Nullable<bool> PhotoCamera { get; set; }
        public Nullable<bool> GeoServices { get; set; }
        public Nullable<bool> Signatures { get; set; }
        public Nullable<bool> UniqueID { get; set; }
        public Nullable<decimal> PackageStartingPrice { get; set; }
        public Nullable<decimal> OptionalFeaturesPrice { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public bool HasDiscount { get; set; }
        public string DiscountDescription { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal DiscountValue { get; set; }
        public Nullable<decimal> InvoiceAmount { get; set; }
        public Nullable<decimal> AmountAlreadyPaid { get; set; }
        public Nullable<System.Guid> InvoiceID { get; set; }
    }
}
