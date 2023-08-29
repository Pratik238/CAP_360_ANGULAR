using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Collections;
using System.Data;
using WebCAP.Models;
using WebCAP.ViewModels;
    
namespace WebCAP.Interface
{
   public interface ICommon
    {
        object TopicsList(string SubjectId, string orderby, string orderbyvalue, string condition);
        object TestTime();

        object EnglishTestTime();

        object getusername(string EmailId);

        object PraticeTestReport(int StudentId);
        // CustomPaginate<QuestionFilters> GetMathsQuestionList(CustomPaginate<QuestionFilters> QuestionFilters);
        DataTable GetMathsQuestionList(CustomPaginate<QuestionFilters> QuestionFilters);
        DataTable GetEnglishQuestionList(CustomPaginate<EnglishQuestionFilters> EnglishQuestionFilters);
        object SATTestReport(int StudentId);
        object AdminPracticeExamSATEnglishReport(int Id, int Usertype, int ExamTypeId);
        object AllEnglishQuestionbyexamid(int ExamId, int Examtype);
        object SATEnglishJumblePichart(int StudentId);
        object AdminSATTesJumbletReport(int Id, int Usertype);
        object SATTestJumblePichart(int StudentId);
        object SATJumbleMathsExamQuestions(int UserId, int SubjectId, string BatchId, int CalculatorId);
        object SATJumbleEnglishExamQuestions(int UserId, int SubjectId, string BatchId, int SectionId);
        object UpdateSATEnglishJumbleQuestions(SATExamEnglishJumbleQuestion ques);
        object AddSATEnglishJumbleQuestions(SATExamEnglishJumbleQuestion ques);
        object AddSATJumbleQuestions(SATExamJumbleQuestion ques);
        object UpdateSATJumbleQuestions(SATExamJumbleQuestion ques);
        object PraticeEnglishPichartReport(int StudentId,int ExamId);

        object SATEnglishPichartReport(int StudentId);

        object AdminPracticeExamReport(int Id, int Usertype);

        object AdminSATTestReport(int Id, int Usertype);

        object GetPracticeSATTestScores(int StudentId, int PracticeorSAT);
        object PraticeQuestions(int UserId, int SubjectId, int TopicId, int CalculatorId, int SubTopicIds, int Ishomework);
        object PraticeEnglishQuestions(int UserId, int SubjectId, int TopicId, int SectionId, int SubTopicIds, int Ishomework);
        object HomeWorkQuestions(int SubjectId, int TopicId, int SubTopicId,string HomeworkIds, int Ishomework);
        object SATExamQuestions(int UserId,int SubjectId, int BatchId, int CalculatorId);
        object SATEnglishExamQuestions(int UserId, int SubjectId, int BatchId, int SectionId);
        
        
        object List(string entityName, string orderby, string orderbyvalue,string condition,bool status);
        
        object GeneralList(string entityName, string orderby, string orderbyvalue, string condition);
        object UsersList(int usertype, int centeradminid, int ISSuperAdmin,bool IsActive);
        object StudentList(int centeradminid);
        object HomeWorkQuestionReport(int Id, int Usertype);
        object HomeWorkEnglishQuestionReport(int Id, int Usertype);
        object DeletedList(string entityName, string orderby, string orderbyvalue, string condition);
        object EnglishScorecardanswerersList(int StudentId, int ExamId, string Name, string Type, int ExamtypeId);
        object PracticeExamEnglishScore(int StudentId, int ExamId, int ExamtypeID);
        object PracticeExamSATEnglishReport(int StudentId, int ExamTypeId);
        object PracticeExamEnglishTopicsandsubtopicsScore(int StudentId, int ExamId, int ExamtypeID);
        string FranchiseDelete(int FranchiseId, int CenteradminId);
        object GetById(CommonParams singleScreenParams);
        object GetSubtopics(int StudentId, string Batchid);

