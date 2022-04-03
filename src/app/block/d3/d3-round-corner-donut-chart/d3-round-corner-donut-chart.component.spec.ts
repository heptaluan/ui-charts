import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RoundCornerDonutChartComponent } from './d3-round-corner-donut-chart.component';

describe('D3RoundCornerDonutChartComponent', () => {
  let component: D3RoundCornerDonutChartComponent;
  let fixture: ComponentFixture<D3RoundCornerDonutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RoundCornerDonutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RoundCornerDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
