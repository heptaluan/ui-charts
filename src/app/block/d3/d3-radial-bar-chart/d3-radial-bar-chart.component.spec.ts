import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RadialBarChartComponent } from './d3-radial-bar-chart.component';

describe('D3RadialBarChartComponent', () => {
  let component: D3RadialBarChartComponent;
  let fixture: ComponentFixture<D3RadialBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RadialBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RadialBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
