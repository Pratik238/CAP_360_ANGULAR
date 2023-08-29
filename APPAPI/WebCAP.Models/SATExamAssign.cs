using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("SATExamAssign")]
    public class SATExamAssign:CapBaseClass
    {




        [Key]
        public int SATExamAssignId { get; set; }
        [Required(ErrorMessage = "Batch Id is Required")]
        [ForeignKey("BatchId")]
        public int BatchId { get; set; }
        [Required(ErrorMessage = "SubTopic Id is Required")]
        [ForeignKey("SubTopicId")]
        public int SubTopicId { get; set; }
        
       




    }
}