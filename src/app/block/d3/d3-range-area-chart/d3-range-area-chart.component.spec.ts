import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RangeAreaChartComponent } from './d3-range-area-chart.component';

describe('D3RangeAreaChartComponent', () => {
  let component: D3RangeAreaChartComponent;
  let fixture: ComponentFixture<D3RangeAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RangeAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RangeAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
