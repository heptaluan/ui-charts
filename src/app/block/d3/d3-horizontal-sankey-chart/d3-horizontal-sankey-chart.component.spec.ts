import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3HorizontalSankeyChartComponent } from './d3-horizontal-sankey-chart.component';

describe('D3HorizontalSankeyChartComponent', () => {
  let component: D3HorizontalSankeyChartComponent;
  let fixture: ComponentFixture<D3HorizontalSankeyChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3HorizontalSankeyChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3HorizontalSankeyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
