/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JumbleTestReportComponent } from './jumble-test-report.component';

describe('JumbleTestReportComponent', () => {
  let component: JumbleTestReportComponent;
  let fixture: ComponentFixture<JumbleTestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumbleTestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumbleTestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
