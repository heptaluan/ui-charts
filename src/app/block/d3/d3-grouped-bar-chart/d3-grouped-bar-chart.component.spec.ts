import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3GroupedBarChartComponent } from './d3-grouped-bar-chart.component';

describe('D3GroupedBarChartComponent', () => {
  let component: D3GroupedBarChartComponent;
  let fixture: ComponentFixture<D3GroupedBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3GroupedBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GroupedBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
