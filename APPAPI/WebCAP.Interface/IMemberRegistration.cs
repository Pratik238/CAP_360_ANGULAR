using System.Collections.Generic;
using System.Linq;
using WebCAP.Models;
using WebCAP.ViewModels;

namespace WebCAP.Interface
{
    public interface IMemberRegistration
    {
        int InsertMember(MemberRegistration memberRegistration);
        long CheckNameExitsforUpdate(string memberFName, string memberLName, string memberMName);
        bool CheckNameExits(string memberFName ,string memberLName, string memberMName);
        
        MemberRegistrationViewModel GetMemberbyId(int memberId);
        bool DeleteMember(long memberId);
        int UpdateMember(MemberRegistration memberRegistration);
        int Count(int userId);
        List<MemberResponse> GetMemberNoList(string memberNo, int userId);
    }
}