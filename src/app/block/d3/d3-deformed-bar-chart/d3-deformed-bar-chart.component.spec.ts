import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3DeformedBarChartComponent } from './d3-deformed-bar-chart.component';

describe('D3DeformedBarChartComponent', () => {
  let component: D3DeformedBarChartComponent;
  let fixture: ComponentFixture<D3DeformedBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3DeformedBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3DeformedBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
