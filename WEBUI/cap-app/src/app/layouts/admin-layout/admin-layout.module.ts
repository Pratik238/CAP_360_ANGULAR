import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminLayoutRoutingModule, routedComponents } from './admin-layout.routing.module';
import { AppCommonModule } from 'src/app/app.common.module';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminLayoutRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    AppCommonModule
  ],
  declarations: [
    ...routedComponents
  ],
})

export class AdminLayoutModule {}
