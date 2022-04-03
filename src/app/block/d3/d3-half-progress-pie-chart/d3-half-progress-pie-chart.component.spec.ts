import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3HalfProgressPieChartComponent } from './d3-half-progress-pie-chart.component';

describe('D3HalfProgressPieChartComponent', () => {
  let component: D3HalfProgressPieChartComponent;
  let fixture: ComponentFixture<D3HalfProgressPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3HalfProgressPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3HalfProgressPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
