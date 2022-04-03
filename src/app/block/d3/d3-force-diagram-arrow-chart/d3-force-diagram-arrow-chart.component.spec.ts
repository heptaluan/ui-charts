import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ForceDiagramArrowChartComponent } from './d3-force-diagram-arrow-chart.component';

describe('D3ForceDiagramArrowChartComponent', () => {
  let component: D3ForceDiagramArrowChartComponent;
  let fixture: ComponentFixture<D3ForceDiagramArrowChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ForceDiagramArrowChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ForceDiagramArrowChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
