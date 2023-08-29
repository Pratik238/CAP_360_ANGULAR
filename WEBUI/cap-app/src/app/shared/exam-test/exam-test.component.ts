import { constants } from './../../constants';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-exam-test',
  templateUrl: './exam-test.component.html',
  styleUrls: ['./exam-test.component.scss']
})
export class ExamTestComponent implements OnInit {

  @ViewChild('gridInAns', {static: false}) pRef: ElementRef;
  // tslint:disable-next-line: ban-types
  @Input() complete: Function;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @Output() isGridIn: EventEmitter<boolean> = new EventEmitter;
  @Input() allQestions: any;

  selectedAns1: string = '';
  selectedAns2: string = '';
  selectedAns3: string = '';
  selectedAns4: string = '';
  enteredGridval: string = null;
  correctVal: string;

  constructor() { }

  ngOnInit() {
    if (this.allQestions && this.allQestions.GridId === constants.GridId) {
      if (this.allQestions.SelectedAnswer && this.allQestions.SelectedAnswer !== undefined && this.allQestions.SelectedAnswer !== null) {
        this.selectedAns1 = this.allQestions.SelectedAnswer.charAt(0);
        this.selectedAns2 = this.allQestions.SelectedAnswer.charAt(1);
        this.selectedAns3 = this.allQestions.SelectedAnswer.charAt(2);
      this.selectedAns4 = this.allQestions.SelectedAnswer.charAt(3);
    }
  }
  }


  selectCorrectAnswer(selectedOpt) {
   this.allQestions.SelectedAnswer = selectedOpt;
   this.dataChange.emit(this.allQestions);
  }

  gridInAnswerOne(ele) {
    this.selectedAns1 = ele;
    this.enteredGridval = `${this.selectedAns1}${this.selectedAns2}${this.selectedAns3}${this.selectedAns4}`;
    this.allQestions.SelectedAnswer = this.enteredGridval;
    setTimeout(() => {
      this.pRef.nativeElement.innerHTML = this.enteredGridval; 
      this.correctVal = this.pRef.nativeElement.value;
    });
  }

  gridInAnswerTwo(ele) {
    this.selectedAns2 = ele;
    this.enteredGridval = `${this.selectedAns1}${this.selectedAns2}${this.selectedAns3}${this.selectedAns4}`;
    this.allQestions.SelectedAnswer = this.enteredGridval;
    setTimeout(() => {
      this.pRef.nativeElement.innerHTML = this.enteredGridval; 
      this.correctVal = this.pRef.nativeElement.value;
    });
  }

  gridInAnswerThree(ele) {
    this.selectedAns3 = ele;
    this.enteredGridval = `${this.selectedAns1}${this.selectedAns2}${this.selectedAns3}${this.selectedAns4}`;
    this.allQestions.SelectedAnswer = this.enteredGridval;
    setTimeout(() => {
      this.pRef.nativeElement.innerHTML = this.enteredGridval; 
      this.correctVal = this.pRef.nativeElement.value;
    });
  }

  gridInAnswerFour(ele) {
    this.selectedAns4 = ele;
    this.enteredGridval = `${this.selectedAns1}${this.selectedAns2}${this.selectedAns3}${this.selectedAns4}`;
    this.allQestions.SelectedAnswer = this.enteredGridval;
    setTimeout(() => {
      this.pRef.nativeElement.innerHTML = this.enteredGridval; 
      this.correctVal = this.pRef.nativeElement.value;
    });
  }
  

}
