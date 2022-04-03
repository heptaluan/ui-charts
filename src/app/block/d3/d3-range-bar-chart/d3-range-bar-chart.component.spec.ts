import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RangeBarChartComponent } from './d3-range-bar-chart.component';

describe('D3RangeBarChartComponent', () => {
  let component: D3RangeBarChartComponent;
  let fixture: ComponentFixture<D3RangeBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RangeBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RangeBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
