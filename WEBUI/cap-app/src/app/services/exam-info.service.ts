import { Injectable } from '@angular/core';
import { ITutorials } from '../models/interfaces/tutorials.model';

@Injectable({
    providedIn: 'root',
})

export class ExamInfoService {

    tutorialsInfo: ITutorials[] = [
        {
            tutorName: 'CAP-Math-Thursdays-Aditya',
            tutorialDate: 'Aug 31, 2020 04:51 PM Central Time (US and Canada)'
        },
        {
            tutorName: 'CAP-Math-Thursdays-Aditya',
            tutorialDate: 'Aug 24, 2020 04:55 PM Central Time (US and Canada)'
        },
        {
            tutorName: 'CAP-Math-Thursdays-Aditya',
            tutorialDate: ' Aug 6, 2020 04:17 PM Central Time (US and Canada)'
        }
    ];

    constructor() {}

    getTutorials() {
      return this.tutorialsInfo;
    }

}
