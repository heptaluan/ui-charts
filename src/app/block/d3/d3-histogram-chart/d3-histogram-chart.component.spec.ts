import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3HistogramChartComponent } from './d3-histogram-chart.component';

describe('D3HistogramChartComponent', () => {
  let component: D3HistogramChartComponent;
  let fixture: ComponentFixture<D3HistogramChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3HistogramChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3HistogramChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
