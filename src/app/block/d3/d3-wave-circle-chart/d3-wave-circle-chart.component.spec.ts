import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3WaveCircleChartComponent } from './d3-wave-circle-chart.component';

describe('D3WaveCircleChartComponent', () => {
  let component: D3WaveCircleChartComponent;
  let fixture: ComponentFixture<D3WaveCircleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3WaveCircleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3WaveCircleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
