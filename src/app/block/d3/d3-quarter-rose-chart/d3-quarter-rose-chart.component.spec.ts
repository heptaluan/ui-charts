import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3QuarterRoseChartComponent } from './d3-quarter-rose-chart.component';

describe('D3QuarterRoseChartComponent', () => {
  let component: D3QuarterRoseChartComponent;
  let fixture: ComponentFixture<D3QuarterRoseChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3QuarterRoseChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3QuarterRoseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
