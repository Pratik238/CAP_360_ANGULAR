using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
   
    public class EnglishQuestionsviewModel
    {
        public EnglishParagraph Paragraph { get; set; }
        public EnglishQuestions[] questions { get; set; }

    }
}