import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangePhoneComponent } from './exchange-phone.component';

describe('ExchangePhoneComponent', () => {
  let component: ExchangePhoneComponent;
  let fixture: ComponentFixture<ExchangePhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangePhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangePhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
