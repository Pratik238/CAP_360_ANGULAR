﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Http;
using WebCAP.Interface;
using WebCAP.Models;

namespace WebCAP.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RemoveRoleController : ControllerBase
    {

        private readonly IUsersInRoles _usersInRoles;
        public RemoveRoleController(IUsersInRoles usersInRoles)
        {
            _usersInRoles = usersInRoles;
        }

        // POST: api/RemoveRole
        [HttpPost]
        public HttpResponseMessage Post([FromBody] UsersInRoles usersInRoles)
        {
            if (ModelState.IsValid)
            {
                if (_usersInRoles.CheckRoleExists(usersInRoles))
                {

                    usersInRoles.UserRolesId = 0;
                    _usersInRoles.RemoveRole(usersInRoles);

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


    }
}
