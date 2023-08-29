/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JumbleMathsTestComponent } from './jumble-maths-test.component';

describe('JumbleMathsTestComponent', () => {
  let component: JumbleMathsTestComponent;
  let fixture: ComponentFixture<JumbleMathsTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumbleMathsTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumbleMathsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
