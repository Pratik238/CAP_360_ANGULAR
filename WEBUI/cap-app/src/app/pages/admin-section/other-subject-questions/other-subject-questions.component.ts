import { Component, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { SubjectsEnum } from 'src/app/models/Enum/subjects';
import { User } from 'src/app/models/interfaces';
import { IAddQuestions, IUpdateQuestions } from 'src/app/models/interfaces/admin-table';
import { IEnglishQuestion, IQuestions } from 'src/app/models/interfaces/english-questions';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-other-subject-questions',
  templateUrl: './other-subject-questions.component.html',
  styleUrls: ['./other-subject-questions.component.scss']
})
export class OtherSubjectQuestionsComponent implements OnInit {

  @ViewChild('displayQuestions') displayQuestions: ElementRef;
  @ViewChild('addEngQuestion') addEngQuestion: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  questionForm: FormGroup;

  adminExamInfo: IEnglishQuestion[] = [];
  selectedExamInfo: any;
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

  englishSections: any[] = [];

  subjects: any[] = [];
  difficultyLevel: any[] = [];
  homeWork: any[] = [];

  user: User;
  cols: any[];
  totalRecords: number;
  loading: boolean = false;
  allQuestionData: any[] = [];
  dataSource: any[] = [];
  lazyLoadEvent: any;

  duplicateTopics: any[] = [];
  duplicateSubTopics: any[] = [];
  duplicateHomeWorkData: any[] = [];

  isShowHomeworkSection: boolean = false;
  isShowHomeworkTab: boolean = false;
  isSHowFormChekbox: boolean = false;
  pageSize: number = 10;
  pageIndex: number = 0;
  isDisplayMathControls: boolean = true;

  isActiveRecord: boolean = true;
  currentstatus: string = 'Active';

  allEngQuestions: any[] = [];
  csvData: any[] = [];
  filtersObject = {
    First: 0,
    Rows: 0,
    SortField: "string",
    SortOrder: 0,
    ResultSetSize: 0,
    isHomeWork: false,
    TotalRecordsCount: 0,
    globalFilter: "",
    filters: {}
  }

  constructor(private adminCommonEndpointsService: AdminCommonEndpointsService,
    private spinnerService: NgxSpinnerService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {

    this.loadDropdownLists();

    this.questionForm = this.fb.group({
      SubjectId: new FormControl(null, Validators.required),
      TopicId: new FormControl(null, Validators.required),
      SubTopicId: new FormControl(null, Validators.required),
      Paragraph: new FormControl('', Validators.required),
      EnglishSectionId: new FormControl(null),
      IsActive: new FormControl(1, Validators.required),
      IsHomework: new FormControl(''),
      HomeWorkId: new FormControl(0),
      DifficultyLevelId: new FormControl(null, Validators.required),
      questions: this.fb.array([
        this.initQuestions()
      ])
    });

  }

  initQuestions() {
    return this.fb.group({
      QuestionText: [''],
      Option1: [''],
      Option2: [''],
      Option3: [''],
      Option4: [''],
      Answer: [''],
      Explanation: [''],
    });
  }

  get questionsFormArray() {
    return this.questionForm.controls.questions as FormArray;
  }

  adNewQuestion() {
    const control = <FormArray>this.questionForm.controls['questions'];
    control.push(this.initQuestions());
  }

  remove(i: number) {
    // remove address from the list
    const control = <FormArray>this.questionForm.controls['questions'];
    control.removeAt(i);
  }

  editQuestion(adminExam) {
    this.isAddMode = false;
    this.selectedExamInfo = adminExam;
    //this.onChangeSubject(adminExam.SubjectId);
    this.topics = this.duplicateTopics;
    this.subTopics = this.duplicateSubTopics;
    this.homeWork = this.duplicateHomeWorkData;
    if (adminExam.IsHomework) {
      this.isSHowFormChekbox = true;
    } else {
      this.isSHowFormChekbox = false;
    }
    this.questionForm.patchValue({
      Paragraph: adminExam.Paragraph,
      EnglishSectionId: adminExam.EnglishSectionId,
      SubjectId: adminExam.SubjectId,
      TopicId: adminExam.TopicId,
      SubTopicId: adminExam.SubTopicId,
      IsActive: adminExam.IsActive ? 1 : 0,
      IsHomework: adminExam.IsHomework ? true : false,
      HomeWorkId: adminExam.HomeWorkName,
      DifficultyLevelId: adminExam.DifficultyLevelId,
    });
    let viewRecord;
    if (this.isShowHomeworkTab) {
      viewRecord = {
        Table: 'EnglishQuestions',
        PKey: adminExam.QuestionId
      };
    } else {
      viewRecord = {
        Table: 'EnglishQuestions',
        PKey: adminExam.QuestionId
      };
    }
    this.spinnerService.show();
    this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(res => {
      const qustnArray = res[0];
      this.spinnerService.hide();
      this.questionForm.setControl('questions', this.setExistingQuestionsData(qustnArray));
    }, error => {
      this.spinnerService.hide();

    });
    this.modalService.open(this.addEngQuestion, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    // this.loadValueChangeForm();
  }

  // below method is used to patch the form array data
  setExistingQuestionsData(qstnData: IQuestions[]): FormArray {
    const formArray = new FormArray([]);
    qstnData.forEach(x => {
      formArray.push(this.fb.group({
        QuestionText: x.QuestionText,
        Option1: x.Option1,
        Option2: x.Option2,
        Option3: x.Option3,
        Option4: x.Option4,
        Answer: x.Answer,
        Explanation: x.Explanation
      }));
    });
    return formArray;
  }

  closeModal() {
    this.questionForm.reset();
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
      this.subjects = subjects.filter(x => x.id !== SubjectsEnum.Maths);
    });

    this.adminCommonEndpointsService.getCommonLists('SubTopics', 'Order by', 'SubTopicName', 'DESC', true).subscribe(result => {
      this.duplicateSubTopics = result;
    });

    this.adminCommonEndpointsService.getCommonLists('Topics', 'Order by', 'TopicName', 'DESC', true).subscribe(result => {
      this.duplicateTopics = result;
    });

    this.adminCommonEndpointsService.getCommonLists('HomeWork', 'Order by', 'HomeWorkName', 'DESC', true).subscribe(result => {
      this.duplicateHomeWorkData = result;
    });

    this.adminCommonEndpointsService.getCommonLists('DifficultyLevel', 'Order by', 'DifficultyLevelId', 'ASC', true).subscribe(result => {
      this.difficultyLevel = result.filter(x => x.SubjectId === SubjectsEnum.English);
    });

    this.adminCommonEndpointsService.getCommonLists('EnglishSection', 'Order by', 'Id', 'ASC', true).subscribe(result => {
      this.englishSections = result;
    });

    // this.spinnerService.hide();
  }

