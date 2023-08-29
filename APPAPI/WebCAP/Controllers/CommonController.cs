using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebCAP.Interface;
using WebCAP.Models;
using Microsoft.AspNetCore.Authorization;
using WebCAP.Concrete;
using WebCAP.ViewModels;
using EntityFrameworkPaginate;
using System.Data;
using System.Collections.Generic;

namespace WebCAP.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
   
    public class CommonController : Controller
    {
        private readonly ICommon _common;
    
        private FileSettings fileSettings { get; set; }
        
        public CommonController(ICommon common)
        {
            _common = common;
          
        }


        //TopicsList
        [HttpGet("GetTopics")]
        public IActionResult TopicsList(string SubjectId, string orderby, string orderbyvalue, string condition = "DESC")
        {
            try
            {
                var result = _common.TopicsList(SubjectId, orderby, orderbyvalue, condition);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Practice test Questions List-Practice test maths

        [HttpGet("GetQuestionsList")]
        public IActionResult GetQuestionsList(int UserId, int SubjectId, int TopicId, int CalculatorId, int SubTopicIds, int Ishomework = 0)
        {
            try
            {


                var result = _common.PraticeQuestions(UserId, SubjectId, TopicId, CalculatorId, SubTopicIds, Ishomework);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        //Practice test Questions List-Practice test english

        [HttpGet("GetEnglishQuestionsList")]
        public IActionResult GetEnglishQuestionsList(int UserId, int SubjectId, int TopicId, int SectionId, int SubTopicIds, int Ishomework = 0)
        {
            try
            {
                var result = _common.PraticeEnglishQuestions(UserId, SubjectId, TopicId, SectionId, SubTopicIds, Ishomework);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        //Pratice Exam test Report-maths-pi chart

        [HttpGet("GetPracticeExamReport")]
        public IActionResult GetPracticeExamReport(int StudentId)
        {
            try
            {
                var result = _common.PraticeTestReport(StudentId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Pratice Exam test Report-english-pi chart

        [HttpGet("GetPracticeEnglishExamReport")]
        public IActionResult GetPracticeEnglishExamReport(int StudentId,int ExamId)
        {
            try
            {
                var result = _common.PraticeEnglishPichartReport(StudentId,ExamId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });

                else if (result.ToString() == CAPMessages.Nosectionid)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { status = StatusCodes.Status404NotFound, message = result });
                }
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Pratice Exam test Score Card-maths

        [HttpGet("GetPracticeExamScore")]
        public IActionResult PracticeExamScore(int StudentId, int ExamId, int ExamtypeID)
        {
            try
            {
                var result = _common.PracticeExamScore(StudentId, ExamId, ExamtypeID);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Pratice Exam test Score Card-English

        [HttpGet("GetPracticeExamEnglishScore")]
        public IActionResult PracticeExamEnglishScore(int StudentId, int ExamId, int ExamtypeID)
        {
            try
            {
                var result = _common.PracticeExamEnglishScore(StudentId, ExamId, ExamtypeID);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == CAPMessages.Nosectionid)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { status = StatusCodes.Status404NotFound, message = result });
                }
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Pratice Exam test- Topics and Subtopics Score Card-maths
        [HttpGet("GetPracticeExamTopicssubtopicscore")]
        public IActionResult GetPracticeExamTopicssubtopic(int StudentId, int ExamId, int ExamtypeID)
        {
            try
            {
                var result = _common.PracticeExamTopicsandsubtopicsScore(StudentId, ExamId, ExamtypeID);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Pratice Exam test- Topics and Subtopics Score Card-english
        [HttpGet("GetPracticeExamEnglishTopicsandsubtopicsScore")]
        public IActionResult PracticeExamEnglishTopicsandsubtopicsScore(int StudentId, int ExamId, int ExamtypeID)
        {
            try
            {
                var result = _common.PracticeExamEnglishTopicsandsubtopicsScore(StudentId, ExamId, ExamtypeID);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if  (result.ToString() == CAPMessages.Nosectionid)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { status = StatusCodes.Status404NotFound, message = result });
                }
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Get Practice and SAT ExamID
        [HttpGet("GetPracticeSATExamIds")]
        public IActionResult GetPracticeSATExamIds(int StudentId, int ExamtypeId, int SubjectId)
        {
            try
            {
                var result = _common.GetExamId(StudentId, ExamtypeId, SubjectId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Pratice Exam test Report-maths

        [HttpGet("GetPracticeExamReportQuestions")]
        public IActionResult GetPracticeExamReportQuestions(int StudentId, int ExamId)
        {
            try
            {
                var result = _common.PraticeTestReportQuestions(StudentId, ExamId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Admin Pratice Exam Report-maths

        [HttpGet("GetAdminPracticeExamReport")]
        public IActionResult GetAdminPracticeExamReport(int Id, int Usertype)
        {
            try
            {
                var result = _common.AdminPracticeExamReport(Id, Usertype);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        //Score Card-maths -practice and sat
        [HttpGet("GetPracticeExamCUMReport")]
        public IActionResult GetPracticeExamCUMReport(int StudentId, int ExamTypeId)
        {
            try
            {
                var result = _common.PracticeExamSATCUMReport(StudentId, ExamTypeId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Score Card-english -practice and sat
        [HttpGet("PracticeExamSATEnglishReport")]
        public IActionResult PracticeExamSATEnglishReport(int StudentId, int ExamTypeId)
        {
            try
            {
                var result = _common.PracticeExamSATEnglishReport(StudentId, ExamTypeId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Answers based on type-maths
        [HttpGet("GetScorecardanswerersList")]
        public IActionResult ScorecardanswerersList(int StudentId, int ExamId, string Name, string Type, int ExamtypeId)
        {
            try
            {
                var result = _common.ScorecardanswerersList(StudentId, ExamId, Name, Type, ExamtypeId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Answers based on type-English
        [HttpGet("GetEnglishScorecardanswerersList")]
        public IActionResult EnglishScorecardanswerersList(int StudentId, int ExamId, string Name, string Type, int ExamtypeId)
        {
            try
            {
                var result = _common.EnglishScorecardanswerersList(StudentId, ExamId, Name, Type, ExamtypeId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        //HomeWork -QuestionsList- all subjects

        [HttpGet("GetHomeworkQuestionsList")]
        public IActionResult GetHomeworkQuestionsList(int SubjectId, int TopicId, int SubTopicId, string HomeWorkIds, int Ishomework = 1)
        {
            try
            {
                var result = _common.HomeWorkQuestions(SubjectId, TopicId, SubTopicId, HomeWorkIds, Ishomework);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Admin-HomeWork -Maths Report
        [HttpGet("GetHomeworkReport")]
        public IActionResult GetHomeworkReport(int Id, int Usertype)
        {
            try
            {
                var result = _common.HomeWorkQuestionReport(Id, Usertype);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Admin-HomeWork -English Report
        [HttpGet("GetHomeworkEnglishReport")]
        public IActionResult GetHomeworkEnglishReport(int Id, int Usertype)
        {
            try
            {
                var result = _common.HomeWorkEnglishQuestionReport(Id, Usertype);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //All Questions
        [HttpGet("GetAllQuestionbyexamid")]
        public IActionResult GetAllQuestionbyexamid(int ExamId, int Examtype)
        {
            try
            {
                var result = _common.AllQuestionbyexamid(ExamId, Examtype);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        //All Questions-english
        [HttpGet("GetAllEnglishQuestionbyexamid")]
        public IActionResult GetAllEnglishQuestionbyexamid(int ExamId, int Examtype)
        {
            try
            {
                var result = _common.AllEnglishQuestionbyexamid(ExamId, Examtype);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        //Get Sat Exam Questions
        [HttpGet("GetSATExamQuestionsList")]
        public IActionResult SATExamQuestions(int UserId, int SubjectId, int BatchId, int CalculatorId)
        {
            try
            {

                var result = _common.SATExamQuestions(UserId, SubjectId, BatchId, CalculatorId);

                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
              
                else if ((result.ToString() == CAPMessages.Doesnotassignsat)||(result.ToString()==CAPMessages.ExamAlreadywritten))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status404NotFound, message = result });
                }
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Get Sat English Exam Questions
        [HttpGet("GetSATExamEnglishQuestionsList")]
        public IActionResult SATEnglishExamQuestions(int UserId, int SubjectId, int BatchId, int SectionId)
        {
            try
            {

                var result = _common.SATEnglishExamQuestions(UserId, SubjectId, BatchId, SectionId);

                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
              
                else if ((result.ToString() == CAPMessages.Doesnotassignsat) || (result.ToString() == CAPMessages.ExamAlreadywritten))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status404NotFound, message = result });
                }
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        //Get Sat Jumble English Exam Questions
        [HttpGet("GetSATExamJumbleEnglishQuestionsList")]
        public IActionResult GetSATExamJumbleEnglishQuestionsList(int UserId, int SubjectId, string BatchId, int SectionId)
        {
            try
            {

                var result = _common.SATJumbleEnglishExamQuestions(UserId, SubjectId, BatchId, SectionId);

                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Get Sat Jumble Maths Exam Questions
        [HttpGet("GetSATExamJumbleMathsQuestionsList")]
        public IActionResult GetSATExamJumbleMathsQuestionsList(int UserId, int SubjectId, string BatchId, int CalculatorId)
        {
            try
            {

                var result = _common.SATJumbleMathsExamQuestions(UserId, SubjectId, BatchId, CalculatorId);

                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        // SAT test PI Chart-Maths

        [HttpGet("GetSATTestReport")]
        public IActionResult GetSATTestReport(int StudentId)
        {
            try
            {
                var result = _common.SATTestReport(StudentId);

                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        // SAT test PI Chart-English

        [HttpGet("GetSATEnglishPichartReport")]
        public IActionResult GetSATEnglishPichartReport(int StudentId)
        {
            try
            {
                var result = _common.SATEnglishPichartReport(StudentId);

                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }



        // SAT test PI Chart-Maths

        [HttpGet("GetSATTestJumblePichart")]
        public IActionResult GetSATTestJumblePichart(int StudentId)
        {
            try
            {
                var result = _common.SATTestJumblePichart(StudentId);

                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        // SAT test PI Chart-English

        [HttpGet("GetSATJumbleEnglishPichartReport")]
        public IActionResult GetSATJumbleEnglishPichartReport(int StudentId)
        {
            try
            {
                var result = _common.SATEnglishJumblePichart(StudentId);

                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }



        //Admin SAT test Report-Maths

        [HttpGet("GetAdminSATTestReport")]
        public IActionResult GetAdminSATTestReport(int Id, int Usertype)
        {
            try
            {
                var result = _common.AdminSATTestReport(Id, Usertype);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Admin SAT Jumble test Report-Maths

        [HttpGet("GetAdminSATTesJumbletReport")]
        public IActionResult AdminSATTesJumbletReport(int Id, int Usertype)
        {
            try
            {
                var result = _common.AdminSATTesJumbletReport(Id, Usertype);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }



        //Admin SAT test Report-English

        [HttpGet("GetAdminPracticeExamSATEnglishReport")]
        public IActionResult AdminPracticeExamSATEnglishReport(int Id, int Usertype, int ExamTypeId)
        {
            try
            {
                var result = _common.AdminPracticeExamSATEnglishReport(Id, Usertype, ExamTypeId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == CAPMessages.Nosectionid)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { status = StatusCodes.Status404NotFound, message = result });
                }

                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Admin SAT SCores

        [HttpGet("GetPracticeSATTestScores")]
        public IActionResult GetPracticeSATTestScores(int StudentId, int PracticeorSAT)
        {
            try
            {
                var result = _common.GetPracticeSATTestScores(StudentId, PracticeorSAT);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Admin SAT test Report-Maths

        [HttpGet("GetSATTestReportQuestions")]
        public IActionResult GetSATTestReportQuestions(int StudentId, int ExamId)
        {
            try
            {
                var result = _common.SATTestReportQuestions(StudentId, ExamId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }



        //Getuserlistbasedonusertype
        [HttpGet("GetUsersList")]
        public IActionResult GetUsersList(int usertype, int centeradminid, int ISSuperAdmin = 0, bool IsActive = true)
        {
            try
            {
                var result = _common.UsersList(usertype, centeradminid, ISSuperAdmin, IsActive);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        //Getstudent list
        [HttpGet("GetStudentListBasedonCenter")]
        public IActionResult GetStudentListBasedonCenter(int centeradminid)
        {
            try
            {
                var result = _common.StudentList(centeradminid);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }







        //Maths TestTime
        [HttpGet("GetTestTime")]
        public IActionResult GetTestTime()
        {
            try
            {
                var result = _common.TestTime();
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        //English TestTime
        [HttpGet("GetEnglishTestTime")]
        public IActionResult GetEnglishTestTime()
        {
            try
            {
                var result = _common.EnglishTestTime();
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        //List
        [HttpGet("GetList")]
        public IActionResult List(string entityName, string orderby, string orderbyvalue, string condition = "DESC", bool status = true)
        {
            try
            {
                var result = _common.List(entityName, orderby, orderbyvalue, condition, status);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if(result.ToString()==string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                 return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        //List
        [HttpGet("GetGeneralList")]
        public IActionResult GetGeneralList(string entityName, string orderby, string orderbyvalue, string condition = "DESC")
        {
            try
            {
                var result = _common.GeneralList(entityName, orderby, orderbyvalue, condition);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //List
        [HttpGet("GetDeletedList")]
        public IActionResult DeletedList(string entityName, string orderby, string orderbyvalue, string condition = "DESC")
        {
            try
            {
                var result = _common.DeletedList(entityName, orderby, orderbyvalue, condition);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Get Subtopics
        [HttpGet("GetSubtopicsbybatchid")]
        public IActionResult GetSubtopics(int StudentId, string BatchId)
        {
            try
            {
                var result = _common.GetSubtopics(StudentId, BatchId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Get topics by based on batch id
        [HttpGet("Gettopicsbybatchid")]
        public IActionResult Gettopics(int StudentId, string BatchId, int SubjectId)
        {
            try
            {
                var result = _common.Gettopics(StudentId, BatchId, SubjectId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Get Subtopics home work 
        [HttpGet("GetSubtopicsHwbybatchid")]
        public IActionResult GetSubtopics(string BatchId)
        {
            try
            {
                var result = _common.GetSubtopics(BatchId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Get topics Home work by batch id
        [HttpGet("GettopicsHwbybatchid")]
        public IActionResult Gettopics(string BatchId, int SubjectId)
        {
            try
            {
                var result = _common.Gettopics(BatchId, SubjectId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Get Subtopics
        [HttpGet("GetHomeWorksbybatchid")]
        public IActionResult GetHomeWorks(string BatchId)
        {
            try
            {
                var result = _common.GetHomeWorks(BatchId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Get Batches
        [HttpGet("Getbatchidsbytutorid")]
        public IActionResult GetBatches(int TutorId)
        {
            try
            {
                var result = _common.GetBatches(TutorId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Get Videos based on Batch
        [HttpGet("GetVideosbasedonBatch")]
        public IActionResult GetVideosbasedonBatch(string BatchId)
        {
            try
            {
                var result = _common.GetVideos(BatchId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        [HttpGet("GetSubtopiccount")]
        public IActionResult GetSubtopiccount(int BatchId, int StudentId)
        {
            try
            {
                var result = _common.GetSubtopiccount(BatchId, StudentId);
                if (result == false)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
               
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        [HttpGet("GetZoomLink")]
        public IActionResult GetZoomLink(string BatchId)
        {
            try
            {
                var result = _common.GetZoomLink(BatchId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Get Attendance Report
        [HttpGet("GetAttendancereport/{FromDate:datetime}/{ToDate:datetime}")]
        public IActionResult GetAttendancereport(int BatchId, DateTime FromDate, DateTime ToDate)
        {
            try
            {
                var result = _common.GetAttendancereport(BatchId, FromDate, ToDate);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //getrecordbyid
        [HttpPost("Getrecordbyid")]
        public IActionResult GetById([FromBody] CommonParams commonParams)
        {
            try
            {
                var result = _common.GetById(commonParams);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });


                return Ok(result);


                //return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Franchise delet
        [HttpPost("FranchiseDelete")]
        public IActionResult FranchiseDelete(int FranchiseId,int CenteradminId)
        {
            try
            {
                var result = _common.FranchiseDelete(FranchiseId, CenteradminId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });

              

                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //changestatus
        [HttpPost("changestatus")]
        public IActionResult ChangeStatus([FromBody] CommonParams commonParams)
        {
            try
            {
                var result = _common.ChangeStatus(commonParams);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
              
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //maths Question list
        [HttpPost("MathsQuestionList")]
        public IActionResult GetMathsList([FromBody] CustomPaginate<QuestionFilters> QuestionFilters)
        {
            try
            {


                DataTable dataTable = _common.GetMathsQuestionList(QuestionFilters);

                if (dataTable.Rows.Count > 0)
                {
                    QuestionFilters.TotalRecordsCount = Convert.ToInt32(dataTable.Rows[0]["NumberOfItems"]);
                }
                else
                {
                    QuestionFilters.TotalRecordsCount = 0;
                }

                QuestionFilters.ResultSetSize = dataTable.Rows.Count;



                var jsonData = Newtonsoft.Json.JsonConvert.SerializeObject(dataTable);
                QuestionFilters.Results = Newtonsoft.Json.JsonConvert.DeserializeObject<List<QuestionFilters>>(jsonData);
                var result=  QuestionFilters;
                //var result = _common.GetMathsQuestionList(QuestionFilters);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //english Question List
        [HttpPost("EnglishQuestionList")]
        public IActionResult GetEnglishList([FromBody] CustomPaginate<EnglishQuestionFilters> QuestionFilters)
        {
            try
            {
                DataTable dataTable = _common.GetEnglishQuestionList(QuestionFilters);
                if (dataTable.Rows.Count > 0)
                {
                    QuestionFilters.TotalRecordsCount = Convert.ToInt32(dataTable.Rows[0]["NumberOfItems"]);
                }
                else
                {
                    QuestionFilters.TotalRecordsCount = 0;
                }

                QuestionFilters.ResultSetSize = dataTable.Rows.Count;
                var jsonData = Newtonsoft.Json.JsonConvert.SerializeObject(dataTable);
                QuestionFilters.Results = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EnglishQuestionFilters>>(jsonData);
                var result = QuestionFilters;


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //MailSent

        [HttpPost("SendEmailForTestDetails")]
        public IActionResult SendEmailForResetPassword(int BatchId, int SubjectId, int StudentId, string Name, int ExamtypeId, int ExamId)
        {
            try
            {
                var result = _common.MailsentbyTestdetails(BatchId, SubjectId, StudentId, Name, ExamtypeId, ExamId);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if ((result.ToString() == CAPMessages.NoMailMessageData)|| (result.ToString() == CAPMessages.NoTutorMailIdData) || (result.ToString() == CAPMessages.MailUpdatesent) || (result.ToString() == CAPMessages.Mailsent))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = result });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Practice exam questions add
        [HttpPost("AddExam")]
        public IActionResult AddExam([FromBody] PracticeExamQuestion exam)
        {
            try
            {

                var result = _common.AddExamQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                
                return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //update exam questions
        [HttpPost("UpdateExam")]
        public IActionResult UpdateExam([FromBody] PracticeExamQuestion exam)
        {
            try
            {
                var result = _common.UpdateexamQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == CAPMessages.NoMailMessageData) 
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { status = StatusCodes.Status404NotFound, message = result });
                }
                return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //add Home work questions
        [HttpPost("AddHomework")]
        public IActionResult AddHomework([FromBody] HomeWorkQuestion Hwexam)
        {
            try
            {
                var result = _common.AddHomeworkQuestions(Hwexam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //update Home work questions
        [HttpPost("UpdateHomeWork")]
        public IActionResult UpdateHomeWork([FromBody] HomeWorkQuestion Hwexam)
        {
            try
            {
                var result = _common.UpdateHomeworkQuestions(Hwexam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //add SAT questions
        [HttpPost("AddSAT")]
        public IActionResult AddSAT([FromBody] SATExamQuestion exam)
        {
            try
            {
                var result = _common.AddSATQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //update SAT questions
        [HttpPost("UpdateSAT")]
        public IActionResult UpdateSAT([FromBody] SATExamQuestion exam)
        {
            try
            {
                var result = _common.UpdateSATQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //add SAT Jumble questions-maths
        [HttpPost("AddSATJumbleMaths")]
        public IActionResult AddSATJumble([FromBody] SATExamJumbleQuestion exam)
        {
            try
            {
                var result = _common.AddSATJumbleQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //update SAT Jumble questions-maths
        [HttpPost("UpdateSATJumbleMaths")]
        public IActionResult UpdateSATJumble([FromBody] SATExamJumbleQuestion exam)
        {
            try
            {
                var result = _common.UpdateSATJumbleQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //add SAT Jumble questions-English
        [HttpPost("AddSATJumbleEnglish")]
        public IActionResult AddSATJumbleEnglish([FromBody] SATExamEnglishJumbleQuestion exam)
        {
            try
            {
                var result = _common.AddSATEnglishJumbleQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //update SAT Jumble questions-English
        [HttpPost("UpdateSATJumbleEnglish")]
        public IActionResult UpdateSATJumbleEnglish([FromBody] SATExamEnglishJumbleQuestion exam)
        {
            try
            {
                var result = _common.UpdateSATEnglishJumbleQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //Practice English exam questions add
        [HttpPost("AddEnglishExam")]
        public IActionResult AddEnglishExam([FromBody] PracticeExamEnglishQuestion exam)
        {
            try
            {

                var result = _common.AddEnglishExamQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //update english exam questions-practice
        [HttpPost("UpdateEnglishExam")]
        public IActionResult UpdateEnglishExam([FromBody] PracticeExamEnglishQuestion exam)
        {
            try
            {
                var result = _common.UpdateEnglishexamQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //add Home work questions-english
        [HttpPost("AddEnglishHomework")]
        public IActionResult AddEnglishHomework([FromBody] HomeWorkEnglishQuestion Hwexam)
        {
            try
            {
                var result = _common.AddEnglishHomeworkQuestions(Hwexam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //update Home work questions-english
        [HttpPost("UpdateEnglishHomeWork")]
        public IActionResult UpdateEnglishHomeWork([FromBody] HomeWorkEnglishQuestion Hwexam)
        {
            try
            {
                var result = _common.UpdateEnglishHomeworkQuestions(Hwexam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //add SAT questions-english
        [HttpPost("AddEnglishSATTest")]
        public IActionResult AddEnglishSATTest([FromBody] SATExamEnglishQuestion exam)
        {
            try
            {
                var result = _common.AddSATEnglishQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //update SAT questions-english
        [HttpPost("UpdateEnglishSAT")]
        public IActionResult UpdateEnglishSAT([FromBody] SATExamEnglishQuestion exam)
        {
            try
            {
                var result = _common.UpdateSATEnglishQuestions(exam);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
      
        //add Franchise
        [HttpPost("AddFranchise")]
        public IActionResult AddFranchise([FromBody] Franchise fr)
        {
            try
            {
                var result = _common.AddFranchise(fr);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result == CAPMessages.InsertFranchise)
                    return Ok(new { status = CAPMessages.Status, message = result });
                else if((result== CAPMessages.Centeradminalready)|| (result == CAPMessages.FrachiseTitle))
                    return StatusCode(StatusCodes.Status409Conflict, new { status = StatusCodes.Status409Conflict, message = result });
                else
                {
                   
                    return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = result });
                    
                }

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //update Franchise
        [HttpPost("UpdateFranchise")]
        public IActionResult UpdateFranchise([FromBody] Franchise fr)
        {
            try
            {
                var result = _common.UpdateFranchise(fr);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                if(result == CAPMessages.Updatefranchise)
                return Ok(new { status = CAPMessages.Status, message = result });
                else
                {
                 
                    return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = result });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //add
        [HttpPost("Addnew")]
        public IActionResult Add([FromBody] CommonParams commonParams)
        {
            try
            {
                var result = _common.Add(commonParams);

                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result == CAPMessages.DataExist)
                {
                    
                    return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = result });
                }
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //add questions
        [HttpPost("AddQuestions")]
        public IActionResult AddQuestions([FromBody] Questions questions)
        {
            try
            {

                var result = _common.AddQuestions(questions);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
              
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //english
        [HttpPost("AddEnglishQuestions")]
        public IActionResult AddEnglishQuestions([FromBody] EnglishParagraph englishQuestions)
        {
            try
            {

                var result = _common.AddEnglishQuestions(englishQuestions);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Update english
        [HttpPost("UpdateEnglishQuestions")]
        public IActionResult UpdateEnglishQuestions([FromBody] EnglishParagraph englishQuestions)
        {
            try
            {

                var result = _common.UpdateEnglishQuestions(englishQuestions);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Update questions
        [HttpPost("UpdateQuestions")]
        public IActionResult UpdateQuestions([FromBody] Questions questions)
        {
            try
            {
                var result = _common.UpdateQuestions(questions);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //add batch assign
        [HttpPost("Batchassign")]
        public IActionResult Batchassign([FromBody] BatchAssign batchAssign)
        {
            try
            {
                var result = _common.BatchAssign(batchAssign);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //add homework assign
        [HttpPost("Homeworkassign")]
        public IActionResult Homeworkassign([FromBody] HomeWorkAssign homeWorkAssign)
        {
            try
            {
                var result = _common.HomeWorkAssign(homeWorkAssign);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //add SAT Exam assign to batch
        [HttpPost("SATExamassign")]
        public IActionResult SATExamassign([FromBody] SATExamAssign batchAssign)
        {
            try
            {
                var result = _common.SATExamassign(batchAssign);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                if (result == CAPMessages.SatexamalreadyAssign)
                {
                    
                    return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = result });
                }
                else
                    return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //add attendance
        [HttpPost("AddAttendance")]
        public IActionResult AddAttendance([FromBody] Attendance[] attendance)
        {
            try
            {

                var result = _common.addAttendance(attendance);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });

                return Ok(new { status = CAPMessages.Status, message = result });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //add ExamIds
        [HttpPost("AddExamIds")]
        public IActionResult AddExamIds([FromBody] ExamIds examIds)
        {
            try
            {

                var result = _common.AddExamids(examIds);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });

                return Ok(new { status = CAPMessages.Status, message = result });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }

        //add English ExamIds
        [HttpPost("AddEnglishExamIds")]
        public IActionResult AddEnglishExamids([FromBody] EnglishExamIds examIds)
        {
            try
            {

                var result = _common.AddEnglishExamids(examIds);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });

                return Ok(new { status = CAPMessages.Status, message = result });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }



        [HttpPost("Deleterecord")]
        public IActionResult Deltete([FromBody] CommonParams commonParams)
        {
            try
            {
                var result = _common.Delete(commonParams);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Restore
        [HttpPost("Restorerecord")]
        public IActionResult ReStore([FromBody] CommonParams commonParams)
        {
            try
            {
                var result = _common.ReStore(commonParams);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Update
        [HttpPost("Updatedata")]
        public IActionResult Update([FromBody] CommonParams commonParams)
        {
            try
            {
                var result = _common.Update(commonParams);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if((result.ToString()==CAPMessages.Nodata)||(result.ToString()==CAPMessages.Nochange))
                    return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = result });
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Get Centeradminuser
        [HttpGet("GetCenteradminUsers")]
        public IActionResult GetCenteradminUsers(int Centeradminid=0)
        {
            try
            {
                var result = _common.DropdownforCenteradminuser(Centeradminid);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if(result.ToString()==string.Empty)
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });
                else
                return Ok( result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Sendmailcontact
        [HttpPost("SendEmailContactus")]
        public IActionResult SendEmailContactus([FromBody] Contactus Contactus)
        {
            try
            {
                var result = _common.InsertcontactData(Contactus);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if (result.ToString() == CAPMessages.contactusdatanotsaved)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { status = StatusCodes.Status400BadRequest, message = result });
                }
                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //Dropdowns
        [HttpPost("Dropdowns")]
        public IActionResult DropdownList([FromBody] CommonParams commonParams)
        {
            try
            {
                var result = _common.DropdownList(commonParams);

                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });

                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }
        //History
        [HttpGet("History")]
        public IActionResult GetHistory(string screen, string id)
        {
            try
            {
                var result = _common.GetHistory(screen, id);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });

                return Ok(new { status = CAPMessages.Status, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


        [HttpGet("GetDiscountedStudentList")]
        public IActionResult GetDiscountedStudentList(int usertype, int centeradminid, int ISSuperAdmin = 0)
        {
            try
            {
                var result = _common.GetDiscountedStudentList(usertype, centeradminid, ISSuperAdmin);
                if (result == null)
                    return StatusCode(StatusCodes.Status204NoContent, new { status = StatusCodes.Status204NoContent, message = CAPMessages.Norecords });
                else if(result.ToString()==string.Empty)
                
                    return StatusCode(StatusCodes.Status200OK, new { status = StatusCodes.Status200OK, message = result });
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = StatusCodes.Status500InternalServerError, message = ex.Message });
            }
        }


    }
}
