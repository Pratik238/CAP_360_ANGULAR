using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("PracticeExamEnglishQuestion")]
    public class PracticeExamEnglishQuestion
    {

        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Exam Id is Required")]
        [ForeignKey("ExamId")]

        public int ExamId { get; set; }
        [Required(ErrorMessage = "Student Id is Required")]
        [ForeignKey("StudentId")]

        public int StudentId { get; set; }
        [Required(ErrorMessage = "Question Id is Required")]
        [ForeignKey("QuestionId")]

        public int QuestionId { get; set; }
        
        public string SelectedAnswer { get; set; }
        public int Skipped { get; set; } = 0;
        public int Answered { get; set; } = 0;
        public int UnAnswered { get; set; } = 0;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime Startdate { get; set; }
        public DateTime? EndDate { get; set; }
    
    }
}