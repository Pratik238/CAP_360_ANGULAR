import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { ICommonDropdown } from '../models/interfaces/common-dropdown';
import { SingleParamsModel } from '../models/interfaces/single-param-model';
import { IAdminTableParams, IViewRecord, IChangeStatus, IAddQuestions, IAssignBatch, IAddStudentAttendance, IAssignHomework, IUpdateQuestions, IAssignSATExam } from '../models/interfaces/admin-table';
import { AuthenticationService } from './authentication.service';
import { User } from '../models/interfaces';
import { catchError } from 'rxjs/operators';
import { IEnglishQuestion } from '../models/interfaces/english-questions';
import { IStudentInfo } from '../models/interfaces/student-info';
import { EndpointFactory } from './endpoint-factory.service';
import { MessageService } from 'primeng/api';
import { ToasterService } from './toaster.service';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class AdminCommonEndpointsService extends EndpointFactory {
  user: User;

  constructor(protected authenticationService: AuthenticationService, protected http: HttpClient, protected messageService: MessageService, injector: Injector, toasterService: ToasterService) {
    super(http, messageService, injector, toasterService)
    this.user = this.authenticationService.userValue;
  }

  private commonDropdownsApiMethod = '/api/Common/Dropdowns';
  private commonGetListApiMethod = '/api/Common/GetList';
  private getMathQuestions = '/api/Common/MathsQuestionList';
  private getEnglishQuestions = '/api/Common/EnglishQuestionList';
  private GetAllEnglishQuestionsList = '/api/Common/EnglishQuestionList';
  private commonAddNewApiMethod = '/api/Common/Addnew';
  private commonGetRecordByIdApiMethod = '/api/Common/Getrecordbyid';
  private commonChangeStatusApiMethod = '/api/Common/changestatus';
  private commonDeleteRecordApiMethod = '/api/Common/Deleterecord';
  private franchiseDeleteRecordApiMethod = '/api/Common/FranchiseDelete';
  private commonRestoreRecordApiMethod = '/api/Common/Restorerecord';
  private updateRecordCommonApiMethod = '/api/Common/Updatedata';
  private updateFranchiseRecordCommonApiMethod = '/api/Common/UpdateFranchise';
  private createFranchiseRecordCommonApiMethod = '/api/Common/AddFranchise';
  private commonDeletedListApiMethod = '/api/Common/GetDeletedList';
  private commonGetTestTimeApiMethod = '/api/Common/GetTestTime';
  private commonGetTopicsApiMethod = '/api/Common/GetTopics';
  private commonGetUsersListApiMethod = '/api/Common/GetUsersList';
  private commonGetQuestionsListApiMethod = '/api/Common/GetQuestionsList';
  private commonGetEnglishQuestionsListApiMethod = '/api/Common/GetEnglishQuestionsList';
  private addStudentApiMethod = '/api/Student/Addstudent';
  private addUserApiMethod = '/api/User';
  private getUserApiMethod = '/api/User';
  private removeUserApiMethod = '/api/User/Delete';
  private removeStudentApiMethod = '/api/Student/DeleteUser';
  private addQuestionsApiMethod = '/api/Common/AddQuestions';
  private updateQuestionsApiMethod = '/api/Common/UpdateQuestions';
  private assignBatchApiMethod = '/api/Common/Batchassign';
  private addAttendenceApiMethod = '/api/Common/AddAttendance';
  private assignHomeworkApiMethod = '/api/Common/Homeworkassign';
  private getGeneralListApiMethod = '/api/Common/GetGeneralList';
  private studentChangePasswordApiMethod = '/api/Student/ChangePassword';
  private updateUserPasswordApiMethod = '/api/User/ChangePassword';
  private updateStudentInfoApiMethod = '/api/Student/UpdateStudentInfo';
  private getSubtopicsbybatchidApiMethod = '/api/Common/GetSubtopicsbybatchid';
  private getTopicsbybatchidApiMethod = '/api/Common/Gettopicsbybatchid';
  private gettopicsHwbybatchidApiMethod = '/api/Common/GettopicsHwbybatchid';
  private getSubtopicsHwbybatchidApiMethod = '/api/Common/GetSubtopicsHwbybatchid';
  private getHomeWorksbybatchidApiMethod = '/api/Common/GetHomeWorksbybatchid';
  private getbatchidsbytutoridApiMethod = '/api/Common/Getbatchidsbytutorid';
  private getAttendancereportApiMethod = '/api/Common/GetAttendancereport';
  private assignSATExamApiMethod = '/api/Common/SATExamassign';
  private getAdminPracticeExamReportApiMethod = '/api/Common/GetAdminPracticeExamReport';
  private getAdminSATTestReportApiMethod = '/api/Common/GetAdminSATTestReport';
  private getAdminSATTesJumbletReportApiMethod = '/api/Common/GetAdminSATTesJumbletReport';
  private getHomeworkReporttApiMethod = '/api/Common/GetHomeworkReport';
  private getAllQuestionbyexamidApiMethod = '/api/Common/GetAllQuestionbyexamid';
  private getStudentListBasedonCenterApiMethod = '/api/Common/GetStudentListBasedonCenter';
  private getVideosbasedonBatchApiMethod = '/api/Common/GetVideosbasedonBatch';
  private addEnglishQuestionsApiMethod = '/api/Common/AddEnglishQuestions';
  private updateEnglishQuestionsApiMethod = '/api/Common/UpdateEnglishQuestions';
  private getHomeworkEnglishReportApiMethod = '/api/Common/GetHomeworkEnglishReport';
  private getAllEnglishQuestionbyexamidApiMethod = '/api/Common/GetAllEnglishQuestionbyexamid';
  private getAdminPracticeExamSATEnglishReportApiMethod = '/api/Common/GetAdminPracticeExamSATEnglishReport';
  private GetDiscountedStudentList = '/api/Common/GetDiscountedStudentList';
  private UpdateStudentDiscountInfoApiMethod = '/api/Student/UpdateStudentDiscountInfo';
  private bookNowDiagnosticeTest = '/api/Student/AddDiagnstic';
  private contactUsEndPt = '/api/student/SendEmailForContactusDetails';
  private studentContactUs = '/api/Common/SendEmailContactus';


  SingleParamModel: SingleParamsModel = new SingleParamsModel();

  getDropdowns(commonDropdown: ICommonDropdown): Observable<ICommonDropdown[]> {
    return this.http.post<ICommonDropdown[]>(`${environment.apiUrl}${this.commonDropdownsApiMethod}`, commonDropdown)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getDropdowns(commonDropdown))
      })
  }

  getRecordById(viewRecord: IViewRecord): Observable<ICommonDropdown> {
    return this.http.post<ICommonDropdown>(`${environment.apiUrl}${this.commonGetRecordByIdApiMethod}`, viewRecord).catch(error => {
      return this.handleErrorCommon(error, () => this.getRecordById(viewRecord))
    })

    // .pipe(catchError(this.handleError));
  }

  changeStatus(viewRecord: IChangeStatus): Observable<IChangeStatus> {
    return this.http.post<IChangeStatus>(`${environment.apiUrl}${this.commonChangeStatusApiMethod}`, viewRecord).catch(error => {
      return this.handleErrorCommon(error, () => this.changeStatus(viewRecord))
    })
  }

  deleteRecord(deleteRecord: IChangeStatus): Observable<IChangeStatus> {
    return this.http.post<IChangeStatus>(`${environment.apiUrl}${this.commonDeleteRecordApiMethod}`, deleteRecord).catch(error => {
      return this.handleErrorCommon(error, () => this.deleteRecord(deleteRecord))
    })
  }



  // franchiseDeleteRecord(deleteRecord: IChangeStatus, batchId, centeradminId): Observable<IChangeStatus> {
  //   const queryParams = `?FranchiseId=${batchId}&CenteradminId=${centeradminId}`;
  //   return this.http.post<IChangeStatus>(`${environment.apiUrl}${this.franchiseDeleteRecordApiMethod}`, deleteRecord)
  //     .pipe(catchError(this.handleError));
  // }



  franchiseDeleteRecord(batchId, centeradminId): Observable<any> {
    const queryParams = `?FranchiseId=${batchId}&CenteradminId=${centeradminId}`;
    return this.http.post<any>(`${environment.apiUrl}${this.franchiseDeleteRecordApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.franchiseDeleteRecord(batchId, centeradminId))
      })
    // return this.http.post("http://localhost:5000/api/Common/FranchiseDelete?FranchiseId=30&CenteradminId=76", {});
  }

  getCommonLists(entityName: string, orderby: string, orderbyvalue: string, condition: string, status): Observable<any[]> {

    const tokenId = this.user ? this.user.Token : localStorage.getItem('access_token');
    const options = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${tokenId}`
      }),
      params: {
        entityName,
        orderby,
        orderbyvalue,
        condition,
        status
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.commonGetListApiMethod}`, options).catch(error => {
      return this.handleErrorCommon(error, () => this.getCommonLists(entityName, orderby, orderbyvalue, condition, status))
    });
  }

  getAllEnglishQuestionsList(filters): Observable<any[]> {
    const options = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.user.Token}`
      }),
      params: filters
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.GetAllEnglishQuestionsList}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllEnglishQuestionsList(filters))
      });;
  }

  // get general list
  getGeneralList(entityName: string, orderby: string, orderbyvalue: string, condition: string): Observable<any[]> {
    const options = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.user.Token}`
      }),
      params: {
        entityName,
        orderby,
        orderbyvalue,
        condition
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getGeneralListApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getGeneralList(entityName, orderbyvalue, orderbyvalue, condition))
      });
  }

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
      });
  }

  DiscountedStudentList(usertype: string, centeradminid: any, ISSuperAdmin: any): Observable<any[]> {
    const options = {
      params: {
        usertype,
        centeradminid,
        ISSuperAdmin
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.GetDiscountedStudentList}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.DiscountedStudentList(usertype, centeradminid, ISSuperAdmin))
      });
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
      });
  }
  UpdateStudentDiscountInfoMethod(studentInfo: IStudentInfo) {
    return this.http.put<IStudentInfo>(`${environment.apiUrl}${this.UpdateStudentDiscountInfoApiMethod}`, studentInfo)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.UpdateStudentDiscountInfoMethod(studentInfo))
      });
  }
  // getHomeWorksbybatchidApiMethod
  getHomeWorksbybatchid(BatchId: any): Observable<any[]> {
    const queryParams = `?BatchId=${BatchId}`;
    return this.http.get<any>(`${environment.apiUrl}${this.getHomeWorksbybatchidApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getHomeWorksbybatchid(BatchId))
      });
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
      });
  }

  // getAdminPracticeExamReportApiMethod
  getAdminPracticeExamReport(Id: any, Usertype: any): Observable<any[]> {
    const queryParams = `?Id=${Id}&Usertype=${Usertype}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getAdminPracticeExamReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAdminPracticeExamReport(Id, Usertype))
      });

  }

  // getAdminSATTestReportApiMethod
  getAdminSATTestReport(Id: any, Usertype: any): Observable<any[]> {
    const queryParams = `?Id=${Id}&Usertype=${Usertype}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getAdminSATTestReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAdminSATTestReport(Id, Usertype))
      });
  }

  // getAdminSATTesJumbletReportApiMethod
  getAdminSATTesJumbletReport(Id: any, Usertype: any): Observable<any[]> {
    const queryParams = `?Id=${Id}&Usertype=${Usertype}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getAdminSATTesJumbletReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAdminSATTesJumbletReport(Id, Usertype))
      });
  }

  // getHomeworkReporttApiMethod
  getHomeworkReport(Id: any, Usertype: any): Observable<any[]> {
    const queryParams = `?Id=${Id}&Usertype=${Usertype}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getHomeworkReporttApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getHomeworkReport(Id, Usertype))
      });
  }

  // getHomeworkEnglishReportApiMethod
  getHomeworkEnglishReport(Id: any, Usertype: any): Observable<any[]> {
    const queryParams = `?Id=${Id}&Usertype=${Usertype}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getHomeworkEnglishReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getHomeworkEnglishReport(Id, Usertype))
      });
  }

  // getAllEnglishQuestionbyexamidApiMethod
  getAllEnglishQuestionbyexamid(ExamId: any, Examtype: any): Observable<any[]> {
    const queryParams = `?ExamId=${ExamId}&Examtype=${Examtype}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getAllEnglishQuestionbyexamidApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllEnglishQuestionbyexamid(ExamId, Examtype))
      });
  }

  // getAdminPracticeExamSATEnglishReportApiMethod
  getAdminPracticeExamSATEnglishReport(Id: any, Usertype: any, ExamTypeId: any): Observable<any[]> {
    const queryParams = `?Id=${Id}&Usertype=${Usertype}&ExamTypeId=${ExamTypeId}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getAdminPracticeExamSATEnglishReportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAdminPracticeExamSATEnglishReport(Id, Usertype, ExamTypeId))
      });
  }

  // getAllQuestionbyexamidApiMethod
  getAllQuestionByExamId(ExamId: any, Examtype: any): Observable<any[]> {
    const queryParams = `?ExamId=${ExamId}&Examtype=${Examtype}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getAllQuestionbyexamidApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllQuestionByExamId(ExamId, Examtype))
      });
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
      });
  }


  getTopics(SubjectId: string, orderby: string, orderbyvalue: string, condition: string): Observable<any[]> {
    const options = {
      params: {
        SubjectId,
        orderby,
        orderbyvalue,
        condition
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.commonGetTopicsApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getTopics(SubjectId, orderby, orderbyvalue, condition))
      });
  }

  getUsersList(usertype: string, centeradminid: any, ISSuperAdmin: any, IsActive = "Active"): Observable<any[]> {
    let options = {};
    if (IsActive == "Active") {
      options = {
        params: {
          usertype,
          centeradminid,
          ISSuperAdmin,
          IsActive: true
        }
      };
    } else {
      options = {
        params: {
          usertype,
          centeradminid,
          ISSuperAdmin,
          IsActive: false
        }
      };
    }
    return this.http.get<any[]>(`${environment.apiUrl}${this.commonGetUsersListApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getUsersList(usertype, centeradminid, ISSuperAdmin, IsActive))
      });
  }

  removeItem(id: string) {
    const queryParams = `/${id}`;
    return this.http.put(`${environment.apiUrl}${this.removeUserApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.removeItem(id))
      });
  }

  removeStudent(Studentid: number) {
    const queryParams = `?Studentid=${Studentid}`;
    return this.http.put(`${environment.apiUrl}${this.removeStudentApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.removeStudent(Studentid))
      });
  }

  // get questions list for test
  getQuestionsList(UserId: any, SubjectId: string, TopicId: string, CalculatorId: string, SubTopicIds: string, Ishomework: string): Observable<any[]> {
    const options = {
      params: {
        UserId,
        SubjectId,
        TopicId,
        SubTopicIds,
        CalculatorId,
        Ishomework
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.commonGetQuestionsListApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getQuestionsList(UserId, SubjectId, TopicId, CalculatorId, SubTopicIds, Ishomework))
      });
  }

  // get questions list for english test
  getEnglishQuestionsList(UserId: any, SubjectId: any, TopicId: string, SectionId: string, SubTopicIds: string, Ishomework: string): Observable<any[]> {
    const options = {
      params: {
        UserId,
        SubjectId,
        TopicId,
        SubTopicIds,
        SectionId,
        Ishomework
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.commonGetEnglishQuestionsListApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getEnglishQuestionsList(UserId, SubjectId, TopicId, SectionId, SubTopicIds, Ishomework))
      });
  }

  getDeletedLists(entityName: string, orderby: string, orderbyvalue: string, condition: string): Observable<any[]> {
    const options = {
      params: {
        entityName,
        orderby,
        orderbyvalue,
        condition
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.commonDeletedListApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getDeletedLists(entityName, orderby, orderbyvalue, condition))
      });
  }

  getTestTime(): Observable<any> {
    const options = {
      headers: {
        'x-refresh': 'true'
      }
    };
    return this.http.get<any>(`${environment.apiUrl}${this.commonGetTestTimeApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getTestTime())
      });
  }

  getUsers(): Observable<any> {
    const options = {
      headers: {
        'x-refresh': 'true'
      }
    };
    return this.http.get<any>(`${environment.apiUrl}${this.getUserApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getUsers())
      });
  }

  addNewList(admintables: IAdminTableParams): Observable<IAdminTableParams> {
    return this.http.post<IAdminTableParams>(`${environment.apiUrl}${this.commonAddNewApiMethod}`, admintables)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addNewList(admintables))
      });
  }

  addContactInfo(admintables: IAdminTableParams): Observable<IAdminTableParams> {
    return this.http.post<IAdminTableParams>(`${environment.apiUrl}${this.studentContactUs}`, admintables)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addContactInfo(admintables))
      });
  }

  studentChangePassword(OldPassword: string, NewPassword: string, UserName: string) {
    const queryParams = `?OldPassword=${OldPassword}&NewPassword=${NewPassword}&UserName=${UserName}`;
    return this.http.post(`${environment.apiUrl}${this.studentChangePasswordApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.studentChangePassword(OldPassword, NewPassword, UserName))
      });
  }

  updateUserPassword(OldPassword: string, NewPassword: string, UserName: string) {
    const queryParams = `?OldPassword=${OldPassword}&NewPassword=${NewPassword}&UserName=${UserName}`;
    return this.http.post(`${environment.apiUrl}${this.updateUserPasswordApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateUserPassword(OldPassword, NewPassword, UserName))
      });
  }

  updateStudentInfo(studentInfo: IStudentInfo) {
    return this.http.put<IStudentInfo>(`${environment.apiUrl}${this.updateStudentInfoApiMethod}`, studentInfo)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateStudentInfo(studentInfo))
      });
  }

  addQuestions(addQuetion: IAddQuestions): Observable<IAddQuestions> {
    return this.http.post<IAddQuestions>(`${environment.apiUrl}${this.addQuestionsApiMethod}`, addQuetion)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addQuestions(addQuetion))
      });
  }

  updateQuestions(addQuetion: IUpdateQuestions): Observable<IUpdateQuestions> {
    return this.http.post<IUpdateQuestions>(`${environment.apiUrl}${this.updateQuestionsApiMethod}`, addQuetion)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateQuestions(addQuetion))
      });
  }

  addEnglishQuestions(addQuetion: IEnglishQuestion): Observable<IEnglishQuestion> {
    return this.http.post<IEnglishQuestion>(`${environment.apiUrl}${this.addEnglishQuestionsApiMethod}`, addQuetion)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addEnglishQuestions(addQuetion))
      });
  }

  updateEnglishQuestions(addQuetion: IEnglishQuestion): Observable<IEnglishQuestion> {
    return this.http.post<IEnglishQuestion>(`${environment.apiUrl}${this.updateEnglishQuestionsApiMethod}`, addQuetion)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateEnglishQuestions(addQuetion))
      });
  }

  assignBatch(assignBatch: IAssignBatch): Observable<IAssignBatch> {
    return this.http.post<IAssignBatch>(`${environment.apiUrl}${this.assignBatchApiMethod}`, assignBatch)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.assignBatch(assignBatch))
      });
  }

  assignHomework(assignHomework: IAssignHomework): Observable<IAssignHomework> {
    return this.http.post<IAssignHomework>(`${environment.apiUrl}${this.assignHomeworkApiMethod}`, assignHomework)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.assignHomework(assignHomework))
      });
  }

  assignSatExam(assignSatExam: IAssignSATExam): Observable<IAssignSATExam> {
    return this.http.post<IAssignSATExam>(`${environment.apiUrl}${this.assignSATExamApiMethod}`, assignSatExam)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.assignSatExam(assignSatExam))
      });
  }

  addAttendence(attendance: IAddStudentAttendance[]): Observable<IAddStudentAttendance> {
    return this.http.post<IAddStudentAttendance>(`${environment.apiUrl}${this.addAttendenceApiMethod}`, attendance)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addAttendence(attendance))
      });
  }

  addStudent(student: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${this.addStudentApiMethod}`, student)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addStudent(student))
      });
  }
  bookForDiagnosticTest(bookNow: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${this.bookNowDiagnosticeTest}`, bookNow)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.bookForDiagnosticTest(bookNow))
      });
  }
  contactUs(contactUsObj: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${this.contactUsEndPt}`, contactUsObj)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.contactUs(contactUsObj))
      });
  }

  addUser(student: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${this.addUserApiMethod}`, student)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.addUser(student))
      });
  }

  updateUser(student: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}${this.addUserApiMethod}`, student)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateUser(student))
      });
  }

  updateRecord(admintables: IAdminTableParams): Observable<IAdminTableParams> {
    return this.http.post<IAdminTableParams>(`${environment.apiUrl}${this.updateRecordCommonApiMethod}`, admintables)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateRecord(admintables))
      });
  }

  createFranchiseRecord(student: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${this.createFranchiseRecordCommonApiMethod}`, student)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.createFranchiseRecord(student))
      });
  }


  // updateFranchiseRecord(info): Observable<any> {
  //   const queryParams = `?fr=`;
  //   return this.http.post<any>(`${environment.apiUrl}${this.updateFranchiseRecordCommonApiMethod}` + queryParams, info).pipe(catchError(this.handleError));
  //   // return this.http.post("http://localhost:5000/api/Common/FranchiseDelete?FranchiseId=30&CenteradminId=76", {});
  // }

  updateFranchiseRecord(student: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${this.updateFranchiseRecordCommonApiMethod}`, student)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateFranchiseRecord(student))
      });
  }

  restoreRecord(restoreRecord: IChangeStatus): Observable<IChangeStatus> {
    return this.http.post<IChangeStatus>(`${environment.apiUrl}${this.commonRestoreRecordApiMethod}`, restoreRecord)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.restoreRecord(restoreRecord))
      });
  }

  // getbatchidsbytutoridApiMethod
  getbatchidsbytutorid(TutorId: any): Observable<any[]> {
    const options = {
      params: {
        TutorId
      }
    };

    return this.http.get<any[]>(`${environment.apiUrl}${this.getbatchidsbytutoridApiMethod}`, options)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getbatchidsbytutorid(TutorId))
      });
  }

  // getAttendancereportApiMethod
  getAttendanceReport(BatchId: string, FromDate: string, ToDate: string): Observable<any[]> {
    const queryParams = `/${FromDate}/${ToDate}?BatchId=${BatchId}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getAttendancereportApiMethod}` + queryParams, {})
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAttendanceReport(BatchId, FromDate, ToDate))
      });
  }

  // getStudentListBasedonCenterApiMethod
  getStudentListBasedonCenter(centeradminid: any): Observable<any[]> {
    const queryParams = `?centeradminid=${centeradminid}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getStudentListBasedonCenterApiMethod}` + queryParams, {}).catch(error => {
      return this.handleErrorCommon(error, () => this.getStudentListBasedonCenter(centeradminid))
    });
  }

  // getVideosbasedonBatchApiMethod
  getVideosbasedonBatch(BatchId: any): Observable<any[]> {
    const queryParams = `?BatchId=${BatchId}`;
    return this.http.get<any[]>(`${environment.apiUrl}${this.getVideosbasedonBatchApiMethod}` + queryParams, {}).catch(error => {
      return this.handleErrorCommon(error, () => this.getVideosbasedonBatch(BatchId))
    });
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message
        }`;
    }
    // console.error(errorMessage);
    // tslint:disable-next-line: deprecation
    return throwError(errorMessage);
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  getMathQuestionsByFilter(filterObj: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${this.getMathQuestions}`, filterObj)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getMathQuestionsByFilter(filterObj))
      });
  }
  getEnglishQuestionsByFilter(filterObj: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${this.getEnglishQuestions}`, filterObj)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getEnglishQuestionsByFilter(filterObj))
      });
  }

}
