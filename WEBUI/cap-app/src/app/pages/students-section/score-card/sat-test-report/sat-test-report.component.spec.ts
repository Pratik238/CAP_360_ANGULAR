/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SatTestReportComponent } from './sat-test-report.component';

describe('SatTestReportComponent', () => {
  let component: SatTestReportComponent;
  let fixture: ComponentFixture<SatTestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SatTestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SatTestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
