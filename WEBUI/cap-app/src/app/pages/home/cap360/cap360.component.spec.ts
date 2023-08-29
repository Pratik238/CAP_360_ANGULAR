/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Cap360Component } from './cap360.component';

describe('Cap360Component', () => {
  let component: Cap360Component;
  let fixture: ComponentFixture<Cap360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cap360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cap360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
