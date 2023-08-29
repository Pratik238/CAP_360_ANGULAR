using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Stripe;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Security.Claims;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using WebCAP.Common;
using WebCAP.Concrete;
using WebCAP.Interface;
using WebCAP.Models;


namespace WebCAP.Controllers
{

    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudent _users;
        private readonly IUsers _user;
        private readonly ICommon _common;
        private readonly DatabaseContext _context;
        IConfiguration configuration;
        public StudentController(DatabaseContext context, IStudent users, IUsers users1, ICommon common, IConfiguration configuration)
        {
            this.configuration = configuration;
            _context = context;
            _users = users;
            _user = users1;
            _common = common;

        }
        // GET: api/User
        [HttpGet]
        public IEnumerable<StudentAdmission> Get()
        {
            return _users.GetAllstudents();
        }
        [HttpGet("GetDiscountedStudentList")]
        public IEnumerable<StudentAdmission> GetDiscountedStudentList()
        {
            return _users.GetDiscountedStudentList();
        }

        [HttpPost("SendEmailIfStudntEmployeOfOrganization/{EmailId}")]
        public IActionResult SendEmailIfStudntEmployeOfOrganization(string EmailId)
        {
            try
            {
                DataTable mailSettings = _common.GetmailSettings(CAPMessages.Enrollment);
                if (mailSettings.Rows.Count > 0)
                {

                    using (MailMessage mm = new MailMessage((string)mailSettings.Rows[0]["MailId"], EmailId))
                    {
                        DataTable SuperAdminResult = (DataTable)_common.UsersList(5, 5, 5, true);
                        DataTable dtcenter = _common.GetCenteradminmail(EmailId);
                        if (dtcenter.Rows.Count > 0)
                        {
                            mm.CC.Add(dtcenter.Rows[0]["EmailId"].ToString());
                        }
                        if (SuperAdminResult.Rows.Count > 0)
                        {
                            mm.Bcc.Add(SuperAdminResult.Rows[0]["EmailId"].ToString());


                        }
                        mm.Subject = mailSettings.Rows[0]["Subject"].ToString();
                        string encodedBytes = EncryptionLibrary.GetVerificationCode(6);
                        mm.Body = mailSettings.Rows[0]["Dear"].ToString() + '\n' +
                           mailSettings.Rows[0]["Body"].ToString() + '\n' + encodedBytes + '\n' + '\n' +
                           mailSettings.Rows[0]["Regards"].ToString() + '\n' +
                           mailSettings.Rows[0]["RegardsName"].ToString();

                        mm.IsBodyHtml = false;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = mailSettings.Rows[0]["SMTP"].ToString();
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(mailSettings.Rows[0]["MailId"].ToString(), mailSettings.Rows[0]["Password"].ToString());
                        smtp.UseDefaultCredentials = true;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = int.Parse(mailSettings.Rows[0]["Port"].ToString());
                        smtp.Send(mm);


                    }


                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        [HttpPut("UpdateStudentDiscountInfo")]
        public async Task<IActionResult> UpdateStudentDiscountInfo([FromBody] StudentAdmission student)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    StripeConfiguration.ApiKey = configuration.GetValue<string>("StripeConfig:SecretKey");


                    var Discount = student.Discount;
                    student = _users.GetStudentAdmissionById(student.StudentId);
                    student.Discount = Discount;
                    var res = _context.StudentAdmission.Where(p => p.StudentId == student.StudentId).FirstOrDefault();
                    if (res != null)
                    {
                        if ((student.Discount.HasValue && student.Discount.Value > 0) && (res.IsDiscountApplied == null || res.IsDiscountApplied == false))
                        {
                            var options = new CouponCreateOptions
                            {
                                Duration = "once",
                                Id = "Discount" + student.StudentId,
                                AmountOff = Discount * 100,
                                Currency = "USD"
                            };
                            var service = new CouponService();
                            Coupon coupon = await service.CreateAsync(options);
                            student.IsDiscountApplied = true;
                            student.couponId = coupon.Id;
                            student.couponName = coupon.Name;
                            student.Discount = Discount;
                        }
                        else if ((student.Discount.HasValue && student.Discount.Value > 0) && res.IsDiscountApplied == true)
                        {
                            var service1 = new CouponService();
                            service1.Delete("Discount" + student.StudentId);
                            var options = new CouponCreateOptions
                            {
                                Duration = "once",
                                Id = "Discount" + student.StudentId,
                                AmountOff = Discount * 100,
                                Currency = "USD"
                            };
                            var service = new CouponService();
                            Coupon coupon = await service.CreateAsync(options);
                            student.IsDiscountApplied = true;
                            student.couponId = coupon.Id;
                            student.couponName = coupon.Name;
                            student.Discount = Discount;
                        }
                        else if ((student.Discount.HasValue && student.Discount.Value == 0) && res.IsDiscountApplied == true)
                        {
                            var service1 = new CouponService();
                            service1.Delete("Discount" + student.StudentId);
                            var options = new CouponCreateOptions
                            {
                                Duration = "once",
                                Id = "Discount" + student.StudentId,
                                AmountOff = Discount * 100,
                                Currency = "USD"
                            };
                            var service = new CouponService();
                            Coupon coupon = await service.CreateAsync(options);
                            student.IsDiscountApplied = true;
                            student.couponId = coupon.Id;
                            student.couponName = coupon.Name;
                            student.Discount = Discount;
                        }
                        else if ((student.Discount.HasValue == false) && res.IsDiscountApplied == true)
                        {
                            var service1 = new CouponService();
                            service1.Delete("Discount" + student.StudentId);

                        }
                        student.UpdatedDate = DateTime.Now;


                        res.couponId = student.couponId;
                        res.couponName = student.couponName;
                        res.Discount = student.Discount;

                        _context.StudentAdmission.Update(res);
                        int count = _context.SaveChanges();
                    }


                    DataTable mailSettings = _common.GetmailSettings(CAPMessages.Payment);
                    if (mailSettings.Rows.Count > 0)
                    {

                        using (MailMessage mm = new MailMessage())
                        {


                            mm.From = new MailAddress((string)mailSettings.Rows[0]["MailId"]);
                            mm.To.Add(student.EmailId);


                            var domain = configuration.GetValue<string>("StripeConfig:Domain");
                            mm.Subject = mailSettings.Rows[0]["Subject"].ToString();
                            var linkpara = student.EmailId + "&Program=" + student.Program + "&Id=" + student.StudentId;
                            var link = domain + "/register/student-payment-gateway?emailid=" + linkpara;
                            mm.Body =
                               mailSettings.Rows[0]["Body"].ToString().Replace("{Link}", link);

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
                        using (MailMessage mm = new MailMessage())
                        {

                            mm.From = new MailAddress((string)mailSettings.Rows[0]["MailId"]);

                            DataTable SuperAdminResult = (DataTable)_common.UsersList(5, 5, 5, true);
                            DataTable dtcenter = _common.GetCenteradminmail(student.EmailId);
                            if (dtcenter.Rows.Count > 0)
                            {
                                mm.To.Add(dtcenter.Rows[0]["EmailId"].ToString());
                            }
                            if (SuperAdminResult.Rows.Count > 0)
                            {
                                mm.CC.Add(SuperAdminResult.Rows[0]["EmailId"].ToString());


                            }

                            var emailtem = configuration.GetValue<string>("NewRegisteredStudentDiscount:BodyForCenterAdmin").Replace("{FastName}", student.StudentFirstName).Replace("{LastName}", student.StudentLastName).Replace("{EmailId}", student.EmailId);


                            mm.Subject = configuration.GetValue<string>("NewRegisteredStudentDiscount:SubjectForCenterAdmin").Replace("{EmailId}", student.EmailId); ;


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


                    }
                    return Ok(res);
                }
                else
                {
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = CAPMessages.Nodata });

                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //add Dignstic
        [HttpPost("AddDiagnstic")]
        public IActionResult AddDiagnstic([FromBody] DignasticTest dg)
        {
            try
            {
                var result = _common.AddDignastic(dg);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == CAPMessages.Diagnstictesnotinserted)
                    return StatusCode(StatusCodes.Status422UnprocessableEntity, new { status = StatusCodes.Status422UnprocessableEntity, message = result });
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        [HttpPost("SendEmailForContactusDetails")]
        public IActionResult SendEmailForResetPassword([FromBody] WebsiteContactus websiteContactus)
        {
            try
            {
                var result = _common.InsertData(websiteContactus);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == CAPMessages.contactusdatanotsaved)
                    return StatusCode(StatusCodes.Status422UnprocessableEntity, new { status = StatusCodes.Status422UnprocessableEntity, message = result });
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        // POST: api/User
        [HttpPost("Addstudent")]
        public HttpResponseMessage Post([FromBody] StudentAdmission student)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (_users.CheckUsersExits(student.EmailId))
                    {
                        var response = new HttpResponseMessage()
                        {
                            StatusCode = HttpStatusCode.Conflict
                        };

                        return response;
                    }
                    else
                    {
                        var userId = this.User.FindFirstValue(ClaimTypes.Name);
                        var tempUsers = AutoMapper.Mapper.Map<StudentAdmission>(student);
                        tempUsers.CreatedDate = DateTime.Now;

                        tempUsers.Password = EncryptionLibrary.EncryptText(student.Password);
                        _users.InsertUsers(tempUsers);

                        if (tempUsers.IsAdsoEmploye.HasValue && tempUsers.IsAdsoEmploye.Value)
                        {


                            DataTable mailSettings = _common.GetmailSettings(CAPMessages.Enrollment);
                            if (mailSettings.Rows.Count > 0)
                            {

                                using (MailMessage mm = new MailMessage())
                                {

                                    mm.From = new MailAddress((string)mailSettings.Rows[0]["MailId"]);

                                    DataTable SuperAdminResult = (DataTable)_common.UsersList(5, 5, 5, true);
                                    DataTable dtcenter = _common.GetCenteradminmail(tempUsers.EmailId);
                                    if (dtcenter.Rows.Count > 0)
                                    {
                                        mm.To.Add(dtcenter.Rows[0]["EmailId"].ToString());
                                    }
                                    if (SuperAdminResult.Rows.Count > 0)
                                    {
                                        mm.CC.Add(SuperAdminResult.Rows[0]["EmailId"].ToString());


                                    }

                                    var emailtem = configuration.GetValue<string>("NewRegisteredStudent:BodyForCenterAdmin").Replace("{FastName}", tempUsers.StudentFirstName).Replace("{LastName}", tempUsers.StudentLastName).Replace("{EmailId}", tempUsers.EmailId);


                                    mm.Subject = configuration.GetValue<string>("NewRegisteredStudent:SubjectForCenterAdmin");


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




                                    using (MailMessage mms = new MailMessage())
                                    {

                                        mms.From = new MailAddress((string)mailSettings.Rows[0]["MailId"]);
                                        mms.To.Add(tempUsers.EmailId);


                                        emailtem = configuration.GetValue<string>("NewRegisteredStudent:BodyForStudent").Replace("{CourseName}", tempUsers.Program).Replace("{ApplicantName}", tempUsers.StudentFirstName + " " + tempUsers.StudentLastName);

                                        mms.Subject = configuration.GetValue<string>("NewRegisteredStudent:SubjectForStudent");
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




                        }


                        var response = new HttpResponseMessage()
                        {
                            StatusCode = HttpStatusCode.OK
                        };

                        return response;
                    }
                }
                else
                {
                    var response = new HttpResponseMessage()
                    {

                        StatusCode = HttpStatusCode.BadRequest
                    };

                    return response;
                }
            }
            catch (Exception ex)
            {
                var response = new HttpResponseMessage()
                {

                    StatusCode = HttpStatusCode.InternalServerError
                };

                return response;
            }
        }


        [HttpGet("GetVerificationcode")]
        public IActionResult GetVerificationcode(string EmailId, string Verification)
        {
            try
            {
                var result = _users.GetVerificationcode(EmailId, Verification);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //MailSent

        [HttpPost("SendEmailForResetPassword/{EmailId}")]
        public IActionResult SendEmailForResetPassword(string EmailId)
        {
            try
            {
                DataTable mailSettings = _common.GetmailSettings(CAPMessages.CAPPassword);
                if (mailSettings.Rows.Count > 0)
                {

                    using (MailMessage mm = new MailMessage((string)mailSettings.Rows[0]["MailId"], EmailId))
                    {
                        mm.Subject = mailSettings.Rows[0]["Subject"].ToString();
                        string encodedBytes = EncryptionLibrary.GetVerificationCode(6);
                        mm.Body = mailSettings.Rows[0]["Dear"].ToString() + '\n' +
                           mailSettings.Rows[0]["Body"].ToString() + '\n' + encodedBytes + '\n' + '\n' +
                           mailSettings.Rows[0]["Regards"].ToString() + '\n' +
                           mailSettings.Rows[0]["RegardsName"].ToString();

                        mm.IsBodyHtml = false;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = mailSettings.Rows[0]["SMTP"].ToString();
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(mailSettings.Rows[0]["MailId"].ToString(), mailSettings.Rows[0]["Password"].ToString());
                        smtp.UseDefaultCredentials = true;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = int.Parse(mailSettings.Rows[0]["Port"].ToString());
                        smtp.Send(mm);
                        var result = _users.SaveVerification(EmailId, encodedBytes);
                        return Ok(result);

                    }


                }
                else
                {
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = CAPMessages.Nodata });
                }


            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        [HttpPost("SendEmailForEnroll/{EmailId}")]
        public IActionResult SendEmailForEnroll(string EmailId)
        {
            try
            {
                DataTable mailSettings = _common.GetmailSettings(CAPMessages.Enrollment);
                if (mailSettings.Rows.Count > 0)
                {

                    using (MailMessage mm = new MailMessage((string)mailSettings.Rows[0]["MailId"], EmailId))
                    {
                        DataTable dtcenter = _common.GetCenteradminmail(EmailId);
                        if (dtcenter.Rows.Count > 0)
                        {
                            mm.CC.Add(dtcenter.Rows[0]["EmailId"].ToString());
                        }

                        mm.Subject = mailSettings.Rows[0]["Subject"].ToString();
                        string encodedBytes = EncryptionLibrary.GetVerificationCode(6);
                        mm.Body = mailSettings.Rows[0]["Dear"].ToString() + '\n' +
                           mailSettings.Rows[0]["Body"].ToString() + '\n' + encodedBytes + '\n' + '\n' +
                           mailSettings.Rows[0]["Regards"].ToString() + '\n' +
                           mailSettings.Rows[0]["RegardsName"].ToString();

                        mm.IsBodyHtml = false;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = mailSettings.Rows[0]["SMTP"].ToString();
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(mailSettings.Rows[0]["MailId"].ToString(), mailSettings.Rows[0]["Password"].ToString());
                        smtp.UseDefaultCredentials = true;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = int.Parse(mailSettings.Rows[0]["Port"].ToString());
                        smtp.Send(mm);
                        return Ok();

                    }


                }
                else
                {
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = CAPMessages.Nodata });
                }


            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        [HttpPost("MessageSent")]
        public IActionResult Messagesent(string PhoneNumber)
        {
            try
            {
                DataTable Messagesettings = _common.GetMessageSettings(1);
                if (Messagesettings.Rows.Count > 0)
                {
                    string accountSid = Environment.GetEnvironmentVariable(Messagesettings.Rows[0]["AccountSid"].ToString());
                    string authToken = Environment.GetEnvironmentVariable(Messagesettings.Rows[0]["AuthToken"].ToString());

                    TwilioClient.Init(Messagesettings.Rows[0]["UserId"].ToString(), Messagesettings.Rows[0]["Password"].ToString());

                    var message = MessageResource.Create(
                        body: CAPMessages.Enrolled,
                        from: new Twilio.Types.PhoneNumber(Messagesettings.Rows[0]["Mobile"].ToString()),
                        to: new Twilio.Types.PhoneNumber(PhoneNumber)
                    );
                }
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }



        //change password
        [Authorize]
        [HttpPost("ChangePassword")]
        public IActionResult ChangePassword(string OldPassword, string NewPassword, string UserName)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var loginstatus = _user.AuthenticateStudent(UserName, EncryptionLibrary.EncryptText(OldPassword));

                    if (loginstatus)
                    {
                        var userdetails = _user.Studentdata(UserName, EncryptionLibrary.EncryptText(NewPassword));
                        if (userdetails != null)
                        {
                            return Ok(userdetails);
                        }



                    }
                    else
                        return StatusCode(StatusCodes.Status404NotFound, new { status = StatusCodes.Status404NotFound, message = CAPMessages.Incorrectpassword });

                }
                return StatusCode(StatusCodes.Status404NotFound, new { status = StatusCodes.Status404NotFound, message = CAPMessages.Incorrectpassword });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Update password

        [HttpPost("UpdatePassword")]
        public IActionResult UpdatePassword([FromBody] Users user)
        {
            try
            {
                if (ModelState.IsValid)
                {

                    var userdetails = _user.Studentdata(user.UserName, EncryptionLibrary.EncryptText(user.NewPassword));
                    if (userdetails != null)
                    {
                        return Ok(userdetails);
                    }

                    if (userdetails.ToString() == CAPMessages.Incorrectusername)
                        return StatusCode(StatusCodes.Status422UnprocessableEntity, new { status = StatusCodes.Status422UnprocessableEntity, message = userdetails });

                }
                return StatusCode(StatusCodes.Status422UnprocessableEntity, new { status = StatusCodes.Status422UnprocessableEntity, message = CAPMessages.Nodata });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        [HttpGet("GetFranchisebasedonlattitude")]
        public IActionResult GetFranchisebasedonlattitude(decimal Lattitude, decimal Longitude)
        {
            try
            {

                var result = _common.GetFranchisebasedonlattitude(Lattitude, Longitude);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });

                return Ok(result);


            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        [Authorize]
        [HttpPut("UpdateProfile")]
        public IActionResult UpdateProfile(string Oldemail, string EmailId, string firstname, string lastname, string phonenumber)
        {
            try
            {
                var result = _users.Updateprofile(Oldemail, EmailId, firstname, lastname, phonenumber);
                if (result.ToString() == CAPMessages.Incorrectmail)
                    return StatusCode(StatusCodes.Status404NotFound, new { status = StatusCodes.Status404NotFound, message = result });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }

        }
        [Authorize]
        [HttpPut("UpdateStudentInfo")]

        public IActionResult Put([FromBody] StudentAdmission student)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    student.UpdatedDate = DateTime.Now;
                    student.Password = EncryptionLibrary.EncryptText(student.Password);

                    string BootCampsIsActive = configuration.GetValue<string>("PlanActive:BootCampsIsActive");
                    string CounsellingIsActive = configuration.GetValue<string>("PlanActive:CounsellingIsActive");
                    var lst = _users.GetAllStripePayment();
                    foreach (var item in student.ProgramIds)
                    {
                        if (item == "Counselling" && CounsellingIsActive.ToLower() == "false")
                        {
                            continue;
                        }
                        if (item == "Boot Camps" && CounsellingIsActive.ToLower() == "false")
                        {
                            continue;
                        }
                        var status = lst.Where(p => p.Program == item).FirstOrDefault();
                        if (status == null)
                        {
                            DataTable mailSettings = _common.GetmailSettings(CAPMessages.Payment);
                            if (mailSettings.Rows.Count > 0)
                            {

                                var res = _context.StudentAdmission.Where(p => p.StudentId == student.StudentId).FirstOrDefault();
                                if (res != null)
                                {
                                    res.IsDiscountApplied = false;
                                    _context.StudentAdmission.Update(res);
                                    int count = _context.SaveChanges();
                                }


                                using (MailMessage mm = new MailMessage())
                                {

                                    string SubjectForStudent = configuration.GetValue<string>("NewProgramEnrolForCenterAdmin:SubjectForStudent");
                                    mm.From = new MailAddress((string)mailSettings.Rows[0]["MailId"]);
                                    mm.To.Add(student.EmailId);


                                    var domain = configuration.GetValue<string>("StripeConfig:Domain");
                                    mm.Subject = SubjectForStudent;
                                    var linkpara = student.EmailId + "&Program=" + item + "&Id=" + student.StudentId;
                                    var link = domain + "/register/student-payment-gateway?emailid=" + linkpara;
                                    string body = configuration.GetValue<string>("NewProgramEnrolForCenterAdmin:BodyForStudent").Replace("{Link}", link).Replace("{CourseName}", item).Replace("{ApplicantName}", student.StudentFirstName + " " + student.StudentLastName); ;



                                    mm.Body = body;


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


                            }
                        }
                    }

                    var result = _users.Updatestudent(student);
                    return Ok(result);
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { status = StatusCodes.Status404NotFound, message = CAPMessages.Nodata });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }



        [Authorize]
        [HttpPut("DeleteUser")]
        public IActionResult DeleteUser(int Studentid)
        {
            try
            {
                var result = _users.DeleteUser(Studentid);
                //if (result.ToString() == CAPMessages.Nodata)
                return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });

                // return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }

        }

    }
}
