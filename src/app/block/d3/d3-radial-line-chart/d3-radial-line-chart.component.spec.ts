import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RadialLineChartComponent } from './d3-radial-line-chart.component';

describe('D3RadialLineChartComponent', () => {
  let component: D3RadialLineChartComponent;
  let fixture: ComponentFixture<D3RadialLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RadialLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RadialLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
