import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RainfallVolumeLineChartComponent } from './d3-rainfall-volume-line-chart.component';

describe('D3LinegridmultipleComponent', () => {
  let component: D3RainfallVolumeLineChartComponent;
  let fixture: ComponentFixture<D3RainfallVolumeLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RainfallVolumeLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RainfallVolumeLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
