using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace WebCAP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StripePaymentController : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] StripePaymentRequest createOptions)
        {
            StripeConfiguration.ApiKey = "sk_test_51IFGVwAU5WVl2sjcL0th6BnIrDGdxASwnWEfVp0c2MLTvHGdKOLy37NjHyCvnC8y5Oci81o7RJMSRF10pcfbuWmh00NToT84hV";
            var options = new ChargeCreateOptions
            {
                Amount = createOptions.amount,
                Currency = "USD",
                Source = createOptions.tokenId,
                Description = "This Test Data",
                ReceiptEmail = "Test@Test.com",


            };
            var service = new ChargeService();
            var charge = service.Create(options);

            return Ok(charge.StripeResponse.Content);
        }
        public class StripePaymentRequest
        {
            public string tokenId { get; set; }
            public string productName { get; set; }
            public int amount { get; set; }
        }
    }

}
