import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ContrastiveFunnelChartComponent } from './d3-contrastive-funnel-chart.component';

describe('D3ContrastiveFunnelChartComponent', () => {
  let component: D3ContrastiveFunnelChartComponent;
  let fixture: ComponentFixture<D3ContrastiveFunnelChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ContrastiveFunnelChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ContrastiveFunnelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
