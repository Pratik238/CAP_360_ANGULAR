import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cap-basic-info',
  templateUrl: './cap-basic-info.component.html',
  styleUrls: ['./cap-basic-info.component.scss']
})
export class CapBasicInfoComponent implements OnInit {

  expImageSrc = 'assets/images/why-cap-img/highly-experienced-professionals-icon.png';
  efectiveImageSrc = 'assets/images/why-cap-img/effective-and-updated-methodologies-icon.png';
  personlaizedImageSrc = 'assets/images/why-cap-img/personalized-attention-for-students-icon.png';

  constructor(private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 500);
  }

}
