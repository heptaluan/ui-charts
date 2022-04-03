import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPriceComponent } from './business-price.component';

describe('BusinessPriceComponent', () => {
  let component: BusinessPriceComponent;
  let fixture: ComponentFixture<BusinessPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
