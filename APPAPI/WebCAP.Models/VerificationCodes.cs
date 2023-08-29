using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("VerificationCodes")]
    public class VerificationCodes
    {




        [Key]
        public int VerificationCodeId { get; set; }
        public string EmailId { get; set; }
        public string VerificationCode { get; set; }
        public bool Verified { get; set; } = false;





    }
}