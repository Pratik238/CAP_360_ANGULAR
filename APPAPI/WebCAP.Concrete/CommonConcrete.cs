
using WebCAP.Models;
using WebCAP.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using WebCAP.DAL;
using Microsoft.Extensions.Options;
using System.Net.Mail;
using System.IO;
using System.Net;
using WebCAP.Common;

using EntityFrameworkPaginate;
using WebCAP.ViewModels;
namespace WebCAP.Concrete
{
    public class CommonConcrete : Repository<Users>, ICommon
    {
        string result = string.Empty;
        private  Settings Settings { get; set; }
        public CommonConcrete(DatabaseContext context, IOptions<Settings> settings) : base(context)
        {
            if (settings != null)
                Settings = settings.Value;
        }
        private DatabaseContext _appContext => (DatabaseContext)_context;
        IOptions<Settings> settings;


        public object TopicsList(string SubjectId, string orderby, string orderbyvalue, string condition)
        {

            try
            {


                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[4];
                arrSqlParam[0] = new SqlParameter("@SubjectId", SubjectId);
                arrSqlParam[1] = new SqlParameter("@orderby", orderby);
                arrSqlParam[2] = new SqlParameter("@orderbyvalue", orderbyvalue);
                arrSqlParam[3] = new SqlParameter("@condition", condition);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetTopicsList", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataTable GetmailSettings(int ExamtypeId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@ExamtypeId", ExamtypeId);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetMailSettings", arrSqlParam);
                return dsResult.Tables[0];


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataTable GetCenteradminmail(string EmailId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@EmailId", EmailId);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetCenteradminmail", arrSqlParam);
                return dsResult.Tables[0];


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object GetZoomLink(string BatchId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@BatchId", BatchId);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetZoomLink", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
              //  return result;


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataTable GetmailSettings(string Subject)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@Subject", Subject);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetMailSettings1", arrSqlParam);
                return dsResult.Tables[0];


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataSet GetmailId(int BatchId, int StudentId, int SubjectId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@BatchId", BatchId);
                arrSqlParam[1] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[2] = new SqlParameter("@SubjectId", SubjectId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetMailId", arrSqlParam);
                return dsResult;


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int UpdateHomeWorkStatus(int StudentId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                int count = sqlHelper.ExecuteNonQuery("dbo.SP_UpdateHomeworkExamid", arrSqlParam);
                return count;


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public DataTable GetMessageSettings(int id)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@Id", id);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetMessageSettings", arrSqlParam);
                return dsResult.Tables[0];


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public object PraticeQuestions(int UserId, int SubjectId, int TopicId, int CalculatorId, int SubTopicIds, int Ishomework)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[6];
                arrSqlParam[0] = new SqlParameter("@UserId", UserId);
                arrSqlParam[1] = new SqlParameter("@SubjectId", SubjectId);
                arrSqlParam[2] = new SqlParameter("@TopicId", TopicId);
                arrSqlParam[3] = new SqlParameter("@SubTopicId", SubTopicIds);
                arrSqlParam[4] = new SqlParameter("@Ishomework", Ishomework);
                arrSqlParam[5] = new SqlParameter("@CalculatorId", CalculatorId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetQuestionList", arrSqlParam);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public object PraticeEnglishQuestions(int UserId, int SubjectId, int TopicId, int SectionId, int SubTopicIds, int Ishomework)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[6];
                arrSqlParam[0] = new SqlParameter("@UserId", UserId);
                arrSqlParam[1] = new SqlParameter("@SubjectId", SubjectId);
                arrSqlParam[2] = new SqlParameter("@TopicId", TopicId);
                arrSqlParam[3] = new SqlParameter("@SubTopicId", SubTopicIds);
                arrSqlParam[4] = new SqlParameter("@Ishomework", Ishomework);
                arrSqlParam[5] = new SqlParameter("@SectionId", SectionId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetEnglishQuestionList", arrSqlParam);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public object SATExamQuestions(int UserId, int SubjectId, int BatchId, int CalculatorId)
        {

            try
            {
                DataSet dsResult=new DataSet();
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@StudentId", UserId);
                arrSqlParam[1] = new SqlParameter("@SubjectId", SubjectId);
                arrSqlParam[2] = new SqlParameter("@BatchId", BatchId);



                DataSet dsResultcount = sqlHelper.ExecuteDataSet("dbo.SP_SATTestCount", arrSqlParam);

                if (dsResultcount.Tables[0].Rows.Count == 0)
                {

                    return CAPMessages.Doesnotassignsat;
                }
                else
                {
                    if ((dsResultcount.Tables[0].Rows.Count == dsResultcount.Tables[1].Rows.Count) && (dsResultcount.Tables[0].Rows.Count == dsResultcount.Tables[2].Rows.Count))
                    {
                        return CAPMessages.ExamAlreadywritten;
                    }
                    else
                    {
                        if ((dsResultcount.Tables[0].Rows.Count > dsResultcount.Tables[1].Rows.Count))
                        {

                            SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                            arrSqlParam1[0] = new SqlParameter("@StudentId", UserId);
                            arrSqlParam1[1] = new SqlParameter("@SubjectId", SubjectId);
                            arrSqlParam1[2] = new SqlParameter("@BatchId", BatchId);

                            arrSqlParam1[3] = new SqlParameter("@CalculatorId", CalculatorId);

                            dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSATQuestionList", arrSqlParam1);

                            return dsResult.Tables[0];

                        }
                        else if (dsResultcount.Tables[0].Rows.Count > dsResultcount.Tables[2].Rows.Count)
                        {
                            SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                            arrSqlParam1[0] = new SqlParameter("@StudentId", UserId);
                            arrSqlParam1[1] = new SqlParameter("@SubjectId", SubjectId);
                            arrSqlParam1[2] = new SqlParameter("@BatchId", BatchId);

                            arrSqlParam1[3] = new SqlParameter("@CalculatorId", CalculatorId);

                            dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSATQuestionList", arrSqlParam1);

                            return dsResult.Tables[0];
                        }
                        else
                        {
                            return dsResult.Tables[0];
                        }


                    }

                }


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object SATEnglishExamQuestions(int UserId, int SubjectId, int BatchId, int SectionId)
        {

            try
            {
                DataSet dsResult = new DataSet();
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@StudentId", UserId);
                arrSqlParam[1] = new SqlParameter("@SubjectId", SubjectId);
                arrSqlParam[2] = new SqlParameter("@BatchId", BatchId);



                DataSet dsResultcount = sqlHelper.ExecuteDataSet("dbo.SP_SATTestCount", arrSqlParam);

                if (dsResultcount.Tables[0].Rows.Count == 0)
                {

                    return CAPMessages.Doesnotassignsat;
                }
                else
                {
                    if ((dsResultcount.Tables[0].Rows.Count == dsResultcount.Tables[1].Rows.Count) && (dsResultcount.Tables[0].Rows.Count == dsResultcount.Tables[2].Rows.Count))
                    {
                        return CAPMessages.ExamAlreadywritten;
                    }
                    else
                    {
                        if ((dsResultcount.Tables[0].Rows.Count > dsResultcount.Tables[1].Rows.Count))
                        {

                            SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                            arrSqlParam1[0] = new SqlParameter("@StudentId", UserId);
                            arrSqlParam1[1] = new SqlParameter("@SubjectId", SubjectId);
                            arrSqlParam1[2] = new SqlParameter("@BatchId", BatchId);

                            arrSqlParam1[3] = new SqlParameter("@SectionId", SectionId);

                            dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSATEnglishQuestionList", arrSqlParam1);

                            return dsResult.Tables[0];

                        }
                        else if (dsResultcount.Tables[0].Rows.Count > dsResultcount.Tables[2].Rows.Count)
                        {
                            SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                            arrSqlParam1[0] = new SqlParameter("@StudentId", UserId);
                            arrSqlParam1[1] = new SqlParameter("@SubjectId", SubjectId);
                            arrSqlParam1[2] = new SqlParameter("@BatchId", BatchId);

                            arrSqlParam1[3] = new SqlParameter("@SectionId", SectionId);

                            dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSATEnglishQuestionList", arrSqlParam1);

                            return dsResult.Tables[0];
                        }
                        else
                        {
                            return dsResult.Tables[0];
                        }


                    }

                }


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object SATJumbleEnglishExamQuestions(int UserId, int SubjectId, string BatchId, int SectionId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                arrSqlParam1[0] = new SqlParameter("@StudentId", UserId);
                arrSqlParam1[1] = new SqlParameter("@SubjectId", SubjectId);
                arrSqlParam1[2] = new SqlParameter("@BatchId", BatchId);

                arrSqlParam1[3] = new SqlParameter("@SectionId", SectionId);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSATJumbleEnglishQuestionList", arrSqlParam1);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;




            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object SATJumbleMathsExamQuestions(int UserId, int SubjectId, string BatchId, int CalculatorId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                arrSqlParam1[0] = new SqlParameter("@StudentId", UserId);
                arrSqlParam1[1] = new SqlParameter("@SubjectId", SubjectId);
                arrSqlParam1[2] = new SqlParameter("@BatchId", BatchId);

                arrSqlParam1[3] = new SqlParameter("@CalculatorId", CalculatorId);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSATJumbleQuestionList", arrSqlParam1);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
                //return result;




            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object HomeWorkQuestionReport(int Id, int Usertype)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@Id", Id);
                arrSqlParam[1] = new SqlParameter("@Usertype", Usertype);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetHomeWorkReport", arrSqlParam);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public object HomeWorkEnglishQuestionReport(int Id, int Usertype)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@Id", Id);
                arrSqlParam[1] = new SqlParameter("@Usertype", Usertype);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetEnglishHomeWorkReport", arrSqlParam);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public object AllQuestionbyexamid(int ExamId, int Examtype)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@ExamId", ExamId);
                arrSqlParam[1] = new SqlParameter("@Examtype", Examtype);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetAllQuestionbyexamid", arrSqlParam);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
                //return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public object AllEnglishQuestionbyexamid(int ExamId, int Examtype)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@ExamId", ExamId);
                arrSqlParam[1] = new SqlParameter("@Examtype", Examtype);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetAllEnglishQuestionbyexamid", arrSqlParam);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object GetFranchisebasedonlattitude(decimal Lattitude, decimal Longitude)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@Lattitude", Lattitude);
                arrSqlParam[1] = new SqlParameter("@Longitude", Longitude);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetFranchisebasedonlattitude", arrSqlParam);
                DataSet dsResult1 = sqlHelper.ExecuteDataSet("dbo.SP_GetDefaultFranchise");

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        if (dsResult1.Tables.Count > 0)
                        {
                            if (dsResult1.Tables[0].Rows.Count > 0)
                            {
                                return dsResult1.Tables[0];
                            }
                        }
                    }
                }
                else
                {
                    if (dsResult1.Tables.Count > 0)
                    {
                        if (dsResult1.Tables[0].Rows.Count > 0)
                        {
                            return dsResult1.Tables[0];
                        }
                    }
                }
                return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }






        public string MailsentbyTestdetails(int BatchId, int SubjectId, int StudentId, string StudnetName, int ExamtypeId, int ExamId)
        {
            try
            {
                DataTable HomeworkMail = GetmailSettings(ExamtypeId);

                DataSet Tutormailid = GetmailId(BatchId, StudentId, SubjectId);
                if (HomeworkMail.Rows.Count > 0)
                {
                    if ((Tutormailid.Tables[0].Rows.Count > 0) || (Tutormailid.Tables[1].Rows.Count > 0))
                    {
                        using (MailMessage mm = new MailMessage((string)HomeworkMail.Rows[0]["MailId"], Tutormailid.Tables[0].Rows[0]["EmailId"].ToString()))
                        {
                            mm.Subject = HomeworkMail.Rows[0]["Subject"].ToString();

                            mm.Body = HomeworkMail.Rows[0]["Dear"].ToString() + '\n' +
                                "SubjectName-" + Tutormailid.Tables[1].Rows[0]["SubjectName"].ToString() + '\n' +
                               StudnetName + " " + HomeworkMail.Rows[0]["Body"].ToString() + " Id:" + ExamId + CAPMessages.Submit + '\n' +
                               HomeworkMail.Rows[0]["Regards"].ToString() + '\n' +
                               HomeworkMail.Rows[0]["RegardsName"].ToString();

                            mm.IsBodyHtml = false;
                            SmtpClient smtp = new SmtpClient();
                            smtp.Host = HomeworkMail.Rows[0]["SMTP"].ToString();
                            smtp.EnableSsl = true;
                            NetworkCredential NetworkCred = new NetworkCredential(HomeworkMail.Rows[0]["MailId"].ToString(), HomeworkMail.Rows[0]["Password"].ToString());
                            smtp.UseDefaultCredentials = true;
                            smtp.Credentials = NetworkCred;
                            smtp.Port = int.Parse(HomeworkMail.Rows[0]["Port"].ToString());
                            smtp.Send(mm);

                            int Count = UpdateHomeWorkStatus(StudentId);
                            if (Count > 0)
                            {

                                result = CAPMessages.Mailsent;
                            }
                            else
                            {
                                result = CAPMessages.MailUpdatesent;
                            }

                        }
                    }
                    else
                    {
                        result = CAPMessages.NoTutorMailIdData;
                    }
                }
                else
                {
                    result = CAPMessages.NoMailMessageData;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public object HomeWorkQuestions(int SubjectId, int TopicId, int SubTopicId, string HomeWorkIds, int Ishomework)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[5];

                arrSqlParam[0] = new SqlParameter("@SubjectId", SubjectId);
                arrSqlParam[1] = new SqlParameter("@TopicId", TopicId);
                arrSqlParam[2] = new SqlParameter("@SubTopicId", SubTopicId);
                arrSqlParam[3] = new SqlParameter("@HomeWorkIds", HomeWorkIds);
                arrSqlParam[4] = new SqlParameter("@Ishomework", Ishomework);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetHomeWorkQuestionList", arrSqlParam);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
              //  return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public object GetExamId(int StudentId, int ExamtypeId, int SubjectId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@ExamTypeId", ExamtypeId);
                arrSqlParam[2] = new SqlParameter("@SubjectId", SubjectId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetExamIds", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object PracticeExamScore(int StudentId, int ExamId, int ExamtypeID)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];

                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@ExamId", ExamId);
                arrSqlParam[2] = new SqlParameter("@ExamTypeid", ExamtypeID);


                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetPracticeScore", arrSqlParam);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
              //  return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public object PracticeExamTopicsandsubtopicsScore(int StudentId, int ExamId, int ExamtypeID)
        {

            try
            {
                DataTable dtalldata = new DataTable();
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];

                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@ExamId", ExamId);
                arrSqlParam[2] = new SqlParameter("@ExamTypeid", ExamtypeID);


                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetPracticeExam_Score", arrSqlParam);
                if (ExamtypeID == Convert.ToInt32(TestTypes.Practice))
                {
                    if (dsResult.Tables.Count > 0)
                    {

                        dtalldata.Merge(dsResult.Tables[0]);
                        if (dsResult.Tables[1].Rows.Count > 0)
                        {
                            for (int i = 0; i < dsResult.Tables[1].Rows.Count; i++)
                            {
                                SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                                arrSqlParam1[0] = new SqlParameter("@SubTopicid", int.Parse(dsResult.Tables[1].Rows[i]["id"].ToString()));
                                arrSqlParam1[1] = new SqlParameter("@StudentId", StudentId);
                                arrSqlParam1[2] = new SqlParameter("@ExamId", ExamId);
                                arrSqlParam1[3] = new SqlParameter("@ExamTypeid", ExamtypeID);
                                DataSet dsResult1 = sqlHelper.ExecuteDataSet("dbo.SP_GetPracticeSubTopicsScore", arrSqlParam1);
                                if (dsResult1.Tables.Count > 0)
                                {
                                    dtalldata.Merge(dsResult1.Tables[0], true, MissingSchemaAction.Ignore);
                                }
                            }

                        }
                    }
                }
                else if (ExamtypeID == Convert.ToInt32(TestTypes.SAT) || (ExamtypeID == Convert.ToInt32(TestTypes.SATJumble)))
                {
                    if (dsResult.Tables.Count > 0)
                    {

                        if (dsResult.Tables[0].Rows.Count > 0)
                        {
                            for (int i = 0; i < dsResult.Tables[0].Rows.Count; i++)
                            {
                                SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                                arrSqlParam1[0] = new SqlParameter("@Topicid", int.Parse(dsResult.Tables[0].Rows[i]["id"].ToString()));
                                arrSqlParam1[1] = new SqlParameter("@StudentId", StudentId);
                                arrSqlParam1[2] = new SqlParameter("@ExamId", ExamId);
                                arrSqlParam1[3] = new SqlParameter("@ExamTypeid", ExamtypeID);
                                DataSet dsResult1 = sqlHelper.ExecuteDataSet("dbo.SP_GetPracticeTopicsScore", arrSqlParam1);
                                if (dsResult1.Tables.Count > 0)
                                {
                                    if (i == 0)
                                    {
                                        dtalldata = dsResult1.Tables[0].Copy();
                                    }
                                    else
                                    {
                                        dtalldata.Merge(dsResult1.Tables[0], true, MissingSchemaAction.Ignore);
                                    }
                                }
                            }

                        }
                        if (dsResult.Tables[1].Rows.Count > 0)
                        {
                            for (int i = 0; i < dsResult.Tables[1].Rows.Count; i++)
                            {
                                SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                                arrSqlParam1[0] = new SqlParameter("@SubTopicid", int.Parse(dsResult.Tables[1].Rows[i]["id"].ToString()));
                                arrSqlParam1[1] = new SqlParameter("@StudentId", StudentId);
                                arrSqlParam1[2] = new SqlParameter("@ExamId", ExamId);
                                arrSqlParam1[3] = new SqlParameter("@ExamTypeid", ExamtypeID);
                                DataSet dsResult2 = sqlHelper.ExecuteDataSet("dbo.SP_GetPracticeSubTopicsScore", arrSqlParam1);
                                if (dsResult2.Tables.Count > 0)
                                {
                                    dtalldata.Merge(dsResult2.Tables[0], true, MissingSchemaAction.Ignore);
                                }
                            }

                        }
                    }
                }


                if (dtalldata.Rows.Count > 0)
                {
                    return dtalldata;
                }
                else
                {
                    return dsResult.Tables[0];
                }

               // return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public object PracticeExamEnglishScore(int StudentId, int ExamId, int ExamtypeID)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                if (ExamtypeID == Convert.ToInt32(TestTypes.Practice))
                {

                    SqlParameter[] arrSqlParam1 = new SqlParameter[2];
                    SqlHelper sqlHelper1 = new SqlHelper(Settings.ConnectionString);
                    arrSqlParam1[0] = new SqlParameter("@StudentId", StudentId);
                    arrSqlParam1[1] = new SqlParameter("@ExamId", ExamId);
                    DataSet dsResult1 = sqlHelper1.ExecuteDataSet("dbo.SP_GetEnglishExamSectionid", arrSqlParam1);
                    if (dsResult1.Tables.Count > 0)
                    {
                        SqlParameter[] arrSqlParam = new SqlParameter[4];

                        arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                        arrSqlParam[1] = new SqlParameter("@ExamId", ExamId);
                        arrSqlParam[2] = new SqlParameter("@ExamTypeid", ExamtypeID);
                        arrSqlParam[3] = new SqlParameter("@SectionId", int.Parse(dsResult1.Tables[0].Rows[0]["EnglishSectionId"].ToString()));

                        SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                        DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetEnglishPracticeScore", arrSqlParam);

                        if (dsResult.Tables.Count > 0)
                        {
                            if (dsResult.Tables[0].Rows.Count > 0)
                            {
                                return dsResult.Tables[0];
                            }
                            else
                            {
                                return dsResult.Tables[0];
                            }
                        }
                        else
                        {
                            return dsResult.Tables[0];
                        }
                    }
                    else
                    {
                        result = CAPMessages.Nosectionid;
                    }
                }
                else
                {
                    SqlParameter[] arrSqlParam = new SqlParameter[4];

                    arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                    arrSqlParam[1] = new SqlParameter("@ExamId", ExamId);
                    arrSqlParam[2] = new SqlParameter("@ExamTypeid", ExamtypeID);
                    arrSqlParam[3] = new SqlParameter("@SectionId",Convert.ToUInt32(EnglishSectiontypes.Reading));

                    SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                    DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetEnglishPracticeScore", arrSqlParam);

                    if (dsResult.Tables.Count > 0)
                    {
                        if (dsResult.Tables[0].Rows.Count > 0)
                        {
                            return dsResult.Tables[0];
                        }
                        else
                        {
                            return dsResult.Tables[0];
                        }
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public object PracticeExamEnglishTopicsandsubtopicsScore(int StudentId, int ExamId, int ExamtypeID)
        {

            try
            {
                DataTable dtalldata = new DataTable();
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam2 = new SqlParameter[2];
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                arrSqlParam2[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam2[1] = new SqlParameter("@ExamId", ExamId);
                DataSet dsResult2 = sqlHelper.ExecuteDataSet("dbo.SP_GetEnglishExamSectionid", arrSqlParam2);
               

                SqlParameter[] arrSqlParam = new SqlParameter[4];

                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@ExamId", ExamId);
                arrSqlParam[2] = new SqlParameter("@ExamTypeid", ExamtypeID);
                if (dsResult2.Tables.Count > 0)
                {
                    if (ExamtypeID == Convert.ToInt32(TestTypes.Practice))
                    {
                        arrSqlParam[3] = new SqlParameter("@SectionId",int.Parse( dsResult2.Tables[0].Rows[0]["EnglishSectionId"].ToString()));
                    }
                    else
                    {
                        arrSqlParam[3] = new SqlParameter("@SectionId", Convert.ToInt32( EnglishSectiontypes.Reading));
                    }
                }
                else
                {
                    result = CAPMessages.Nosectionid;
                }
                

               
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetEnglishPracticeExam_Score", arrSqlParam);
                if (ExamtypeID == Convert.ToInt32(TestTypes.Practice))
                {
                    if (dsResult.Tables.Count > 0)
                    {

                        dtalldata.Merge(dsResult.Tables[0]);
                        if (dsResult.Tables[1].Rows.Count > 0)
                        {
                            for (int i = 0; i < dsResult.Tables[1].Rows.Count; i++)
                            {
                                SqlParameter[] arrSqlParam1 = new SqlParameter[5];
                                arrSqlParam1[0] = new SqlParameter("@SubTopicid", int.Parse(dsResult.Tables[1].Rows[i]["id"].ToString()));
                                arrSqlParam1[1] = new SqlParameter("@StudentId", StudentId);
                                arrSqlParam1[2] = new SqlParameter("@ExamId", ExamId);
                                arrSqlParam1[3] = new SqlParameter("@ExamTypeid", ExamtypeID);

                                arrSqlParam[4] = new SqlParameter("@SectionId", int.Parse(dsResult2.Tables[0].Rows[0]["EnglishSectionId"].ToString()));
                                DataSet dsResult1 = sqlHelper.ExecuteDataSet("dbo.SP_GetEnglishSectionPracticeSubTopicsScore", arrSqlParam1);
                                if (dsResult1.Tables.Count > 0)
                                {
                                    dtalldata.Merge(dsResult1.Tables[0], true, MissingSchemaAction.Ignore);
                                }
                            }

                        }
                    }
                }
                else if (ExamtypeID == Convert.ToInt32(TestTypes.SAT) || (ExamtypeID == Convert.ToInt32(TestTypes.SATJumble)))
                {
                    if (dsResult.Tables.Count > 0)
                    {

                        if (dsResult.Tables[0].Rows.Count > 0)
                        {
                            for (int i = 0; i < dsResult.Tables[0].Rows.Count; i++)
                            {
                                SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                                arrSqlParam1[0] = new SqlParameter("@Topicid", int.Parse(dsResult.Tables[0].Rows[i]["id"].ToString()));
                                arrSqlParam1[1] = new SqlParameter("@StudentId", StudentId);
                                arrSqlParam1[2] = new SqlParameter("@ExamId", ExamId);
                                arrSqlParam1[3] = new SqlParameter("@ExamTypeid", ExamtypeID);
                                DataSet dsResult1 = sqlHelper.ExecuteDataSet("dbo.SP_GetEnglishPracticeTopicsScore", arrSqlParam1);
                                if (dsResult1.Tables.Count > 0)
                                {
                                    if (i == 0)
                                    {
                                        dtalldata = dsResult1.Tables[0].Copy();
                                    }
                                    else
                                    {
                                        dtalldata.Merge(dsResult1.Tables[0], true, MissingSchemaAction.Ignore);
                                    }
                                }
                            }

                        }
                        if (dsResult.Tables[1].Rows.Count > 0)
                        {
                            for (int i = 0; i < dsResult.Tables[1].Rows.Count; i++)
                            {
                                SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                                arrSqlParam1[0] = new SqlParameter("@SubTopicid", int.Parse(dsResult.Tables[1].Rows[i]["id"].ToString()));
                                arrSqlParam1[1] = new SqlParameter("@StudentId", StudentId);
                                arrSqlParam1[2] = new SqlParameter("@ExamId", ExamId);
                                arrSqlParam1[3] = new SqlParameter("@ExamTypeid", ExamtypeID);
                                DataSet dsResult3 = sqlHelper.ExecuteDataSet("dbo.SP_GetEnglishPracticeSubTopicsScore", arrSqlParam1);
                                if (dsResult3.Tables.Count > 0)
                                {
                                    dtalldata.Merge(dsResult3.Tables[0], true, MissingSchemaAction.Ignore);
                                }
                            }

                        }
                    }
                }


                if (dtalldata.Rows.Count > 0)
                {
                    return dtalldata;
                }
                else
                {
                    return dsResult.Tables[0];
                }

              //  return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public object PraticeTestReport(int StudentId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetPracticePiChart", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public object PraticeEnglishPichartReport(int StudentId,int ExamId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam1 = new SqlParameter[1];
                SqlHelper sqlHelper1 = new SqlHelper(Settings.ConnectionString);
                arrSqlParam1[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam1[1] = new SqlParameter("@ExamId", ExamId);
                DataSet dsResult1 = sqlHelper1.ExecuteDataSet("dbo.SP_GetEnglishExamSectionid", arrSqlParam1);
                if (dsResult1.Tables.Count > 0)
                {
                    SqlParameter[] arrSqlParam = new SqlParameter[2];
                    arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                    arrSqlParam[1] = new SqlParameter("@SectionId", int.Parse(dsResult1.Tables[0].Rows[0]["EnglishSectionId"].ToString()));

                    

                    DataSet dsResult = sqlHelper1.ExecuteDataSet("dbo.SP_GetPracticeEnglishPiChart", arrSqlParam);
                    if (dsResult.Tables.Count > 0)
                    {
                        if (dsResult.Tables[0].Rows.Count > 0)
                        {
                            return dsResult.Tables[0];
                        }
                        else
                        {
                            return dsResult.Tables[0];
                        }
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }

                }
                else
                {
                    result = CAPMessages.Nosectionid;
                }    
                return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public object PraticeTestReportQuestions(int StudentId, int ExamId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@ExamId", ExamId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetAnsweredQuestionbyexamid", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
                //return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public object SATTestReportQuestions(int StudentId, int ExamId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@ExamId", ExamId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSATTestAnsweredQuestionbyexamid", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
                //return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public object SATTestReport(int StudentId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSATPiChart", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public object SATEnglishPichartReport(int StudentId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSATEnglishPiChart", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
                //return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public object SATTestJumblePichart(int StudentId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSATJumblePiChart", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public object SATEnglishJumblePichart(int StudentId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSATJumbleEnglishPiChart", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public object AdminSATTestReport(int Id, int Usertype)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@Id", Id);
                arrSqlParam[1] = new SqlParameter("@Usertype", Usertype);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);


                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetAdminSATTESTReport", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {

                        dsResult.Tables[0].Columns.Add("Score", typeof(System.Int32));

                        foreach (DataRow row in dsResult.Tables[0].Rows)
                        {

                            int correctcount = int.Parse(row["CalGridCorrect"].ToString()) + int.Parse(row["CalMulCorrect"].ToString()) + int.Parse(row["NoCalMulCorrect"].ToString()) + int.Parse(row["NoCalGridCorrect"].ToString());
                            SqlParameter[] arrSqlParam1 = new SqlParameter[1];
                            arrSqlParam1[0] = new SqlParameter("@Correctcount", correctcount);
                            DataSet dsResult1 = sqlHelper.ExecuteDataSet("dbo.SP_GetScore", arrSqlParam1);
                            if (dsResult1.Tables.Count > 0)
                            {
                                if (dsResult1.Tables[0].Rows.Count > 0)
                                {
                                    row["Score"] = int.Parse(dsResult1.Tables[0].Rows[0]["Score"].ToString());
                                }
                            }
                        }
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
               // return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object AdminSATTesJumbletReport(int Id, int Usertype)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@Id", Id);
                arrSqlParam[1] = new SqlParameter("@Usertype", Usertype);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);


                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetAdminSATTESTJumbleReport", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        dsResult.Tables[0].Columns.Add("Score", typeof(System.Int32));

                        foreach (DataRow row in dsResult.Tables[0].Rows)
                        {

                            int correctcount = int.Parse(row["CalGridCorrect"].ToString()) + int.Parse(row["CalMulCorrect"].ToString()) + int.Parse(row["NoCalMulCorrect"].ToString()) + int.Parse(row["NoCalGridCorrect"].ToString());
                            SqlParameter[] arrSqlParam1 = new SqlParameter[1];
                            arrSqlParam1[0] = new SqlParameter("@Correctcount", correctcount);
                            DataSet dsResult1 = sqlHelper.ExecuteDataSet("dbo.SP_GetScore", arrSqlParam1);
                            if (dsResult1.Tables.Count > 0)
                            {
                                if (dsResult1.Tables[0].Rows.Count > 0)
                                {
                                    row["Score"] = int.Parse(dsResult1.Tables[0].Rows[0]["Score"].ToString());
                                }
                            }
                        }
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
                //return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object GetPracticeSATTestScores(int StudentId, int PracticeorSAT)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@PracticeorSAT", PracticeorSAT);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);


                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_PracticeSATScore", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }

                else
                {
                    return dsResult.Tables[0];
                }

              //  return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public object AdminPracticeExamReport(int Id, int Usertype)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@Id", Id);
                arrSqlParam[1] = new SqlParameter("@Usertype", Usertype);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetAdminPracticeExamReport", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        dsResult.Tables[0].Columns.Add("Score", typeof(System.Int32));

                        foreach (DataRow row in dsResult.Tables[0].Rows)
                        {

                            int correctcount = int.Parse(row["CalGridCorrect"].ToString()) + int.Parse(row["CalMulCorrect"].ToString()) + int.Parse(row["NoCalMulCorrect"].ToString()) + int.Parse(row["NoCalGridCorrect"].ToString());
                            SqlParameter[] arrSqlParam1 = new SqlParameter[1];
                            arrSqlParam1[0] = new SqlParameter("@Correctcount", correctcount);
                            DataSet dsResult1 = sqlHelper.ExecuteDataSet("dbo.SP_GetScore", arrSqlParam1);
                            if (dsResult1.Tables.Count > 0)
                            {
                                if (dsResult1.Tables[0].Rows.Count > 0)
                                {
                                    row["Score"] = int.Parse(dsResult1.Tables[0].Rows[0]["Score"].ToString());
                                }
                            }
                        }
                        return dsResult.Tables[0];

                    }
                    else
                    {
                        return dsResult.Tables[0];
                    }
                }
                else
                {
                    return dsResult.Tables[0];
                }
                //return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object PracticeExamSATCUMReport(int StudentId, int ExamTypeId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@ExamtypeId", ExamTypeId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetPracticeCUMExamReport", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        dsResult.Tables[0].Columns.Add("Score", typeof(System.Int32));

                        foreach (DataRow row in dsResult.Tables[0].Rows)
                        {

                            int correctcount = int.Parse(row["CalGridCorrect"].ToString()) + int.Parse(row["CalMulCorrect"].ToString()) + int.Parse(row["NoCalMulCorrect"].ToString()) + int.Parse(row["NoCalGridCorrect"].ToString());
                            SqlParameter[] arrSqlParam1 = new SqlParameter[1];
                            arrSqlParam1[0] = new SqlParameter("@Correctcount", correctcount);
                            DataSet dsResult1 = sqlHelper.ExecuteDataSet("dbo.SP_GetScore", arrSqlParam1);
                            if (dsResult1.Tables.Count > 0)
                            {
                                if (dsResult1.Tables[0].Rows.Count > 0)
                                {
                                    row["Score"] = int.Parse(dsResult1.Tables[0].Rows[0]["Score"].ToString());
                                }
                            }
                        }
                    }
                }
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
               // return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }




        public object PracticeExamSATEnglishReport(int StudentId, int ExamTypeId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@ExamtypeId", ExamTypeId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetPracticeEnglishExam", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        dsResult.Tables[0].Columns.Add("Score", typeof(System.Int32));

                        foreach (DataRow row in dsResult.Tables[0].Rows)
                        {

                            int correctcount = int.Parse(row["TotalReadCorrect"].ToString()) + int.Parse(row["TotalWriteCorrect"].ToString());
                            SqlParameter[] arrSqlParam1 = new SqlParameter[1];
                            arrSqlParam1[0] = new SqlParameter("@Correctcount", correctcount);
                            DataSet dsResult1 = sqlHelper.ExecuteDataSet("dbo.SP_GetScore", arrSqlParam1);
                            if (dsResult1.Tables.Count > 0)
                            {
                                if (dsResult1.Tables[0].Rows.Count > 0)
                                {
                                    row["Score"] = int.Parse(dsResult1.Tables[0].Rows[0]["Score"].ToString());
                                }
                            }
                        }
                    }
                }
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
               // return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public object AdminPracticeExamSATEnglishReport(int Id, int Usertype, int ExamTypeId)
        {

            try
            {
                int Sectionid =0;
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam2 = new SqlParameter[2];
                SqlHelper sqlHelper2 = new SqlHelper(Settings.ConnectionString);
                arrSqlParam2[0] = new SqlParameter("@StudentId", Id);
                arrSqlParam2[1] = new SqlParameter("@ExamId", Id);
                DataSet dsResult2 = sqlHelper2.ExecuteDataSet("dbo.SP_GetEnglishExamSectionid", arrSqlParam2);
                if (dsResult2.Tables.Count > 0)
                {
                    if (dsResult2.Tables[0].Rows.Count > 0)
                    {
                        Sectionid = Convert.ToInt32(dsResult2.Tables[0].Rows[0]["EnglishSectionId"].ToString());
                    }
                }

                SqlParameter[] arrSqlParam = new SqlParameter[4];

                arrSqlParam[0] = new SqlParameter("@Id", Id);
                arrSqlParam[1] = new SqlParameter("@Usertype", Usertype);
                arrSqlParam[2] = new SqlParameter("@ExamtypeId", ExamTypeId);
                if (ExamTypeId == Convert.ToInt32(TestTypes.Practice))
                {
                    if (Sectionid > 0)
                    {
                        arrSqlParam[3] = new SqlParameter("@SectionId", Convert.ToInt32(EnglishSectiontypes.Reading));
                    }
                    else
                    {
                        result = CAPMessages.Nosectionid;
                    }
                }
                else
                {
                    arrSqlParam[3] = new SqlParameter("@SectionId", Convert.ToInt32(EnglishSectiontypes.Reading));
                }
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetAdminPracticeSATEnglishExam", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        dsResult.Tables[0].Columns.Add("Score", typeof(System.Int32));

                        foreach (DataRow row in dsResult.Tables[0].Rows)
                        {

                            int correctcount = int.Parse(row["TotalReadCorrect"].ToString()) + int.Parse(row["TotalWriteCorrect"].ToString());
                            SqlParameter[] arrSqlParam1 = new SqlParameter[1];
                            arrSqlParam1[0] = new SqlParameter("@Correctcount", correctcount);
                            DataSet dsResult1 = sqlHelper.ExecuteDataSet("dbo.SP_GetScore", arrSqlParam1);
                            if (dsResult1.Tables.Count > 0)
                            {
                                if (dsResult1.Tables[0].Rows.Count > 0)
                                {
                                    row["Score"] = int.Parse(dsResult1.Tables[0].Rows[0]["Score"].ToString());
                                }
                            }
                        }
                    }
                    if (dsResult.Tables.Count > 0)
                    {
                        if (dsResult.Tables[0].Rows.Count > 0)
                        {
                            return dsResult.Tables[0];
                        }
                        else
                        {
                             return dsResult.Tables[0];
                        }
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }



                return result;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object TestTime()
        {

            try
            {
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetTestTime");
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object EnglishTestTime()
        {

            try
            {
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetEnglishTestTime");
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public object List(string entityName, string orderby, string orderbyvalue, string condition, bool status)
        {

            try
            {
                int active;
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[5];
                arrSqlParam[0] = new SqlParameter("@entityName", entityName);
                arrSqlParam[1] = new SqlParameter("@orderby", orderby);
                arrSqlParam[2] = new SqlParameter("@orderbyvalue", orderbyvalue);
                arrSqlParam[3] = new SqlParameter("@condition", condition);
                if (status == true)
                {
                    active = Convert.ToInt32(YesornoEnum.True);
                }
                else
                {
                    active = Convert.ToInt32(YesornoEnum.False);
                }
                arrSqlParam[4] = new SqlParameter("@status", active);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetList", arrSqlParam);
                //if (dsResult.Tables.Count > 0)
                //{
                //    if (dsResult.Tables[0].Rows.Count > 0)
                //    {
                return dsResult.Tables[0];
                //    }
                //    else
                //    {
                //         return dsResult.Tables[0];
                //    }
                //}
                //else
                //{
                //     return dsResult.Tables[0];
                //}
                // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object ScorecardanswerersList(int StudentId, int ExamId, string Name, string Type, int ExamtypeId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[5];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@ExamId", ExamId);
                arrSqlParam[2] = new SqlParameter("@Name", Name);
                arrSqlParam[3] = new SqlParameter("@Type", Type);

                arrSqlParam[4] = new SqlParameter("@ExamtypeId", ExamtypeId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetQuestionbyexamid", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object EnglishScorecardanswerersList(int StudentId, int ExamId, string Name, string Type, int ExamtypeId)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[5];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@ExamId", ExamId);
                arrSqlParam[2] = new SqlParameter("@Name", Name);
                arrSqlParam[3] = new SqlParameter("@Type", Type);

                arrSqlParam[4] = new SqlParameter("@ExamtypeId", ExamtypeId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetEnglishQuestionbyexamid", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public object GeneralList(string entityName, string orderby, string orderbyvalue, string condition)
        {

            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[4];
                arrSqlParam[0] = new SqlParameter("@entityName", entityName);
                arrSqlParam[1] = new SqlParameter("@orderby", orderby);
                arrSqlParam[2] = new SqlParameter("@orderbyvalue", orderbyvalue);
                arrSqlParam[3] = new SqlParameter("@condition", condition);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetGeneralList", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public object UsersList(int usertype, int centeradminid, int ISSuperAdmin,bool IsActive)
        {

            try
            {
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[4];
                arrSqlParam[0] = new SqlParameter("@usertype", usertype);
                arrSqlParam[1] = new SqlParameter("@centeradminid", centeradminid);
                arrSqlParam[2] = new SqlParameter("@ISSuperAdmin", ISSuperAdmin);
                if(IsActive== true)
                {
                    arrSqlParam[3] = new SqlParameter("@IsActive", Convert.ToInt32(ActiveTypeStatusEnum.Active));
                }
                else
                {
                    arrSqlParam[3] = new SqlParameter("@IsActive", Convert.ToInt32(ActiveTypeStatusEnum.Inactive));
                }
                
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetUsersList", arrSqlParam);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        for (int i = 0; i < dsResult.Tables[0].Rows.Count; i++)
                        {
                            if (dsResult.Tables[0].Rows[i]["Password"].ToString() != null)
                            {
                                dsResult.Tables[0].Rows[i]["Password"] = EncryptionLibrary.DecryptText(dsResult.Tables[0].Rows[i]["Password"].ToString());
                            }
                        }
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public object StudentList(int centeradminid)
        {

            try
            {
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];

                arrSqlParam[0] = new SqlParameter("@CenterAdminId", centeradminid);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetStudentsbasedoncenter", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
                //return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public object DeletedList(string entityName, string orderby, string orderbyvalue, string condition)
        {

            try
            {
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[4];
                arrSqlParam[0] = new SqlParameter("@entityName", entityName);
                arrSqlParam[1] = new SqlParameter("@orderby", orderby);
                arrSqlParam[2] = new SqlParameter("@orderbyvalue", orderbyvalue);
                arrSqlParam[3] = new SqlParameter("@condition", condition);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetDeletedList", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object GetVideos(string BatchId)
        {

            try
            {
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@BatchId", BatchId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetVideosbasedonbatch", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                        return new[] { CAPMessages.Nodata1 };

                    }
                }
                else
                {
                    return new[] { CAPMessages.Nodata1 };
                }
                //return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public bool GetSubtopiccount(int BatchId, int StudentId)
        {

            try
            {
                bool res = false;
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@BatchId", BatchId);
                arrSqlParam[1] = new SqlParameter("@StudentId", StudentId);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetSubtopicidcount", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        if (int.Parse(dsResult.Tables[0].Rows[0]["SubtopicIdCount"].ToString()) < 6)
                        {
                            res = false;
                        }
                        else
                        {
                            res = true;
                        }
                    }
                    else
                    {
                        res = false;
                    }
                }
                else
                {
                    res = false;
                }
                return res;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object GetById(CommonParams commonParams)
        {
            try
            {
                if (string.IsNullOrEmpty(commonParams.PKeyFld))
                    commonParams.PKeyFld = GetPKey(commonParams.Table);

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@Table", commonParams.Table);
                arrSqlParam[1] = new SqlParameter("@PKey", commonParams.PKey);
                arrSqlParam[2] = new SqlParameter("@PKeyId", commonParams.PKeyFld);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetRecordbyID", arrSqlParam);
                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
              //  return result;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public string FranchiseDelete(int FranchiseId, int CenteradminId)
        {
            try
            {
                

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@FranchiseId", FranchiseId);
                arrSqlParam[1] = new SqlParameter("@CenteradminId", CenteradminId);
              
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
               int count = sqlHelper.ExecuteNonQuery("dbo.SP_DeleteFranchise", arrSqlParam);
                if (count > 1)
                    result = CAPMessages.Franchisedelete;

                return result;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        

        public DataTable GetMathsQuestionList(CustomPaginate<QuestionFilters> QuestionFilters)
        {
            try
            {
                if (QuestionFilters.filters == null)
                    QuestionFilters.filters = new QuestionFilters();
                string sortColumn = string.Empty;

                var sorts = new Sorts<QuestionFilters>();
                var filters = new EntityFrameworkPaginate.Filters<QuestionFilters>();
                short statusId = (short)Convert.ToUInt16(ActiveTypeStatusEnum.Other);
                if (string.IsNullOrEmpty(QuestionFilters.SortField))
                {
                    sortColumn = "CreatedDate";
                    QuestionFilters.SortOrder = -1;
                    sorts.Add(sortColumn == "CreatedDate", x => x.CreatedDate, true);
                }
                else
                {
                    sortColumn = QuestionFilters.SortField;
                }
                sortColumn = char.ToUpper(sortColumn[0]) + sortColumn.Substring(1);
                var propertyInfo = typeof(QuestionFilters).GetProperty(sortColumn);
                if(QuestionFilters.filters.TopicName==null)
                {
                    QuestionFilters.filters.TopicName = string.Empty;
                }
                if (QuestionFilters.filters.SubTopicName == null)
                {
                    QuestionFilters.filters.SubTopicName = string.Empty;
                }
                if (QuestionFilters.filters.QuestionText == null)
                {
                    QuestionFilters.filters.QuestionText = string.Empty;
                }
                if (QuestionFilters.filters.Option1 == null)
                {
                    QuestionFilters.filters.Option1 = string.Empty;
                }
                if (QuestionFilters.filters.Option2 == null)
                {
                    QuestionFilters.filters.Option2 = string.Empty;
                }
                if (QuestionFilters.filters.Option3 == null)
                {
                    QuestionFilters.filters.Option3 = string.Empty;
                }
                if (QuestionFilters.filters.Option4 == null)
                {
                    QuestionFilters.filters.Option4 = string.Empty;
                }
              
                if (QuestionFilters.filters.Explanation == null)
                {
                    QuestionFilters.filters.Explanation = string.Empty;

                }
                if (QuestionFilters.filters.CreatedBy == null)
                {
                    QuestionFilters.filters.CreatedBy = string.Empty;
                }
                if (QuestionFilters.filters.UpdatedBy == null)
                {
                    QuestionFilters.filters.UpdatedBy = string.Empty;
                }
               
                if (QuestionFilters.SortOrder == -1)
                {
                    sorts.Add(true, x => propertyInfo.GetValue(x, null), true);
                }
                else
                {
                    sorts.Add(true, x => propertyInfo.GetValue(x, null));
                }

                if (!string.IsNullOrEmpty(QuestionFilters.filters.Status))
                {
                    if (QuestionFilters.filters.Status.ToLower() == Convert.ToString(ActiveTypeStatusEnum.Inactive).ToLower())
                    {
                        statusId = (short)Convert.ToUInt16(ActiveTypeStatusEnum.Inactive);
                    }
                    else if (QuestionFilters.filters.Status.ToLower() == Convert.ToString(ActiveTypeStatusEnum.Active).ToLower())
                    {
                        statusId = (short)Convert.ToUInt16(ActiveTypeStatusEnum.Active);
                    }
                    else
                    {
                        statusId = (short)Convert.ToUInt16(ActiveTypeStatusEnum.Other);
                    }
                }


                QuestionFilters.globalFilter = QuestionFilters.globalFilter?.ToLower() ?? string.Empty;

                DateTime? createdDate;
                if (QuestionFilters.filters.CreatedDate.ToString("MM/dd/yyyy") != "01/01/0001")
                {
                    createdDate = QuestionFilters.filters.CreatedDate;
                }
                else
                {
                    createdDate = null;
                }

                DateTime? updatedDate;
                if (QuestionFilters.filters.UpdatedDate.ToString("MM/dd/yyyy") != "01/01/0001")
                {
                    updatedDate = QuestionFilters.filters.UpdatedDate;
                }
                else
                {
                    updatedDate = null;
                }

                DataTable dataTable = this.GetFromStoredProcedure("GetMathsQuestionList",
                    ("PageSize", QuestionFilters.Rows),
                    ("PageNumber", QuestionFilters.PageNo),
                    ("SortColumn", QuestionFilters.SortField),
                    ("SortOrder", QuestionFilters.SortOrder),
                    ("StatusId", statusId),
                    ("GlobalFilter", QuestionFilters.globalFilter),
                    ("Answer", QuestionFilters.filters.Answer),
                    ("CalculatorId", QuestionFilters.filters.CalculatorId),
                    ("DifficultyLevelId", QuestionFilters.filters.DifficultyLevelName),
                    ("GridId", QuestionFilters.filters.GridId),
                    ("Explanation", QuestionFilters.filters.Explanation),
                    ("HomeWorkId", QuestionFilters.filters.HomeWorkId),
                    ("IsHomeWork", QuestionFilters.filters.IsHomeWork),
                    ("Option1", QuestionFilters.filters.Option1),
                    ("Option2", QuestionFilters.filters.Option2),
                    ("Option3", QuestionFilters.filters.Option3),
                    ("Option4", QuestionFilters.filters.Option4),
                    ("QuestionId", QuestionFilters.filters.QuestionId),
                    ("QuestionText", QuestionFilters.filters.QuestionText),
                    ("SubjectId", QuestionFilters.filters.SubjectId),
                    ("SubTopicname", QuestionFilters.filters.SubTopicName),
                    ("Topicname", QuestionFilters.filters.TopicName),
                    ("CreatedDate", createdDate),
                    ("UpdatedDate", updatedDate),
                    ("CreatedBy", QuestionFilters.filters.CreatedBy),
                    ("UpdatedBy", QuestionFilters.filters.UpdatedBy),
                    ("IsDeleted", QuestionFilters.filters.IsDeleted)
                    );

                //if (dataTable.Rows.Count > 0)
                //{
                //    QuestionFilters.TotalRecordsCount = Convert.ToInt32(dataTable.Rows[0]["NumberOfItems"]);
                //}
                //else
                //{
                //    QuestionFilters.TotalRecordsCount = 0;
                //}

                //QuestionFilters.ResultSetSize = dataTable.Rows.Count;
                

                
                //var jsonData = Newtonsoft.Json.JsonConvert.SerializeObject(dataTable);
                //QuestionFilters.Results = Newtonsoft.Json.JsonConvert.DeserializeObject<List<QuestionFilters>>(jsonData);
                return dataTable;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public DataTable GetEnglishQuestionList(CustomPaginate<EnglishQuestionFilters> EnglishQsFilters)
        {
            try
            {
                if (EnglishQsFilters.filters == null)
                    EnglishQsFilters.filters = new EnglishQuestionFilters();
                string sortColumn = string.Empty;

                var sorts = new Sorts<EnglishQuestionFilters>();
                var filters = new EntityFrameworkPaginate.Filters<EnglishQuestionFilters>();
                short statusId = (short)Convert.ToUInt16(ActiveTypeStatusEnum.Other);
                if (string.IsNullOrEmpty(EnglishQsFilters.SortField))
                {
                    sortColumn = "CreatedDate";
                    EnglishQsFilters.SortOrder = -1;
                    sorts.Add(sortColumn == "CreatedDate", x => x.CreatedDate, true);
                }
                else
                {
                    sortColumn = EnglishQsFilters.SortField;
                }
                sortColumn = char.ToUpper(sortColumn[0]) + sortColumn.Substring(1);
                var propertyInfo = typeof(EnglishQuestionFilters).GetProperty(sortColumn);

                if (EnglishQsFilters.SortOrder == -1)
                {
                    sorts.Add(true, x => propertyInfo.GetValue(x, null), true);
                }
                else
                {
                    sorts.Add(true, x => propertyInfo.GetValue(x, null));
                }

                if (!string.IsNullOrEmpty(EnglishQsFilters.filters.Status))
                {
                    if (EnglishQsFilters.filters.Status.ToLower() == Convert.ToString(ActiveTypeStatusEnum.Inactive).ToLower())
                    {
                        statusId = (short)Convert.ToUInt16(ActiveTypeStatusEnum.Inactive);
                    }
                    else if (EnglishQsFilters.filters.Status.ToLower() == Convert.ToString(ActiveTypeStatusEnum.Active).ToLower())
                    {
                        statusId = (short)Convert.ToUInt16(ActiveTypeStatusEnum.Active);
                    }
                    else
                    {
                        statusId = (short)Convert.ToUInt16(ActiveTypeStatusEnum.Other);
                    }
                }
                if (EnglishQsFilters.filters.Paragraph == null)
                {
                    EnglishQsFilters.filters.Paragraph = string.Empty;
                }
                if (EnglishQsFilters.filters.TopicName == null)
                {
                    EnglishQsFilters.filters.TopicName = string.Empty;
                }
                if (EnglishQsFilters.filters.SubTopicName == null)
                {
                    EnglishQsFilters.filters.SubTopicName = string.Empty;
                }
                if (EnglishQsFilters.filters.QuestionText == null)
                {
                    EnglishQsFilters.filters.QuestionText = string.Empty;
                }
                if (EnglishQsFilters.filters.Option1 == null)
                {
                    EnglishQsFilters.filters.Option1 = string.Empty;
                }
                if (EnglishQsFilters.filters.Option2 == null)
                {
                    EnglishQsFilters.filters.Option2 = string.Empty;
                }
                if (EnglishQsFilters.filters.Option3 == null)
                {
                    EnglishQsFilters.filters.Option3 = string.Empty;
                }
                if (EnglishQsFilters.filters.Option4 == null)
                {
                    EnglishQsFilters.filters.Option4 = string.Empty;
                }

                if (EnglishQsFilters.filters.Explanation == null)
                {
                    EnglishQsFilters.filters.Explanation = string.Empty;

                }
                if (EnglishQsFilters.filters.CreatedBy == null)
                {
                    EnglishQsFilters.filters.CreatedBy = string.Empty;
                }
                if (EnglishQsFilters.filters.UpdatedBy == null)
                {
                    EnglishQsFilters.filters.UpdatedBy = string.Empty;
                }


                EnglishQsFilters.globalFilter = EnglishQsFilters.globalFilter?.ToLower() ?? string.Empty;

                DateTime? createdDate;
                if (EnglishQsFilters.filters.CreatedDate.ToString("MM/dd/yyyy") != "01/01/0001")
                {
                    createdDate = EnglishQsFilters.filters.CreatedDate;
                }
                else
                {
                    createdDate = null;
                }

                DateTime? updatedDate;
                if (EnglishQsFilters.filters.UpdatedDate.ToString("MM/dd/yyyy") != "01/01/0001")
                {
                    updatedDate = EnglishQsFilters.filters.UpdatedDate;
                }
                else
                {
                    updatedDate = null;
                }

                DataTable dataTable = this.GetFromStoredProcedure("GetEnglishQuestionList",
                    ("PageSize", EnglishQsFilters.Rows),
                    ("PageNumber", EnglishQsFilters.PageNo),
                    ("SortColumn", EnglishQsFilters.SortField),
                    ("SortOrder", EnglishQsFilters.SortOrder),
                    ("StatusId", statusId),
                    ("GlobalFilter", EnglishQsFilters.globalFilter),
                    ("Answer", EnglishQsFilters.filters.Answer),
                    ("SectionId", EnglishQsFilters.filters.SectionId),
                    ("DifficultyLevelId", EnglishQsFilters.filters.DifficultyLevelName),
                   
                    ("Explanation", EnglishQsFilters.filters.Explanation),
                    ("HomeWorkId", EnglishQsFilters.filters.HomeWorkId),
                    ("IsHomeWork", EnglishQsFilters.filters.IsHomeWork),
                    ("Option1", EnglishQsFilters.filters.Option1),
                    ("Option2", EnglishQsFilters.filters.Option2),
                    ("Option3", EnglishQsFilters.filters.Option3),
                    ("Option4", EnglishQsFilters.filters.Option4),
                    ("QuestionId", EnglishQsFilters.filters.QuestionId),
                    ("QuestionText", EnglishQsFilters.filters.QuestionText),
                    ("Paragraph", EnglishQsFilters.filters.Paragraph),
                    ("SubjectId", EnglishQsFilters.filters.SubjectId),
                    ("SubTopicname", EnglishQsFilters.filters.SubTopicName),
                    ("Topicname", EnglishQsFilters.filters.TopicName),
                    ("CreatedDate", createdDate),
                    ("UpdatedDate", updatedDate),
                    ("CreatedBy", EnglishQsFilters.filters.CreatedBy),
                    ("UpdatedBy", EnglishQsFilters.filters.UpdatedBy),
                    ("IsDeleted", EnglishQsFilters.filters.IsDeleted)
                    );

                return dataTable;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public string ChangeStatus(CommonParams commonParams)
        {
            var count = 0;
            try
            {
                if (string.IsNullOrEmpty(commonParams.PKeyFld))
                {
                    commonParams.PKeyFld = GetPKey(commonParams.Table);
                }

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@Table", commonParams.Table);
                arrSqlParam[1] = new SqlParameter("@PKey", commonParams.PKey);
                arrSqlParam[2] = new SqlParameter("@PKeyId", commonParams.PKeyFld);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                count = sqlHelper.ExecuteNonQuery("dbo.SP_ChangeStatus", arrSqlParam);
                if (count>0)
                    result = CAPMessages.Statuschanged;

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public string Delete(CommonParams commonParams)
        {
            int count = 0;
            try
            {
                if (string.IsNullOrEmpty(commonParams.PKeyFld))
                    commonParams.PKeyFld = GetPKey(commonParams.Table);



                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@Table", commonParams.Table);
                arrSqlParam[1] = new SqlParameter("@PKey", commonParams.PKey);
                arrSqlParam[2] = new SqlParameter("@PKeyId", commonParams.PKeyFld);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                count = sqlHelper.ExecuteNonQuery("dbo.SP_DeleteRecord", arrSqlParam);


                if (count>0)
                    result = CAPMessages.Delete;

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string ReStore(CommonParams commonParams)
        {
            int count = 0;
            try
            {
                if (string.IsNullOrEmpty(commonParams.PKeyFld))
                    commonParams.PKeyFld = GetPKey(commonParams.Table);

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@Table", commonParams.Table);

                arrSqlParam[1] = new SqlParameter("@PKey", commonParams.PKey);
                arrSqlParam[2] = new SqlParameter("@PKeyId", commonParams.PKeyFld);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                count = sqlHelper.ExecuteNonQuery("dbo.SP_RestoreRecord", arrSqlParam);


                if (count>0)
                    result = CAPMessages.Restore;

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object DropdownList(CommonParams commonparrams)
        {
            try
            {

                var filter = string.Empty;
                if (!string.IsNullOrEmpty(commonparrams.Filter))
                {
                    filter = " WHERE " + commonparrams.Filter;
                }
                else
                {
                    filter = " WHERE Isdeleted=0";
                }
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[4];
                arrSqlParam[0] = new SqlParameter("@SelectFields", commonparrams.SelectFields);
                arrSqlParam[1] = new SqlParameter("@SortBy", commonparrams.SortBy);
                arrSqlParam[2] = new SqlParameter("@Dropdown", commonparrams.Dropdown);
                arrSqlParam[3] = new SqlParameter("@filter", filter);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dtresult = sqlHelper.ExecuteDataSet("dbo.SP_GetDropDownList", arrSqlParam);


                if (dtresult.Tables.Count > 0)
                {
                    if (dtresult.Tables[0].Rows.Count > 0)
                    {
                        return dtresult.Tables[0];
                    }
                    else
                    {
                         return dtresult.Tables[0];
                    }
                }
                else
                {
                     return dtresult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object DropdownforCenteradminuser(int Centeradminid)
        {
            try
            {
                DataSet dtresult = new DataSet();
                if (Centeradminid == 0)
                {
                    CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);

                    SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                    dtresult = sqlHelper.ExecuteDataSet("dbo.SP_GetCenterDropDownList");

                }
                else
                {
                    CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                    SqlParameter[] arrSqlParam = new SqlParameter[1];
                    arrSqlParam[0] = new SqlParameter("@Centeradminid", Centeradminid);
                    SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                    dtresult = sqlHelper.ExecuteDataSet("dbo.SP_GetCenterDropDownListInUpdate",arrSqlParam);
                }
                if (dtresult.Tables.Count > 0)
                {
                    if (dtresult.Tables[0].Rows.Count > 0)
                    {
                        return dtresult.Tables[0];
                    }
                    else
                    {
                        return dtresult.Tables[0];
                    }
                }
                else
                {
                    return dtresult.Tables[0];
                }

                // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public object GetHistory(string tableName, string id)
        {
            try
            {
                string Pkeyid = GetPKey(tableName);
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@Table", tableName);
                arrSqlParam[1] = new SqlParameter("@Pkeyid", Pkeyid);
                arrSqlParam[2] = new SqlParameter("@id", id);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dtresult = sqlHelper.ExecuteDataSet("dbo.SP_GetHistory", arrSqlParam);


                if (dtresult.Tables.Count > 0)
                {
                    if (dtresult.Tables[0].Rows.Count > 0)
                    {
                        return dtresult.Tables[0];
                    }
                    else
                    {
                         return dtresult.Tables[0];
                    }
                }
                else
                {
                     return dtresult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public object GetSubtopics(int StudentId, string Batchid)
        {
            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[1] = new SqlParameter("@BatchId", Batchid);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dtresult = sqlHelper.ExecuteDataSet("dbo.SP_GetSubTopicsBasedonBatch", arrSqlParam);
                if (dtresult.Tables.Count > 0)
                {
                    if (dtresult.Tables[0].Rows.Count > 0)
                    {
                        return dtresult.Tables[0];
                    }
                    else
                    {
                         return dtresult.Tables[0];
                    }
                }
                else
                {
                     return dtresult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object Gettopics(int StudentId, string Batchid, int SubjectId)
        {
            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@SubjectId", SubjectId);
                arrSqlParam[1] = new SqlParameter("@StudentId", StudentId);
                arrSqlParam[2] = new SqlParameter("@BatchId", Batchid);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dtresult = sqlHelper.ExecuteDataSet("dbo.SP_GetTopicsBasedonBatch", arrSqlParam);
                if (dtresult.Tables.Count > 0)
                {
                    if (dtresult.Tables[0].Rows.Count > 0)
                    {
                        return dtresult.Tables[0];
                    }
                    else
                    {
                         return dtresult.Tables[0];
                    }
                }
                else
                {
                     return dtresult.Tables[0];
                }
               // return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object GetSubtopics(string Batchid)
        {
            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];

                arrSqlParam[0] = new SqlParameter("@BatchId", Batchid);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dtresult = sqlHelper.ExecuteDataSet("dbo.SP_GetsubTopicsBasedonhomeworks", arrSqlParam);
                if (dtresult.Tables.Count > 0)
                {
                    if (dtresult.Tables[0].Rows.Count > 0)
                    {
                        return dtresult.Tables[0];
                    }
                    else
                    {
                         return dtresult.Tables[0];
                    }
                }
                else
                {
                     return dtresult.Tables[0];
                }
                //dtresult   return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object Gettopics(string Batchid, int SubjectId)
        {
            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                arrSqlParam[0] = new SqlParameter("@SubjectId", SubjectId);
                arrSqlParam[1] = new SqlParameter("@BatchId", Batchid);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dtresult = sqlHelper.ExecuteDataSet("dbo.SP_GetTopicsBasedonhomeworks", arrSqlParam);
                if (dtresult.Tables.Count > 0)
                {
                    if (dtresult.Tables[0].Rows.Count > 0)
                    {
                        return dtresult.Tables[0];
                    }
                    else
                    {
                         return dtresult.Tables[0];
                    }
                }
                else
                {
                     return dtresult.Tables[0];
                }
                //dtresult return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object GetHomeWorks(string Batchid)
        {
            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];

                arrSqlParam[0] = new SqlParameter("@BatchId", Batchid);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dtresult = sqlHelper.ExecuteDataSet("dbo.SP_GethomeworkBasedonbatch", arrSqlParam);
                if (dtresult.Tables.Count > 0)
                {
                    if (dtresult.Tables[0].Rows.Count > 0)
                    {
                        return dtresult.Tables[0];
                    }
                    else
                    {
                         return dtresult.Tables[0];
                    }
                }
                else
                {
                     return dtresult.Tables[0];
                }
                //dtresult return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object GetBatches(int TutorId)
        {
            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@Tutorid", TutorId);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dtresult = sqlHelper.ExecuteDataSet("dbo.SP_Getbatchesbasedontutor", arrSqlParam);
                if (dtresult.Tables.Count > 0)
                {
                    if (dtresult.Tables[0].Rows.Count > 0)
                    {
                        return dtresult.Tables[0];
                    }
                    else
                    {
                         return dtresult.Tables[0];
                    }
                }
                else
                {
                     return dtresult.Tables[0];
                }
                //dtresult  return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public object GetAttendancereport(int BatchId, DateTime FromDate, DateTime ToDate)
        {
            try
            {

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@BatchId", BatchId);
                arrSqlParam[1] = new SqlParameter("@FromDate", FromDate);
                arrSqlParam[2] = new SqlParameter("@ToDate", ToDate);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dtresult = sqlHelper.ExecuteDataSet("dbo.SP_GetAttendanceReport", arrSqlParam);
                if (dtresult.Tables.Count > 0)
                {
                    if (dtresult.Tables[0].Rows.Count > 0)
                    {
                        return dtresult.Tables[0];
                    }
                    else
                    {
                         return dtresult.Tables[0];
                    }
                }
                else
                {
                     return dtresult.Tables[0];
                }
                //dtresult return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        private string GetPKey(string tableName)
        {
            try
            {

                string pkey = string.Empty;

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[1];
                arrSqlParam[0] = new SqlParameter("@Table", tableName);

                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                pkey = sqlHelper.ExecuteScalar("dbo.SP_GetPKey", arrSqlParam).ToString();
                return pkey;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string AddQuestions(Questions ques)
        {
            try
            {
                ques.CreatedDate = DateTime.Now;
                ques.UpdatedDate = DateTime.Now;
                _appContext.Questions.Add(ques);
                int count = _appContext.SaveChanges();
                if (count>0)
                {
                    result = CAPMessages.InsertQuestion;


                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string AddEnglishQuestions(EnglishParagraph Questions)
        {
            try
            {
                // EnglishParagraph engpr = Questions.Paragraph;
                using (var transaction = this._context.Database.BeginTransaction())
                {
                    try
                    {
                        var Engques = Questions.questions;
                        _appContext.englishParagraph.Add(Questions);
                        int count = _appContext.SaveChanges();
                        foreach (var item in Engques)
                        {
                            item.CreatedDate = item.UpdatedDate = DateTime.Now;
                            item.ParagraphId = Questions.Id;

                        }
                        _appContext.englishQuestions.AddRange(Engques);
                        int count1 = _appContext.SaveChanges();
                        if (count1 > 0)
                        {
                            result = CAPMessages.Englishques;
                            transaction.Commit();
                        }

                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new Exception(CAPMessages.Englishquesnotsave, ex.InnerException);
                    }
                }


                return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public string UpdateEnglishQuestions(EnglishParagraph Questions)
        {
            try
            {
                // EnglishParagraph engpr = Questions.Paragraph;
                using (var transaction = this._context.Database.BeginTransaction())
                {
                    try
                    {
                        var Para = _appContext.englishParagraph.Where(p => p.Id == Questions.Id).FirstOrDefault();
                        if (Para != null)
                        {
                            Para.Paragraph = Questions.Paragraph;
                            _appContext.englishParagraph.Update(Para);
                            _appContext.SaveChanges();
                            var Engques = Questions.questions;


                            foreach (var item in Engques)
                            {
                                if (item.QuestionId == 0)
                                {
                                    item.ParagraphId = Para.Id;
                                    var engq = item;
                                    _appContext.englishQuestions.Add(engq);
                                }
                                else
                                {
                                    var Questiondata = _appContext.englishQuestions.Where(p => p.QuestionId == item.QuestionId).FirstOrDefault();
                                    if (Questiondata != null)
                                    {
                                        Questiondata.UpdatedDate = DateTime.Now;
                                        Questiondata.ParagraphId = Para.Id;
                                        Questiondata.QuestionText = item.QuestionText;
                                        Questiondata.Answer = item.Answer;
                                        Questiondata.DifficultyLevelId = item.DifficultyLevelId;
                                        Questiondata.EnglishSectionId = item.EnglishSectionId;
                                        Questiondata.Explanation = item.Explanation;
                                        Questiondata.HomeworkId = item.HomeworkId;
                                        Questiondata.IsHomeWork = item.IsHomeWork;
                                        Questiondata.Option1 = item.Option1;
                                        Questiondata.Option2 = item.Option2;
                                        Questiondata.Option3 = item.Option3;
                                        Questiondata.Option4 = item.Option4;
                                        Questiondata.SubjectId = item.SubjectId;
                                        Questiondata.SubTopicId = item.SubTopicId;
                                        Questiondata.TopicId = item.TopicId;
                                        Questiondata.Updatedby = item.Updatedby;
                                        _appContext.englishQuestions.Update(Questiondata);
                                    }
                                }
                                
                            }

                            int count1 = _appContext.SaveChanges();
                            if (count1 > 0)
                            {
                                result = CAPMessages.Englishquesupdate;
                                transaction.Commit();
                            }

                        }



                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new Exception(CAPMessages.Englishquesnotupdate, ex.InnerException);
                    }
                }


                return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public string UpdateQuestions(Questions ques)
        {
            try
            {
                var Qsresult = _appContext.Questions.Where(p => p.QuestionId == ques.QuestionId).FirstOrDefault();
                if (Qsresult != null)
                {
                    Qsresult.Answer = ques.Answer;

                    Qsresult.CalculatorId = ques.CalculatorId;
                    Qsresult.DifficultyLevelId = ques.DifficultyLevelId;
                    Qsresult.Explanation = ques.Explanation;
                    Qsresult.GridId = ques.GridId;
                    Qsresult.HomeworkId = ques.HomeworkId;
                    Qsresult.IsHomeWork = ques.IsHomeWork;
                    Qsresult.Option1 = ques.Option1;
                    Qsresult.Option2 = ques.Option2;
                    Qsresult.Option3 = ques.Option3;
                    Qsresult.Option4 = ques.Option4;

                    Qsresult.QuestionText = ques.QuestionText;
                    Qsresult.IsActive = ques.IsActive;
                    Qsresult.SubjectId = ques.SubjectId;

                    Qsresult.SubTopicId = ques.SubTopicId;
                    Qsresult.TopicId = ques.TopicId;
                    Qsresult.Updatedby = ques.Updatedby;

                    Qsresult.UpdatedDate = DateTime.Now;
                    _appContext.Questions.Update(Qsresult);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.UpdateQuestion;
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public object AddExamQuestions(PracticeExamQuestion ques)
        {
            try
            {
                ques.CreatedDate = DateTime.Now;
                ques.ExamId = _appContext.ExamIds.Where(p => p.StudentId == ques.StudentId && p.Status != "Completed" && p.TestId == Convert.ToInt32(TestTypes.Practice)).Select(p => p.ExamId).FirstOrDefault();
                _appContext.PracticeExamQuestion.Add(ques);
                int count = _appContext.SaveChanges();
                if (count>0)
                {
                    result = CAPMessages.InsertExamQuestion;


                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public object UpdateexamQuestions(PracticeExamQuestion ques)
        {
            try
            {
                var Qsresult = _appContext.PracticeExamQuestion.Where(p => p.Id == ques.Id).FirstOrDefault();
                if (Qsresult != null)
                {
                    Qsresult.QuestionId = ques.QuestionId;
                    Qsresult.ExamId = ques.ExamId;
                    Qsresult.StudentId = ques.StudentId;
                    Qsresult.SelectedAnswer = ques.SelectedAnswer;
                    Qsresult.Skipped = ques.Skipped;
                    Qsresult.Answered = ques.Answered;
                    Qsresult.Startdate = ques.Startdate;
                    Qsresult.EndDate = ques.EndDate;
                    Qsresult.UnAnswered = ques.UnAnswered;

                    _appContext.PracticeExamQuestion.Update(Qsresult);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.UpdateExamQuestion;
                    }
                }
                else
                {
                   return Qsresult;
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }




        public object AddHomeworkQuestions(HomeWorkQuestion Hwques)
        {
            try
            {
                Hwques.CreatedDate = DateTime.Now;
                Hwques.ExamId = _appContext.ExamIds.Where(p => p.StudentId == Hwques.StudentId && p.Status != "Completed" && p.TestId == Convert.ToInt32(TestTypes.HomeWork)).Select(p => p.ExamId).FirstOrDefault();
                _appContext.HomeworkQuestion.Add(Hwques);
                int count = _appContext.SaveChanges();
                if (count>0)
                {
                    result = CAPMessages.InsertHomeworkQuestion;


                }
                return Hwques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public object UpdateHomeworkQuestions(HomeWorkQuestion ques)
        {
            try
            {
                var Qsresult = _appContext.HomeworkQuestion.Where(p => p.Id == ques.Id).FirstOrDefault();
                if (Qsresult != null)
                {
                    Qsresult.QuestionId = ques.QuestionId;
                    Qsresult.ExamId = ques.ExamId;
                    Qsresult.StudentId = ques.StudentId;
                    Qsresult.SelectedAnswer = ques.SelectedAnswer;
                    Qsresult.Skipped = ques.Skipped;
                    Qsresult.Answered = ques.Answered;
                    Qsresult.Startdate = ques.Startdate;
                    Qsresult.EndDate = ques.EndDate;

                    _appContext.HomeworkQuestion.Update(Qsresult);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.UpdateHomeworkQuestion;
                    }
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object AddSATQuestions(SATExamQuestion ques)
        {
            try
            {
                ques.CreatedDate = DateTime.Now;

                ques.ExamId = _appContext.ExamIds.Where(p => p.StudentId == ques.StudentId && p.Status != "Completed" && p.TestId == Convert.ToInt32(TestTypes.SAT)).Select(p => p.ExamId).FirstOrDefault();
                _appContext.SATExamQuestion.Add(ques);
                int count = _appContext.SaveChanges();
                if (count>0)
                {
                    result = CAPMessages.InsertSATQuestion;
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object AddDignastic(DignasticTest dg)
        {
            try
            {
                dg.CreatedDate = DateTime.Now;
                dg.UpdatedDate = DateTime.Now;
                _appContext.dignasticTest.Add(dg);
                int count = _appContext.SaveChanges();
                if (count > 0)
                {
                    result = CAPMessages.Diagnstictes;
                    DataTable DgMail = GetmailSettings(Convert.ToString( MailEnums.DiagnosticTest));
                    using (MailMessage mm = new MailMessage((string)DgMail.Rows[0]["MailId"], DgMail.Rows[0]["MailId"].ToString()))
                    {
                        mm.Subject = DgMail.Rows[0]["Subject"].ToString();

                        mm.Body = DgMail.Rows[0]["Dear"].ToString() + '\n' +
                            DgMail.Rows[0]["Body"].ToString() + dg.Email + "Please Find The Details" + '\n' +
                            "Name :" + dg.Name + '\n' +
                           "Phone :" + " " + dg.Phone + '\n' +
                           "Email :" + dg.Email + '\n' +
                           DgMail.Rows[0]["Regards"].ToString() + '\n' +
                           DgMail.Rows[0]["RegardsName"].ToString();

                        mm.IsBodyHtml = false;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = DgMail.Rows[0]["SMTP"].ToString();
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(DgMail.Rows[0]["MailId"].ToString(), DgMail.Rows[0]["Password"].ToString());
                        smtp.UseDefaultCredentials = true;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = int.Parse(DgMail.Rows[0]["Port"].ToString());
                        smtp.Send(mm);


                       
                    }
                  

                }
                else
                {
                    result = CAPMessages.Diagnstictesnotinserted;
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public object UpdateSATQuestions(SATExamQuestion ques)
        {
            try
            {
                var Qsresult = _appContext.SATExamQuestion.Where(p => p.Id == ques.Id).FirstOrDefault();
                if (Qsresult != null)
                {
                    Qsresult.QuestionId = ques.QuestionId;
                    Qsresult.ExamId = ques.ExamId;
                    Qsresult.StudentId = ques.StudentId;
                    Qsresult.SelectedAnswer = ques.SelectedAnswer;
                    Qsresult.Skipped = ques.Skipped;
                    Qsresult.Answered = ques.Answered;
                    Qsresult.Startdate = ques.Startdate;
                    Qsresult.EndDate = ques.EndDate;
                    Qsresult.UnAnswered = ques.UnAnswered;

                    _appContext.SATExamQuestion.Update(Qsresult);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.UpdateSATQuestion;
                    }
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object AddSATJumbleQuestions(SATExamJumbleQuestion ques)
        {
            try
            {
                ques.CreatedDate = DateTime.Now;

                ques.ExamId = _appContext.ExamIds.Where(p => p.StudentId == ques.StudentId && p.Status != "Completed" && p.TestId == Convert.ToInt32(TestTypes.SATJumble)).Select(p => p.ExamId).FirstOrDefault();
                _appContext.SATExamJumbleQuestion.Add(ques);
                int count = _appContext.SaveChanges();
                if (count>0)
                {
                    result = CAPMessages.InsertSATQuestion;
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public object UpdateSATJumbleQuestions(SATExamJumbleQuestion ques)
        {
            try
            {
                var Qsresult = _appContext.SATExamJumbleQuestion.Where(p => p.Id == ques.Id).FirstOrDefault();
                if (Qsresult != null)
                {
                    Qsresult.QuestionId = ques.QuestionId;
                    Qsresult.ExamId = ques.ExamId;
                    Qsresult.StudentId = ques.StudentId;
                    Qsresult.SelectedAnswer = ques.SelectedAnswer;
                    Qsresult.Skipped = ques.Skipped;
                    Qsresult.Answered = ques.Answered;
                    Qsresult.Startdate = ques.Startdate;
                    Qsresult.EndDate = ques.EndDate;
                    Qsresult.UnAnswered = ques.UnAnswered;

                    _appContext.SATExamJumbleQuestion.Update(Qsresult);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.UpdateSATQuestion;
                    }
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }




        public object AddEnglishExamQuestions(PracticeExamEnglishQuestion ques)
        {
            try
            {
                ques.CreatedDate = DateTime.Now;
                ques.ExamId = _appContext.EnglishExamIds.Where(p => p.StudentId == ques.StudentId && p.Status != "Completed" && p.TestId == Convert.ToInt32(TestTypes.Practice)).Select(p => p.ExamId).FirstOrDefault();
                _appContext.PracticeExamEnglishQuestion.Add(ques);
                int count = _appContext.SaveChanges();
                if (count>0)
                {
                    result = CAPMessages.InsertExamQuestion;


                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public object UpdateEnglishexamQuestions(PracticeExamEnglishQuestion ques)
        {
            try
            {
                var Qsresult = _appContext.PracticeExamEnglishQuestion.Where(p => p.Id == ques.Id).FirstOrDefault();
                if (Qsresult != null)
                {
                    Qsresult.QuestionId = ques.QuestionId;
                    Qsresult.ExamId = ques.ExamId;
                    Qsresult.StudentId = ques.StudentId;
                    Qsresult.SelectedAnswer = ques.SelectedAnswer;
                    Qsresult.Skipped = ques.Skipped;
                    Qsresult.Answered = ques.Answered;
                    Qsresult.Startdate = ques.Startdate;
                    Qsresult.EndDate = ques.EndDate;
                    Qsresult.UnAnswered = ques.UnAnswered;

                    _appContext.PracticeExamEnglishQuestion.Update(Qsresult);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.UpdateExamQuestion;
                    }
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object AddEnglishHomeworkQuestions(HomeWorkEnglishQuestion Hwques)
        {
            try
            {
                Hwques.CreatedDate = DateTime.Now;
                Hwques.ExamId = _appContext.EnglishExamIds.Where(p => p.StudentId == Hwques.StudentId && p.Status != "Completed" && p.TestId == Convert.ToInt32(TestTypes.HomeWork)).Select(p => p.ExamId).FirstOrDefault();
                _appContext.HomeworkEnglishQuestion.Add(Hwques);
                int count = _appContext.SaveChanges();
                if (count>0)
                {
                    result = CAPMessages.InsertHomeworkQuestion;


                }
                return Hwques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public object UpdateEnglishHomeworkQuestions(HomeWorkEnglishQuestion ques)
        {
            try
            {
                var Qsresult = _appContext.HomeworkEnglishQuestion.Where(p => p.Id == ques.Id).FirstOrDefault();
                if (Qsresult != null)
                {
                    Qsresult.QuestionId = ques.QuestionId;
                    Qsresult.ExamId = ques.ExamId;
                    Qsresult.StudentId = ques.StudentId;
                    Qsresult.SelectedAnswer = ques.SelectedAnswer;
                    Qsresult.Skipped = ques.Skipped;
                    Qsresult.Answered = ques.Answered;
                    Qsresult.Startdate = ques.Startdate;
                    Qsresult.EndDate = ques.EndDate;

                    _appContext.HomeworkEnglishQuestion.Update(Qsresult);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.UpdateHomeworkQuestion;
                    }
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object AddSATEnglishQuestions(SATExamEnglishQuestion ques)
        {
            try
            {
                ques.CreatedDate = DateTime.Now;
                ques.ExamId = _appContext.EnglishExamIds.Where(p => p.StudentId == ques.StudentId && p.Status != "Completed" && p.TestId == Convert.ToInt32(TestTypes.SAT)).Select(p => p.ExamId).FirstOrDefault();
                _appContext.SATExamEnglishQuestion.Add(ques);
                int count = _appContext.SaveChanges();
                if (count>0)
                {
                    result = CAPMessages.InsertSATQuestion;
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public object UpdateSATEnglishQuestions(SATExamEnglishQuestion ques)
        {
            try
            {
                var Qsresult = _appContext.SATExamEnglishQuestion.Where(p => p.Id == ques.Id).FirstOrDefault();
                if (Qsresult != null)
                {
                    Qsresult.QuestionId = ques.QuestionId;
                    Qsresult.ExamId = ques.ExamId;
                    Qsresult.StudentId = ques.StudentId;
                    Qsresult.SelectedAnswer = ques.SelectedAnswer;
                    Qsresult.Skipped = ques.Skipped;
                    Qsresult.Answered = ques.Answered;
                    Qsresult.Startdate = ques.Startdate;
                    Qsresult.EndDate = ques.EndDate;
                    Qsresult.UnAnswered = ques.UnAnswered;

                    _appContext.SATExamEnglishQuestion.Update(Qsresult);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.UpdateSATQuestion;
                    }
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public object AddSATEnglishJumbleQuestions(SATExamEnglishJumbleQuestion ques)
        {
            try
            {
                ques.CreatedDate = DateTime.Now;
                ques.ExamId = _appContext.EnglishExamIds.Where(p => p.StudentId == ques.StudentId && p.Status != "Completed" && p.TestId == Convert.ToInt32(TestTypes.SATJumble)).Select(p => p.ExamId).FirstOrDefault();
                _appContext.SATExamEnglishJumbleQuestions.Add(ques);
                int count = _appContext.SaveChanges();
                if (count>0)
                {
                    result = CAPMessages.InsertSATQuestion;
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public object UpdateSATEnglishJumbleQuestions(SATExamEnglishJumbleQuestion ques)
        {
            try
            {
                var Qsresult = _appContext.SATExamEnglishJumbleQuestions.Where(p => p.Id == ques.Id).FirstOrDefault();
                if (Qsresult != null)
                {
                    Qsresult.QuestionId = ques.QuestionId;
                    Qsresult.ExamId = ques.ExamId;
                    Qsresult.StudentId = ques.StudentId;
                    Qsresult.SelectedAnswer = ques.SelectedAnswer;
                    Qsresult.Skipped = ques.Skipped;
                    Qsresult.Answered = ques.Answered;
                    Qsresult.Startdate = ques.Startdate;
                    Qsresult.EndDate = ques.EndDate;
                    Qsresult.UnAnswered = ques.UnAnswered;

                    _appContext.SATExamEnglishJumbleQuestions.Update(Qsresult);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.UpdateSATQuestion;
                    }
                }
                return ques;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string AddFranchise(Franchise franchise)
        {
            try
            {
                var frresult = _appContext.Franchise.Where(p => p.FranchiseTitle == franchise.FranchiseTitle ).FirstOrDefault();
                var frresult2 = _appContext.Franchise.Where(p => p.Centeradminid == franchise.Centeradminid).FirstOrDefault();
                if (frresult == null)
                {
                    if (frresult2 == null)
                    {
                        franchise.CreatedDate = DateTime.Now;
                        franchise.UpdatedDate = DateTime.Now;
                        _appContext.Franchise.Add(franchise);
                        int count = _appContext.SaveChanges();
                        if (count>0)
                        {
                            result = CAPMessages.InsertFranchise;
                        }
                    }
                    else
                    {
                        return CAPMessages.Centeradminalready;
                    }
                }
                else
                {
                    return CAPMessages.FrachiseTitle;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string UpdateFranchise(Franchise fran)
        {
            try
            {
                var frresult1 = _appContext.Franchise.Where(p => p.FranchiseId != fran.FranchiseId && p.FranchiseTitle == fran.FranchiseTitle && p.IsActive == true && p.IsDeleted == false).FirstOrDefault();
                var frresult2 = _appContext.Franchise.Where(p => p.FranchiseId != fran.FranchiseId && p.Centeradminid == fran.Centeradminid && p.IsActive == true && p.IsDeleted == false).FirstOrDefault();
                var frresult = _appContext.Franchise.Where(p => p.FranchiseId == fran.FranchiseId).FirstOrDefault();
                if (frresult != null)
                {
                    if (frresult1 == null)
                    {
                        if (frresult2 == null)
                        {
                            frresult.AddressLine = fran.AddressLine;
                            frresult.Centeradminid = fran.Centeradminid;
                            frresult.CityName = fran.CityName;
                            frresult.CountryName = fran.CountryName;
                            frresult.DomainId = fran.DomainId;
                            frresult.Email = fran.Email;
                            frresult.FacebookId = fran.FacebookId;
                           // frresult.FranchiseId = fran.FranchiseId;
                            frresult.FranchiseTitle = fran.FranchiseTitle;
                            frresult.IsActive = fran.IsActive;
                            frresult.IsDeleted = fran.IsDeleted;
                            frresult.Lattitude = fran.Lattitude;
                            frresult.LocationDisplayName = fran.LocationDisplayName;
                            frresult.LocationName = fran.LocationName;
                            frresult.LocationURL = fran.LocationURL;
                            frresult.Longitude = fran.Longitude;
                            frresult.Password = fran.Password;
                            frresult.PhoneNumber = fran.PhoneNumber;
                            frresult.StateName = fran.StateName;
                            frresult.TwitterId = fran.TwitterId;
                            frresult.Updatedby = fran.Updatedby;
                            frresult.UpdatedDate = DateTime.Now;
                            frresult.Zipcode = fran.Zipcode;

                            _appContext.Franchise.Update(frresult);
                            int count = _appContext.SaveChanges();
                            if (count>0)
                            {
                                result = CAPMessages.Updatefranchise;
                            }
                        }
                        else
                        {
                            return CAPMessages.Centeradminalready;
                        }
                    }
                    else
                    {
                        return CAPMessages.FrachiseTitle;
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object InsertData(WebsiteContactus websiteContactus)
        {
            try
            {
                websiteContactus.CreatedDate = DateTime.Now;
                websiteContactus.UpdatedDate = DateTime.Now;
                 _appContext.websiteContactus.Add(websiteContactus);
                var count = _context.SaveChanges();
                if (count > 0)
                {
                    DataTable DgMail = GetmailSettings(Convert.ToString(MailEnums.WebsiteContactus));
                    using (MailMessage mm = new MailMessage((string)DgMail.Rows[0]["MailId"], DgMail.Rows[0]["MailId"].ToString()))
                    {
                        mm.Subject = DgMail.Rows[0]["Subject"].ToString();
                        mm.CC.Add(websiteContactus.EmailId);
                        mm.Body = DgMail.Rows[0]["Dear"].ToString() + '\n' +
                            DgMail.Rows[0]["Body"].ToString() +" "+ websiteContactus.EmailId + " Please Find The Details" + '\n' +
                            "Name :" + websiteContactus.Name + '\n' +
                           "Phone :" + " " + websiteContactus.Phone + '\n' +
                           "Email :" + websiteContactus.EmailId + '\n' +
                           "Message :" + websiteContactus.Message + '\n' +
                           DgMail.Rows[0]["Regards"].ToString() + '\n' +
                           DgMail.Rows[0]["RegardsName"].ToString();

                        mm.IsBodyHtml = false;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = DgMail.Rows[0]["SMTP"].ToString();
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(DgMail.Rows[0]["MailId"].ToString(), DgMail.Rows[0]["Password"].ToString());
                        smtp.UseDefaultCredentials = true;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = int.Parse(DgMail.Rows[0]["Port"].ToString());
                        smtp.Send(mm);
                    }
                    result = CAPMessages.contactusdatasaved;
                }
                else
                {
                    result = CAPMessages.contactusdatanotsaved;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public object InsertcontactData(Contactus Contactus)
        {
            try
            {
                Contactus.CreatedDate = DateTime.Now;
                Contactus.UpdatedDate = DateTime.Now;
                _appContext.Contactus.Add(Contactus);
                var count = _context.SaveChanges();
                if (count > 0)
                {
                    DataTable DgMail = GetmailSettings(Convert.ToString(MailEnums.Contactus));
                    using (MailMessage mm = new MailMessage((string)DgMail.Rows[0]["MailId"], Contactus.EmailTo))
                    {
                        mm.Subject = DgMail.Rows[0]["Subject"].ToString();
                        mm.CC.Add(Contactus.EmailId);
                        mm.Body = DgMail.Rows[0]["Dear"].ToString() + '\n' +
                            DgMail.Rows[0]["Body"].ToString()+" " + Contactus.EmailId + " Please Find The Details" + '\n' +
                            "Name :" + Contactus.Name + '\n' +
                           "Phone :" + " " + Contactus.Phone + '\n' +
                           "Subject :" + Contactus.Subject + '\n' +
                           "Message :" + Contactus.Message + '\n' +'\n'+
                           
                           DgMail.Rows[0]["Regards"].ToString() + '\n' +
                           DgMail.Rows[0]["RegardsName"].ToString();

                        mm.IsBodyHtml = false;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = DgMail.Rows[0]["SMTP"].ToString();
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential(DgMail.Rows[0]["MailId"].ToString(), DgMail.Rows[0]["Password"].ToString());
                        smtp.UseDefaultCredentials = true;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = int.Parse(DgMail.Rows[0]["Port"].ToString());
                        smtp.Send(mm);
                    }
                    result = CAPMessages.contactusdatasaved;
                }
                else
                {
                    result = CAPMessages.contactusdatanotsaved;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string BatchAssign(BatchAssign batchAssign)
        {
            try
            {
                List<BatchAssign> listofstudentNames = batchAssign
                                              .StudentIds
                                              .Select(item => new BatchAssign() { StudentId = int.Parse(item) }
                                              ).ToList();
                if (listofstudentNames != null && listofstudentNames.Count > 0)
                {
                    foreach (var item in listofstudentNames)
                    {
                        item.BatchId = batchAssign.BatchId;
                        item.CreatedDate = item.UpdatedDate = DateTime.Now;
                        item.Createdby = item.Updatedby = batchAssign.Createdby;

                    }
                    _appContext.BatchAssign.AddRange(listofstudentNames);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.BactchAssign;


                    }

                }


                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string SATExamassign(SATExamAssign satexamassign)
        {
            try
            {
                var satinfo= _appContext.SATExamAssign.Where(p => p.SubTopicId == satexamassign.SubTopicId && p.BatchId== satexamassign.BatchId).FirstOrDefault();
                if (satinfo == null)
                {
                    satexamassign.CreatedDate = DateTime.Now;
                    satexamassign.UpdatedDate = DateTime.Now;
                    _appContext.SATExamAssign.Add(satexamassign);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.SatAssign;
                    }
                }
                else
                {
                    result = CAPMessages.SatexamalreadyAssign;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string HomeWorkAssign(HomeWorkAssign homeWorkAssign)
        {
            try
            {
                List<HomeWorkAssign> listofhomeworkNames = homeWorkAssign
                                              .HomeWorkIds
                                              .Select(item => new HomeWorkAssign() { HomeWorkId = int.Parse(item) }
                                              ).ToList();
                if (listofhomeworkNames != null && listofhomeworkNames.Count > 0)
                {
                    foreach (var item in listofhomeworkNames)
                    {
                        item.BatchId = homeWorkAssign.BatchId;
                        item.CreatedDate = item.UpdatedDate = DateTime.Now;
                        item.Createdby = item.Updatedby = homeWorkAssign.Createdby;

                    }
                    _appContext.homeWorkAssign.AddRange(listofhomeworkNames);
                    int count = _appContext.SaveChanges();
                    if (count>0)
                    {
                        result = CAPMessages.Homeworkassign;


                    }

                }


                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string addAttendance(Attendance[] attendance)
        {
            try
            {

                foreach (var item in attendance)
                {
                    item.CreatedDate = item.UpdatedDate = DateTime.Now;
                }
                _appContext.attendance.AddRange(attendance);
                int count = _appContext.SaveChanges();
                if (count > 0)
                {
                    result = CAPMessages.AttendenceSaved;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public string AddExamids(ExamIds examIds)
        {
            try
            {
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                if (examIds.TestId == Convert.ToInt32(TestTypes.SAT))
                {

                    arrSqlParam[0] = new SqlParameter("@StudentId", examIds.StudentId);
                    arrSqlParam[1] = new SqlParameter("@SubjectId", 1);

                    int Satexamid = Convert.ToInt32(sqlHelper.ExecuteScalar("dbo.GetSATExamAssignid", arrSqlParam));
                    if (Satexamid != 0)
                    {
                        examIds.SATExamAssignId = Satexamid;
                    }
                }
                else if (examIds.TestId == Convert.ToInt32(TestTypes.HomeWork))
                {

                    arrSqlParam[0] = new SqlParameter("@StudentId", examIds.StudentId);
                    arrSqlParam[1] = new SqlParameter("@SubjectId", 1);

                    int Hwexamid = Convert.ToInt32(sqlHelper.ExecuteScalar("dbo.GetHomeWorkAssignid", arrSqlParam));
                    if (Hwexamid != 0)
                    {
                        examIds.HomeWorkAssignId = Hwexamid;
                    }
                }
                _appContext.ExamIds.Add(examIds);
                int count = _appContext.SaveChanges();
                if (count > 0)
                {
                    result = CAPMessages.ExamIdcreated;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string AddEnglishExamids(EnglishExamIds examIds)
        {
            try
            {
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[2];
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                if (examIds.TestId == Convert.ToInt32(TestTypes.SAT))
                {

                    arrSqlParam[0] = new SqlParameter("@StudentId", examIds.StudentId);
                    arrSqlParam[1] = new SqlParameter("@SubjectId", 2);

                    int Satexamid = Convert.ToInt32(sqlHelper.ExecuteScalar("dbo.GetSATExamAssignid", arrSqlParam));
                    if (Satexamid != 0)
                    {
                        examIds.SATExamAssignId = Satexamid;
                    }
                }
                else if (examIds.TestId == Convert.ToInt32(TestTypes.HomeWork))
                {

                    arrSqlParam[0] = new SqlParameter("@StudentId", examIds.StudentId);
                    arrSqlParam[1] = new SqlParameter("@SubjectId", 2);

                    int Hwexamid = Convert.ToInt32(sqlHelper.ExecuteScalar("dbo.GetHomeWorkAssignid", arrSqlParam));
                    if (Hwexamid != 0)
                    {
                        examIds.HomeWorkAssignId = Hwexamid;
                    }
                }
                _appContext.EnglishExamIds.Add(examIds);
                int count = _appContext.SaveChanges();
                if (count > 0)
                {
                    result = CAPMessages.ExamIdcreated;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        


        public string Add(CommonParams commonParams)
        {


            int count = 0;
            string tableName = string.Empty;
            DataSet dtresult;
            try
            {
                tableName = commonParams.Table;

                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);

                var FilterFieldName = commonParams.FilterFieldName;
                var FilterFielvalue = commonParams.FilterFieldValue;
                var FilterFieldName1 = commonParams.FilterFieldName1;
                var FilterFielvalue1 = commonParams.FilterFieldValue1;
                if (string.IsNullOrEmpty(FilterFieldName1))
                {
                    SqlParameter[] arrSqlParam1 = new SqlParameter[3];
                    arrSqlParam1[0] = new SqlParameter("@Table", tableName);
                    arrSqlParam1[1] = new SqlParameter("@FilterFieldName", FilterFieldName);
                    arrSqlParam1[2] = new SqlParameter("@FilterFielvalue", FilterFielvalue);
                    dtresult = sqlHelper.ExecuteDataSet("dbo.SP_CheckData", arrSqlParam1);
                }
                else
                {
                    SqlParameter[] arrSqlParam1 = new SqlParameter[5];
                    arrSqlParam1[0] = new SqlParameter("@Table", tableName);
                    arrSqlParam1[1] = new SqlParameter("@FilterFieldName", FilterFieldName);
                    arrSqlParam1[2] = new SqlParameter("@FilterFielvalue", FilterFielvalue);
                    arrSqlParam1[3] = new SqlParameter("@FilterFieldName1", FilterFieldName1);
                    arrSqlParam1[4] = new SqlParameter("@FilterFielvalue1", FilterFielvalue1);
                    dtresult = sqlHelper.ExecuteDataSet("dbo.SP_ChecknewData", arrSqlParam1);
                }
                if (dtresult.Tables[0].Rows.Count == 0)
                {

                    SqlParameter[] arrSqlParam = new SqlParameter[3];
                    var FieldNames = string.Join(",", commonParams.Data.Where(p => p.FieldName.ToLower() != string.Empty).Select(p => p.FieldName));
                    var FieldValues = string.Join(",", commonParams.Data.Where(p => p.FieldName.ToLower() != string.Empty).Select(p => p.FieldValue));


                    FieldValues = FieldValues.Replace(",", "','");
                    arrSqlParam[0] = new SqlParameter("@Table", tableName);
                    arrSqlParam[1] = new SqlParameter("@FieldNames", FieldNames);
                    arrSqlParam[2] = new SqlParameter("@FieldValues", FieldValues);
                    count = sqlHelper.ExecuteNonQuery("dbo.SP_InsertData", arrSqlParam);
                    
                    if (count > 0)

                        result = CAPMessages.Insert;
                }
                else
                {

                    result = CAPMessages.DataExist;
                }
                return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public string Update(CommonParams commonParams)
        {

            int count = 0;
            string tableName = string.Empty;
            string pkeyId = string.Empty;
            string pkeyFld = string.Empty;
            try
            {
                tableName = commonParams.Table;
                var FieldNames = commonParams.Data.Where(p => string.IsNullOrEmpty(p.ReferenceTable)).Select(p => p.FieldName).ToList();
                var FieldValues = commonParams.Data.Where(p => string.IsNullOrEmpty(p.ReferenceTable)).Select(p => p.FieldValue).ToList();

                pkeyFld = GetPKey(tableName);
                pkeyId = commonParams.Data.Where(p => p.FieldName == pkeyFld).Select(p => p.FieldValue).FirstOrDefault();
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@Table", tableName);
                arrSqlParam[1] = new SqlParameter("@PkeyId", pkeyFld);
                arrSqlParam[2] = new SqlParameter("@Pkey", pkeyId);

                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetData", arrSqlParam);

                if (dsResult.Tables[0].Rows.Count > 0)
                {
                    var modifyFields = CompareFields(FieldNames, FieldValues, dsResult.Tables[0]);
                    if (!string.IsNullOrEmpty(modifyFields))
                    {
                        SqlParameter[] arrSqlParam1 = new SqlParameter[4];
                        arrSqlParam1[0] = new SqlParameter("@Table", tableName);
                        arrSqlParam1[1] = new SqlParameter("modifyFields", modifyFields);
                        arrSqlParam1[2] = new SqlParameter("@PkeyId", pkeyFld);
                        arrSqlParam1[3] = new SqlParameter("@Pkey", pkeyId);


                        count = sqlHelper.ExecuteNonQuery("dbo.SP_UpdateData", arrSqlParam1);
                        if (count>0)
                            result = CAPMessages.Update;
                    }
                    else
                    {
                        result = CAPMessages.Nochange;
                    }
                }
                else
                {
                    result = CAPMessages.Nodata;
                }
                return result;



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
                var result = (from user in _appContext.Users

                              where user.EmailId == EmailId

                              select new
                              {
                                  Name = user.FirstName + " " + user.LastName

                              }).FirstOrDefault();


                return result;


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }








        private string CompareFields(List<string> fieldNames, List<string> fieldValues, DataTable prvData)
        {
            try
            {
                int count = 0;
                string modifyFlds = string.Empty;
                foreach (DataColumn col in prvData.Columns)
                {
                    count = 0;
                    foreach (var name in fieldNames)
                    {
                        if (col.ColumnName.ToLower().Equals(name.ToLower()))
                        {
                            foreach (DataRow row in prvData.Rows)
                            {
                                if (col.ColumnName == "IsActive")
                                {
                                    if (row[col].ToString().ToLower() != fieldValues[count].ToLower())
                                    {
                                        modifyFlds = modifyFlds + "," + col.ColumnName + "='" + fieldValues[count] + "'";
                                    }
                                }
                                else if (row[col].ToString() != fieldValues[count])
                                {
                                    modifyFlds = modifyFlds + "," + col.ColumnName + "='" + fieldValues[count] + "'";
                                }
                            }
                            break;
                        }
                        count++;
                    }
                }
                if (modifyFlds.Contains(","))
                    modifyFlds = modifyFlds.Substring(1);

                return modifyFlds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object GetDiscountedStudentList(int usertype, int centeradminid, int ISSuperAdmin)
        {

            try
            {
                CommonConcrete commonRepository = new CommonConcrete(_appContext, settings);
                SqlParameter[] arrSqlParam = new SqlParameter[3];
                arrSqlParam[0] = new SqlParameter("@usertype", usertype);
                arrSqlParam[1] = new SqlParameter("@centeradminid", centeradminid);
                arrSqlParam[2] = new SqlParameter("@ISSuperAdmin", ISSuperAdmin);
                SqlHelper sqlHelper = new SqlHelper(Settings.ConnectionString);
                DataSet dsResult = sqlHelper.ExecuteDataSet("dbo.SP_GetDiscountedUsersList", arrSqlParam);

                if (dsResult.Tables.Count > 0)
                {
                    if (dsResult.Tables[0].Rows.Count > 0)
                    {
                        for (int i = 0; i < dsResult.Tables[0].Rows.Count; i++)
                        {
                            if (dsResult.Tables[0].Rows[i]["Password"].ToString() != null)
                            {
                                dsResult.Tables[0].Rows[i]["Password"] = EncryptionLibrary.DecryptText(dsResult.Tables[0].Rows[i]["Password"].ToString());
                            }
                        }
                        return dsResult.Tables[0];
                    }
                    else
                    {
                         return dsResult.Tables[0];
                    }
                }
                else
                {
                     return dsResult.Tables[0];
                }
                return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



    }
}
