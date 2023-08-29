using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebCAP.ViewModels
{
    public class UsersViewModel
    {
        public int Id { get; set; }

      
      
        [Required]
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [Required]
        public string EmailId { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public string Password { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;

        public bool IsDeleted { get; set; } = false;

        public int UserType { get; set; }

        public int CenterAdminId { get; set; }
    }
}
