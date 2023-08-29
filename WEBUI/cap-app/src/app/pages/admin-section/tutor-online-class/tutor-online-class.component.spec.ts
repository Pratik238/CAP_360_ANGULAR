/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TutorOnlineClassComponent } from './tutor-online-class.component';

describe('TutorOnlineClassComponent', () => {
  let component: TutorOnlineClassComponent;
  let fixture: ComponentFixture<TutorOnlineClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorOnlineClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorOnlineClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
