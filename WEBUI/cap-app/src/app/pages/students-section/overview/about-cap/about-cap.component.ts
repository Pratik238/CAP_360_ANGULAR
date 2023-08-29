import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-about-cap',
  templateUrl: './about-cap.component.html',
  styleUrls: ['./about-cap.component.scss']
})
export class AboutCapComponent implements OnInit {

  constructor(private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 500);
  }

}
