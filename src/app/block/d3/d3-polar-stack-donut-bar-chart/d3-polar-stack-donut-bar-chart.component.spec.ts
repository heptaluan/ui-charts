import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PolarStackDonutBarChartComponent } from './d3-polar-stack-donut-bar-chart.component';

describe('D3PolarStackDonutBarChartComponent', () => {
  let component: D3PolarStackDonutBarChartComponent;
  let fixture: ComponentFixture<D3PolarStackDonutBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PolarStackDonutBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PolarStackDonutBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