  loadOtherSubjects(event) {
    // this.loading = true;
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
        "IsDeleted": false,
        "Status": this.isActiveRecord ? "Active" : "InActive",
        "IsHomeWork": this.isShowHomeworkTab,
        "QuestionId": event.filters['QuestionId'] ? Number(event.filters['QuestionId'].value) : 0,
        "TopicName": event.filters['TopicName'] ? event.filters['TopicName'].value : "",
        "SubTopicName": event.filters['SubTopicName'] ? event.filters['SubTopicName'].value : "",
        "Paragraph": event.filters['Paragraph'] ? event.filters['Paragraph'].value : null,
        "DifficultyLevelName": event.filters['DifficultyLevelName'] ? event.filters['DifficultyLevelName'].value : ""
      },
      "globalFilter": globalFilter
    }
    this.spinnerService.show();
    this.adminCommonEndpointsService.getEnglishQuestionsByFilter(requestObj).subscribe(result => {
      this.dataSource = result;
      this.csvData = result.Results;
      this.allQuestionData = result.Results;
      this.totalRecords = result.TotalRecordsCount;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
    // this.loading = false;
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

  getLoadStatusRecords(status: boolean) {
    this.isActiveRecord = status;
    this.loadOtherSubjects(this.lazyLoadEvent);
  }

  // Change events
  onChangeSubject() {
    // if (event.target.value !== null && event.target.value !== '') {
    this.topics = this.duplicateTopics.filter(x => x.SubjectId.toString() === SubjectsEnum.English.toString());

    // check the subject
    // if (event.target.value.toString() === '1') {
    //   this.isDisplayMathControls = true;
    // } else {
    //   this.isDisplayMathControls = false;
    // }
    // }
    // if (event !== null && event !== '') {
    //   this.topics = this.duplicateTopics.filter(x => x.SubjectId.toString() === event.toString());

    //   // check the subject
    //   if (event.toString() === '1') {
    //     this.isDisplayMathControls = true;
    //   } else {
    //     this.isDisplayMathControls = false;
    //   }
    // }
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

  addQuestion() {
    if (this.questionsFormArray.value.length > 1) {
      this.questionsFormArray.value.forEach((x, i) => {
        if (x.QuestionText === null) {
          const control = <FormArray>this.questionForm.controls['questions'];
          control.removeAt(0);
        }
      });
    }
    this.questionForm.reset()
    this.questionForm.get('HomeWorkId').patchValue(0);
    this.questionForm.get('SubjectId').patchValue(SubjectsEnum.English);
    this.onChangeSubject()
    this.modalService.open(this.addEngQuestion, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  saveEngQuestion() {
    var questionArray = [];
    if (this.isAddMode) {
      if (this.questionForm.get('questions').value) {
        this.questionForm.get('questions').value.forEach(x => {
          const questionObj = {
            SubjectId: this.questionForm.get('SubjectId').value,
            TopicId: this.questionForm.get('TopicId').value,
            SubTopicId: this.questionForm.get('SubTopicId').value,
            HomeWorkId: Number(this.questionForm.get('HomeWorkId').value),
            IsHomework: this.questionForm.get('IsHomework').value ? 1 : 0,
            EnglishSectionId: this.questionForm.get('EnglishSectionId').value,
            DifficultyLevelId: this.questionForm.get('DifficultyLevelId').value,
            Createdby: this.user.Name,
            QuestionText: x.QuestionText,
            Option1: x.Option1,
            Option2: x.Option2,
            Option3: x.Option3,
            Option4: x.Option4,
            Answer: x.Answer,
            Explanation: x.Explanation,
          };
          questionArray.push(questionObj);
        });
      }
      const engQuestion: IEnglishQuestion = {
        Paragraph: this.questionForm.get('Paragraph').value,
        questions: questionArray,
      }
      this.adminCommonEndpointsService.addEnglishQuestions(engQuestion).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: 'Question created succesfully', detail: '' });
        this.questionForm.reset();
        this.spinnerService.hide();
        this.loadDropdownLists();
        this.loadOtherSubjects(this.lazyLoadEvent);
        this.modalService.dismissAll();
        this.isSHowFormChekbox = false;
      }, (e) => {
        this.questionForm.reset();
        this.isSHowFormChekbox = false;
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.modalService.dismissAll();
      });
    } else {
      if (this.questionForm.get('questions').value) {
        this.questionForm.get('questions').value.forEach(x => {
          const questionObj = {
            QuestionId: this.selectedExamInfo.QuestionId,
            SubjectId: this.questionForm.get('SubjectId').value,
            TopicId: this.questionForm.get('TopicId').value,
            SubTopicId: this.questionForm.get('SubTopicId').value,
            HomeWorkId: this.questionForm.get('HomeWorkId').value ? this.questionForm.get('HomeWorkId').value : 0,
            IsHomework: this.questionForm.get('IsHomework').value ? 1 : 0,
            EnglishSectionId: this.questionForm.get('EnglishSectionId').value,
            DifficultyLevelId: this.questionForm.get('DifficultyLevelId').value,
            QuestionText: x.QuestionText,
            Option1: x.Option1,
            Option2: x.Option2,
            Option3: x.Option3,
            Option4: x.Option4,
            Answer: x.Answer,
            Explanation: x.Explanation,
            Createdby: this.selectedExamInfo.Createdby,
            Updatedby: this.user.Name
          };
          questionArray.push(questionObj);
        });

        const updateQuestion: IEnglishQuestion = {
          Id: this.selectedExamInfo.Id,
          Paragraph: this.questionForm.get('Paragraph').value,
          questions: questionArray,
        }

        this.adminCommonEndpointsService.updateEnglishQuestions(updateQuestion).toPromise().then((result) => {
          this.messageService.add({ severity: 'success', summary: 'Question updated succesfully', detail: '' });
          this.questionForm.reset();
          this.spinnerService.hide();
          this.loadDropdownLists();
          this.isSHowFormChekbox = false;
          this.loadOtherSubjects(this.lazyLoadEvent);
          this.modalService.dismissAll();
        }, (e) => {
          this.questionForm.reset();
          this.isSHowFormChekbox = false;
          // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
          this.modalService.dismissAll();
        });
      }
    }
  }

  onCheckboxChange(event) {
    if (event.checked) {
      this.isShowHomeworkSection = true;
    } else {
      this.isShowHomeworkSection = false;
      this.questionForm.get('HomeWorkId').patchValue(0);
    }
  }

  onDisplayHomeworkData(event) {
    this.spinnerService.show();
    if (event.checked) {
      this.isShowHomeworkTab = true;
      this.loadOtherSubjects(this.lazyLoadEvent);
      this.spinnerService.hide();
    } else {
      this.isShowHomeworkTab = false;
      this.loadOtherSubjects(this.lazyLoadEvent);
      this.spinnerService.hide();
    }
  }

  formValid() {
    return this.questionForm.valid;
  }

  deleteQuestion(question) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'englishQuestions',
      PKey: question.QuestionId
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {
      this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
      this.spinnerService.hide();
      this.loadDropdownLists();
      this.loadOtherSubjects(this.lazyLoadEvent);
      this.modalService.dismissAll();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while deleting...', detail: '' });
      this.modalService.dismissAll();
    });
  }

  viewQuestion(adminExamInfo) {
    this.spinnerService.show();
    let viewRecord;
    if (this.isShowHomeworkTab) {
      viewRecord = {
        Table: 'vw_EnglishHomework_Questions',
        PKey: 'QuestionId',
        PKeyFld: adminExamInfo.QuestionId
      };
    } else {
      this.selectedExamInfo = adminExamInfo;
      viewRecord = {
        Table: 'vw_EnglishQuestions',
        PKey: 'QuestionId',
        PKeyFld: adminExamInfo.QuestionId
      };
    }
    this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(result => {
      this.selectedExamInfo = result['message'][0];
      this.modalService.open(this.displayQuestions, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
      this.spinnerService.hide();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while loading...', detail: '' });
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
      const header = Object.keys(data);
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
