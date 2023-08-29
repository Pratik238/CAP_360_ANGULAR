/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MathSatExamComponent } from './math-sat-exam.component';

describe('MathSatExamComponent', () => {
  let component: MathSatExamComponent;
  let fixture: ComponentFixture<MathSatExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MathSatExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MathSatExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
