import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnLoginComponent } from './un-login.component';

describe('UnLoginComponent', () => {
  let component: UnLoginComponent;
  let fixture: ComponentFixture<UnLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
