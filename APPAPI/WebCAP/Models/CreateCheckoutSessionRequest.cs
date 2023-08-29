using Newtonsoft.Json;

namespace WebCAP.Models
{
    public class CreateCheckoutSessionRequest
    {
        [JsonProperty("priceId")]
        public string PriceId { get; set; }
        public string EmailId { get; set; }
        public string StudentId { get; set; }
    }
}
