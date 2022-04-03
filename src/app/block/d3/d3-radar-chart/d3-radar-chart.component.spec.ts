import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RadarChartComponent } from './d3-radar-chart.component';

describe('D3RadarChartComponent', () => {
  let component: D3RadarChartComponent;
  let fixture: ComponentFixture<D3RadarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RadarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
