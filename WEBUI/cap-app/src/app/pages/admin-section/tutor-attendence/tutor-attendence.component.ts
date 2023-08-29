import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-tutor-attendence',
  templateUrl: './tutor-attendence.component.html',
  styleUrls: ['./tutor-attendence.component.scss']
})
export class TutorAttendenceComponent implements OnInit {

  attendanceForm: FormGroup;
  batches: any[] = [];
  assignBatches: any[] = [];
  selectedOrderIds: any[] = [];

  selected = [];

  subTopics: any[] = [];
  topics: any[] = [];
  duplicateSubTopics: any[] = [];

  attendance: any[] = [
    { id: 1, name: 'P' },
    { id: 2, name: 'A' }
  ];

  user: User;
  allStudents: any[] = [];
  minDateValue = new Date();
  maxDateValue = new Date();
  isShowStudents: boolean = false;

  constructor(private spinnerService: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private messageService: MessageService) { }

  ngOnInit() {


    this.attendanceForm = this.fb.group({
      BatchId: new FormControl(null, Validators.required),
      TopicId: new FormControl(null, Validators.required),
      SubTopicId: new FormControl(null, Validators.required),
      studentAttendance: this.fb.array([
        this.initAttendance(),
      ]),
      AttendanceDate: new FormControl(null, Validators.required)
    });

    this.refreshData();

    this.addAttendance();
  }

  initAttendance() {
    // initialize our address
    return this.fb.group({
      StudentId: new FormControl(null, Validators.required),
      AttendanceState: new FormControl(null, Validators.required),
    });
  }

  get ordersFormArray() {
    return this.attendanceForm.controls.studentAttendance as FormArray;
  }

  addAttendance() {
    const control = <FormArray>this.attendanceForm.controls['studentAttendance'];
    control.controls.forEach(x => {
      if (x.value.StudentId !== '' && x.value.StudentId !== null) {
        control.push(this.initAttendance());
      }
    });
  }

  refreshData() {
    this.user = this.authenticationService.userValue;

    this.spinnerService.show();
    this.adminCommonEndpointsService.getCommonLists('Topics', 'Order by', 'TopicId', 'ASC', true).subscribe(result => {
      this.topics = result;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });

    this.spinnerService.show();
    this.adminCommonEndpointsService.getCommonLists('SubTopics', 'Order by', 'SubTopicId', 'ASC', true).subscribe(result => {
      this.duplicateSubTopics = result;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });

    this.adminCommonEndpointsService.getCommonLists('Batch', 'Order by', 'BatchId', 'ASC', true).subscribe(result => {
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.batches = result;
      } else if (this.user.Usertype === rolesEnum.CenterAdmin) {
        this.batches = result.filter(x => x.CenteradminId === this.user.UserId);
      } else {
        this.batches = result.filter(x => x.TutorId === this.user.UserId);
      }
      this.spinnerService.hide();
    }, error => {

      this.spinnerService.hide();
    });

    this.adminCommonEndpointsService.getCommonLists('vw_batchAssign', 'Order by', 'BatchId', 'ASC', true).subscribe(result => {
      this.assignBatches = result;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });

  }

  onChangeBatch(event) {
    if (event.target.value !== null && event.target.value !== '' && event.target.value !== 'null') {
      this.allStudents = this.assignBatches.filter(x => x.BatchId.toString() === event.target.value.toString());
      if (this.allStudents.length > 0) {
        this.isShowStudents = true;
        this.allStudents.map(x => {
          x['isAttented'] = '-';
        });
      } else {
        this.isShowStudents = false;
      }
    } else {
      this.attendanceForm.reset();
    }
  }

  onChangeTopic(event) {
    if (event.target.value !== null) {
      const filteredSubTopics = this.duplicateSubTopics.filter(x => x.TopicId.toString() === event.target.value.toString());
      this.subTopics = filteredSubTopics;
    } else {
      this.subTopics = [];
    }
  }

  allFormsValid() {
    return this.attendanceForm.valid && this.allStudents.length > 0;
  }

  saveAttendence() {
    this.spinnerService.hide();
    let attendanceArray: any[] = [];
    this.attendanceForm.value.studentAttendance.forEach(x => {
      if (x !== undefined && x.StudentId !== '' && x.StudentId !== undefined && x.StudentId !== null) {
        const attendancObj = {
          BatchId: this.attendanceForm.value.BatchId,
          SubTopicId: this.attendanceForm.value.SubTopicId,
          AttendanceDate: this.attendanceForm.value.AttendanceDate,
          AttendanceState: x.AttendanceState,
          StudentId: x.StudentId,
          Createdby: this.user.Name,
          Updatedby: this.user.Name
        };
        attendanceArray.push(attendancObj);
      }
    });

    this.adminCommonEndpointsService.addAttendence(attendanceArray).toPromise().then((result) => {
      this.messageService.add({ severity: 'success', summary: 'Attendance saved successfully', detail: '' });
      this.refreshData();
      this.attendanceForm.reset();
      this.spinnerService.hide();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in Attendance...', detail: '' });
      this.attendanceForm.reset();
      this.spinnerService.hide();
    });
  }

}
