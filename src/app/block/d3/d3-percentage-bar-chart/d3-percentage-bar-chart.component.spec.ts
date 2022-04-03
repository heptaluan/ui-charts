import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PercentageBarChartComponent } from './d3-percentage-bar-chart.component';

describe('D3PercentageBarChartComponent', () => {
  let component: D3PercentageBarChartComponent;
  let fixture: ComponentFixture<D3PercentageBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PercentageBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PercentageBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
