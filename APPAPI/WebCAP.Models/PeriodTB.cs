using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("PeriodTB")]
    public class PeriodTB
    {
        [Key]
        public int PeriodID { get; set; }
        public string Text { get; set; }
        public string Value { get; set; }
    }


}
