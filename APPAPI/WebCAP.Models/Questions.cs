using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("Questions")]
    public class Questions:CapBaseClass
    {




        [Key]
        public int QuestionId { get; set; }
        [Required(ErrorMessage = "Subject Id is Required")]
        [ForeignKey("SubjectId")]
        public int SubjectId { get; set; }
        [Required(ErrorMessage = "Topic Id is Required")]
        [ForeignKey("TopicId")] 
        public int TopicId { get; set; }
        [Required(ErrorMessage = "SubTopic Id is Required")]
        [ForeignKey("SubTopicId")]
        public int SubTopicId { get; set; }
        [Required(ErrorMessage = "Question Text is Required")]
        public string QuestionText { get; set; }
        [Required(ErrorMessage = "Option1 is Required")]
        public string Option1 { get; set; }

        public string Option2 { get; set; }
        public string Option3 { get; set; }
        public string Option4 { get; set; }
        [Required(ErrorMessage = "Answer is Required")]
        public string Answer { get; set; }
        [Required(ErrorMessage = "Explanation is Required")]
        public string Explanation { get; set; }
        
        [ForeignKey("CalculatorId")]
        public int CalculatorId { get; set; }
        [ForeignKey("GridId")]
        public int GridId { get; set; }
        [ForeignKey("DifficultyLevelId")]
        public int DifficultyLevelId { get; set; }
       
       
        public bool IsHomeWork { get; set; } = false;
        [ForeignKey("HomeworkId")]
        public int HomeworkId { get; set; }
    }
}