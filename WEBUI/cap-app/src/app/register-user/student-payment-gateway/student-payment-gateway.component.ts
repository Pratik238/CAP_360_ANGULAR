import { NgZone } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { loadStripe } from '@stripe/stripe-js';

import { DataProvider } from 'src/app/helpers/providers/data.provider';
import { PaymentGatewayService } from 'src/app/services/payment-gateway.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

// var APIurl;
// function test1(){
//   Test("http://localhost:5000/api/ForteConfig");
// }

@Component({
  selector: 'app-student-payment-gateway',
  templateUrl: './student-payment-gateway.component.html',
  styleUrls: ['./student-payment-gateway.component.scss']
})
export class StudentPaymentGatewayComponent implements OnInit {
  elements: any;
   IsvisibleSMARTSAT = false;
  public IsvisibleCAP360 = false;
   IsvisibleBootCamps = false;
   IsvisibleCounselling = false;
   isVisiblePaymentIfDone=false;
  studentEmailId:any;
  PlanId:any;
  studentId:any;
  priceId:any;
  stripePromise = loadStripe(environment.stripe_key);
  constructor( private ngZone: NgZone,private activatedRoute: ActivatedRoute,   private paymentGatewayService: PaymentGatewayService,private spinnerService: NgxSpinnerService,private dataProvider: DataProvider) { 
    this.loadScript();    
    this.activatedRoute.queryParams.subscribe(params => {
      this.PlanId = params['Program'];
      this.studentEmailId = params['emailid'];
      this.studentId = params['Id'];
      
    });
    if(this.activatedRoute.snapshot.queryParams["emailid"]!=null){
      this.CheckPaymentIsDone();
      
    }else{

    if (this.dataProvider.storage) {
      
      this.studentEmailId = this.dataProvider.storage['studentEmailId'];
      this.PlanId = this.dataProvider.storage['PlanId'];
      //this.PlanId=='CAP360'
      sessionStorage.setItem('studentEmailId', this.studentEmailId);
      sessionStorage.setItem('PlanId', this.PlanId);
      
      
    }else{
      this.studentEmailId = sessionStorage.getItem('studentEmailId');
      this.PlanId = sessionStorage.getItem('PlanId');
    }
    this.CheckPaymentIsDone();
  }


//this.loadForteConfig();
//this.loadForteConfigFor360();  

this.LoadStripeContentBasedOnplan();

  }
  
  CheckPaymentIsDone(){
    const obj={
     
      EmailId: this.studentEmailId,
      Program:this.PlanId,
      }
        this.paymentGatewayService.CheckPaymentIsDone(obj).subscribe((data: any)=>{
          const res=data;

         if(res!=null && res.status=="paid"){
          this.isVisiblePaymentIfDone=true;
         }else{
           this.LoadStripeContentBasedOnplan();
          this.loadStripeConfig();
         }
            
        })  

  }

  
LoadStripeContentBasedOnplan(){
if(this.PlanId=='SMARTSAT'){
  this.IsvisibleSMARTSAT=true;
  this.priceId= environment.priceIdSMARTSAT;
}
if(this.PlanId=='CAP360'){
  this.IsvisibleCAP360=true;
  this.priceId= environment.priceId360;

}
if(this.PlanId=='Boot Camps'){
  this.IsvisibleBootCamps=true;

}
if(this.PlanId=='Counselling'){
  this.IsvisibleCounselling=true;

}
}
loadStripeConfigforOrganization(){

  const obj={
    priceId: this.priceId,
    EmailId: this.studentEmailId,
    StudentId:this.studentId,
    }
      this.paymentGatewayService.CreateCheckoutSession(obj).subscribe((data: any)=>{
        const res=data;
        this.elements = {};
        
          this.elements.sessionId =res.sessionId;
         
          
      })  
}
  loadStripeConfig() {
const obj={
  priceId: this.priceId,
  EmailId: this.studentEmailId,
  StudentId:this.studentId
  }
    this.paymentGatewayService.CreateCheckoutSessionWithoutDiscount(obj).subscribe((data: any)=>{
     // this.paymentGatewayService.CreateCheckoutSession(obj).subscribe((data: any)=>{
      const res=data;
      this.elements = {};
      
        this.elements.sessionId =res.sessionId;
       
        
    })  
   
    
  }
  async checkout() {
    // Call your backend to create the Checkout session.

    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await this.stripePromise;
    // const { error } = await stripe.redirectToCheckout({
    //   mode: 'subscription',
    //   lineItems: [{price: 'price_1IFw1GAU5WVl2sjcDiWHpzST', quantity: 1}],
    //   successUrl: `${window.location.href}/success`,
    //   cancelUrl: `${window.location.href}/failure`,
    // });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    // if (error) {
    //   console.log(error);
    // }
    await stripe.redirectToCheckout({
        // mode: 'subscription',
       // lineItems: [{price: 'price_1IGLJEAU5WVl2sjckTXtdmTF', quantity: 1}],
        sessionId: this.elements.sessionId ,
       //  successUrl: `${window.location.href}/success`,
      //  cancelUrl: `${window.location.href}/failure`,
        
      })
      .then(res => {
        console.log(res);
     })
     .catch(error => {
        console.log(error);
     });
      

  }
  
  ngOnInit(): void {
    
    window['angularComponentReference'] = { component: this, zone: this.ngZone, loadAngularFunction: () => this.angularFunctionCalled(this.elements), };
    //this.loadScript();
  }
  angularFunctionCalled(a:any) {  
    alert('Angular 2+ function is called'+a);  
  }  
  loadForteConfig() {
    this.paymentGatewayService.getForteConfig(this.studentEmailId).subscribe((data: any)=>{
      const res=data;
      this.elements = {};
      
        this.elements.utc_time =res.utc_time;
        this.elements.signature = res.pay_now_single_payment
        this.elements.total_amount = res.pay_schedule_amount;
        this.elements.order_number = res.order_number;
        
    })  
   
    
  }
  loadForteConfigFor360() {
    this.paymentGatewayService.getForteConfig360(this.studentEmailId).subscribe((data: any)=>{
          const res=data;
      this.elements = {};
      
        this.elements.utc_time360 =res.utc_time;
        this.elements.signature360 = res.pay_now_single_payment
        this.elements.total_amount360 = res.pay_schedule_amount;
        this.elements.order_number360 = res.order_number;
    })  
   
    
  }
  loadScript() {
    if(!window.document.getElementById('stripe-link')) {
      var s = window.document.createElement("link");
      s.rel = "stylesheet";
      s.href = "assets/all/css/bootstrap.css";
	  
	  var s1 = window.document.createElement("link");
      s1.rel = "stylesheet";
      s1.href = "assets/all/css/fonts.css";
	  
	  var s2 = window.document.createElement("link");
      s2.rel = "stylesheet";
      s2.href = "assets/all/css/style.css";
      
     
      

      }
       
      window.document.body.appendChild(s);
	  window.document.body.appendChild(s1);
	  window.document.body.appendChild(s2);

    if(!window.document.getElementById('Payment-script')) {
      var s6 = window.document.createElement("script");
      s6.id = "Payment-script";
      s6.type = "text/javascript";
      s6.src = "assets/all/js/core.min.js";
      var s7 = window.document.createElement("script");
      s7.id = "Payment-script";
      s7.type = "text/javascript";
      s7.src = "assets/all/js/script.js";
      }
       
      window.document.body.appendChild(s6);
      window.document.body.appendChild(s7);




  }
}
