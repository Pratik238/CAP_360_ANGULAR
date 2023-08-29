import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminCommonEndpointsService } from '../../../../services/admin-common-endpoints.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {

  @ViewChild('displayVideos') displayVideos: ElementRef;
  @ViewChild('videoPlayer') videoplayer: ElementRef;

  thumbnail: any;

  videoSource: any;
  user: User;
  videos: any[] = [];
  isDisplayWarningMessage: boolean = true;

  constructor(private spinnerService: NgxSpinnerService,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal) {

  }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.spinnerService.show();
    this.adminCommonEndpointsService.getVideosbasedonBatch(this.user.BatchIds).subscribe(result => {
      if (result && result.length > 0 && result[0] != "There is No Data ...") {
        this.videos = result;
        this.videos.map(x => {
          x['displayVideoUrl'] = this.sanitizer.bypassSecurityTrustResourceUrl(x.VideoPath);
        });
        if (this.videos.length > 0) {
          this.isDisplayWarningMessage = false;
        } else {
          this.isDisplayWarningMessage = true;
        }
      }
      this.spinnerService.hide();
    });
  }

  openVideo(video) {
    this.videoSource = video;
    this.modalService.open(this.displayVideos, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }


  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

}
