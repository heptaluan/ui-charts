/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DySearchComponent } from './dy-search.component';

describe('DySearchComponent', () => {
  let component: DySearchComponent;
  let fixture: ComponentFixture<DySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
