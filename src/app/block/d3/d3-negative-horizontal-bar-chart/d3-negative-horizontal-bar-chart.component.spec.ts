import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3NegativeHorizontalBarChartComponent } from './d3-negative-horizontal-bar-chart.component';

describe('D3NegativeHorizontalBarChartComponent', () => {
  let component: D3NegativeHorizontalBarChartComponent;
  let fixture: ComponentFixture<D3NegativeHorizontalBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3NegativeHorizontalBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3NegativeHorizontalBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
