using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using WebCAP.Interface;
using WebCAP.Models;
using WebCAP.ViewModels;

namespace WebCAP.Concrete
{
    public class UsersInRolesConcrete : IUsersInRoles
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _configuration;

        public UsersInRolesConcrete(DatabaseContext context, IConfiguration config)
        {
            _context = context;
            _configuration = config;
        }

        public bool AssignRole(UsersInRoles usersInRoles)
        {
            try
            {
                _context.Add(usersInRoles);
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

        public bool CheckRoleExists(UsersInRoles usersInRoles)
        {
            try
            { 
            var result = (from userrole in _context.UsersInRoles
                          where userrole.UserId == usersInRoles.UserId && userrole.RoleId == usersInRoles.RoleId
                          select userrole).Count();

            return result > 0 ? true : false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool RemoveRole(UsersInRoles usersInRoles)
        {
            try
            {
                var role = (from userrole in _context.UsersInRoles
                            where userrole.UserId == usersInRoles.UserId && userrole.RoleId == usersInRoles.RoleId
                            select userrole).FirstOrDefault();
                if (role != null)
                {
                    _context.UsersInRoles.Remove(role);
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

        public List<AssignRolesViewModel> GetAssignRoles()
        {
            try
            {
                var result = (from usertb in _context.UsersInRoles
                              join role in _context.Role on usertb.RoleId equals role.RoleId
                              join user in _context.Users on usertb.UserId equals user.UserId
                              select new AssignRolesViewModel()
                              {
                                  RoleName = role.RoleName,
                                  RoleId = usertb.RoleId,
                                  UserName = role.RoleName,
                                  UserId = usertb.UserId,
                                  UserRolesId = usertb.UserRolesId

                              }).ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
