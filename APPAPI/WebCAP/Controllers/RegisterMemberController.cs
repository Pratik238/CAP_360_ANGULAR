using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebCAP.Common;
using WebCAP.Interface;
using WebCAP.Models;
using WebCAP.ViewModels;

namespace WebCAP.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterMemberController : ControllerBase
    {
        private readonly IMemberRegistration _memberRegistration;
        private readonly IUrlHelper _urlHelper;

        public RegisterMemberController(IUrlHelper urlHelper, IMemberRegistration memberRegistration)
        {
            _memberRegistration = memberRegistration;
            _urlHelper = urlHelper;
        }
        
        // GET: api/RegisterMember/5
        [HttpGet("{id}", Name = "GetMember")]
        public MemberRegistrationViewModel Get(int id)
        {
            return _memberRegistration.GetMemberbyId(id);
        }

        // POST: api/RegisterMember
        [HttpPost]
        public HttpResponseMessage Post([FromBody] MemberRegistrationViewModel member)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (!_memberRegistration.CheckNameExits(member.MemberFName, member.MemberLName, member.MemberMName))
                    {
                        var userId = this.User.FindFirstValue(ClaimTypes.Name);
                        var automember = AutoMapper.Mapper.Map<MemberRegistration>(member);
                        automember.JoiningDate = DateTime.Now;
                        automember.Createdby = Convert.ToInt32(userId);

                        var result = _memberRegistration.InsertMember(automember);
                        if (result > 0)
                        {
                            var response = new HttpResponseMessage()
                            {
                                StatusCode = HttpStatusCode.OK
                            };
                            return response;
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
                    else
                    {
                        var response = new HttpResponseMessage()
                        {
                            StatusCode = HttpStatusCode.Conflict
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
                throw ex;
            }
        }

        // PUT: api/RegisterMember/5
        [HttpPut("{id}")]
        public HttpResponseMessage Put(int id, [FromBody] MemberRegistrationViewModel member)
        {

            if (ModelState.IsValid)
            {
                var storedMemberid =
                    _memberRegistration.CheckNameExitsforUpdate(member.MemberFName, member.MemberLName,
                        member.MemberMName);
                if (storedMemberid == member.MemberId || storedMemberid == 0)
                {
                    var automember = AutoMapper.Mapper.Map<MemberRegistration>(member);
                    automember.JoiningDate = DateTime.Now;
                    
                    var result = _memberRegistration.UpdateMember(automember);
                    if (result > 0)
                    {
                        var response = new HttpResponseMessage()
                        {
                            StatusCode = HttpStatusCode.OK
                        };
                        return response;
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
                else
                {
                    var response = new HttpResponseMessage()
                    {
                        StatusCode = HttpStatusCode.Conflict
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

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public HttpResponseMessage Delete(long id)
        {
            try
            {
                var result = _memberRegistration.DeleteMember(id);

                if (result)
                {
                    var response = new HttpResponseMessage()
                    {
                        StatusCode = HttpStatusCode.OK
                    };
                    return response;
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


    }
}
