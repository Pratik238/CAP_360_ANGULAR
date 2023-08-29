import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { SubjectsEnum } from 'src/app/models/Enum/subjects';
import { User } from 'src/app/models/interfaces';
import { IAdminQuestion } from 'src/app/models/interfaces/admin-exam';
import { IAddQuestions, IUpdateQuestions } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-all-questions',
  templateUrl: './all-questions.component.html',
  styleUrls: ['./all-questions.component.scss']
})
export class AllQuestionsComponent implements OnInit {

  @ViewChild('displayQuestions') displayQuestions: ElementRef;
  @ViewChild('reportInvalidQuestion') reportInvalidQuestion: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  questionForm: FormGroup;

  adminExamInfo: IAdminQuestion[] = [];
  selectedExamInfo: IAdminQuestion;
  isAddMode = true;
  question = 'question';

  statuses: any[] = [
    {
      id: 1,
      value: 'Active'
    },
    {
      id: 0,
      value: 'In-active'
    }
  ];

  topics: any[] = [];

  subTopics: any[] = [];

  Answers: any[] = [
    { id: 1, value: 'Option 1' },
    { id: 2, value: 'Option 2' },
    { id: 3, value: 'Option 3 ' },
    { id: 4, value: 'Option 4' },
  ];

  yesOrNoArray: any[] = [
    { id: '1', value: 'Yes' },
    { id: '2', value: 'No' }
  ];

  subjects: any[] = [];
  difficultyLevel: any[] = [];
  homeWork: any[] = [];

  isShowGridInSection = false;
  user: User;
  cols: any[];
  totalRecords: number;
  loading: boolean = false;
  allQuestionData: any[] = [];
  lazyLoadEvent: any;
  dataSource: any[] = [];
  csvData: any[] = []; s

  duplicateTopics: any[] = [];
  duplicateSubTopics: any[] = [];
  duplicateHomeWorkData: any[] = [];

  isShowHomeworkSection: boolean = false;
  isShowHomeworkTab: boolean = false;
  isSHowFormChekbox: boolean = false;
  pageSize: number = 10;
  pageIndex: number = 0;
  isDisplayMathControls: boolean = true;
  currentstatus: string = 'Active';
  pagesize: number = 10;
  totalPages: number = 0;
  isActiveRecord: boolean = true;

  filtersObject = {
    "First": 0,
    "Rows": 0,
    "SortField": "string",
    "SortOrder": 0,
    "ResultSetSize": 0,
    "TotalRecordsCount": 0,
    "filters": {}
  }

  constructor(private adminCommonEndpointsService: AdminCommonEndpointsService,
    private spinnerService: NgxSpinnerService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private messageService: MessageService) {
  }

  ngOnInit() {

    this.cols = [
      { field: 'QuestionId', header: 'ID' },
      { field: 'TopicId', header: 'Topic' },
      { field: 'SubTopicId', header: 'Sub Topic' },
      { field: 'CalculatorId', header: 'Calc' },
      { field: 'CalculatorId', header: 'Non Calc' },
      { field: 'GridId', header: 'Grid In' },
      { field: 'Homeworkname', header: 'Homework Name' },
      { field: 'DifficultyLevelId', header: 'Difficulty' },
      { field: 'QuestionText', header: 'Question' },
      { field: 'IsActive', header: 'Status' }
    ];

    this.loadDropdownLists();

    this.questionForm = this.fb.group({
      SubjectId: new FormControl(null, Validators.required),
      TopicId: new FormControl(null, Validators.required),
      SubTopicId: new FormControl(null, Validators.required),
      CalculatorId: new FormControl(null, Validators.required),
      QuestionText: new FormControl('', Validators.required),
      Option1: new FormControl(''),
      Option2: new FormControl(''),
      Option3: new FormControl(''),
      Option4: new FormControl(''),
      Answer: new FormControl(null, Validators.required),
      Explanation: new FormControl('', Validators.required),
      GridId: new FormControl(null, Validators.required),
      IsActive: new FormControl(1, Validators.required),
      IsHomework: new FormControl(''),
      HomeWorkId: new FormControl(0),
      DifficultyLevelId: new FormControl(null, Validators.required),
    });

  }


  loadFilters(event) {
    this.filtersObject.First = parseInt(event.first) / event.rows;
    this.filtersObject.Rows = event.rows;
    this.filtersObject.SortOrder = event.sortOrder;
    this.filtersObject.SortField = event.sortField;
    this.filtersObject = event;
    this.filtersObject.filters = this.listSearchFilterObjectCreation(
      event.filters
    );
  }

