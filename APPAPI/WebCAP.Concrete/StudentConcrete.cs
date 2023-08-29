using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using WebCAP.DAL;
using WebCAP.Interface;
using WebCAP.Models;
using WebCAP.ViewModels;
using WebGYM.Models;

namespace WebCAP.Concrete
{
    public class StudentConcrete : IStudent
    {
        private readonly DatabaseContext _context;
        private readonly IUsers _users;
        string result = string.Empty;
        private Settings Settings { get; set; }
        public StudentConcrete(DatabaseContext context, IUsers users, IOptions<Settings> settings)
        {
            _users = users;
            _context = context;
            if (settings != null)
                Settings = settings.Value;
        }
        private DatabaseContext _appContext => _context;
        IOptions<Settings> settings;


        public bool CheckUsersExits(string username)
        {
            try
            {
                var result = (from user in _context.StudentAdmission
                              where user.EmailId == username
                              select user).Count();

                return result > 0 ? true : false;
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

                              where student.EmailId == username && student.IsActive == true && student.IsDeleted == false

                              select new LoginResponse
                              {
                                  UserId = student.StudentId,
                                  RoleId = 2,
                                  Status = student.IsActive,
                                  UserName = student.EmailId
                              }).SingleOrDefault();


                return result;


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<StudentAdmission> GetAllstudents()
        {
            try
            {
                var result = (from user in _context.StudentAdmission
                              where user.IsActive == true
                              select user).ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public bool InsertUsers(StudentAdmission user)
        {
            try
            {
                user.UpdatedDate = DateTime.Now;
                _context.StudentAdmission.Add(user);
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


        public string SaveVerification(string EmailId, string encodedBytes)
        {
            try
            {
                VerificationCodes ver = new VerificationCodes();
                ver.VerificationCode = encodedBytes;
                ver.Verified = false;
                ver.EmailId = EmailId;
                _context.VerificationCodes.Add(ver);
                var Res = _context.SaveChanges();
                if (Res > 0)
                {
                    result = CAPMessages.VerificationCode;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }



        public bool GetVerificationcode(string EmailId, string encodedBytes)
        {

            try
            {
                var Res = (from veri in _context.VerificationCodes
                           where veri.EmailId == EmailId && veri.VerificationCode == encodedBytes
                           select veri).ToList();

                if (Res.Count() > 0)
                {

                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }

        public object getusername(string EmailId)
        {
            try
            {
                var result = (from student in _context.StudentAdmission

                              where student.EmailId == EmailId

                              select new
                              {
                                  Name = student.StudentFirstName + " " + student.StudentLastName

                              }).FirstOrDefault();


                return result;


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
                var res = _context.StudentAdmission.Where(p => p.EmailId == Oldemail).FirstOrDefault();
                if (res.EmailId != null)
                {
                    res.EmailId = EmailId;
                    res.StudentFirstName = firstname;
                    res.StudentLastName = lastname;
                    res.Contactno = phonenumber;
                    _context.StudentAdmission.Update(res);
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



        public string Updatestudent(StudentAdmission student)
        {
            try
            {

                var res = _context.StudentAdmission.Where(p => p.StudentId == student.StudentId).FirstOrDefault();
                if (res != null)
                {
                    var str = String.Join(",", student.ProgramIds);


                    res.EmailId = student.EmailId;
                    res.StudentFirstName = student.StudentFirstName;
                    res.StudentLastName = student.StudentLastName;
                    res.Contactno = student.Contactno;
                    res.Age = student.Age;
                    res.City = student.City;
                    res.CountryName = student.CountryName;
                    res.FranchiseId = student.FranchiseId;
                    res.IsActive = student.IsActive;
                    res.IsDeleted = student.IsDeleted;
                    res.OtherExplanation = student.OtherExplanation;
                    res.ParentEmailId = student.ParentEmailId;
                    res.ParentFirstName = student.ParentFirstName;
                    res.ParentLastName = student.ParentLastName;
                    res.Password = student.Password;
                    res.Program = str;
                    res.State = student.State;
                    res.StreetAddress = student.StreetAddress;
                    res.StreetAddress2 = student.StreetAddress2;
                    res.UpdatedDate = student.UpdatedDate;
                    res.Zipcode = student.Zipcode;
                    _context.StudentAdmission.Update(res);
                    int count = _context.SaveChanges();
                    if (count > 0)
                    {
                        result = CAPMessages.ProfileUpdated;
                    }
                }
                else
                {
                    result = CAPMessages.Incorrectinformation;
                }
                return result;


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object DeleteUser(int Studentid)
        {
            try
            {
                var res = _context.StudentAdmission.Where(p => p.StudentId == Studentid).FirstOrDefault();
                if (res.EmailId != null)
                {
                    res.IsDeleted = true;
                    res.UpdatedDate = DateTime.Now;
                    _context.StudentAdmission.Update(res);
                    int count = _context.SaveChanges();
                    if (count > 0)
                    {
                        result = CAPMessages.Deletestudent;
                    }
                }
                else
                {
                    return res;
                }
                return result;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public StudentAdmission GetStudentAdmissionById(int StudentId)
        {

            var res = _context.StudentAdmission.Where(p => p.StudentId == StudentId).FirstOrDefault();
            return res;
        }



        public List<StudentAdmission> GetDiscountedStudentList()
        {
            try
            {



                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetDiscountedStudentList", null);

                List<StudentAdmission> lst = new List<StudentAdmission>();

                return lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public StripeCustomer CreateStripeCustomer(StripeCustomer user)
        {
            try
            {

                var res = _context.StripeCustomer.Where(p => p.emailId == user.emailId).FirstOrDefault();
                if (res != null)
                {
                    return res;
                }
                else
                {
                    _context.StripeCustomer.Add(user);
                    var result = _context.SaveChanges();
                    return user;
                }


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool CheckStripeCustomerExits(string username)
        {
            try
            {

                var result = (from user in _context.StripeCustomer
                              where user.emailId == username
                              select user).Count();

                return result > 0 ? true : false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool SaveStripeResponce(StripePayment obj)
        {
            try
            {
                var res_SessionId = _context.StripePayment.Where(p => p.SessionId == obj.SessionId).FirstOrDefault();
                //var res = _context.StripePayment.Where(p => p.EmailId == obj.EmailId).FirstOrDefault();
                if (res_SessionId == null)
                {
                    _context.StripePayment.Add(obj);
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

        public List<StripePayment> GetAllStripePayment()
        {
            try
            {
                var result = (from user in _context.StripePayment
                              select user).ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
