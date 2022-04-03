import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RoundCornerPieChartComponent } from './d3-round-corner-pie-chart.component';

describe('D3RoundCornerPieChartComponent', () => {
  let component: D3RoundCornerPieChartComponent;
  let fixture: ComponentFixture<D3RoundCornerPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RoundCornerPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RoundCornerPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
