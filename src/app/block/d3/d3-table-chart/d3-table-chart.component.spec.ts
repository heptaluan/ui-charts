import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3TableChartComponent } from './d3-table-chart.component';

describe('D3TableChartComponent', () => {
  let component: D3TableChartComponent;
  let fixture: ComponentFixture<D3TableChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3TableChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TableChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
