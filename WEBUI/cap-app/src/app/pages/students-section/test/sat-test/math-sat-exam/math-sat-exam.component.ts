import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { SharedService } from 'src/app/helpers/providers/shared.service';
import { studentTestEnum } from 'src/app/models/Enum/student-test';
import { User } from 'src/app/models/interfaces';
import { IAddExamId } from 'src/app/models/interfaces/add-exam';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';

@Component({
  selector: 'app-math-sat-exam',
  templateUrl: './math-sat-exam.component.html',
  styleUrls: ['./math-sat-exam.component.scss']
})
export class MathSatExamComponent implements OnInit {

  user: User;
  satData: any[] = [];
  isDislayExamInfo: boolean;
  displayUserFreindlyMessage: string;
  isDisplayScore: boolean = false;
  scoreMessage: string;

  constructor(private spinnerService: NgxSpinnerService,
    private studentCommonEndpointsService: StudentCommonEndpointsService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private sharedService: SharedService,
    private router: Router) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit() {
    this.spinnerService.show();
    this.studentCommonEndpointsService.getPracticeSATTestScores(this.user.UserId, studentTestEnum.SatTest).subscribe(res => {
      if (res.length > 0) {
        this.isDisplayScore = true;
        this.scoreMessage = res[0].Score;
      } else {
        this.isDisplayScore = false;
      }
    });
    this.studentCommonEndpointsService.getSATExamQuestionsList(this.user.UserId, '1', this.user.BatchIds, 2).subscribe(result => {
      this.satData = result;
      if (this.satData.length > 0 && this.satData.length === 20) {
        this.isDislayExamInfo = true;
      } else {
        this.isDislayExamInfo = false;
      }
    }, e => {
      if (e.text) {
        this.isDislayExamInfo = false;
        this.displayUserFreindlyMessage = e.text;
      }
    });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1000);
  }

  onClickGoToStartExam() {
    const satTest: IAddExamId = {
      StudentId: this.user.UserId,
      TestId: studentTestEnum.SatTest
    };
    if (this.satData.length === 20) {
      if (this.isDislayExamInfo) {
        this.studentCommonEndpointsService.addExamIds(satTest).subscribe(result => {
        });
        this.sharedService.setStorage({ isFromMathsPracticeTest: false, satData: this.satData, isFromJumbleMathsTest: false });
        this.router.navigate(['/start-exam']);
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Unable to generate test...', detail: '' });
    }
  }

}
