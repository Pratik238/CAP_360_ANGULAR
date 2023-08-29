using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebCAP.Models;
using WebCAP.ViewModels;
using WebGYM.Models;

namespace WebCAP.Interface
{
   public interface IStudent
    {
        bool InsertUsers(StudentAdmission user);

        bool CheckUsersExits(string username);
        bool GetVerificationcode(string EmailId, string encodedBytes);
        List<StudentAdmission> GetAllstudents();
        LoginResponse GetstudentDetailsbyCredentials(string username);

        string SaveVerification(string EmailId, string encodedBytes);

        object getusername(string EmailId);

        string Updatestudent(StudentAdmission student);
        string Updateprofile(string Oldemail, string EmailId, string firstname, string lastname, string phonenumber);

        object DeleteUser(int Studentid);
        
        StripeCustomer CreateStripeCustomer(StripeCustomer user);
        bool CheckStripeCustomerExits(string username);
        bool SaveStripeResponce(StripePayment obj);

        StudentAdmission GetStudentAdmissionById(int StudentId);
        List<StudentAdmission> GetDiscountedStudentList();
        List<StripePayment> GetAllStripePayment();
    }
}
