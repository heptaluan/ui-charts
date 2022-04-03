import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RelativeRadarChartComponent } from './d3-relative-radar-chart.component';

describe('D3RelativeRadarChartComponent', () => {
  let component: D3RelativeRadarChartComponent;
  let fixture: ComponentFixture<D3RelativeRadarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RelativeRadarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RelativeRadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
