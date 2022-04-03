import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PercentageAreaChartComponent } from './d3-percentage-area-chart.component';

describe('D3PercentageAreaChartComponent', () => {
  let component: D3PercentageAreaChartComponent;
  let fixture: ComponentFixture<D3PercentageAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PercentageAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PercentageAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
