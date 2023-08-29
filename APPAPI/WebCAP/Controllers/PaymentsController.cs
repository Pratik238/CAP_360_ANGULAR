using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using WebCAP.Concrete;
using WebCAP.Interface;
using WebCAP.Models;
using WebGYM.Models;

namespace WebCAP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        public readonly IOptions<StripeOptions> options;
        private readonly IStripeClient client;
        private readonly IStudent users;
        IConfiguration configuration;
        private readonly DatabaseContext _context;
        private readonly ICommon _common;
        public PaymentsController(IOptions<StripeOptions> options, IStudent _users, ICommon common, IConfiguration configuration, DatabaseContext context)
        {
            this.configuration = configuration;
            users = _users;
            this.options = options;
            _context = context;
            _common = common;
            string SecretKey = configuration.GetValue<string>("StripeConfig:SecretKey");
            string Domain = configuration.GetValue<string>("StripeConfig:Domain");
            string PublishableKey = configuration.GetValue<string>("StripeConfig:PublishableKey");
            this.options.Value.SecretKey = SecretKey;
            this.options.Value.PublishableKey = PublishableKey;
            this.options.Value.Domain = Domain;
            this.client = new StripeClient(this.options.Value.SecretKey);
        }
        [HttpGet("CheckPaymentIsDone")]
        public async Task<IActionResult> CheckPaymentIsDone(string EmailId, string Program)
        {
            var res = _context.StripePayment.Where(p => p.EmailId == EmailId && p.Program == Program).FirstOrDefault();
            if (res != null && res.status == "paid")
            {
                return Ok(res);
            }
            else
            {
                return Ok(res);
            }
        }

        [HttpGet("setup")]
        public SetupResponse Setup()
        {
            return new SetupResponse
            {
                ProPrice = this.options.Value.ProPrice,
                BasicPrice = this.options.Value.BasicPrice,
                PublishableKey = this.options.Value.PublishableKey,
            };
        }

        [HttpGet("RetrievePaymentIntent")]
        public IActionResult RetrievePaymentIntent()
        {
            try
            {
                StripeConfiguration.ApiKey = this.options.Value.SecretKey;
                var service = new ChargeService();
                var PaymentIntent = service.Get("py_1IPZvkAU5WVl2sjciahhC8Ol");
                return Ok(new { status = StatusCodes.Status200OK, message = PaymentIntent });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });

            }
        }
        [HttpPost("Listsubscriptions")]
        public IActionResult Listsubscriptions()
        {
            StripeConfiguration.ApiKey = this.options.Value.SecretKey;

            var options = new SubscriptionListOptions
            {
                Limit = 3,
            };
            var service = new SubscriptionService();
            StripeList<Subscription> subscriptions = service.List(
              options
            );
            return Ok(subscriptions);
        }
        [HttpPost("DirectToBankPay")]
        public IActionResult DirectToBankPay([FromBody] BankDetails bankobject)
        {
            try
            {


                StripeConfiguration.ApiKey = this.options.Value.SecretKey;

                var options = new CustomerCreateOptions
                {

                    Email = bankobject.EmailId,
                    Source = bankobject.BankTokenId, // Get the bank token submitted by the form
                                                     //Plan = bankobject.priceId,
                };
                var service = new CustomerService();

                var customer = service.Create(options);

                var options2 = new BankAccountVerifyOptions
                {
                    Amounts = new List<long> { 32, 45 },
                };
                var service2 = new BankAccountService();
                service2.Verify(
                  customer.Id,
                  bankobject.BankId,
                  options2
                );
                var options3 = new ChargeCreateOptions
                {
                    Amount = 1500 * 100,
                    Currency = "usd",
                    Customer = customer.Id,

                };
                var service3 = new ChargeService();
                var charge = service3.Create(options3);
                var service4 = new PaymentIntentService();
                var PaymentIntent = service4.Get(charge.Id);
                return Ok(new { status = StatusCodes.Status200OK, message = PaymentIntent });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });

            }
        }
        [HttpPost("Creatingcoupons")]
        public async Task<IActionResult> Creatingcoupons()
        {
            StripeConfiguration.ApiKey = this.options.Value.SecretKey;

            var options = new CouponCreateOptions
            {
                Duration = "once",
                Id = "free-period",
                AmountOff = 10,
            };
            var service = new CouponService();
            Coupon coupon = await service.CreateAsync(options);
            return Ok(coupon);
        }
        [HttpPost("CustomerService")]
        public async Task<IActionResult> CustomerService()
        {
            StripeConfiguration.ApiKey = this.options.Value.SecretKey;

            var options = new CustomerCreateOptions
            {
                Name = "jenny rosen",
                Email = "Test036@Test.com",
                Description = "My First Test Customer (created for API docs)",
            };
            var service = new CustomerService();
            var customer = await service.CreateAsync(options);
            return Ok(customer.Id);
        }
        [HttpPost("DiscountingSubscriptions")]
        public async Task<IActionResult> DiscountingSubscriptions(Stripe.Customer objc)
        {
            StripeConfiguration.ApiKey = this.options.Value.SecretKey;

            var items = new List<SubscriptionItemOptions> {
                    new SubscriptionItemOptions {Price = "price_1IFw1GAU5WVl2sjcDiWHpzST"}
                    };
            var options = new SubscriptionCreateOptions
            {
                Customer = objc.Id,
                Items = items,
                Coupon = "free-period",


            };
            var service = new SubscriptionService();
            Subscription subscription = await service.CreateAsync(options);
            return Ok(subscription);
        }

        [HttpGet("create-checkout-session-WithoutDiscount")]
        public async Task<IActionResult> CreateCheckoutSessionWithoutDiscount(string EmailId, string priceId, string StudentId)
        {

            StripeConfiguration.ApiKey = this.options.Value.SecretKey;

            //var lst = Listsubscriptions();
            //var cus = CustomerService();
            //var coupons = Creatingcoupons();
            //var sub =DiscountingSubscriptions(cus);

            var result = users.CheckStripeCustomerExits(EmailId);
            if (string.IsNullOrEmpty(StudentId) && StudentId == "undefined")
            {
                var res = _context.StudentAdmission.Where(p => p.EmailId == EmailId).FirstOrDefault();
                if (res != null)
                {
                    StudentId = Convert.ToString(res.StudentId);
                }
            }
            if (StudentId == "undefined")
            {
                var res = _context.StudentAdmission.Where(p => p.EmailId == EmailId).FirstOrDefault();
                if (res != null)
                {
                    StudentId = Convert.ToString(res.StudentId);
                }
            }
            var stdObj = users.GetStudentAdmissionById(Convert.ToInt32(StudentId));
            StripeCustomer obj = new StripeCustomer();
            if (result)
            {
                obj.emailId = EmailId;
                obj = users.CreateStripeCustomer(obj);
            }
            else
            {
                var cusoptions = new CustomerCreateOptions
                {

                    Email = EmailId
                };
                var cusservice = new CustomerService();
                var customer = await cusservice.CreateAsync(cusoptions);
                obj.emailId = EmailId;
                obj.customerId = customer.Id;
                obj = users.CreateStripeCustomer(obj);
            }
            var options = new SessionCreateOptions
            {
                Customer = obj.customerId, //cus.Id,
                SuccessUrl = $"{this.options.Value.Domain}/register/success?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{this.options.Value.Domain}/register/failure",
                PaymentMethodTypes = new List<string>
                {
                    "card",
                },
                Mode = "subscription",
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = priceId,
                        Quantity = 1,
                    },
                },


            };
            string priceId360 = configuration.GetValue<string>("StripeConfig:priceId360");
            string priceIdSMARTSAT = configuration.GetValue<string>("StripeConfig:priceIdSMARTSAT");
            string priceIdBootCamps = configuration.GetValue<string>("StripeConfig:priceIdBootCamps");
            string priceIdCounselling = configuration.GetValue<string>("StripeConfig:priceIdCounselling");
            string Program = string.Empty;
            if (priceId == priceId360)
            {
                Program = "CAP360";

            }
            else if (priceId == priceIdSMARTSAT)
            {
                Program = "SMARTSAT";
            }
            else if (priceId == priceIdBootCamps)
            {
                Program = "Boot Camps";
            }
            else if (priceId == priceIdCounselling)
            {
                Program = "Counselling";
            }
            if (stdObj != null && stdObj.IsDiscountApplied.HasValue
                && stdObj.IsDiscountApplied.Value == true && !string.IsNullOrEmpty(stdObj.couponId) && Program.ToLower() == stdObj.Program.ToLower())
            {
                var Discounts = new List<SessionDiscountOptions>
                  {
                    new SessionDiscountOptions
                    {
                      Coupon = stdObj.couponId,

                    },
                  };
                options.Discounts = Discounts;
            }
            else
            {
                options.AddExtraParam("allow_promotion_codes", "true");
            }

            var service = new SessionService(this.client);
            try
            {
                var session = await service.CreateAsync(options);
                return Ok(new CreateCheckoutSessionResponse
                {
                    SessionId = session.Id,
                });
            }
            catch (StripeException e)
            {
                Console.WriteLine(e.StripeError.Message);
                return BadRequest(new ErrorResponse
                {
                    ErrorMessage = new ErrorMessage
                    {
                        Message = e.StripeError.Message,
                    }
                });
            }
        }

        [HttpGet("create-checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession(string EmailId, string PriceId, string StudentId)
        {

            var result = users.CheckStripeCustomerExits(EmailId);
            var stdObj = users.GetStudentAdmissionById(Convert.ToInt32(StudentId));
            StripeCustomer obj = new StripeCustomer();
            if (result)
            {
                obj.emailId = EmailId;
                obj = users.CreateStripeCustomer(obj);
            }
            else
            {
                var cusoptions = new CustomerCreateOptions
                {

                    Email = EmailId
                };
                var cusservice = new CustomerService();
                var customer = await cusservice.CreateAsync(cusoptions);
                obj.emailId = EmailId;
                obj.customerId = customer.Id;
                obj = users.CreateStripeCustomer(obj);
            }
            var options = new SessionCreateOptions
            {
                Customer = obj.customerId,
                SuccessUrl = $"{this.options.Value.Domain}/register/success?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{this.options.Value.Domain}/register/failure",
                PaymentMethodTypes = new List<string>
                {
                    "card",
                },
                Mode = "subscription",
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = PriceId,
                        Quantity = 1,
                    },
                },


            };

            string priceId360 = configuration.GetValue<string>("StripeConfig:priceId360");
            string priceIdSMARTSAT = configuration.GetValue<string>("StripeConfig:priceIdSMARTSAT");
            string priceIdBootCamps = configuration.GetValue<string>("StripeConfig:priceIdBootCamps");
            string priceIdCounselling = configuration.GetValue<string>("StripeConfig:priceIdCounselling");
            string Program = string.Empty;
            if (PriceId == priceId360)
            {
                Program = "CAP360";

            }
            else if (PriceId == priceIdSMARTSAT)
            {
                Program = "SMARTSAT";
            }
            else if (PriceId == priceIdBootCamps)
            {
                Program = "Boot Camps";
            }
            else if (PriceId == priceIdCounselling)
            {
                Program = "Counselling";
            }
            if (stdObj != null && stdObj.IsDiscountApplied.HasValue
                && stdObj.IsDiscountApplied.Value == true && !string.IsNullOrEmpty(stdObj.couponId) && Program.ToLower() == stdObj.Program)
            {
                var Discounts = new List<SessionDiscountOptions>
                  {
                    new SessionDiscountOptions
                    {
                      Coupon = stdObj.couponId,

                    },
                  };
                options.Discounts = Discounts;
            }
            else
            {
                options.AddExtraParam("allow_promotion_codes", "true");
            }


            var service = new SessionService(this.client);
            try
            {
                var session = await service.CreateAsync(options);
                return Ok(new CreateCheckoutSessionResponse
                {
                    SessionId = session.Id,
                });
            }
            catch (StripeException e)
            {
                Console.WriteLine(e.StripeError.Message);
                return BadRequest(new ErrorResponse
                {
                    ErrorMessage = new ErrorMessage
                    {
                        Message = e.StripeError.Message,
                    }
                });
            }
        }

        [HttpGet("/order/success")]
        public ActionResult OrderSuccess([FromQuery] string session_id)
        {
            StripeConfiguration.ApiKey = this.options.Value.SecretKey;

            var sessionService = new SessionService();
            Session session = sessionService.Get(session_id);

            var customerService = new CustomerService();

            var options = new InvoiceListOptions
            {
                Limit = 1,
                Customer = session.CustomerId,

            };

            var service = new InvoiceService();
            StripeList<Invoice> invoices = service.List(options);
            InvoiceResponce bsObj = JsonConvert.DeserializeObject<InvoiceResponce>(invoices.StripeResponse.Content);
            var obj = (bsObj.@data[0]);
            StripePayment sobj = new StripePayment();
            sobj.stripePaymentId = obj.id;
            sobj.attempt_count = Convert.ToString(obj.attempt_count);
            sobj.CustomerId = session.CustomerId;
            sobj.SessionId = session_id;
            sobj.hosted_invoice_url = obj.hosted_invoice_url;
            sobj.invoice_pdf = obj.invoice_pdf;
            sobj.billing_reason = obj.billing_reason;
            sobj.EmailId = obj.customer_email;
            sobj.status = obj.status;
            sobj.subscription = obj.subscription;
            string priceId360 = configuration.GetValue<string>("StripeConfig:priceId360");
            string priceIdSMARTSAT = configuration.GetValue<string>("StripeConfig:priceIdSMARTSAT");
            string priceIdBootCamps = configuration.GetValue<string>("StripeConfig:priceIdBootCamps");
            string priceIdCounselling = configuration.GetValue<string>("StripeConfig:priceIdCounselling");

            if ((obj.lines.@data)[0].plan.id == priceId360)
            {
                sobj.Program = "CAP360";

            }
            else if ((obj.lines.@data)[0].plan.id == priceIdSMARTSAT)
            {
                sobj.Program = "SMARTSAT";
            }
            else if ((obj.lines.@data)[0].plan.id == priceIdBootCamps)
            {
                sobj.Program = "Boot Camps";
            }
            else if ((obj.lines.@data)[0].plan.id == priceIdCounselling)
            {
                sobj.Program = "Counselling";
            }

            //sobj.total_discount_amounts = "0";//Convert.ToString(obj.total_discount_amounts[0].amount);
            sobj.PriceId = (obj.lines.@data)[0].plan.id;
            sobj.product = (obj.lines.@data)[0].plan.product;
            sobj.amount_paid = Convert.ToString(obj.amount_paid);
            sobj.period_end = obj.period_end;
            sobj.period_start = obj.period_start;

            var result = _context.StripePayment.Where(p => p.EmailId == sobj.EmailId && p.Program == sobj.Program).FirstOrDefault();
            var res = _context.StudentAdmission.Where(p => p.EmailId == sobj.EmailId).FirstOrDefault();
            if (result == null)
            {
                users.SaveStripeResponce(sobj);

                DataTable mailSettings = _common.GetmailSettings(CAPMessages.Enrollment);
                if (mailSettings.Rows.Count > 0)
                {

                    using (MailMessage mm = new MailMessage())
                    {

                        mm.From = new MailAddress((string)mailSettings.Rows[0]["MailId"]);

                        DataTable SuperAdminResult = (DataTable)_common.UsersList(5, 5, 5, true);
                        DataTable dtcenter = _common.GetCenteradminmail(sobj.EmailId);
                        if (dtcenter.Rows.Count > 0)
                        {
                            mm.To.Add(dtcenter.Rows[0]["EmailId"].ToString());
                        }
                        if (SuperAdminResult.Rows.Count > 0)
                        {
                            mm.CC.Add(SuperAdminResult.Rows[0]["EmailId"].ToString());


                        }
                        var amount = Convert.ToInt32(sobj.amount_paid) / 100;

                        var emailtem = configuration.GetValue<string>("PaymentSuccess:BodyForCenterAdmin").Replace("{Link}", sobj.hosted_invoice_url).Replace("{Amount}", amount.ToString()).Replace("{Name}", dtcenter.Rows[0]["FirstName"].ToString()).Replace("{Mode}", "subscription").Replace("{Pragram}", sobj.Program).Replace("{Email}", sobj.EmailId).Replace("{StudentName}", res.StudentFirstName + " " + res.StudentLastName);

                        mm.Subject = configuration.GetValue<string>("PaymentSuccess:SubjectForCenterAdmin").Replace("{Program}", sobj.Program).Replace("{Amount}", amount.ToString());


                        mm.Body = emailtem;

                        mm.IsBodyHtml = true;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = mailSettings.Rows[0]["SMTP"].ToString();
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(mailSettings.Rows[0]["MailId"].ToString(), mailSettings.Rows[0]["Password"].ToString());
                        smtp.UseDefaultCredentials = true;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = int.Parse(mailSettings.Rows[0]["Port"].ToString());
                        smtp.Send(mm);
                    }
                    using (MailMessage mms = new MailMessage())
                    {


                        mms.From = new MailAddress((string)mailSettings.Rows[0]["MailId"]);
                        mms.To.Add(res.EmailId);


                        var amount = Convert.ToInt32(sobj.amount_paid) / 100;
                        var emailtem = configuration.GetValue<string>("PaymentSuccess:BodyForStudent").Replace("{Link}", sobj.hosted_invoice_url).Replace("{Amount}", amount.ToString()).Replace("{Name}", res.StudentFirstName + " " + res.StudentLastName).Replace("{Mode}", "subscription").Replace("{Pragram}", sobj.Program).Replace("{Email}", sobj.EmailId).Replace("{StudentName}", res.StudentFirstName + " " + res.StudentLastName).Replace("{date}", DateTime.Now.ToString("dddd, dd MMMM yyyy"));

                        mms.Subject = configuration.GetValue<string>("PaymentSuccess:SubjectForStudent").Replace("{Program}", sobj.Program).Replace("{Amount}", amount.ToString());




                        mms.Body = emailtem;
                        mms.IsBodyHtml = true;
                        SmtpClient smtps = new SmtpClient();
                        smtps.Host = mailSettings.Rows[0]["SMTP"].ToString();
                        smtps.EnableSsl = true;
                        NetworkCredential NetworkCreds = new NetworkCredential(mailSettings.Rows[0]["MailId"].ToString(), mailSettings.Rows[0]["Password"].ToString());
                        smtps.UseDefaultCredentials = true;
                        smtps.Credentials = NetworkCreds;
                        smtps.Port = int.Parse(mailSettings.Rows[0]["Port"].ToString());
                        smtps.Send(mms);
                    }
                }
            }
            return Content($"<html><body><h1>Thanks for your order!</h1></body></html>");
        }

        [HttpGet("checkout-session")]
        public async Task<IActionResult> CheckoutSession(string sessionId)
        {

            var service = new SessionService(this.client);
            var session = await service.GetAsync(sessionId);
            return Ok(session);
        }

        [HttpPost("customer-portal")]
        public async Task<IActionResult> CustomerPortal([FromBody] CustomerPortalRequest req)
        {
            // For demonstration purposes, we're using the Checkout session to retrieve the customer ID. 
            // Typically this is stored alongside the authenticated user in your database.
            var checkoutSessionId = req.SessionId;
            var checkoutService = new SessionService(this.client);
            var checkoutSession = await checkoutService.GetAsync(checkoutSessionId);

            // This is the URL to which your customer will return after
            // they are done managing billing in the Customer Portal.
            var returnUrl = this.options.Value.Domain;

            var options = new Stripe.BillingPortal.SessionCreateOptions
            {
                Customer = checkoutSession.CustomerId,
                ReturnUrl = returnUrl,
            };
            var service = new Stripe.BillingPortal.SessionService(this.client);
            var session = await service.CreateAsync(options);

            return Ok(session);
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    this.options.Value.WebhookSecret
                );
                Console.WriteLine($"Webhook notification with type: {stripeEvent.Type} found for {stripeEvent.Id}");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Something failed {e}");
                return BadRequest();
            }

            if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                Console.WriteLine($"Session ID: {session.Id}");
                // Take some action based on session.
            }

            return Ok();
        }
    }
}