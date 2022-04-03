import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PolarLineChartComponent } from './d3-polar-line-chart.component';

describe('D3PolarLineChartComponent', () => {
  let component: D3PolarLineChartComponent;
  let fixture: ComponentFixture<D3PolarLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PolarLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PolarLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
