/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JumbleTestComponent } from './jumble-test.component';

describe('JumbleTestComponent', () => {
  let component: JumbleTestComponent;
  let fixture: ComponentFixture<JumbleTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumbleTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumbleTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
