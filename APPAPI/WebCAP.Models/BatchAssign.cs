using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("BatchAssign")]
    public class BatchAssign:CapBaseClass
    {




        [Key]
        public int AssignId { get; set; }
        [Required(ErrorMessage = "Batch Id is Required")]
        [ForeignKey("BatchId")]
        public int BatchId { get; set; }
        [Required(ErrorMessage = "Student Id is Required")]
        [ForeignKey("StudentId")]
        public int StudentId { get; set; }
        [NotMapped]
        public string[] StudentIds { get; set; }
        
      



    }
}