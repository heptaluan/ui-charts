import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PolarStackBarChartComponent } from './d3-polar-stack-bar-chart.component';

describe('D3PolarStackBarChartComponent', () => {
  let component: D3PolarStackBarChartComponent;
  let fixture: ComponentFixture<D3PolarStackBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PolarStackBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PolarStackBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
