import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3SimpleLineChartComponent } from './d3-simple-line-chart.component';

describe('D3SimpleLineChartComponent', () => {
  let component: D3SimpleLineChartComponent;
  let fixture: ComponentFixture<D3SimpleLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3SimpleLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SimpleLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
