using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("EnglishExamIds")]
    public class EnglishExamIds
    {




        [Key]
        public int ExamId { get; set; }

        [Required(ErrorMessage = "Student Id is Required")]
        public int StudentId { get; set; }
        [Required(ErrorMessage = "Test Id is Required")]
        public int TestId { get; set; }
        public string Status { get; set; }

        public int SATExamAssignId { get; set; }

        public int HomeWorkAssignId { get; set; }
    }
}