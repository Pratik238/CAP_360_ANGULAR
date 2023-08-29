import { constants } from 'src/app/constants';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/helpers/providers/shared.service';
import { IEnglishTestResultReport, ITestResultReport } from 'src/app/models/interfaces/test-result';
import * as CanvasJS from './../../../shared/canvasjs.min';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {
  data: any;
  pieChartReport: ITestResultReport;
  englishPieChartReport: IEnglishTestResultReport;
  isFromPracticeTest: boolean = false;
  isFromEnglishPracticeTest: boolean = false;
  isFromEnglishSubject: boolean = false;

  constructor(private router: Router,
              private sharedService: SharedService,
              private spinnerService: NgxSpinnerService) {
                const storage = this.sharedService.getStorage();
                if (storage) {
                 if (storage['isFromEnglishPracticeTest'] === true && storage['isFromEnglishPracticeTest'] !== undefined &&
                    storage['pieChartReport'] !== null ) {
                    this.englishPieChartReport = storage["pieChartReport"][0];
                    this.isFromEnglishPracticeTest = true;
                    this.isFromEnglishSubject = true;
                  } 
                 if (storage['isFromEnglishSATExam'] === true && storage['isFromEnglishSATExam'] !== undefined &&
                    storage['pieChartReport'] !== null ) {
                    this.englishPieChartReport = storage["pieChartReport"][0];
                    this.isFromEnglishPracticeTest = false;
                    this.isFromEnglishSubject = true;
                  } 
                 if (storage['isFromPracticeTest'] === true && storage['isFromPracticeTest'] !== undefined &&
                    storage['pieChartReport'] !== null ) {
                    this.pieChartReport = storage["pieChartReport"][0];
                    this.isFromPracticeTest = true;
                  } 
                 if (storage['isFromSATExam'] === true && storage['isFromSATExam'] !== undefined &&
                    storage['pieChartReport'] !== null ) {
                    this.pieChartReport = storage["pieChartReport"][0];
                    this.isFromPracticeTest = false;
                  } 
                  if (storage['isFromExamResult'] === true ) {
                    this.pieChartReport = storage['pieChartReport'];
                    this.isFromPracticeTest = storage['isFromPracticeTest'];
                  }
                } 
                else {
                  this.router.navigate(['/home/sign-in']);
                }

                this.sharedService.clearStorage();
   }

  ngOnInit() {
    if (this.isFromEnglishSubject) {
      this.loadEnglishPieChart();
    }  else {
      this.loadPieChart();
    }
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1000);
  }

  loadEnglishPieChart() {
    let chart = new CanvasJS.Chart("chartContainer", {
			theme: "light2",
			animationEnabled: true,
			exportEnabled: true,
			title:{
				text: "Exam Results"
      },
      legend:{
        verticalAlign: "bottom",
        fontSize: 15,
        fontFamily: "Helvetica"        
      },
			data: [{
				type: "pie",
				showInLegend: true,
				toolTipContent: "<b>{name}</b>: {y}",
				indexLabel: "{name} - {y}",
				dataPoints: [
					{ y: this.englishPieChartReport.ReadInferencingCorrect, name: "Reading Inferencing Correct" },
					{ y: this.englishPieChartReport.ReadInferencingwrong, name: "Reading Inferencing Wrong" },
					{ y: this.englishPieChartReport.ReadParaphrasingCorrect, name: "Reading Paraphrasing and Proofing Correct" },
					{ y: this.englishPieChartReport.ReadParaphrasingwrong, name: "Reading Paraphrasing and Proofing Wrong" },
					{ y: this.englishPieChartReport.ReadmainideaCorrect, name: "Reading Main Idea Correct" },
          { y: this.englishPieChartReport.Readmainideawrong, name: "Reading Main Idea Wrong" },
					{ y: this.englishPieChartReport.ReadGrammarCorrect, name: "Reading Grammar Correct" },
          { y: this.englishPieChartReport.ReadGrammarwrong, name: "Reading Grammar Wrong" },
					{ y: this.englishPieChartReport.ReadVocaabularyCorrect, name: "Reading Vocaabulary Correct" },
          { y: this.englishPieChartReport.ReadVocaabularyCorrect, name: "Reading Vocaabulary Wrong" },
        
          { y: this.englishPieChartReport.WriteInferencingCorrect, name: "Writting Inferencing Correct" },
					{ y: this.englishPieChartReport.WriteInferencingwrong, name: "Writting Inferencing Wrong" },
					{ y: this.englishPieChartReport.WriteParaphrasingCorrect, name: "Writting Paraphrasing and Proofing Correct" },
					{ y: this.englishPieChartReport.WriteParaphrasingwrong, name: "Writting Paraphrasing and Proofing Wrong" },
					{ y: this.englishPieChartReport.WritemainideaCorrect, name: "Writting Main Idea Correct" },
          { y: this.englishPieChartReport.Writemainideawrong, name: "Writting Main Idea Wrong" },
					{ y: this.englishPieChartReport.WriteGrammarCorrect, name: "Writting Grammar Correct" },
          { y: this.englishPieChartReport.WriteGrammarwrong, name: "Writting Grammar Wrong" },
					{ y: this.englishPieChartReport.WriteVocaabularyCorrect, name: "Writting Vocaabulary Correct" },
          { y: this.englishPieChartReport.WriteVocaabularywrong, name: "Writting Vocaabulary Wrong" }
				]
			}]
		});
			
		chart.render();
  }

  loadPieChart() {
    let chart = new CanvasJS.Chart("chartContainer", {
			theme: "light2",
			animationEnabled: true,
			exportEnabled: true,
			title:{
				text: "Exam Results"
      },
      legend:{
        verticalAlign: "bottom",
        fontSize: 15,
        fontFamily: "Helvetica"        
      },
			data: [{
				type: "pie",
				showInLegend: true,
				toolTipContent: "<b>{name}</b>: {y}",
				indexLabel: "{name} - {y}",
				dataPoints: [
					{ y: this.pieChartReport.CalMulCorrect, name: "Calculator Multiple Choice Correct" },
					{ y: this.pieChartReport.CalMulWrong, name: "Calculator Multiple Choice Wrong" },
					{ y: this.pieChartReport.NoCalMulCorrect, name: "Non Calculator Multiple Choice correct" },
					{ y: this.pieChartReport.NoCalMulWrong, name: "Non Calculator Multiple Choice Wrong" },
					{ y: this.pieChartReport.CalGridWrong, name: "Calculator GridIn Wrong" },
					{ y: this.pieChartReport.CalGridCorrect, name: "Calculator GridIn Correct"},
					{ y: this.pieChartReport.NoCalGridCorrect, name: "Non Calculator GridIn Correct" },
					{ y: this.pieChartReport.NoCalGridWrong, name: "Non Calculator GridIn Wrong" }
				]
			}]
		});
			
		chart.render();
  }

  // Below code is used to show correct and wrong questions data for practice test
  showNonMulCorrect() {
    this.sharedService.setStorage({ 
      ExamId: this.pieChartReport['ExamId'],
      questionType: constants.examResult_NonMulCorrect,
      pieChartReport: this.pieChartReport,
      isFromPracticeTest: this.isFromPracticeTest
    });
    this.router.navigate(['/user/exam-result-questions']);
  }
 
  showNonMulWrong() {
    this.sharedService.setStorage({ 
      ExamId: this.pieChartReport['ExamId'],
      questionType: constants.examResult_NoCalMulWrong,
      pieChartReport: this.pieChartReport,
      isFromPracticeTest: this.isFromPracticeTest
    });
    this.router.navigate(['/user/exam-result-questions']);
  }
  
  showNoCalgridCorrect() {
    this.sharedService.setStorage({ 
      ExamId: this.pieChartReport['ExamId'],
      questionType: constants.examResult_NoCalgridCorrect,
      pieChartReport: this.pieChartReport,
      isFromPracticeTest: this.isFromPracticeTest
    });
    this.router.navigate(['/user/exam-result-questions']);
  }
 
  showNoCalgridWrong() {
    this.sharedService.setStorage({ 
      ExamId: this.pieChartReport['ExamId'],
      questionType: constants.examResult_NoCalGridWrong,
      pieChartReport: this.pieChartReport,
      isFromPracticeTest: this.isFromPracticeTest
    });
    this.router.navigate(['/user/exam-result-questions']);
  }
  
  showCalMulCorrect() {
    this.sharedService.setStorage({ 
      ExamId: this.pieChartReport['ExamId'],
      questionType: constants.examResult_CalMulcorrect,
      pieChartReport: this.pieChartReport,
      isFromPracticeTest: this.isFromPracticeTest
    });
    this.router.navigate(['/user/exam-result-questions']);
  }
 
  showCalMulWrong() {
    this.sharedService.setStorage({ 
      ExamId: this.pieChartReport['ExamId'],
      questionType: constants.examResult_CalMulWrong,
      pieChartReport: this.pieChartReport,
      isFromPracticeTest: this.isFromPracticeTest
    });
    this.router.navigate(['/user/exam-result-questions']);
  }

  showCalGridWrong() {
    this.sharedService.setStorage({ 
      ExamId: this.pieChartReport['ExamId'],
      questionType: constants.examResult_CalGridWrong,
      pieChartReport: this.pieChartReport,
      isFromPracticeTest: this.isFromPracticeTest
    });
    this.router.navigate(['/user/exam-result-questions']);
  }
 
  showCalGridCorrect() {
    this.sharedService.setStorage({ 
      ExamId: 65,
      questionType: constants.examResult_CalGridCorrect,
      pieChartReport: this.pieChartReport,
      isFromPracticeTest: this.isFromPracticeTest
    });
    this.router.navigate(['/user/exam-result-questions']);
  }
 
  onSkippedQuestions() {
    this.sharedService.setStorage({ 
      ExamId: 65,
      questionType: constants.examResult_SkippedQuestions,
      pieChartReport: this.pieChartReport,
      isFromPracticeTest: this.isFromPracticeTest
    });
    this.router.navigate(['/user/exam-result-questions']);
  }
 
  showAnsweredQuestions() {
    this.sharedService.setStorage({ 
      ExamId: 65,
      questionType: constants.examResult_AnsweredQuestions,
      pieChartReport: this.pieChartReport,
      isFromPracticeTest: this.isFromPracticeTest
    });
    this.router.navigate(['/user/exam-result-questions']);
  }
 
  showUnAnsweredQuestions() {
    this.sharedService.setStorage({ 
      ExamId: 65,
      questionType: constants.examResult_UnAnsweredQuestions,
      pieChartReport: this.pieChartReport,
      isFromPracticeTest: this.isFromPracticeTest
    });
    this.router.navigate(['/user/exam-result-questions']);
  }

}
