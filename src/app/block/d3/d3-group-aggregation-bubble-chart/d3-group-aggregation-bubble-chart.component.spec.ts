import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3GroupAggregationBubbleChartComponent } from './d3-group-aggregation-bubble-chart.component';

describe('D3GroupAggregationBubbleChartComponent', () => {
  let component: D3GroupAggregationBubbleChartComponent;
  let fixture: ComponentFixture<D3GroupAggregationBubbleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3GroupAggregationBubbleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GroupAggregationBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
