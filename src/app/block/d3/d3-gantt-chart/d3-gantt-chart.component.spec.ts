import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3GanttChartComponent } from './d3-gantt-chart.component';

describe('D3GanttChartComponent', () => {
  let component: D3GanttChartComponent;
  let fixture: ComponentFixture<D3GanttChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3GanttChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GanttChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
