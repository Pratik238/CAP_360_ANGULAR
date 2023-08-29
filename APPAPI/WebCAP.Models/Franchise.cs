using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebCAP.Models
{
    [Table("Franchise")]
    public class Franchise :CapBaseClass
    {




        [Key]
        public int FranchiseId { get; set; }

        [Required(ErrorMessage = "AddressLine is Required")]
        
        public string AddressLine { get; set; }

        [Required(ErrorMessage = "CountryName is Required")]
        
        public string CountryName { get; set; }

        [Required(ErrorMessage = "StateName is Required")]
        

        public string StateName { get; set; }

        [Required(ErrorMessage = "CityName is Required")]
        

        public string CityName { get; set; }
        
        public string LocationName { get; set; }

       
        
        public string LocationDisplayName { get; set; }
       
        
        public string LocationURL { get; set; }
        [Required(ErrorMessage = "Zipcode is Required")]
        

        public int Zipcode { get; set; }
        [Required(ErrorMessage = "PhoneNumber is Required")]
        
        public string PhoneNumber { get; set; }
        
        public string FacebookId { get; set; }
        
        
        public string TwitterId { get; set; }
        
        public string DomainId { get; set; }
        
        public string Email { get; set; }
       
       
        public string Password { get; set; }
        [Required(ErrorMessage = "Centeradminid is Required")]
        [ForeignKey("Centeradminid")]
        public int Centeradminid { get; set; }

        [Required(ErrorMessage = "Lattitude is Required")]
        
        public decimal Lattitude { get; set; }

        [Required(ErrorMessage = "Longitude is Required")]
        
        public decimal Longitude { get; set; }
        [Required(ErrorMessage = "FranchiseTitle is Required")]
        

        public string FranchiseTitle { get; set; }
    }
}