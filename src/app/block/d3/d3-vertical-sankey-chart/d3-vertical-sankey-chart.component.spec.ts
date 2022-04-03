import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3VerticalSankeyChartComponent } from './d3-vertical-sankey-chart.component';

describe('D3VerticalSankeyChartComponent', () => {
  let component: D3VerticalSankeyChartComponent;
  let fixture: ComponentFixture<D3VerticalSankeyChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3VerticalSankeyChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3VerticalSankeyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
