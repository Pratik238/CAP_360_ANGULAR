using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("StudentAdmission")]
    public class StudentAdmission
    {




        [Key]
        public int StudentId { get; set; }
        public string StudentFirstName { get; set; }
        public string StudentLastName { get; set; }
        public int Age { get; set; }
        public string Grade { get; set; }
        public string Program { get; set; }

        public string ParentFirstName { get; set; }
        public string ParentLastName { get; set; }
        public string Contactno { get; set; }

        public string EmailId { get; set; }
        public string Password { get; set; }
        public string ParentEmailId { get; set; }
        public string StreetAddress { get; set; }

        public int? Discount { get; set; }
        public bool? IsDiscountApplied { get; set; }
        public bool? IsAdsoEmploye { get; set; }
        public string couponName { get; set; }
        public string couponId { get; set; }
        public string StreetAddress2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }

        public string Zipcode { get; set; }
        public string HearAboutUs { get; set; }
        public string OtherExplanation { get; set; }
        public string CountryName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        [ForeignKey("FranchiseId")]
        public int FranchiseId { get; set; }

        [NotMapped]
        public string[] ProgramIds { get; set; }

    }
}