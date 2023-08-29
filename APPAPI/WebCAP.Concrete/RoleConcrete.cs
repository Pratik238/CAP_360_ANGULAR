using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using WebCAP.Interface;
using WebCAP.Models;

namespace WebCAP.Concrete
{
    public class RoleConcrete : IRole
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _configuration;

        public RoleConcrete(DatabaseContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public bool CheckRoleExits(string roleName)
        {
            try
            {
                var result = (from role in _context.Role
                              where role.RoleName == roleName
                              select role).Count();

                return result > 0 ? true : false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool DeleteRole(int roleId)
        {
            try
            {
                var roledata = (from role in _context.Role
                                where role.RoleId == roleId
                                select role).FirstOrDefault();

                if (roledata != null)
                {
                    _context.Role.Remove(roledata);
                    var result = _context.SaveChanges();

                    if (result > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Role GetRolebyId(int roleId)
        {
            try
            {
                var result = (from role in _context.Role
                              where role.RoleId == roleId
                              select role).FirstOrDefault();

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<Role> GetAllRole()
        {
            try
            {
                var result = (from role in _context.Role
                              select role).ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void InsertRole(Role role)
        {
            try
            {
                _context.Role.Add(role);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool UpdateRole(Role role)
        {
            try
            {
                _context.Entry(role).Property(x => x.Status).IsModified = true;
                var result = _context.SaveChanges();
                if (result > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
