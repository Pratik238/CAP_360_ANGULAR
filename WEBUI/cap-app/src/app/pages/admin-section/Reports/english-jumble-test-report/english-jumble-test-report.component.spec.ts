/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EnglishJumbleTestReportComponent } from './english-jumble-test-report.component';

describe('EnglishJumbleTestReportComponent', () => {
  let component: EnglishJumbleTestReportComponent;
  let fixture: ComponentFixture<EnglishJumbleTestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnglishJumbleTestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishJumbleTestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
