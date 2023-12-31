/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomePageLayoutComponent } from './home-page-layout.component';

describe('HomePageLayoutComponent', () => {
  let component: HomePageLayoutComponent;
  let fixture: ComponentFixture<HomePageLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
