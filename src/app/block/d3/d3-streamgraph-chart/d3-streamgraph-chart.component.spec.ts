import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3StreamgraphChartComponent } from './d3-streamgraph-chart.component';

describe('D3StreamgraphChartComponent', () => {
  let component: D3StreamgraphChartComponent;
  let fixture: ComponentFixture<D3StreamgraphChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3StreamgraphChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3StreamgraphChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
