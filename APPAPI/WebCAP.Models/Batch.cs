using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("Batch")]
    public class Batch:CapBaseClass
    {




        [Key]
        public int BatchId { get; set; }
        [Required(ErrorMessage = "Batch Name is Required")]
        public string BatchName { get; set; }
        [Required(ErrorMessage = "Tuttor Id is Required")]
        [ForeignKey("TutorId")]
        public int TutorId { get; set; }
        [Required(ErrorMessage = "Centeradmin Id is Required")]
        [ForeignKey("CenteradminId")]
        public int CenteradminId { get; set; }





    }
}