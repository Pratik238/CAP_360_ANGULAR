import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentGatewayService } from 'src/app/services/payment-gateway.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  session_id:any;
  constructor(private activatedRoute: ActivatedRoute,private paymentGatewayService: PaymentGatewayService) { }

  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.session_id = params['session_id'];
      this.loadOrderSuccess();
    });

  }
  loadOrderSuccess() {
if( this.session_id!=null){
    this.paymentGatewayService.OrderSuccess(this.session_id).subscribe((data: any)=>{
     
        
    })  
  }
    
  }
}
