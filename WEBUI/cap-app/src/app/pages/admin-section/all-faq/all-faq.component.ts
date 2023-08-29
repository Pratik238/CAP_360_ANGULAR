import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-all-faq',
  templateUrl: './all-faq.component.html',
  styleUrls: ['./all-faq.component.scss']
})
export class AllFaqComponent implements OnInit {

  @ViewChild('addNewSubTopicForm') addNewSubTopicForm: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  selectedProducts: [];

  value: Date;

  allFaqForm: FormGroup;
  searchForm: FormGroup;
  submitted = false;
  p = 1;
  faqTypes: any[] = [
    {
      id: 1,
      value: 'User FAQs'
    },
    {
      id: 2,
      value: 'Admin FAQs'
    }
  ];

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

    question: string;

    allTopicsArray: any[] = [];
    topic: any;
    isAddMode = true;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toasterService: ToasterService) { }

  ngOnInit() {
    this.allFaqForm = this.fb.group({
      faqType: new FormControl('', Validators.required),
      faqTitle: new FormControl('', Validators.required),
      faqDescription: new FormControl('', Validators.required),
      isActive: new FormControl('', Validators.required),
    });

    this.searchForm = this.fb.group({
      questionId: new FormControl(''),
      selectedDate: new FormControl('')
    });

  }

  addNewSubTopic() {
    this.modalService.open(this.addNewSubTopicForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  cancelTopic() {
    this.modalService.dismissAll();
    this.allFaqForm.reset();
  }

  topicFormValid() {
    return this.allFaqForm.valid;
  }

  onSearchQuestions() {
    // console.log(this.searchForm);
    const emptyArray = this.allTopicsArray.filter(x => x.faqTitle === this.searchForm.get('questionId').value);
    this.allTopicsArray = emptyArray;
  }

  saveTopic() {
    if (this.isAddMode) {
      const topicObj = {
        id: (this.allTopicsArray.length + 1),
        faqType: this.allFaqForm.get('faqType').value,
        faqTitle: this.allFaqForm.get('faqTitle').value,
        faqDescription: this.allFaqForm.get('faqDescription').value,
        isActive: this.allFaqForm.get('isActive').value,
      };
      this.allTopicsArray.push(this.allFaqForm.value);
      this.toasterService.showSuccess('', 'Topic added successfully');
      this.allFaqForm.reset();
      this.modalService.dismissAll();
    } else {
      const findCurrentRecordIndex = this.allTopicsArray.findIndex(x => x.faqType === this.allFaqForm.get('faqType').value);
      this.allTopicsArray.splice(findCurrentRecordIndex, 1);
      this.allTopicsArray.push(this.allFaqForm.value);
      this.toasterService.showSuccess('', 'Topic Updated successfully');
      this.allFaqForm.reset();
      this.modalService.dismissAll();
    }
  }

  editTopic(topic) {
    this.topic = topic;
    this.allFaqForm.patchValue({
      topicName: topic.topicName,
      topicUrl: topic.topicUrl,
      isActive: topic.isActive,
    });
    this.isAddMode = false;
    this.modalService.open(this.addNewSubTopicForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteTopic(topic) {
    const index = this.allTopicsArray.findIndex(x => x.topicName === topic.topicName);
    if (index > -1) {
      this.allTopicsArray.splice(index, 1);
      this.modalService.dismissAll();
    }
  }

    viewTopic(topic) {
      this.topic = topic;
      this.modalService.open(this.displayTopics, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: false, backdrop: 'static', keyboard: false
      });
    }

    removeTopic(topic) {
      this.topic = topic;
      this.modalService.open(this.displayWarningMessage, {
        size: 'md', windowClass: 'confirm-dialog-window',
        centered: false, backdrop: 'static', keyboard: false
      });
    }

}
