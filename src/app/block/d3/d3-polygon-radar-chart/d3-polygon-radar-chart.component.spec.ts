import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PolygonRadarChartComponent } from './d3-polygon-radar-chart.component';

describe('D3PolygonRadarChartComponent', () => {
  let component: D3PolygonRadarChartComponent;
  let fixture: ComponentFixture<D3PolygonRadarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PolygonRadarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PolygonRadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
