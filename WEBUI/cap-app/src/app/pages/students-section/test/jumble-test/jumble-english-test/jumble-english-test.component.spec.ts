/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JumbleEnglishTestComponent } from './jumble-english-test.component';

describe('JumbleEnglishTestComponent', () => {
  let component: JumbleEnglishTestComponent;
  let fixture: ComponentFixture<JumbleEnglishTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumbleEnglishTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumbleEnglishTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
