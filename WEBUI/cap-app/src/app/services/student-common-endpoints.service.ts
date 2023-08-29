import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddExam, IAddExamId } from '../models/interfaces/add-exam';
import { AuthenticationService } from './authentication.service';
import { EndpointFactory } from './endpoint-factory.service';
import { ToasterService } from './toaster.service';

// @Injectable({
//   providedIn: "root",
// })
@Injectable()
export class StudentCommonEndpointsService extends EndpointFactory {
  constructor(protected authenticationService: AuthenticationService, protected http: HttpClient, protected messageService: MessageService, injector: Injector, toasterService: ToasterService
  ) {
    //  this.user = this.authenticationService.userValue;
    super(http, messageService, injector, toasterService)

  }


  private getSubtopicsbybatchidApiMethod = "/api/Common/GetSubtopicsbybatchid";
  private getTopicsbybatchidApiMethod = "/api/Common/Gettopicsbybatchid";
  private gettopicsHwbybatchidApiMethod = "/api/Common/GettopicsHwbybatchid";
  private getSubtopicsHwbybatchidApiMethod =
    "/api/Common/GetSubtopicsHwbybatchid";
  private getHomeWorksbybatchidApiMethod = "/api/Common/GetHomeWorksbybatchid";
  private addExamApiMethod = "/api/Common/AddExam";
  private updateExamApiMethod = "/api/Common/UpdateExam";
  private addSATJumbleMathsApiMethod = "/api/Common/AddSATJumbleMaths";
  private updateSATJumbleMathsApiMethod = "/api/Common/UpdateSATJumbleMaths";
  private addSATJumbleEnglishApiMethod = "/api/Common/AddSATJumbleEnglish";
  private updateSATJumbleEnglishApiMethod = "/api/Common/UpdateSATJumbleEnglish";
  private updateEnglishExamApiMethod = "/api/Common/UpdateEnglishExam";
  private addEnglishExamApiMethod = "/api/Common/AddEnglishExam";
  private addHomeworkApiMethod = "/api/Common/AddHomework";
  private updateHomeWorkApiMethod = "/api/Common/UpdateHomeWork";
  private addEnglishHomeworkApiMethod = "/api/Common/AddEnglishHomework";
  private updateEnglishHomeWorkApiMethod = "/api/Common/UpdateEnglishHomeWork";
  private getHomeworkQuestionsListApiMethod = "/api/Common/GetHomeworkQuestionsList";
  private homeWorkOtherSubjectsQuestionsApiMethod = "/api/Common/HomeWorkOtherSubjectsQuestions";
  private getSATExamQuestionsListApiMethod = "/api/Common/GetSATExamQuestionsList";
  private getSATExamEnglishQuestionsListApiMethod = "/api/Common/GetSATExamEnglishQuestionsList";
  private getSATExamJumbleEnglishQuestionsListApiMethod = "/api/Common/GetSATExamJumbleEnglishQuestionsList";
  private getSATExamJumbleMathsQuestionsListApiMethod = '/api/Common/GetSATExamJumbleMathsQuestionsList';
  private addSatApiMethod = "/api/Common/AddSAT";
  private updateSatApiMethod = "/api/Common/UpdateSAT";
  private addEnglishSATTestApiMethod = "/api/Common/AddEnglishSATTest";
  private updateEnglishSATApiMethod = "/api/Common/UpdateEnglishSAT";
  private getPracticeTestExamReportApiMethod = "/api/Common/GetPracticeExamReport";
  private getSATTestReportReportApiMethod = '/api/Common/GetSATTestReport';
  private getSATEnglishPichartReportApiMethod = '/api/Common/GetSATEnglishPichartReport';
  private getSATJumbleEnglishPichartReportApiMethod = '/api/Common/GetSATJumbleEnglishPichartReport';
  private getSATTestJumblePichartApiMethod = '/api/Common/GetSATTestJumblePichart';
  private getPracticeEnglishExamReportApiMethod = '/api/Common/GetPracticeEnglishExamReport';
  private sendEmailForResetPasswordApiMethod = "/api/Student/SendEmailForResetPassword";
  private getVerificationcodeApiMethod = "/api/Student/GetVerificationcode";
  private updatePasswordApiMethod = "/api/Student/UpdatePassword";
  private updateStudentProfileApiMethod = "/api/Student/UpdateProfile";
  private updateUserProfileApiMethod = "/api/User/UpdateProfile";
  private messageSentApiMethod = "/api/Student/MessageSent";
  private addExamIdsApiMethod = "/api/Common/AddExamIds";
  private addEnglishExamIdsApiMethod = "/api/Common/AddEnglishExamIds";
  private getPracticeExamReportQuestionsApiMethod = '/api/Common/GetPracticeExamReportQuestions';
  private getSATTestReportQuestionsApiMethod = '/api/Common/GetSATTestReportQuestions';
  private sendEmailForTestDetailsApiMethod = '/api/Common/SendEmailForTestDetails';
  private getFranchisebasedonlattitudeApiMethod = '/api/Student/GetFranchisebasedonlattitude';
  private getPracticeSATTestScoresApiMethod = '/api/Common/GetPracticeSATTestScores';
  private getSubtopiccountApiMethod = '/api/Common/GetSubtopiccount';
  private getZoomLinkApiMethod = '/api/Common/GetZoomLink';
  private getPracticeExamScoreApiMethod = '/api/Common/GetPracticeExamScore';
  private getPracticeSATExamIdsApiMethod = '/api/Common/GetPracticeSATExamIds';
  private getPracticeExamCUMReportApiMethod = '/api/Common/GetPracticeExamCUMReport';
  private getPracticeExamSATEnglishReportApiMethod = '/api/Common/PracticeExamSATEnglishReport';
  private getPracticeExamTopicssubtopicscoreApiMethod = '/api/Common/GetPracticeExamTopicssubtopicscore';
  private getPracticeExamEnglishScoreApiMethod = '/api/Common/GetPracticeExamEnglishScore';
  private getPracticeExamEnglishTopicsandsubtopicsScoreApiMethod = '/api/Common/GetPracticeExamEnglishTopicsandsubtopicsScore';
  private getScorecardanswerersListApiMethod = '/api/Common/GetScorecardanswerersList';
  private getEnglishScorecardanswerersListApiMethod = '/api/Common/GetEnglishScorecardanswerersList';

