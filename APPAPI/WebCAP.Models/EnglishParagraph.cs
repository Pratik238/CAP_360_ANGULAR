using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("EnglishParagraph")]
    public class EnglishParagraph
    {
        [Key]
        public int Id { get; set; }


        public string Paragraph { get; set; }

        [NotMapped]
        public EnglishQuestions[] questions { get; set; }

    }
}