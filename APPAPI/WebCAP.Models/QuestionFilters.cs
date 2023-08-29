
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace WebCAP.Models
{
    public class QuestionFilters
    {
        [Key]
        public int? QuestionId { get; set; }
        public string TopicName { get; set; }
        public int? TopicId { get; set; }
        public string SubTopicName { get; set; }
        public int? SubTopicId { get; set; }
        public string QuestionText { get; set; }
        public string Option1 { get; set; }
        public string Option2 { get; set; }
        public string Option3 { get; set; }
        public string Option4 { get; set; }
        public int? Answer { get; set; }
        public string Explanation { get; set; }
        public string CalculatorId { get; set; }
        public string CalculatorName { get; set; }
        public string GridId { get; set; }

        public string GridName { get; set; }
        public string DifficultyLevelId { get; set; }
        public string DifficultyLevelName { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string Status { get; set; }
        public bool IsHomeWork { get; set; } = false;
        public string HomeWorkId { get; set; }
        public string HomeWorkName { get; set; }
        public int? SubjectId { get; set; }
        

    }
}