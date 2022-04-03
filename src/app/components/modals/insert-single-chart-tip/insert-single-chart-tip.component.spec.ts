import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertSingleChartTipComponent } from './insert-single-chart-tip.component';

describe('InsertSingleChartTipComponent', () => {
  let component: InsertSingleChartTipComponent;
  let fixture: ComponentFixture<InsertSingleChartTipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertSingleChartTipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertSingleChartTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
