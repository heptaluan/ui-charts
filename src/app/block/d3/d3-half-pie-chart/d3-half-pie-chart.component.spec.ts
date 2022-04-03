import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3HalfPieChartComponent } from './d3-half-pie-chart.component';

describe('D3HalfPieChartComponent', () => {
  let component: D3HalfPieChartComponent;
  let fixture: ComponentFixture<D3HalfPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3HalfPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3HalfPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
