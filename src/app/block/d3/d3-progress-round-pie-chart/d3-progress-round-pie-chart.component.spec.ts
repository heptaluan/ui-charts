import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ProgressRoundPieChartComponent } from './d3-progress-round-pie-chart.component';

describe('D3ProgressRoundPieChartComponent', () => {
  let component: D3ProgressRoundPieChartComponent;
  let fixture: ComponentFixture<D3ProgressRoundPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ProgressRoundPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ProgressRoundPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
