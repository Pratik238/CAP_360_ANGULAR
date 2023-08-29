using System.ComponentModel.DataAnnotations;

namespace WebCAP.ViewModels
{
    public class LoginRequestViewModel
    {
        public int UserId { get; set; }
        [Required(ErrorMessage = "Enter UserName")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Enter Password")]
        public string Password { get; set; }
        public string Token { get; set; }
        public int Usertype { get; set; }
        public string Name { get; set; }
        public int BatchId { get; set; }

        public string BatchIds { get; set; }

        public int FranchiseId { get; set; }
    }


}
