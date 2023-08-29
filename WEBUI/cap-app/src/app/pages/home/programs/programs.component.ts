import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AdminCommonEndpointsService } from '../../../services/admin-common-endpoints.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { ToasterService } from '../../../services/toaster.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {
  bookNowForm: FormGroup;
  contactUsForm: FormGroup;
  @ViewChild('galleryOne', { static: true }) slickModal: SlickCarouselComponent;
  slideConfig = { 'slidesToShow': 1, 'autoplay': true, 'autoplayspeed': 400, 'arrows': false };

  capProgramInfo: any[] = [
    { title: 'Increase the odds of acceptance letters with us', header: 'APPLICATION', subHeader: 'BOOT CAMP' },
    { title: 'CAP360 is the program that transforms the kid into an entrepreneur', header: 'CAP360', subHeader: '' }
  ];
  responseSuccessCode:string = "200";

  constructor(private router: Router,
              private fb: FormBuilder,
              private spinnerService: NgxSpinnerService,
              private adminCommonEndpointsService: AdminCommonEndpointsService,
              private toastService: ToasterService,
              private messageService: MessageService
              ) {

  }

  ngOnInit() {
    if (!this.slickModal.initialized) {
      this.slickModal.initSlick();
      this.slickModal.slickNext();
    }
    this.bookNowForm= this.fb.group({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('',[Validators.required, Validators.email])
    });
    this.contactUsForm= this.fb.group({
      name: new FormControl('', Validators.required),      
      email: new FormControl('',[Validators.required, Validators.email]),
      message: new FormControl('',Validators.required)
    });
    
  }

  enroll(event) {
    this.router.navigateByUrl('/admission-form');
  }
  onSubmitBookNow(){
    this.spinnerService.show();
    const bookNowObj = {
      Name:this.bookNowForm.get('name').value,
      Phone:this.bookNowForm.get('phone').value,
      Email:this.bookNowForm.get('email').value
    }
    this.adminCommonEndpointsService.bookForDiagnosticTest(bookNowObj).toPromise().then(result =>{
      if(result.status === this.responseSuccessCode){
        this.spinnerService.hide();        
        this.bookNowForm.reset();       
        this.toastService.showSuccess('',result.message);
      }
    },(e) => {
      this.toastService.showError(e, 'Error in while booking diagnostic test...');
      this.messageService.add({ severity: 'error', summary: 'Error in while booking diagnostic test...', detail: '' });      
      this.spinnerService.hide();
    });
  }
  onSubmitContactUs(){
    this.spinnerService.show();
    const contactUsObj = {
      Name:this.contactUsForm.get('name').value,
      Phone: "",
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
      this.messageService.add({ severity: 'error', summary: 'Error in while ContactUS...', detail: '' });      
      this.spinnerService.hide();
    });
  }
  allFormsValid() {
    return this.bookNowForm.valid;
  }
  allFieldsInGetinTouchValid() {
    return this.contactUsForm.valid;
  }

}
