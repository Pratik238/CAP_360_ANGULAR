﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using WebCAP.Interface;
using WebCAP.Models;
using WebCAP.ViewModels;

namespace WebCAP.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AssignRolesController : ControllerBase
    {
        private readonly IUsersInRoles _usersInRoles;
        public AssignRolesController(IUsersInRoles usersInRoles)
        {
            _usersInRoles = usersInRoles;
        }


        // GET: api/UsersInRoles
        [HttpGet]
        public IEnumerable<AssignRolesViewModel> Get()
        {
            try
            {
                return _usersInRoles.GetAssignRoles();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        // POST: api/UsersInRoles
        [HttpPost]
        public HttpResponseMessage Post([FromBody] UsersInRoles usersInRoles)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (_usersInRoles.CheckRoleExists(usersInRoles))
                    {
                        var response = new HttpResponseMessage()
                        {
                            StatusCode = HttpStatusCode.Conflict
                        };

                        return response;
                    }
                    else
                    {

                        usersInRoles.UserRolesId = 0;
                        _usersInRoles.AssignRole(usersInRoles);

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

                throw ex;
            }
        }



    }
}
