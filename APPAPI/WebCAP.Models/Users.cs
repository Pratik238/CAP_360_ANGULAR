using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("Users")]
    public class Users : CapBaseClass
    {
        [Key]
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }

        public int UserType { get; set; }

        public int? CenterAdminId { get; set; }
        [NotMapped]
        public string NewPassword { get; set; }
        [NotMapped]
        public string UserName { get; set; }
    }

}
