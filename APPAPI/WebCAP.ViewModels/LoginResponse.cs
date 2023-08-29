using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebCAP.ViewModels
{
    public class LoginResponse
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public bool Status { get; set; }
        public int RoleId { get; set; }

        public string Name { get; set; }

        public int BatchId { get; set; }

        public string BatchIds { get; set; }

        public int FranchiseId { get; set; }

    }
}
