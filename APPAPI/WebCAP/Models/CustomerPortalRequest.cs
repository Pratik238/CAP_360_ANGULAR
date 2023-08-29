using Newtonsoft.Json;

namespace WebCAP.Models
{
    public class CustomerPortalRequest
    {
        [JsonProperty("sessionId")]
        public string SessionId { get; set; }
    }
}
