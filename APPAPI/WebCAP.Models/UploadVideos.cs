using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("UploadVideos")]
    public class UploadVideos : CapBaseClass
    {




        [Key]
        public int Id { get; set; }
        public int BatchId { get; set; }
        public string VideoPath { get; set; }




    }
}