import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3DeformedPieChartComponent } from './d3-deformed-pie-chart.component';

describe('D3DeformedPieChartComponent', () => {
  let component: D3DeformedPieChartComponent;
  let fixture: ComponentFixture<D3DeformedPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3DeformedPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3DeformedPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
