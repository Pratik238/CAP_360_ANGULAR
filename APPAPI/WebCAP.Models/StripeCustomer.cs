using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebGYM.Models
{
	[Table("StripeCustomer")]
	public class StripeCustomer
	{
		[Key]
		public int cuId { get; set; }
		public string customerId { get; set; }
		public string emailId { get; set; }
		public DateTime? CreatedDate { get; set; }
		public DateTime? ModifyDate { get; set; }
		public string Coupon { get; set; }
		public string CouponId { get; set; }



	}
}
