import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3GroupedHorizontalBarChartComponent } from './d3-grouped-horizontal-bar-chart.component';

describe('D3GroupedHorizontalBarChartComponent', () => {
  let component: D3GroupedHorizontalBarChartComponent;
  let fixture: ComponentFixture<D3GroupedHorizontalBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3GroupedHorizontalBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GroupedHorizontalBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
