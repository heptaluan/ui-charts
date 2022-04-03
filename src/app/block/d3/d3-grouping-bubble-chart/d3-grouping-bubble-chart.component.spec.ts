import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3GroupingBubbleChartComponent } from './d3-grouping-bubble-chart.component';

describe('D3GroupingBubbleChartComponent', () => {
  let component: D3GroupingBubbleChartComponent;
  let fixture: ComponentFixture<D3GroupingBubbleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3GroupingBubbleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GroupingBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
