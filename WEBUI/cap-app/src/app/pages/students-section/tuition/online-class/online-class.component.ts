import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/models/interfaces';
import { IChangeStatus } from 'src/app/models/interfaces/admin-table';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';

@Component({
  selector: 'app-online-class',
  templateUrl: './online-class.component.html',
  styleUrls: ['./online-class.component.scss']
})
export class OnlineClassComponent implements OnInit {

  zoomLink: any;
  display: boolean = false;
  user: User;

  constructor(private spinnerService: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private studentCommonEndpointsService: StudentCommonEndpointsService) { }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.loadData();
  }

  loadData() {
    this.spinnerService.show();
    this.studentCommonEndpointsService.getZoomLink(this.user.BatchIds).subscribe(result => {
      if (result['length'] === 0) {
        this.display = false;
      } else {
        this.zoomLink = result[0];
        this.display = true;
      }
    });
    this.spinnerService.hide();
  }

  openSite() {
    if (this.zoomLink !== undefined && this.zoomLink.Link !== null && this.zoomLink.Link !== undefined) {
      window.open(this.zoomLink.Link, '_blank');
      // below code is used to change the zoom link status
      const changeStatus: IChangeStatus = {
        Table: 'URLLinks',
        PKey: this.zoomLink.Link
      };
    } else {
      this.display = true;
    }

  }

}
