import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayDataModalComponent } from './pay-data-modal.component';

describe('PayDataModalComponent', () => {
  let component: PayDataModalComponent;
  let fixture: ComponentFixture<PayDataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayDataModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
