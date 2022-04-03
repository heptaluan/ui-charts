import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PolarAreaChartComponent } from './d3-polar-area-chart.component';

describe('D3PolarAreaChartComponent', () => {
  let component: D3PolarAreaChartComponent;
  let fixture: ComponentFixture<D3PolarAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PolarAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PolarAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
