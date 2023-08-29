/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SmartsatComponent } from './smartsat.component';

describe('SmartsatComponent', () => {
  let component: SmartsatComponent;
  let fixture: ComponentFixture<SmartsatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartsatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartsatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
