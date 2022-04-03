import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3FunnelChartComponent } from './d3-funnel-chart.component';

describe('D3FunnelChartComponent', () => {
  let component: D3FunnelChartComponent;
  let fixture: ComponentFixture<D3FunnelChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3FunnelChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3FunnelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
