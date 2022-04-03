import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3CalendarHeatmapChartComponent } from './d3-calendar-heatmap-chart.component';

describe('D3CalendarHeatmapChartComponent', () => {
  let component: D3CalendarHeatmapChartComponent;
  let fixture: ComponentFixture<D3CalendarHeatmapChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3CalendarHeatmapChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3CalendarHeatmapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
