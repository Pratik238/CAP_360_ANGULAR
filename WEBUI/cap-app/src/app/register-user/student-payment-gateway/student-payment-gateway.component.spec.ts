import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPaymentGatewayComponent } from './student-payment-gateway.component';

describe('StudentPaymentGatewayComponent', () => {
  let component: StudentPaymentGatewayComponent;
  let fixture: ComponentFixture<StudentPaymentGatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPaymentGatewayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPaymentGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
