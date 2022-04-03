import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3WeightedTreeChartComponent } from './d3-weighted-tree-chart.component';

describe('D3WeightedTreeChartComponent', () => {
  let component: D3WeightedTreeChartComponent;
  let fixture: ComponentFixture<D3WeightedTreeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3WeightedTreeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3WeightedTreeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
