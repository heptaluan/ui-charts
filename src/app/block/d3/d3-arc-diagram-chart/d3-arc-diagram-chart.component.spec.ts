import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ArcDiagramChartComponent } from './d3-arc-diagram-chart.component';

describe('D3ArcDiagramChartComponent', () => {
  let component: D3ArcDiagramChartComponent;
  let fixture: ComponentFixture<D3ArcDiagramChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ArcDiagramChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ArcDiagramChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
