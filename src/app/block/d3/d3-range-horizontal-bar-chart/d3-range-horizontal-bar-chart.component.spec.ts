import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RangeHorizontalBarChartComponent } from './d3-range-horizontal-bar-chart.component';

describe('D3RangeHorizontalBarChartComponent', () => {
  let component: D3RangeHorizontalBarChartComponent;
  let fixture: ComponentFixture<D3RangeHorizontalBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RangeHorizontalBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RangeHorizontalBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
