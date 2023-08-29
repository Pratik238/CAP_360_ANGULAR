/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SatTestComponent } from './sat-test.component';

describe('SatTestComponent', () => {
  let component: SatTestComponent;
  let fixture: ComponentFixture<SatTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SatTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SatTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
