import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3SimpleSankeyChartComponent } from './d3-simple-sankey-chart.component';

describe('D3SimpleSankeyChartComponent', () => {
  let component: D3SimpleSankeyChartComponent;
  let fixture: ComponentFixture<D3SimpleSankeyChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3SimpleSankeyChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SimpleSankeyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
