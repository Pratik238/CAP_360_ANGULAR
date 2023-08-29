import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from 'src/app/app.common.module';
import { RegisterUserComponent } from './register-user.component';
import { RegisterUserRoutingModule } from './register-user.routing';
import { StudentPaymentGatewayComponent } from './student-payment-gateway/student-payment-gateway.component';

import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailureComponent } from './payment-failure/payment-failure.component';
import { AchPaymentComponent } from './ach-payment/ach-payment.component';

@NgModule({
  imports: [
    CommonModule,
    RegisterUserRoutingModule,
    AppCommonModule,
    ReactiveFormsModule
  ],

  // declarations: [RegisterUserComponent]
  declarations: [RegisterUserComponent, StudentPaymentGatewayComponent, PaymentSuccessComponent, PaymentFailureComponent,AchPaymentComponent]
})

export class RegisterUserModule { }
