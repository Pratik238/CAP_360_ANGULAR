import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-online-class-videos',
  templateUrl: './online-class-videos.component.html',
  styleUrls: ['./online-class-videos.component.scss']
})
export class OnlineClassVideosComponent implements OnInit {

  @ViewChild('addEditVideoFrom') addEditVideoFrom: ElementRef;
  @ViewChild('fileUploadInput') fileUploadInput: any;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  batchForm: FormGroup;
  submitted = false;

  dataSource: any[] = [];
  allVideos: any[] = [];
  csvData: any[] = [];
  tutorVideo: any;
  user: User;
  isAddMode = true;

  batches: any[] = [];
  totalRecords: number = 0;
  lazyLoadEvent: any;
  currentstatus = 'true';


  constructor(private fb: FormBuilder,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService,
    private toasterService: ToasterService) { }

  ngOnInit() {
    this.refreshData();
    this.batchForm = this.fb.group({
      BatchId: new FormControl(null, Validators.required),
      VideoPath: new FormControl(null, Validators.required)
    });
    this.loadBatchVideosData(this.lazyLoadEvent);
  }

  refreshData() {
    this.spinnerService.show();
    this.user = this.authenticationService.userValue;
    this.adminCommonEndpointsService.getCommonLists('vw_Batches', 'Order by', 'BatchId', 'ASC', true).subscribe(result => {
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
  }

  loadBatchVideosData(event: LazyLoadEvent, status = 'true') {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.currentstatus = status;
    this.adminCommonEndpointsService.getCommonLists('vw_uploadvideos', 'Order by', 'Id', 'ASC', this.currentstatus).subscribe(result => {
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.dataSource = result;
      } else if (this.user.Usertype === rolesEnum.CenterAdmin) {
        this.dataSource = result.filter(x => x.CenterAdminId === this.user.UserId);
      } else {
        this.dataSource = result.filter(x => x.TutorId === this.user.UserId);
      }
      this.csvData = JSON.parse(JSON.stringify(this.dataSource));
      // if (event && event.first && event.rows) {
      //   this.allVideos = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allVideos = this.dataSource.slice(0, 10);
      // }

      this.allVideos = this.dataSource;
      // this.allVideos = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  allFormsValid() {
    return this.batchForm.valid;
  }

  addVideo() {
    this.modalService.open(this.addEditVideoFrom, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  cancelBatch() {
    this.modalService.dismissAll();
    this.batchForm.reset();
  }

  videoFormVaild() {
    return this.batchForm.valid;
  }

  saveBatch() {
    if (this.isAddMode) {
      const topicsParam: IAdminTableParams = {
        Table: 'UploadVideos',
        FilterFieldName: 'VideoPath',
        FilterFieldValue: this.batchForm.get('VideoPath').value,
        Data: [
          {
            FieldName: 'BatchId',
            FieldValue: this.batchForm.get('BatchId').value
          },
          {
            FieldName: 'VideoPath',
            FieldValue: this.batchForm.get('VideoPath').value
          },
          {
            FieldName: 'Createdby',
            FieldValue: this.user.Name
          },
          {
            FieldName: 'Updatedby',
            FieldValue: this.user.Name
          }
        ]
      };
      this.spinnerService.show();
      this.adminCommonEndpointsService.addNewList(topicsParam).toPromise().then((result) => {

        this.spinnerService.hide();
        this.modalService.dismissAll();
        this.batchForm.reset();
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.refreshData();
        this.loadBatchVideosData(this.lazyLoadEvent);
      }, (e) => {
        this.spinnerService.hide();
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.modalService.dismissAll();
        this.batchForm.reset();
      });
    } else {
      const topicsParam: IAdminTableParams = {
        Table: 'UploadVideos',
        Data: [
          {
            FieldName: 'Id',
            FieldValue: this.tutorVideo.Id
          },
          {
            FieldName: 'BatchId',
            FieldValue: this.batchForm.get('BatchId').value
          },
          {
            FieldName: 'Createdby',
            FieldValue: this.user.Name
          },
          {
            FieldName: 'Createdby',
            FieldValue: this.user.Name
          },
          {
            FieldName: 'Updatedby',
            FieldValue: this.user.Name
          }
        ]
      };
      this.spinnerService.show();
      this.adminCommonEndpointsService.updateRecord(topicsParam).toPromise().then((result) => {

        this.spinnerService.hide();
        this.batchForm.reset();
        this.refreshData();
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.loadBatchVideosData(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        this.spinnerService.hide();
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.modalService.dismissAll();
        this.batchForm.reset();
      });
    }
  }

  closeModal() {
    this.batchForm.reset();
  }

  editVideos(video) {
    this.tutorVideo = video;
    this.batchForm.patchValue({
      BatchId: video.BatchId,
      VideoPath: video.VideoPath,
    });
    this.isAddMode = false;
    this.modalService.open(this.addEditVideoFrom, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteClassRecording(tutorVideo) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'UploadVideos',
      PKey: tutorVideo.Id
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {

      this.spinnerService.hide();
      this.messageService.add({ severity: 'success', summary: 'Successfully deleted.', detail: '' });
      this.refreshData();
      this.loadBatchVideosData(this.lazyLoadEvent);
      this.modalService.dismissAll();
    }, (e) => {
      this.spinnerService.hide();
      // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
      this.modalService.dismissAll();
    });

  }

  viewTopic(topic) {
    this.spinnerService.show();
    this.tutorVideo = topic;
    this.modalService.open(this.displayTopics, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.spinnerService.hide();
  }

  removeTutorVideo(topic) {
    this.tutorVideo = topic;
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
      a.download = 'OnlineClassVideosReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
