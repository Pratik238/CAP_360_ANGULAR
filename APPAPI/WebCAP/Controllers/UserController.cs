using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using WebCAP.Common;
using WebCAP.Concrete;
using WebCAP.Interface;
using WebCAP.Models;
using WebCAP.ViewModels;
namespace WebCAP.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUsers _users;
        private readonly DatabaseContext _context;
        public UserController(IUsers users, DatabaseContext context)
        {
            _users = users;
            _context = context;
        }


        // GET: api/User
        [HttpGet]
        public IEnumerable<Users> Get()
        {
            return _users.GetAllUsers();
        }

        // GET: api/User/5
        [HttpGet("{id}", Name = "GetUsers")]
        public Users Get(int id)
        {
            return _users.GetUsersbyId(id);
        }

        // POST: api/User
        [HttpPost]
        public IActionResult Post([FromBody] UsersViewModel users)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (_users.CheckUsersExits(users.EmailId))
                    {
                        return StatusCode(StatusCodes.Status409Conflict, new { status = StatusCodes.Status409Conflict, message = CAPMessages.EmailAlreadyexist });

                    }
                    else if (_users.CheckUsersExits1(users.EmailId))
                    {
                        return StatusCode(StatusCodes.Status409Conflict, new { status = StatusCodes.Status409Conflict, message = CAPMessages.EmailAlreadyexist });
                    }
                    else
                    {
                        var userId = this.User.FindFirstValue(ClaimTypes.Name);
                        var tempUsers = AutoMapper.Mapper.Map<Users>(users);
                        tempUsers.CreatedDate = DateTime.Now;
                        tempUsers.Createdby = users.CreatedBy;
                        tempUsers.Updatedby = users.UpdatedBy;
                        tempUsers.UpdatedDate = DateTime.Now;
                        tempUsers.Password = EncryptionLibrary.EncryptText(users.Password);

                        bool status = _users.InsertUsers(tempUsers);
                        if (status == true)
                        {
                            return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = CAPMessages.InsertUser });

                        }
                        else
                        {
                            return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = CAPMessages.InsertUserfailed });
                        }


                    }
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = CAPMessages.InsertUserfailed });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = ex.InnerException });
            }

        }

        // PUT: api/User/5
        [HttpPut]
        public IActionResult Put([FromBody] Users users)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var userinfo = _context.Users.Where(p => p.UserId != users.UserId && p.EmailId == users.EmailId && p.IsActive == true && p.IsDeleted == false).FirstOrDefault();
                    var studentinfo = _context.StudentAdmission.Where(p => p.EmailId == users.EmailId && p.IsActive == true && p.IsDeleted == false).FirstOrDefault();
                    if (userinfo == null && studentinfo == null)
                    {
                        var tempUsers = AutoMapper.Mapper.Map<Users>(users);
                        tempUsers.UpdatedDate = DateTime.Now;
                        tempUsers.Password = EncryptionLibrary.EncryptText(users.Password);
                        var result = _users.UpdateUsers(tempUsers);

                        return Ok(result);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status409Conflict, new { status = StatusCodes.Status409Conflict, message = CAPMessages.EmailAlreadyexist });

                    }

                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = ModelState });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        [HttpPut("UpdateProfile")]
        public IActionResult UpdateProfile(string Oldemail, string EmailId, string firstname, string lastname, string phonenumber)
        {
            try
            {


                var result = _users.Updateprofile(Oldemail, EmailId, firstname, lastname, phonenumber);
                if (result.ToString() == CAPMessages.Incorrectmail)
                    return StatusCode(StatusCodes.Status422UnprocessableEntity, new { status = StatusCodes.Status422UnprocessableEntity, message = result });
                return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }

        }

        [HttpPut("UpdatePassword")]
        public IActionResult UpdatePassword(string EmailId, string Password)
        {
            try
            {


                var result = _users.Updatepassword(EmailId, Password);
                if (result.ToString() == CAPMessages.Incorrectmail)
                    return StatusCode(StatusCodes.Status422UnprocessableEntity, new { status = StatusCodes.Status422UnprocessableEntity, message = result });
                return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }

        }



        // DELETE: api/ApiWithActions/5
        [HttpPut("Delete/{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var result = _users.DeleteUsers(id);
                // if (result.ToString() == CAPMessages.Nodata)
                return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });
                // return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }


        [HttpPost("ChangePassword")]
        public IActionResult ChangePassword(string OldPassword, string NewPassword, string UserName)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var loginstatus = _users.AuthenticateAdminUsers(UserName, EncryptionLibrary.EncryptText(OldPassword));

                    if (loginstatus)
                    {
                        var userdetails = _users.Usersdata(UserName, EncryptionLibrary.EncryptText(NewPassword));
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

    }
}