  // getSubtopicsbybatchidApiMethod
  getSubtopicsbybatchid(StudentId: any, BatchId: any): Observable<any[]> {
    const options = {
      params: {
        StudentId,
        BatchId
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getSubtopicsbybatchidApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSubtopicsbybatchid(StudentId, BatchId))
      })
  }

  // getSubtopicsHwbybatchidApiMethod
  getSubtopicsHwbybatchid(BatchId: any): Observable<any[]> {
    const options = {
      params: {
        BatchId
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getSubtopicsHwbybatchidApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSubtopicsHwbybatchid(BatchId))
      })
  }

  // getHomeWorksbybatchidApiMethod
  getHomeWorksbybatchid(BatchId: any): Observable<any[]> {
    const options = {
      params: {
        BatchId
      }
    };
    return this.http.get<any[]>(`${environment.apiUrl}${this.getHomeWorksbybatchidApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getHomeWorksbybatchid(BatchId))
      })
  }

  // getTopicsbybatchidApiMethod
  getTopicsbybatchid(StudentId: any, BatchId: any, SubjectId: any): Observable<any[]> {
    const options = {
      params: {
        StudentId,
        BatchId,
        SubjectId
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getTopicsbybatchidApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getTopicsbybatchid(StudentId, BatchId, SubjectId))
      })
  }

  // gettopicsHwbybatchidApiMethod
  getTopicsHwbybatchid(BatchId: any, SubjectId: any): Observable<any[]> {
    const options = {
      params: {
        BatchId,
        SubjectId
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.gettopicsHwbybatchidApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getTopicsHwbybatchid(BatchId, SubjectId))
      })
  }

  // get questions list for maths test
  getHomeworkQuestionsList(SubjectId: string, TopicId: string, SubTopicId: string, HomeWorkIds: string, Ishomework: string): Observable<any[]> {
    const options = {
      params: {
        SubjectId,
        TopicId,
        SubTopicId,
        HomeWorkIds,
        Ishomework
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getHomeworkQuestionsListApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getHomeworkQuestionsList(SubjectId, TopicId, SubTopicId, HomeWorkIds, Ishomework))
      })
  }
  // get questions list for english test
  homeWorkOtherSubjectsQuestions(SubjectId: string, TopicId: string, SubTopicId: string, HomeWorkIds: string, Ishomework: string): Observable<any[]> {
    const options = {
      params: {
        SubjectId,
        TopicId,
        SubTopicId,
        HomeWorkIds,
        Ishomework
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.homeWorkOtherSubjectsQuestionsApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.homeWorkOtherSubjectsQuestions(SubjectId, TopicId, SubTopicId, HomeWorkIds, Ishomework))
      })
  }

  // get questions list for SAT maths test
  getSATExamQuestionsList(UserId: any, SubjectId: any, BatchId: any, CalculatorId: any): Observable<any[]> {
    const options = {
      params: {
        UserId,
        SubjectId,
        BatchId,
        CalculatorId
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getSATExamQuestionsListApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSATExamQuestionsList(UserId, SubjectId, BatchId, CalculatorId))
      })
  }

  // get questions list for SAT english test
  getSATExamEnglishQuestionsList(UserId: any, SubjectId: any, BatchId: any, SectionId: any): Observable<any[]> {
    const options = {
      params: {
        UserId,
        SubjectId,
        BatchId,
        SectionId
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getSATExamEnglishQuestionsListApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSATExamEnglishQuestionsList(UserId, SubjectId, BatchId, SectionId))
      })
  }

  // get questions list for Jumble english test
  getSATExamJumbleEnglishQuestionsList(UserId: any, SubjectId: any, BatchId: any, SectionId: any): Observable<any[]> {
    const options = {
      params: {
        UserId,
        SubjectId,
        BatchId,
        SectionId
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getSATExamJumbleEnglishQuestionsListApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSATExamJumbleEnglishQuestionsList(UserId, SubjectId, BatchId, SectionId))
      })
  }

  // get questions list for Jumble Maths test
  getSATExamJumbleMathsQuestionsList(UserId: any, SubjectId: any, BatchId: any, CalculatorId: any): Observable<any[]> {
    const options = {
      params: {
        UserId,
        SubjectId,
        BatchId,
        CalculatorId
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getSATExamJumbleMathsQuestionsListApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSATExamJumbleMathsQuestionsList(UserId, SubjectId, BatchId, CalculatorId))
      })
  }

  // get practice test report
  getPracticerTestExamReport(StudentId: any): Observable<any> {
    const queryParams = `?StudentId=${StudentId}`;
    return this.http.get<any>(`${environment.apiUrl}${this.getPracticeTestExamReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPracticerTestExamReport(StudentId))
      })
  }

  // get practice test report
  getSATTestReportReport(StudentId: any): Observable<any> {
    const queryParams = `?StudentId=${StudentId}`;
    return this.http.get<any>(`${environment.apiUrl}${this.getSATTestReportReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSATTestReportReport(StudentId))
      })
  }

  // get maths SAT test report
  getSATEnglishPichartReport(StudentId: any): Observable<any> {
    const queryParams = `?StudentId=${StudentId}`;
    return this.http.get<any>(`${environment.apiUrl}${this.getSATEnglishPichartReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSATEnglishPichartReport(StudentId))
      })
  }

  // get english Jumble SAT test report
  getSATJumbleEnglishPichartReport(StudentId: any): Observable<any> {
    const queryParams = `?StudentId=${StudentId}`;
    return this.http.get<any>(`${environment.apiUrl}${this.getSATJumbleEnglishPichartReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSATJumbleEnglishPichartReport(StudentId))
      })
  }

  // get Jumble Maths SAT test report
  getSATTestJumblePichart(StudentId: any): Observable<any> {
    const queryParams = `?StudentId=${StudentId}`;
    return this.http.get<any>(`${environment.apiUrl}${this.getSATTestJumblePichartApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSATTestJumblePichart(StudentId))
      })
  }

  // get english practice test report
  getPracticeEnglishExamReport(StudentId: any): Observable<any> {
    const queryParams = `?StudentId=${StudentId}`;
    return this.http.get<any>(`${environment.apiUrl}${this.getPracticeEnglishExamReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPracticeEnglishExamReport(StudentId))
      })
  }


  // getVerificationcodeApiMethod
  getVerificationcode(EmailId: string, Verification: string): Observable<any[]> {
    const options = {
      params: {
        EmailId,
        Verification
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getVerificationcodeApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getVerificationcode(EmailId, Verification))
      })
  }


  // getPracticeExamReportQuestionsApiMethod
  getPracticeExamReportQuestions(StudentId: string, ExamId: string): Observable<any[]> {
    const options = {
      params: {
        StudentId,
        ExamId
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getPracticeExamReportQuestionsApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPracticeExamReportQuestions(StudentId, ExamId))
      })
  }

  // getSATTestReportQuestionsApiMethod
  getSATTestReportQuestions(StudentId: string, ExamId: string): Observable<any[]> {
    const options = {
      params: {
        StudentId,
        ExamId
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getSATTestReportQuestionsApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSATTestReportQuestions(StudentId, ExamId))
      })
  }

  // getFranchisebasedonlattitudeApiMethod
  getFranchisebasedonlattitude(Lattitude: any, Longitude: any): Observable<any[]> {

    const queryParams = `?Lattitude=${Lattitude}&Longitude=${Longitude}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getFranchisebasedonlattitudeApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getFranchisebasedonlattitude(Lattitude, Longitude))
      })
  }

  // sendEmailForResetPasswordApiMethod
  sendEmailForResetPassword(EmailId: string) {
    const queryParams = `/${EmailId}`;
    return this.http.post<any>(`${environment.apiUrl}${this.sendEmailForResetPasswordApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.sendEmailForResetPassword(EmailId))
      })
  }

  // updatePasswordApiMethod
  updatePassword(NewPassword: string, UserName: string): Observable<any> {
    const queryParams = `?NewPassword=${NewPassword}&UserName=${UserName}`;
    return this.http.post(`${environment.apiUrl}${this.updatePasswordApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updatePassword(NewPassword, UserName))
      })

  }

  // getPracticeSATTestScoresApiMethod
  getPracticeSATTestScores(StudentId: any, PracticeorSAT: any): Observable<any[]> {
    const queryParams = `?StudentId=${StudentId}&PracticeorSAT=${PracticeorSAT}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getPracticeSATTestScoresApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPracticeSATTestScores(StudentId, PracticeorSAT))
      })

  }

  // getSubtopiccountApiMethod
  getSubTopicCount(BatchId: any, StudentId: any): Observable<boolean> {
    const queryParams = `?BatchId=${BatchId}&StudentId=${StudentId}`;
    return this.http.get<boolean>(`${environment.apiUrl}${this.getSubtopiccountApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSubTopicCount(BatchId, StudentId))
      })

  }

  // getSubtopiccountApiMethod
  getZoomLink(BatchId: any): Observable<boolean> {
    const queryParams = `?BatchId=${BatchId}`;
    return this.http.get<boolean>(`${environment.apiUrl}${this.getZoomLinkApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getZoomLink(BatchId))
      })

  }

  // getPracticeExamScoreApiMethod
  getPracticeExamScore(StudentId: any, ExamId: any, ExamTypeid: any): Observable<any[]> {
    const queryParams = `?StudentId=${StudentId}&ExamId=${ExamId}&ExamTypeid=${ExamTypeid}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getPracticeExamScoreApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPracticeExamScore(StudentId, ExamId, ExamTypeid))
      })

  }

  // getPracticeExamScoreApiMethod
  getPracticeSATExamEnglishScore(StudentId: any, ExamId: any, ExamTypeid: any): Observable<any[]> {
    const queryParams = `?StudentId=${StudentId}&ExamId=${ExamId}&ExamTypeid=${ExamTypeid}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getPracticeExamEnglishScoreApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPracticeSATExamEnglishScore(StudentId, ExamId, ExamTypeid))
      })

  }

  // getPracticeExamCUMReportApiMethod
  getPracticeExamCUMReport(StudentId: any, ExamTypeId: any): Observable<any[]> {
    const queryParams = `?StudentId=${StudentId}&ExamTypeid=${ExamTypeId}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getPracticeExamCUMReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPracticeExamCUMReport(StudentId, ExamTypeId))
      })

  }

  // getPracticeExamCUMReportApiMethod
  getPracticeSATEnglishExamCumulativeReport(StudentId: any, ExamTypeId: any): Observable<any[]> {
    const queryParams = `?StudentId=${StudentId}&ExamTypeid=${ExamTypeId}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getPracticeExamSATEnglishReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPracticeSATEnglishExamCumulativeReport(StudentId, ExamTypeId))
      })

  }

  // getPracticeExamCUMTopicSubTopicReportApiMethod
  getPracticeExamTopicsSubtopicScore(StudentId: any, ExamId: any, ExamTypeId: any): Observable<any[]> {
    const queryParams = `?StudentId=${StudentId}&ExamId=${ExamId}&ExamTypeid=${ExamTypeId}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getPracticeExamTopicssubtopicscoreApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPracticeExamTopicsSubtopicScore(StudentId, ExamId, ExamTypeId))
      })

  }

  // getPracticeExamCUMTopicSubTopicReportApiMethod for english score card
  getPracticeEnglishTopicsandsubtopicsScore(StudentId: any, ExamId: any, ExamTypeId: any): Observable<any[]> {
    const queryParams = `?StudentId=${StudentId}&ExamId=${ExamId}&ExamTypeid=${ExamTypeId}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getPracticeExamEnglishTopicsandsubtopicsScoreApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPracticeEnglishTopicsandsubtopicsScore(StudentId, ExamId, ExamTypeId))
      })

  }

  // getScorecardanswerersListApiMethod
  getScorecardanswerersList(StudentId: any, ExamId: any, Name: string, Type: string, ExamTypeId: any): Observable<any[]> {
    const queryParams = `?StudentId=${StudentId}&ExamId=${ExamId}&Name=${Name}&Type=${Type}&ExamTypeid=${ExamTypeId}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getScorecardanswerersListApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getScorecardanswerersList(StudentId, ExamId, Name, Type, ExamTypeId))
      })

  }

  // getEnglishScorecardanswerersListApiMethod 
  getEnglishScorecardanswerersList(StudentId: any, ExamId: any, Name: string, Type: string, ExamTypeId: any): Observable<any[]> {
    const queryParams = `?StudentId=${StudentId}&ExamId=${ExamId}&Name=${Name}&Type=${Type}&ExamTypeid=${ExamTypeId}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getEnglishScorecardanswerersListApiMethod}` + queryParams, {}).catch(error => {
      return this.handleErrorCommon(error, () => this.getEnglishScorecardanswerersList(StudentId, ExamId, Name, Type, ExamTypeId))
    })

  }

  // getPracticeSATExamIdsApiMethod
  getPracticeSATExamIds(StudentId: any, ExamtypeId: any, SubjectId: any): Observable<any[]> {
    const queryParams = `?StudentId=${StudentId}&ExamtypeId=${ExamtypeId}&SubjectId=${SubjectId}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getPracticeSATExamIdsApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPracticeSATExamIds(StudentId, ExamtypeId, SubjectId))
      })

  }

  // sendEmailForTestDetailsApiMethod
  sendEmailForTestDetails(BatchId: any, SubjectId: any, StudentId: any, Name: any, ExamtypeId: any, ExamId: any): Observable<any[]> {
    const queryParams = `?BatchId=${BatchId}&SubjectId=${SubjectId}&StudentId=${StudentId}&Name=${Name}&ExamtypeId=${ExamtypeId}&ExamId=${ExamId}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.sendEmailForTestDetailsApiMethod}` + queryParams, {}).catch(error => {
      return this.handleErrorCommon(error, () => this.sendEmailForTestDetails(BatchId, SubjectId, StudentId, Name, ExamtypeId, ExamId))
    })

  }

  // Add exam
  addExam(addExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.addExamApiMethod}`, addExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addExam(addExam))
      })
  }

  // Jumble maths test Add exam api
  addSATJumbleMaths(addExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.addSATJumbleMathsApiMethod}`, addExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addSATJumbleMaths(addExam))
      })
  }

  // Jumble Maths test Update exam api
  updateSATJumbleMaths(updateExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.updateSATJumbleMathsApiMethod}`, updateExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateSATJumbleMaths(updateExam))
      })
  }

  // Jumble english test Add exam api
  addSATJumbleEnglish(addExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.addSATJumbleEnglishApiMethod}`, addExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addSATJumbleEnglish(addExam))
      })
  }

  // Jumble Englsih test Update exam api
  updateSATJumbleEnglish(updateExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.updateSATJumbleEnglishApiMethod}`, updateExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateSATJumbleEnglish(updateExam))
      })
  }

  // Add english exam
  addEnglishExam(addExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.addEnglishExamApiMethod}`, addExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addEnglishExam(addExam))
      })
  }

  // Update exam
  updateExam(updateExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.updateExamApiMethod}`, updateExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateExam(updateExam))
      })
  }

  // Update english exam
  updateEnglishExam(updateExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.updateEnglishExamApiMethod}`, updateExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateEnglishExam(updateExam))
      })
  }

  // Add exam
  addHomework(addExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.addHomeworkApiMethod}`, addExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addHomework(addExam))
      })
  }

  // Add english exam
  addEnglishHomework(addExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.addEnglishHomeworkApiMethod}`, addExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addEnglishHomework(addExam))
      })
  }

  // Update exam
  updateHomeWork(updateExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.updateHomeWorkApiMethod}`, updateExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateHomeWork(updateExam))
      })
  }

  // Update english exam
  updateEnglishHomeWork(updateExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.updateEnglishHomeWorkApiMethod}`, updateExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateEnglishHomeWork(updateExam))
      })
  }

  // Add Sat exam
  addSatExam(addExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.addSatApiMethod}`, addExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addSatExam(addExam))
      })
  }

  // Update SAT exam
  updateSatExam(updateExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.updateSatApiMethod}`, updateExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateSatExam(updateExam))
      })
  }

  // Add Sat english exam
  addEnglishSATTest(addExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.addEnglishSATTestApiMethod}`, addExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addEnglishSATTest(addExam))
      })
  }

  // Update SAT exam
  updateEnglishSAT(updateExam: IAddExam): Observable<IAddExam> {
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.updateEnglishSATApiMethod}`, updateExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateEnglishSAT(updateExam))
      })
  }

  // ApiMethod
  messageSent(phoneNumber: string): Observable<IAddExam> {
    const queryParams = `?phoneNumber=${phoneNumber}`;
    return this.http.post<IAddExam>(`${environment.apiUrl}${this.messageSentApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.messageSent(phoneNumber))
      })
  }

  // updateStudentProfileApiMethod
  updateStudentProfile(Oldemail: string, EmailId: string, firstname: string, lastname: string, phonenumber: string) {
    const queryParams = `?Oldemail=${Oldemail}&EmailId=${EmailId}&firstname=${firstname}&lastname=${lastname}&phonenumber=${phonenumber}`;
    return this.http.put(`${environment.apiUrl}${this.updateStudentProfileApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateStudentProfile(Oldemail, EmailId, firstname, lastname, phonenumber))
      })
  }

  // updateStudentProfileApiMethod
  updateUserProfile(Oldemail: string, EmailId: string, firstname: string, lastname: string, phonenumber: string) {
    const queryParams = `?Oldemail=${Oldemail}&EmailId=${EmailId}&firstname=${firstname}&lastname=${lastname}&phonenumber=${phonenumber}`;
    return this.http.put(`${environment.apiUrl}${this.updateUserProfileApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateUserProfile(Oldemail, EmailId, firstname, lastname, phonenumber))
      })
  }

  // Add math exam ids
  addExamIds(addExam: IAddExamId): Observable<IAddExamId> {
    return this.http.post<IAddExamId>(`${environment.apiUrl}${this.addExamIdsApiMethod}`, addExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addExamIds(addExam))
      })
  }

  // Add english exam ids
  addEnglishExamId(addExam: IAddExamId): Observable<IAddExamId> {
    return this.http.post<IAddExamId>(`${environment.apiUrl}${this.addEnglishExamIdsApiMethod}`, addExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addEnglishExamId(addExam))
      })
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err) {
      if (err && err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMessage = `An error occurred: ${err.error.message}`;
      } else if (err) {
        errorMessage = `${err['text']}`;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage = `Server returned code: ${err && err.status}, error message is: ${err.message
          }`;
      }
      return throwError(errorMessage);
    }
  }
}
