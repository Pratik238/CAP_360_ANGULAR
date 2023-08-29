using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("HomeWorkAssign")]
    public class HomeWorkAssign:CapBaseClass
    {




        [Key]
        public int HomeWorkAssignId { get; set; }
        [Required(ErrorMessage = "Batch Id is Required")]
        [ForeignKey("BatchId")]
        public int BatchId { get; set; }
        [Required(ErrorMessage = "HomeWork Id is Required")]
        [ForeignKey("HomeWorkId")]
        public int HomeWorkId { get; set; }
        [NotMapped]
        public string[] HomeWorkIds { get; set; }
        
     



    }
}