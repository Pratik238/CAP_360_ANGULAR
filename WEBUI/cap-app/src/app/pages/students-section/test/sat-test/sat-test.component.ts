import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sat-test',
  templateUrl: './sat-test.component.html',
  styleUrls: ['./sat-test.component.scss']
})
export class SatTestComponent implements OnInit {

  constructor(private spinnerService: NgxSpinnerService,
              private router: Router ) { }

  ngOnInit() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1000);
  }

  onClickGoToStartExam() {
    this.router.navigate(['/start-exam']);
  }

}
