using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("Attendance")]
    public class Attendance : CapBaseClass
    {




        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Batch Id is Required")]
        [ForeignKey("BatchId")]
        public int BatchId { get; set; }
        [Required(ErrorMessage = "SubTopic Id is Required")]
        [ForeignKey("SubTopicId")]
        public int SubTopicId { get; set; }
        [Required(ErrorMessage = "Student Id is Required")]
        [ForeignKey("StudentId")]
        public int StudentId { get; set; }
        [Required(ErrorMessage = "Attendance Date is Required")]
        public DateTime? AttendanceDate { get; set; }
        [Required(ErrorMessage = "Attendance State is Required")]
        public string AttendanceState { get; set; }





    }
}