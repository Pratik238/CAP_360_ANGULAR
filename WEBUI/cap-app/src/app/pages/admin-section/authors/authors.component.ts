import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  @ViewChild('addNewAdminForm') addNewAdminForm: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  selectedProducts: [];

  value: Date;

  adminForm: FormGroup;
  submitted = false;

    statuses: any[] = [
      {
        id: 123,
        value: 'Active'
      },
      {
        id: 124,
        value: 'In-active'
      }
    ];


    allTopicsArray: any[] = [];
    user: any;
    isAddMode = true;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toasterService: ToasterService) { }

  ngOnInit() {
    this.adminForm = this.fb.group({
      authorName: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      imageurl: new FormControl('', Validators.required),
      aboutAuthor: new FormControl('', Validators.required),
      facebookId: new FormControl('', Validators.required),
      twitterId: new FormControl('', Validators.required),
      linkedinId: new FormControl('', Validators.required),
      isActive: new FormControl(123, Validators.required),
    });

  }

  addNewSubTopic() {
    this.modalService.open(this.addNewAdminForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  cancelTopic() {
    this.modalService.dismissAll();
    this.adminForm.reset();
  }

  topicFormValid() {
    return this.adminForm.valid;
  }

  saveTopic() {
    if (this.isAddMode) {
      this.allTopicsArray.push(this.adminForm.value);
      this.toasterService.showSuccess('', 'Admin added successfully');
      this.adminForm.reset();
      this.modalService.dismissAll();
    } else {
      const findCurrentRecordIndex = this.allTopicsArray.findIndex(x => x.authorName === this.adminForm.get('authorName').value);
      this.allTopicsArray.splice(findCurrentRecordIndex, 1);
      this.allTopicsArray.push(this.adminForm.value);
      this.toasterService.showSuccess('', 'Admin Updated successfully');
      this.adminForm.reset();
      this.modalService.dismissAll();
    }
  }

  editTopic(user) {
    this.user = user;
    this.adminForm.patchValue({
      authorName: user.authorName,
      url: user.url,
      imageurl: user.imageurl,
      facebookId: user.facebookId,
      aboutAuthor: user.aboutAuthor,
      twitterId: user.twitterId,
      linkedinId: user.linkedinId,
      isActive: user.isActive,
    });
    this.isAddMode = false;
    this.modalService.open(this.addNewAdminForm, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteTopic(user) {
    const index = this.allTopicsArray.findIndex(x => x.topicName === user.topicName);
    if (index > -1) {
      this.allTopicsArray.splice(index, 1);
      this.modalService.dismissAll();
    }
  }

    viewTopic(user) {
      this.user = user;
      this.modalService.open(this.displayTopics, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
    }

    removeTopic(user) {
      this.user = user;
      this.modalService.open(this.displayWarningMessage, {
        size: 'md', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
    }

    allFormsValid() {
      return this.adminForm.valid;
    }
}
