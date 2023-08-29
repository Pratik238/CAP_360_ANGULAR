using System.ComponentModel.DataAnnotations;

namespace WebCAP.ViewModels
{
    public class RoleViewModel
    {
        [Required(ErrorMessage = "Enter Role name")]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 3)]
        public string RoleName { get; set; }
        public bool Status { get; set; }
        public int? RoleId { get; set; }
    }
}
