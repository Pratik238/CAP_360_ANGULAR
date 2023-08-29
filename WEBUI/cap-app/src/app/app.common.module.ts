import { SharedService } from './helpers/providers/shared.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgPrimeModule } from './app.ngprime.module';
import { SafePipe } from './helpers/pipes/safe.pipe';
import { DataProvider } from './helpers/providers/data.provider';

import { ErrorComponent } from './shared/error/error.component';
import { ExamTestComponent } from './shared/exam-test/exam-test.component';
import { MathjaxComponent } from './shared/mathjax/mathjax.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        NgPrimeModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        ExamTestComponent,
        MathjaxComponent,
        SafePipe
    ],
    declarations: [
        ErrorComponent,
        ExamTestComponent,
        MathjaxComponent,
        SafePipe
    ],
    providers: [
        MessageService,
        ConfirmationService,
        DataProvider,
        SharedService
    ]
})
export class AppCommonModule {

}