  listSearchFilterObjectCreation(filterData) {
    const data = filterData;
    let result = {};
    if (data !== undefined) {
      const keys = Object.keys(data);
      for (var i = 0; i < keys.length; i++) {
        result[keys[i]] = data[keys[i]]['value'] === undefined ? data[keys[i]] : data[keys[i]]['value']
      }
    }
    return result;
  }

  editQuestion(adminExam) {
    this.isAddMode = true;
    this.selectedExamInfo = adminExam;
    this.topics = this.duplicateTopics;
    this.subTopics = this.duplicateSubTopics;
    this.homeWork = this.duplicateHomeWorkData.filter(x => x.SubTopicId === adminExam.SubTopicId);
    if (adminExam.IsHomework) {
      this.isSHowFormChekbox = true;
      this.onCheckboxChange(true);
    } else {
      this.isSHowFormChekbox = false;
      this.onCheckboxChange(false);
    }
    this.questionForm.patchValue({
      SubjectId: adminExam.SubjectId,
      TopicId: adminExam.TopicId,
      SubTopicId: adminExam.SubTopicId,
      CalculatorId: adminExam.CalculatorId,
      QuestionText: adminExam.QuestionText,
      Option1: adminExam.Option1,
      Option2: adminExam.Option2,
      Option3: adminExam.Option3,
      Option4: adminExam.Option4,
      Answer: adminExam.Answer,
      Explanation: adminExam.Explanation,
      GridId: adminExam.GridId,
      IsActive: adminExam.IsActive ? 1 : 0,
      IsHomework: adminExam.IsHomework ? true : false,
      HomeWorkId: adminExam.HomeWorkId,
      DifficultyLevelId: adminExam.DifficultyLevelId,
    });
    this.isAddMode = false;
    this.modalService.open(this.reportInvalidQuestion, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.loadValueChangeForm();
  }

  loadValueChangeForm() {
    this.questionForm.valueChanges.subscribe(value => {
      if (value !== null) {
        if (value.HomeWorkId !== 0) {
          this.isShowHomeworkSection = true;
        } else {
          this.isShowHomeworkSection = false;
        }
      }
    });
  }

  loadDropdownLists() {
    // this.spinnerService.show();
    this.user = this.authenticationService.userValue;

    const subjectsDropdown = {
      dropdown: 'Subjects',
      sortby: 'SubjectName',
      selectfields: 'SubjectName as name,SubjectId as id'
    };
    this.adminCommonEndpointsService.getDropdowns(subjectsDropdown).subscribe(result => {
      const subjects = result['message'];
      this.subjects = subjects.filter(x => x.id === SubjectsEnum.Maths);
      // this.spinnerService.hide();
    }, erroe => {

      // this.spinnerService.hide();
    });

    this.adminCommonEndpointsService.getCommonLists('SubTopics', 'Order by', 'SubTopicName', 'DESC', true).subscribe(result => {
      this.duplicateSubTopics = result;
      // this.spinnerService.hide();
    }, erroe => {

      // this.spinnerService.hide();
    });

    this.adminCommonEndpointsService.getCommonLists('Topics', 'Order by', 'TopicName', 'DESC', true).subscribe(result => {
      this.duplicateTopics = result;
      // this.spinnerService.hide();
    });

    this.adminCommonEndpointsService.getCommonLists('HomeWork', 'Order by', 'HomeWorkName', 'DESC', true).subscribe(result => {
      this.duplicateHomeWorkData = result;
      // this.spinnerService.hide();
    }, erroe => {

      // this.spinnerService.hide();
    });

    this.adminCommonEndpointsService.getCommonLists('DifficultyLevel', 'Order by', 'DifficultyLevelId', 'ASC', true).subscribe(result => {
      this.difficultyLevel = result.filter(x => x.SubjectId === SubjectsEnum.Maths);
      // this.spinnerService.hide();
    }, erroe => {

      // this.spinnerService.hide();
    });

  }

  loadAllQuestions(event) {
    this.loading = true;
    this.lazyLoadEvent = event;
    const globalFilter = event.globalFilter ? event.globalFilter : "";
    const requestObj: any = {
      "First": parseInt(event.first) / event.rows,
      "Rows": event.rows,
      "SortField": "",
      "SortOrder": event.sortOrder,
      "ResultSetSize": 0,
      "TotalRecordsCount": 0,
      "filters": {
        "QuestionId": event.filters['QuestionId'] ? Number(event.filters['QuestionId'].value) : null,
        "TopicName": event.filters['TopicName'] ? event.filters['TopicName'].value : "",
        "SubTopicName": event.filters['SubTopicName'] ? event.filters['SubTopicName'].value : "",
        "CalculatorId": event.filters['CalculatorId'] ? event.filters['CalculatorId'].value : null,
        "GridId": event.filters['GridId'] ? event.filters['GridId'].value : null,
        "DifficultyLevelName": event.filters['DifficultyLevelName'] ? event.filters['DifficultyLevelName'].value : "",
        "IsDeleted": false,
        "Status": this.isActiveRecord ? "Active" : "InActive",
        "IsHomeWork": this.isShowHomeworkTab
      },
      "globalFilter": globalFilter
    }
    this.spinnerService.show();
    this.adminCommonEndpointsService.getMathQuestionsByFilter(requestObj).subscribe(result => {
      this.dataSource = result;
      this.csvData = result.Results;
      this.allQuestionData = result.Results;
      this.totalRecords = result.TotalRecordsCount;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
    this.loading = false;
  }

  getLoadStatusRecords(status) {
    this.spinnerService.show();
    this.isActiveRecord = status;
    this.loadAllQuestions(this.lazyLoadEvent);
    this.spinnerService.hide();
  }
  /*  globalSearch(val) {
     this.searchParameters.globalFilter = val
     const lazyEvent = this.lazyLoadEventData;
     this.loadData(lazyEvent, val);
   } */
  // change methods
  onChangeSubject() {
    if (this.questionForm.get('SubjectId').value !== null && this.questionForm.get('SubjectId').value !== '') {
      this.topics = this.duplicateTopics.filter(x => x.SubjectId.toString() === this.questionForm.get('SubjectId').value.toString());

      // check the subject
      if (this.questionForm.get('SubjectId').value === '1') {
        if (!this.isShowHomeworkSection) {
          this.isDisplayMathControls = true;
        }
      } else {
        this.isDisplayMathControls = false;
      }
    }
  }
  onChangeTopic(event) {
    if (event.target.value !== null && event.target.value !== '') {
      this.subTopics = this.duplicateSubTopics.filter(x => x.TopicId.toString() === event.target.value.toString());
    }
  }

  onChangeSubTopic(event) {
    if (event.target.value !== null && event.target.value !== '') {
      this.homeWork = this.duplicateHomeWorkData.filter(x => x.SubTopicId.toString() === event.target.value.toString());
    }
  }

  onChangeGridInValues(event) {
    if (event.target.value === '1' || event.target.value === 1) {
      this.isShowGridInSection = true;
    } else {
      this.isShowGridInSection = false;
    }
  }

  onCheckboxChange(event) {
    if (event) {
      setTimeout(() => {
        this.questionForm.get('CalculatorId').patchValue(2);
        this.questionForm.get('GridId').patchValue(2);
        this.isDisplayMathControls = false;
        this.isShowHomeworkSection = true;
      });
    } else {
      setTimeout(() => {
        this.isShowHomeworkSection = false;
        this.isDisplayMathControls = true;
        this.questionForm.get('HomeWorkId').patchValue(0);
      });
    }
  }

  onDisplayHomeworkData(event) {
    this.spinnerService.show();
    if (event.checked) {
      this.isShowHomeworkTab = true;
      this.isActiveRecord = true;
      this.loadAllQuestions(this.lazyLoadEvent);
    } else {
      this.isShowHomeworkTab = false;
      this.loadAllQuestions(this.lazyLoadEvent);
    }
    this.spinnerService.hide();
  }

  addQuestion() {
    this.isAddMode = true;
    this.isShowHomeworkSection = false;
    this.questionForm.get('HomeWorkId').patchValue(0);
    this.questionForm.get('SubjectId').patchValue(SubjectsEnum.Maths);
    this.onChangeSubject()

    this.isDisplayMathControls = true;
    // this.questionForm.patchValue({
    //   SubjectId: SubjectsEnum.Maths,
    // });
    this.modalService.open(this.reportInvalidQuestion, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  closeModal() {
    this.questionForm.reset();
  }

  saveQuestion() {
    this.spinnerService.show();
    if (this.isAddMode) {
      const addQuestions: IAddQuestions = {
        SubjectId: this.questionForm.get('SubjectId').value,
        TopicId: this.questionForm.get('TopicId').value,
        SubTopicId: this.questionForm.get('SubTopicId').value,
        IsHomeWork: this.questionForm.get('IsHomework').value ? 1 : 0,
        HomeworkId: this.questionForm.get('HomeWorkId').value,
        CalculatorId: this.questionForm.get('CalculatorId').value ? this.questionForm.get('CalculatorId').value : 0,
        QuestionText: this.questionForm.get('QuestionText').value,
        Option1: this.questionForm.get('Option1').value,
        Option2: this.questionForm.get('Option2').value,
        Option3: this.questionForm.get('Option3').value,
        Option4: this.questionForm.get('Option4').value,
        Answer: this.questionForm.get('Answer').value,
        Explanation: this.questionForm.get('Explanation').value,
        GridId: this.questionForm.get('GridId').value ? this.questionForm.get('GridId').value : 0,
        IsActive: Number(this.questionForm.get('IsActive').value),
        DifficultyLevelId: this.questionForm.get('DifficultyLevelId').value,
        Createdby: this.user.Name,
        Updatedby: this.user.Name
      };
      this.adminCommonEndpointsService.addQuestions(addQuestions).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: 'Question added successfully', detail: '' });
        this.questionForm.reset();
        this.spinnerService.hide();
        this.loadDropdownLists();
        this.loadAllQuestions(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        this.questionForm.reset();
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.modalService.dismissAll();
      });
    } else {
      const updateQuestion: IUpdateQuestions = {
        QuestionId: this.selectedExamInfo.QuestionId,
        SubjectId: this.questionForm.get('SubjectId').value,
        TopicId: this.questionForm.get('TopicId').value,
        SubTopicId: this.questionForm.get('SubTopicId').value,
        IsHomeWork: this.questionForm.get('IsHomework').value ? 1 : 0,
        HomeworkId: this.questionForm.get('HomeWorkId').value,
        CalculatorId: this.questionForm.get('CalculatorId').value,
        QuestionText: this.questionForm.get('QuestionText').value,
        Option1: this.questionForm.get('Option1').value,
        Option2: this.questionForm.get('Option2').value,
        Option3: this.questionForm.get('Option3').value,
        Option4: this.questionForm.get('Option4').value,
        Answer: this.questionForm.get('Answer').value,
        Explanation: this.questionForm.get('Explanation').value,
        GridId: this.questionForm.get('GridId').value,
        IsActive: Number(this.questionForm.get('IsActive').value),
        DifficultyLevelId: this.questionForm.get('DifficultyLevelId').value,
        Createdby: this.user.Name,
        Updatedby: this.user.Name
      };
      this.adminCommonEndpointsService.updateQuestions(updateQuestion).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: 'Question updated successfully', detail: '' });
        this.questionForm.reset();
        this.spinnerService.hide();
        this.loadDropdownLists();
        this.loadAllQuestions(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        this.questionForm.reset();
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.modalService.dismissAll();
      });
    }
  }

  formValid() {
    return this.questionForm.valid;
  }

  getTopicNameById(topicId: string) {
    return this.duplicateTopics && this.duplicateTopics.filter(x => x.TopicId === topicId).length > 0
      ? this.duplicateTopics.find(x => x.TopicId === topicId).TopicName
      : '--';
  }

  getSubTopicnameById(topicId: string) {
    return this.duplicateSubTopics && this.duplicateSubTopics.filter(x => x.SubTopicId === topicId).length > 0
      ? this.duplicateSubTopics.find(x => x.SubTopicId === topicId).SubTopicName
      : '--';
  }

  deleteQuestion(question) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'Questions',
      PKey: question.QuestionId
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {
      this.messageService.add({ severity: 'success', summary: 'Question removed successfully', detail: '' });
      this.spinnerService.hide();
      this.loadDropdownLists();
      this.loadAllQuestions(this.lazyLoadEvent);
      this.modalService.dismissAll();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error while removing...', detail: '' });
      this.modalService.dismissAll();
      this.spinnerService.hide();
    });
  }

  viewQuestion(adminExamInfo) {
    this.spinnerService.show();
    let viewRecord;
    if (this.isShowHomeworkTab) {
      viewRecord = {
        Table: 'vw_Homework_Questions',
        PKey: 'QuestionId',
        PKeyFld: adminExamInfo.QuestionId
      };
    } else {
      this.selectedExamInfo = adminExamInfo;
      viewRecord = {
        Table: 'vw_Questions',
        PKey: 'QuestionId',
        PKeyFld: adminExamInfo.QuestionId
      };
    }
    this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(response => {
      let result: any = response;
      if (result.length > 0) {
      }
      this.selectedExamInfo = result[0];
      this.modalService.open(this.displayQuestions, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });

      this.spinnerService.hide();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error while opeining...', detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
    });
  }

  cancelQuestion() {
    this.modalService.dismissAll();
    this.questionForm.reset();
  }

  removeQuestion(adminExamInfo) {
    this.selectedExamInfo = adminExamInfo;
    this.modalService.open(this.displayWarningMessage, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: false, backdrop: 'static', keyboard: false
    });
  }

  downloadFile(data: any) {
    if (data !== null && data !== undefined) {
      const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
      const header = Object.keys(data[0]);
      const csv = data.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      );
      csv.unshift(header.join(','));
      const csvArray = csv.join('\r\n');

      const a = document.createElement('a');
      const blob = new Blob([csvArray], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = 'AllQuestionsReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
