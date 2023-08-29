using Microsoft.EntityFrameworkCore;
using WebCAP.Models;
using WebGYM.Models;

namespace WebCAP.Concrete
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }

        public DbSet<PeriodTB> PeriodTb { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<MemberRegistration> MemberRegistration { get; set; }
        public DbSet<Users> Users { get; set; }

        public DbSet<StudentAdmission> StudentAdmission { get; set; }
        public DbSet<StripeCustomer> StripeCustomer { get; set; }
        public DbSet<StripePayment> StripePayment { get; set; }

        public DbSet<Franchise> Franchise { get; set; }
        public DbSet<BatchAssign> BatchAssign { get; set; }
        public DbSet<Batch> Batch { get; set; }
        public DbSet<UsersInRoles> UsersInRoles { get; set; }

        public DbSet<Questions> Questions { get; set; }

        public DbSet<EnglishQuestions> englishQuestions { get; set; }

        public DbSet<EnglishParagraph> englishParagraph { get; set; }
        public DbSet<Attendance> attendance { get; set; }
        public DbSet<UploadVideos> uploadVideos { get; set; }
        public DbSet<HomeWorkAssign> homeWorkAssign { get; set; }

        public DbSet<PracticeExamQuestion> PracticeExamQuestion { get; set; }
        public DbSet<SATExamQuestion> SATExamQuestion { get; set; }

        public DbSet<EnglishExamIds> EnglishExamIds { get; set; }

        public DbSet<PracticeExamEnglishQuestion> PracticeExamEnglishQuestion { get; set; }
        public DbSet<SATExamEnglishQuestion> SATExamEnglishQuestion { get; set; }
        public DbSet<SATExamEnglishJumbleQuestion> SATExamEnglishJumbleQuestions { get; set; }
        public DbSet<SATExamJumbleQuestion> SATExamJumbleQuestion { get; set; }

        public DbSet<ExamIds> ExamIds { get; set; }
        public DbSet<VerificationCodes> VerificationCodes { get; set; }
        public DbSet<SATExamAssign> SATExamAssign { get; set; }

        public DbSet<DignasticTest> dignasticTest { get; set; }


        public DbSet<HomeWorkQuestion> HomeworkQuestion { get; set; }

        public DbSet<HomeWorkEnglishQuestion> HomeworkEnglishQuestion { get; set; }

        public DbSet<WebsiteContactus> websiteContactus { get; set; }
        public DbSet<Contactus> Contactus { get; set; }

    }
}
