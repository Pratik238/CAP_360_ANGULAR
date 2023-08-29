using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WebCAP.Common;
using WebCAP.Interface;
using WebCAP.Models;
using WebCAP.ViewModels;
using WebCAP.Concrete;
namespace WebCAP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly AppSettings _appSettings;
        private readonly IUsers _users;
        
        public AuthenticateController(IOptions<AppSettings> appSettings, IUsers users)
        {
            _users = users;
            _appSettings = appSettings.Value;
        }

        // POST: api/Authenticate
        [HttpPost]
        public IActionResult Post([FromBody] LoginRequestViewModel value)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var loginstatus = _users.AuthenticateUsers(value.UserName, EncryptionLibrary.EncryptText(value.Password));

                    if (loginstatus)
                    {
                        var userdetails = _users.GetUserDetailsbyCredentials(value.UserName);
                        var userdetails1 = _users.GetstudentDetailsbyCredentials(value.UserName);
                        

                        if (userdetails != null)
                        {

                            var tokenHandler = new JwtSecurityTokenHandler();
                            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                            var tokenDescriptor = new SecurityTokenDescriptor
                            {
                                Subject = new ClaimsIdentity(new Claim[]
                                {
                                        new Claim(ClaimTypes.Name, userdetails.UserId.ToString())
                                }),
                                Expires = DateTime.UtcNow.AddDays(1),
                                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                                    SecurityAlgorithms.HmacSha256Signature)
                            };
                            var token = tokenHandler.CreateToken(tokenDescriptor);
                            value.Token = tokenHandler.WriteToken(token);

                            // remove password before returning
                            value.Password = null;
                            value.UserId = userdetails.UserId;
                            value.Usertype = userdetails.RoleId;
                            value.Name = userdetails.Name;
                            value.FranchiseId = userdetails.FranchiseId;
                            return Ok(value);

                        }
                        else if(userdetails1!=null)
                        {
                            if (userdetails1.BatchIds != "")
                            {
                                var tokenHandler = new JwtSecurityTokenHandler();
                                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                                var tokenDescriptor = new SecurityTokenDescriptor
                                {
                                    Subject = new ClaimsIdentity(new Claim[]
                                    {
                                        new Claim(ClaimTypes.Name, userdetails1.UserId.ToString())
                                    }),
                                    Expires = DateTime.UtcNow.AddDays(1),
                                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                                        SecurityAlgorithms.HmacSha256Signature)
                                };
                                var token = tokenHandler.CreateToken(tokenDescriptor);
                                value.Token = tokenHandler.WriteToken(token);

                                // remove password before returning
                                value.Password = null;
                                value.UserId = userdetails1.UserId;
                                value.Usertype = userdetails1.RoleId;
                                value.Name = userdetails1.Name;
                               // value.BatchId = userdetails1.BatchId;
                                value.BatchIds = userdetails1.BatchIds;
                                value.FranchiseId = userdetails1.FranchiseId;
                                return Ok(value);
                            }
                            else
                            {
                                return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = CAPMessages.studentlogin });
                            }
                        }
                        else
                        {
                            return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = CAPMessages.Incorrectmail });
                          
                        }
                    }
                    return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = CAPMessages.Incorrectmail });
                 
                }
                value.Password = null;
                value.Usertype = 0;
                return Ok(value);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


       

    }
}
