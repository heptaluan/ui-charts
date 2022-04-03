import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3OneLevelTreemapChartComponent } from './d3-one-level-treemap-chart.component';

describe('D3OneLevelTreemapChartComponent', () => {
  let component: D3OneLevelTreemapChartComponent;
  let fixture: ComponentFixture<D3OneLevelTreemapChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3OneLevelTreemapChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3OneLevelTreemapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
