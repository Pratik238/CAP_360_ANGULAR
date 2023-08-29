import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AchPaymentComponent } from './ach-payment/ach-payment.component';

import { PaymentFailureComponent } from './payment-failure/payment-failure.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { RegisterUserComponent } from './register-user.component';
import { StudentPaymentGatewayComponent } from './student-payment-gateway/student-payment-gateway.component';




const routes: Routes = [
    {
        path: '',
        component: RegisterUserComponent

    },
    {
        path: 'student-payment-gateway',
        component: StudentPaymentGatewayComponent
    },
    {
        path: 'ach-payment-gateway',
        component: AchPaymentComponent
    },
    {
        path: 'success',
        component: PaymentSuccessComponent
    },
    {
        path: 'failure',
        component: PaymentFailureComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RegisterUserRoutingModule { }
