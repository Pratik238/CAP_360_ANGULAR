using System;
using System.Collections.Generic;
using System.Linq;
using WebCAP.Common;
using WebCAP.Interface;
using WebCAP.Models;
using WebCAP.ViewModels;

namespace WebCAP.Concrete
{
    public class UsersConcrete : IUsers
    {
        string result = string.Empty;

        private readonly DatabaseContext _context;
        public UsersConcrete(DatabaseContext context)
        {
            _context = context;
        }

        public bool CheckUsersExits(string username)
        {
            try
            {
                var result = (from user in _context.Users
                              where user.EmailId == username
                              select user).Count();


                return result > 0 ? true : false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool CheckUsersExits1(string username)
        {
            try
            {
                var result1 = (from student in _context.StudentAdmission where student.EmailId == username select student).Count();

                return result1 > 0 ? true : false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public object Usersdata(string username, string Password)
        {
            try
            {
                int count = 0;
                var Userdata = _context.Users.Where(p => p.EmailId == username).FirstOrDefault();
                if (Userdata != null)
                {
                    Userdata.Password = Password;
                    _context.Users.Update(Userdata);
                    count = _context.SaveChanges();
                    if (count == 1)
                    {
                        result = CAPMessages.passwordupdate;
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object Studentdata(string username, string Password)
        {
            try
            {
                int count = 0;
                var Studentdata = _context.StudentAdmission.Where(p => p.EmailId == username).FirstOrDefault();
                var Userdata = _context.Users.Where(p => p.EmailId == username).FirstOrDefault();
                if (Studentdata != null)
                {
                    Studentdata.Password = Password;
                    _context.StudentAdmission.Update(Studentdata);
                    count = _context.SaveChanges();
                    if (count == 1)
                    {
                        result = CAPMessages.passwordupdate;
                    }
                }
                else if (Userdata != null)
                {
                    Userdata.Password = Password;
                    _context.Users.Update(Userdata);
                    count = _context.SaveChanges();
                    if (count == 1)
                    {
                        result = CAPMessages.passwordupdate;
                    }
                }
                else
                    result = CAPMessages.Incorrectusername;
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }






        public bool AuthenticateUsers(string username, string password)
        {
            try
            {
                var result = (from user in _context.Users

                              where user.EmailId == username && user.Password == password
                              select user).Count();
                var result1 = (from student in _context.StudentAdmission
                               where student.EmailId == username && student.Password == password
                               select student).Count();


                return (result > 0 || result1 > 0) ? true : false;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public bool AuthenticateStudent(string username, string password)
        {
            try
            {
                var result1 = (from student in _context.StudentAdmission
                               where student.EmailId == username && student.Password == password
                               select student).Count();


                return (result1 > 0) ? true : false;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public bool AuthenticateAdminUsers(string username, string password)
        {
            try
            {
                var result = (from user in _context.Users

                              where user.EmailId == username && user.Password == password
                              select user).Count();



                return (result > 0) ? true : false;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }


        public LoginResponse GetUserDetailsbyCredentials(string username)
        {
            try
            {
                var result = (from user in _context.Users

                              where user.EmailId == username && user.IsActive == true && user.IsDeleted == false

                              select new LoginResponse
                              {
                                  UserId = user.UserId,

                                  Name = user.LastName == null ? user.FirstName : user.FirstName + " " + user.LastName,
                                  RoleId = user.UserType,
                                  Status = user.IsActive,
                                  UserName = user.EmailId
                              }).SingleOrDefault();
                if (result != null)
                {
                    if (result.RoleId == Convert.ToInt32(UserTypes.Tutor))
                    {
                        var resulttutor = (from user in _context.Users
                                           join franchise in _context.Franchise on user.CenterAdminId equals franchise.Centeradminid
                                           where user.EmailId == username

                                           select new LoginResponse
                                           {
                                               UserId = user.UserId,

                                               Name = user.LastName == null ? user.FirstName : user.FirstName + " " + user.LastName,
                                               RoleId = user.UserType,
                                               FranchiseId = franchise.FranchiseId,
                                               Status = user.IsActive,
                                               UserName = user.EmailId
                                           }).SingleOrDefault();
                        return resulttutor;
                    }
                    else if (result.RoleId == Convert.ToInt32(UserTypes.CenterAdmin))
                    {
                        var resultCenter = (from user in _context.Users
                                            join franchise in _context.Franchise on user.UserId equals franchise.Centeradminid
                                            where user.EmailId == username

                                            select new LoginResponse
                                            {
                                                UserId = user.UserId,

                                                Name = user.LastName == null ? user.FirstName : user.FirstName + " " + user.LastName,
                                                RoleId = user.UserType,
                                                FranchiseId = franchise.FranchiseId,
                                                Status = user.IsActive,
                                                UserName = user.EmailId
                                            }).SingleOrDefault();
                        return resultCenter;

                    }

                }

                return result;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public LoginResponse GetstudentDetailsbyCredentials(string username)
        {
            try
            {
                var result = (from student in _context.StudentAdmission
                                  //join batch in _context.BatchAssign on student.StudentId equals batch.StudentId
                              where student.EmailId == username && student.IsDeleted == false && student.IsActive == true

                              select new LoginResponse
                              {
                                  UserId = student.StudentId,
                                  Name = student.StudentLastName == null ? student.StudentFirstName : student.StudentFirstName + " " + student.StudentLastName,
                                  RoleId = Convert.ToInt32(UserTypes.User),
                                  FranchiseId = student.FranchiseId,
                                  Status = student.IsActive,
                                  UserName = student.EmailId,
                                  BatchIds = string.Join(",", _context.BatchAssign.Where(p => p.StudentId == student.StudentId && p.IsDeleted == false).Select(p => p.BatchId))//.FirstOrDefault()//batch.BatchId
                              }).SingleOrDefault();


                return result;


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object DeleteUsers(int userId)
        {
            try
            {
                var removeuser = (from user in _context.Users
                                  where user.UserId == userId
                                  select user).FirstOrDefault();
                if (removeuser != null)
                {
                    removeuser.IsDeleted = true;
                    removeuser.UpdatedDate = DateTime.Now;

                    _context.Users.Update(removeuser);
                    int count = _context.SaveChanges();

                    if (count > 0)
                    {
                        result = CAPMessages.DeleteUser;
                    }
                    else
                    {
                        return removeuser;
                    }
                }
                else
                {
                    return removeuser;
                }
                return removeuser;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<Users> GetAllUsers()
        {
            try
            {
                var result = (from user in _context.Users
                              where user.IsActive == true
                              select user).ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Users GetUsersbyId(int userId)
        {
            try
            {
                var result = (from user in _context.Users
                              where user.UserId == userId
                              select user).FirstOrDefault();

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool InsertUsers(Users user)
        {
            try
            {
                _context.Users.Add(user);
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
        public string Updateprofile(string Oldemail, string EmailId, string firstname, string lastname, string phonenumber)
        {
            try
            {
                var res = _context.Users.Where(p => p.EmailId == Oldemail).FirstOrDefault();
                if (res.EmailId != null)
                {
                    res.EmailId = EmailId;
                    res.FirstName = firstname;
                    res.LastName = lastname;
                    res.PhoneNumber = phonenumber;
                    _context.Users.Update(res);
                    int count = _context.SaveChanges();
                    if (count > 0)
                    {
                        result = CAPMessages.ProfileUpdated;
                    }
                }
                else
                {
                    result = CAPMessages.Incorrectmail;
                }
                return result;


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string Updatepassword(string EmailId, string password)
        {
            try
            {
                var res = _context.Users.Where(p => p.EmailId == EmailId).FirstOrDefault();
                if (res.EmailId != null)
                {
                    res.Password = EncryptionLibrary.EncryptText(password);

                    _context.Users.Update(res);
                    int count = _context.SaveChanges();
                    if (count > 0)
                    {
                        result = CAPMessages.ProfileUpdated;
                    }
                }
                else
                {
                    result = CAPMessages.Incorrectmail;
                }
                return result;


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool UpdateUsers(Users user)
        {
            try
            {
                var userinfo = _context.Users.Where(p => p.UserId == user.UserId).FirstOrDefault();

                if (userinfo != null)
                {

                    userinfo.EmailId = user.EmailId;
                    userinfo.PhoneNumber = user.PhoneNumber;
                    userinfo.FirstName = user.FirstName;
                    userinfo.LastName = user.LastName;
                    userinfo.Password = user.Password;
                    userinfo.UserType = user.UserType;
                    userinfo.IsActive = user.IsActive;
                    userinfo.IsDeleted = user.IsDeleted;
                    userinfo.CenterAdminId = user.CenterAdminId;
                    _context.Users.Update(userinfo);
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
                return false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
