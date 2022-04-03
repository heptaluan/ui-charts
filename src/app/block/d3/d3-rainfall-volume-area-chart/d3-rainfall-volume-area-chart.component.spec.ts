import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RainfallVolumeAreaChartComponent } from './d3-rainfall-volume-area-chart.component';

describe('D3RainfallVolumeAreaChartComponent', () => {
  let component: D3RainfallVolumeAreaChartComponent;
  let fixture: ComponentFixture<D3RainfallVolumeAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RainfallVolumeAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RainfallVolumeAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
