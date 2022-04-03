import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ForceDiagramChartComponent } from './d3-force-diagram-chart.component';

describe('D3ForceDiagramChartComponent', () => {
  let component: D3ForceDiagramChartComponent;
  let fixture: ComponentFixture<D3ForceDiagramChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ForceDiagramChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ForceDiagramChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
