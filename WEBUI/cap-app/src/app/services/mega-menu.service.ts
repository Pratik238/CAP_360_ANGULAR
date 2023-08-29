import { Injectable } from '@angular/core';
import { User } from '../models/interfaces';
import { CustomMegaMenuItem } from '../models/interfaces/customMegaMenuItem';
import { AuthenticationService } from './authentication.service';
import { StudentCommonEndpointsService } from './student-common-endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class MegaMenuService {

  isValidMathSatExam: boolean;
  user: User;

  constructor(
    private studentCommonEndpointsService: StudentCommonEndpointsService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe(x => this.user = x);
    // this.studentCommonEndpointsService.getSubTopicCount(this.user.BatchId, this.user.UserId).subscribe(result => {
    //   console.log(result);
    //   if (result) {
    //     this.isValidMathSatExam = false;
    //   } else {
    //     this.isValidMathSatExam = true;
    //   }
    // });
  }

  isValidSatExam() {
    this.studentCommonEndpointsService.getSubTopicCount(this.user.BatchIds, this.user.UserId).subscribe(result => {
      console.log(result);
      if (result) {
        this.isValidMathSatExam = false;
      } else {
        this.isValidMathSatExam = true;
      }
    });
    return this.isValidMathSatExam;
  }

  getMegaMenuList(): CustomMegaMenuItem[] {
    return [
      {
        label: 'Overview',
        //  icon: 'fa fa-fw fa-group',
        items: [
          {
            label: 'What is CAP, Why CAP', routerLink: '/user/overview/cap-basic-info',
            routerLinkActiveOptions: { exact: true }
          },
          {
            label: 'More About CAP', routerLink: '/user/overview/about-cap',
            routerLinkActiveOptions: { exact: true }
          }
        ]
      },
      {
        label: 'Program',
        //  icon: 'fa fa-fw fa-group',
        items: [
          { label: 'AP', routerLink: '/user/tutoring/test-prep/ap', routerLinkActiveOptions: { exact: true } },
          { label: 'SMART SAT', routerLink: '/user/tutoring/test-prep/sat', routerLinkActiveOptions: { exact: true } },
          { label: 'ACT', routerLink: '/user/tutoring/test-prep/act', routerLinkActiveOptions: { exact: true } },
          { label: 'BOOT CAMPS', routerLink: '/user/tutoring/test-prep/bootcamp', routerLinkActiveOptions: { exact: true } },
          { label: 'ADMISSION CONSULTING', routerLink: '/user/tutoring/test-prep/act', routerLinkActiveOptions: { exact: true } },
          { label: 'CLUBS', routerLink: '/user/tutoring/test-prep/act', routerLinkActiveOptions: { exact: true } },
        ],
      },
      {
        label: 'Tuition',
        //  icon: 'fa fa-fw fa-group',
        items: [
          {
            label: 'Online Class', routerLink: '/user/tuition/online-class'
          },
          {
            label: 'Home Work', routerLink: '/user/tuition/home-work',
            routerLinkActiveOptions: { exact: true }
          },
          {
            label: 'Videos', routerLink: '/user/tuition/videos',
            routerLinkActiveOptions: { exact: true }
          },
        ],
      },
      {
        label: 'Test',
        //  icon: 'fa fa-fw fa-group',
        items: [
          {
            label: 'Practice',
            items: [
              { label: 'Maths', routerLink: '/user/test/practice/maths', routerLinkActiveOptions: { exact: true }, },
              { label: 'English', routerLink: '/user/test/practice/english', routerLinkActiveOptions: { exact: true } },
            ],
          },
          {
            label: 'SAT Test',
            items: [
              { label: 'Maths', routerLink: '/user/test/sat-test/maths-sat', routerLinkActiveOptions: { exact: true } },
              { label: 'English', routerLink: '/user/test/sat-test/english-sat', routerLinkActiveOptions: { exact: true } },
            ],
          },
          {
            label: 'Jumble Test',
            items: [
              { label: 'Maths', routerLink: '/user/test/Jumble-test/maths-test', routerLinkActiveOptions: { exact: true } },
              { label: 'English', routerLink: '/user/test/Jumble-test/english-test', routerLinkActiveOptions: { exact: true } },
            ],
          }
        ],
      },
      {
        label: 'Score Card',//  icon: 'fa fa-fw fa-group',
        items: [
          {
            label: 'Practice Test',
            routerLink: '/user/score-card/practice-test', routerLinkActiveOptions: { exact: true }
          },
          {
            label: 'SAT', routerLink: '/user/score-card/sat-report', routerLinkActiveOptions: { exact: true }
          },
          {
            label: 'Jumble Test', routerLink: '/user/score-card/jumble-test-report', routerLinkActiveOptions: { exact: true }
          },
        ]
      },
      {
        label: 'FAQ',//  icon: 'fa fa-fw fa-group',
        routerLink: '/user/faq', routerLinkActiveOptions: { exact: true }
      },
      {
        label: 'ContactUs',//  icon: 'fa fa-fw fa-group',
        routerLink: '/user/contactus', routerLinkActiveOptions: { exact: true }
      }
    ];
  }

}
