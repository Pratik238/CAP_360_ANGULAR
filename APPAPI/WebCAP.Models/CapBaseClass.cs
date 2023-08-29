using System;

namespace WebCAP.Models
{
    public class CapBaseClass
    {

        public string Createdby { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string Updatedby { get; set; }

        public DateTime UpdatedDate { get; set; } = DateTime.Now;

        public bool IsActive { get; set; } = true;

        public bool IsDeleted { get; set; } = false;
    }
}
