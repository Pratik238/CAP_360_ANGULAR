using System.Collections.Generic;
using WebCAP.Models;
using WebCAP.ViewModels;

namespace WebCAP.Interface
{
    public interface IUsers
    {
        bool InsertUsers(Users user);
        object Usersdata(string Username,string password);
        object Studentdata(string Username,string password);
        string Updateprofile(string Oldemail, string EmailId, string firstname, string lastname, string phonenumber);
        bool CheckUsersExits(string username);
        bool CheckUsersExits1(string username);
        Users GetUsersbyId(int userid);
        object DeleteUsers(int userid);
        bool UpdateUsers(Users role);
        string Updatepassword(string EmailId, string password);
        List<Users> GetAllUsers();
        bool AuthenticateUsers(string username, string password);
        bool AuthenticateAdminUsers(string username, string password);
        bool AuthenticateStudent(string username, string password);
        LoginResponse GetUserDetailsbyCredentials(string username);
        LoginResponse GetstudentDetailsbyCredentials(string username);

    }
}