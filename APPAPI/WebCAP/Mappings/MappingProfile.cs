using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using WebCAP.Models;
using WebCAP.ViewModels;

namespace WebCAP.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
             CreateMap<Role, RoleViewModel>()
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.RoleName))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));

            CreateMap<MemberRegistrationViewModel, MemberRegistration>()
                .ForMember(dest => dest.MemberId, opt => opt.MapFrom(src => src.MemberId))
                .ForMember(dest => dest.MemberFName, opt => opt.MapFrom(src => src.MemberFName))
                .ForMember(dest => dest.MemberLName, opt => opt.MapFrom(src => src.MemberLName))
                .ForMember(dest => dest.MemberMName, opt => opt.MapFrom(src => src.MemberMName))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
                .ForMember(dest => dest.EmailId, opt => opt.MapFrom(src => src.EmailId))
                .ForMember(dest => dest.Dob, opt => opt.MapFrom(src => src.Dob))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Amount))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.Age))
                .ForMember(dest => dest.Contactno, opt => opt.MapFrom(src => src.Contactno))
                .ForMember(dest => dest.JoiningDate, opt => opt.MapFrom(src => src.JoiningDate))
                .ForMember(dest => dest.PlanID, opt => opt.MapFrom(src => src.PlanID))
                .ForMember(dest => dest.SchemeID, opt => opt.MapFrom(src => src.SchemeID))
                .ForMember(dest => dest.MemImagePath, opt => opt.Ignore())
                .ForMember(dest => dest.MemImagename, opt => opt.Ignore())
                .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore());

            CreateMap<UsersViewModel, Users>()
                
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.EmailId, opt => opt.MapFrom(src => src.EmailId))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.UserType, opt => opt.MapFrom(src => src.UserType))
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.Password))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => src.IsDeleted))
                .ForMember(dest => dest.Createdby, opt => opt.MapFrom(src => src.CreatedBy))
                .ForMember(dest => dest.Updatedby, opt => opt.MapFrom(src => src.UpdatedBy))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive));

        }
    }
}
