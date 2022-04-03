import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3SunburstChartComponent } from './d3-sunburst-chart.component';

describe('D3SunburstChartComponent', () => {
  let component: D3SunburstChartComponent;
  let fixture: ComponentFixture<D3SunburstChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3SunburstChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SunburstChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
