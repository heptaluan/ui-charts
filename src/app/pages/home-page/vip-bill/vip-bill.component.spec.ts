import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VipBillComponent } from './vip-bill.component';

describe('VipBillComponent', () => {
  let component: VipBillComponent;
  let fixture: ComponentFixture<VipBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VipBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VipBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
