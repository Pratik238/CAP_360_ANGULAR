import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentGatewayService } from 'src/app/services/payment-gateway.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-ach-payment',
  templateUrl: './ach-payment.component.html',
  styleUrls: ['./ach-payment.component.scss']
})
export class AchPaymentComponent implements OnInit {
  accountForm: FormGroup;
  studentEmailId:any;
  PlanId:any;
  studentId:any;
  priceId:any;
  
  elements: {};
  constructor(private activatedRoute: ActivatedRoute,
    private paymentGatewayService: PaymentGatewayService,private toastService: ToasterService) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.PlanId = params['Program'];
      this.studentEmailId = params['emailid'];
      this.studentId = params['Id'];
      
    });
    this.LoadStripeContentBasedOnplan();
  }
  LoadStripeContentBasedOnplan(){
    
    if(this.PlanId=='SMARTSAT'){
      this.priceId= environment.priceIdSMARTSAT;
    }
    if(this.PlanId=='CAP360'){
      this.priceId= environment.priceId360;
    }
    if(this.PlanId=='Boot Camps'){
     }
    if(this.PlanId=='Counselling'){
      
    }
    }
  stripePromise = loadStripe(environment.stripe_key);
  ngOnInit() {
    this.accountForm=new FormGroup({
      name:new FormControl('',Validators.required),
      type:new FormControl('',Validators.required),
      routing_number:new FormControl('',Validators.required),
      account_number:new FormControl('',Validators.required),
    });
  }
  async bankAccount(){

    const stripe = await this.stripePromise;
    var bankAccountData = {
      country: 'us',
      currency: 'usd',
      routing_number: this.accountForm.get('routing_number').value,
      account_number: this.accountForm.get('account_number').value,
      account_holder_name: this.accountForm.get('name').value,
      account_holder_type: this.accountForm.get('type').value,
    };
    stripe.createToken('bank_account', bankAccountData).then(res => {
      
      var token = {
        priceId: this.priceId,
        EmailId: this.studentEmailId,
        BankTokenId:res.token.id,
        BankId:res.token.bank_account.id,
      };
      this.BankToPay(token);
   })
   .catch(error => {
      console.log(error);
   });
   
  }
  BankToPay(obj) {
    
        this.paymentGatewayService.PayViaBank(obj).subscribe((data: any)=>{
          
          console.log(data)
          if (data.status==200) {
            this.toastService.showSuccess('', 'Payment has been done successfully.');
          } else {
            this.toastService.showWarning('', data.message);
          }
        },
        (err) => {console.log(err)});
         
       
        
      }

}
