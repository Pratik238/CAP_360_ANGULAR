import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AdminCommonEndpointsService } from '../../../services/admin-common-endpoints.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterService } from '../../../services/toaster.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home-contact-us',
  templateUrl: './home-contact-us.component.html',
  styleUrls: ['./home-contact-us.component.scss']
})
export class HomeContactUsComponent implements OnInit {
  contactUsForm: FormGroup;
  responseSuccessCode:string = "200";

  constructor(private fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private toastService: ToasterService,
    private messageService: MessageService) {
   }

  ngOnInit() {
    this.contactUsForm= this.fb.group({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('',[Validators.required, Validators.email]),
      message: new FormControl('',Validators.required)
    });
  }
  onSubmitContactUs(){
    this.spinnerService.show();
    const contactUsObj = {
      Name:this.contactUsForm.get('name').value,
      Phone:this.contactUsForm.get('phone').value,
      EmailId:this.contactUsForm.get('email').value,
      Message: this.contactUsForm.get('message').value
    }
    this.adminCommonEndpointsService.contactUs(contactUsObj).toPromise().then(result =>{
      if(result.status === this.responseSuccessCode){
        this.spinnerService.hide();        
        this.contactUsForm.reset();       
        this.toastService.showSuccess('',result.message);
      }
    },(e) => {
      this.toastService.showError(e, 'Error in while ContactUS...');
      this.messageService.add({ severity: 'error', summary: 'Error in whileContactUS...', detail: '' });      
      this.spinnerService.hide();
    });
  }

  allFormsValid() {
    return this.contactUsForm.valid;
  }

}
