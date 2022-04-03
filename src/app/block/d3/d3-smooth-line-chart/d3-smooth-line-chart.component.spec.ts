import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3SmoothLineChartComponent } from './d3-smooth-line-chart.component';

describe('D3SmoothLineChartComponent', () => {
  let component: D3SmoothLineChartComponent;
  let fixture: ComponentFixture<D3SmoothLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3SmoothLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SmoothLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