        object Gettopics(int StudentId, string Batchid, int SubjectId);
        object GetSubtopics( string Batchid);
        object Gettopics( string Batchid,int SubjectId);
        object GetHomeWorks( string Batchid);
        DataTable GetmailSettings(int Subject);

        DataTable GetmailSettings(string Subject);
        string MailsentbyTestdetails(int BatchId, int SubjectId, int StudentId ,string Name, int ExamtypeId, int ExamId);
        DataTable GetMessageSettings(int id);
        DataTable GetCenteradminmail(string EmailId);
        object GetBatches(int TutorId);
        object GetFranchisebasedonlattitude(decimal Lattitude, decimal Longitude);
        object GetAttendancereport(int BatchId, DateTime FromDate, DateTime ToDate);
        
        object PracticeExamTopicsandsubtopicsScore(int StudentId, int ExamId, int ExamtypeID);
        object ScorecardanswerersList(int StudentId, int ExamId, string Name, string Type, int ExamtypeId);
        object AllQuestionbyexamid(int ExamId, int Examtype);

        
        string ChangeStatus(CommonParams singleScreenParams);
        
        object PracticeExamSATCUMReport(int StudentId, int ExamTypeId);
        object AddExamQuestions(PracticeExamQuestion ques);
        object UpdateexamQuestions(PracticeExamQuestion ques);
        object AddHomeworkQuestions(HomeWorkQuestion Hwques);
        object UpdateHomeworkQuestions(HomeWorkQuestion Hwques);
        object AddDignastic(DignasticTest dg);
        object AddEnglishExamQuestions(PracticeExamEnglishQuestion ques);
        object UpdateEnglishexamQuestions(PracticeExamEnglishQuestion ques);
        object AddEnglishHomeworkQuestions(HomeWorkEnglishQuestion Hwques);
        object UpdateEnglishHomeworkQuestions(HomeWorkEnglishQuestion ques);
        object GetExamId(int StudentId, int ExamtypeId, int SubjectId);
        object PracticeExamScore(int StudentId, int ExamId, int ExamtypeID);
        object GetZoomLink(string BatchId);
        object AddSATQuestions(SATExamQuestion Hwques);
        object UpdateSATQuestions(SATExamQuestion Hwques);
        string UpdateFranchise(Franchise fran);
        string AddFranchise(Franchise franchise);
        object AddSATEnglishQuestions(SATExamEnglishQuestion ques);
        object UpdateSATEnglishQuestions(SATExamEnglishQuestion ques);
        object PraticeTestReportQuestions(int StudentId, int ExamId);
        object InsertData(WebsiteContactus websitecontact);
        object SATTestReportQuestions(int StudentId, int ExamId);
        string Add(CommonParams singleScreenParams);
        string AddQuestions(Questions questions);
        string AddEnglishQuestions(EnglishParagraph englishQuestions);
        string UpdateEnglishQuestions(EnglishParagraph englishQuestions);
        string UpdateQuestions(Questions questions);
        string BatchAssign(BatchAssign batchAssign);
        object DropdownforCenteradminuser(int Centeradminid);
        object InsertcontactData(Contactus Contactus);
        string SATExamassign(SATExamAssign satexamassign);
        string HomeWorkAssign(HomeWorkAssign homeWorkAssign);
        string addAttendance(Attendance[] attendance);
        string AddExamids(ExamIds attendance);

        string AddEnglishExamids(EnglishExamIds examIds);
        bool GetSubtopiccount(int BatchId, int StudentId);
        object GetVideos(string BatchId);
        //string Uploadvideos(UploadVideos uploadVideos);
        string Delete(CommonParams singleScreenParams);
        string ReStore(CommonParams singleScreenParams);
        string Update(CommonParams singleScreenParams);
        object DropdownList(CommonParams singleScreenParams);
       
        object GetHistory(string tableName, string id);
        object GetDiscountedStudentList(int usertype, int centeradminid, int ISSuperAdmin);
    }
}
