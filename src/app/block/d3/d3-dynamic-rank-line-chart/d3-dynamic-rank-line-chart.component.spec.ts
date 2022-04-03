import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3DynamicRankLineChartComponent } from './d3-dynamic-rank-line-chart.component';

describe('D3DynamicRankLineChartComponent', () => {
  let component: D3DynamicRankLineChartComponent;
  let fixture: ComponentFixture<D3DynamicRankLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3DynamicRankLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3DynamicRankLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
