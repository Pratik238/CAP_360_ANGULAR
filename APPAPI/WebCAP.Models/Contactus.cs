using System;
using System.ComponentModel.DataAnnotations;
namespace WebCAP.Models
{
    public class Contactus
    {
        [Key]
        public int ContactId { get; set; }

        public string Name { get; set; }

        public string Phone { get; set; }

        public string EmailId { get; set; }

        public string EmailTo { get; set; }

        public string Subject { get; set; }

        public string Message { get; set; }

        public string BatchId { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;


        public DateTime UpdatedDate { get; set; } = DateTime.Now;

        public bool IsActive { get; set; } = true;

        public bool IsDeleted { get; set; } = false;
    }
}