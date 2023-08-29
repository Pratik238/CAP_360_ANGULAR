using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebGYM.Models
{
	[Table("StripePayment")]
	public class StripePayment
	{
		[Key]
		public int Id { get; set; }
		public string stripePaymentId { get; set; }
		public string hosted_invoice_url { get; set; }
		public string invoice_pdf { get; set; }
		public string type { get; set; }
		public string status { get; set; }
		public string subscription { get; set; }
		public string billing_reason { get; set; }
		public string attempt_count { get; set; }

		public string EmailId { get; set; }
		public string CustomerId { get; set; }
		public DateTime? CreatedDate { get; set; }
		public string SessionId { get; set; }
		public string Program { get; set; }
		public string PriceId { get; set; }
		public string total_discount_amounts { get; set; }
		public string product { get; set; }
		public string amount_paid { get; set; }
		public int period_end { get; set; }
		public int period_start { get; set; }

	}
}
