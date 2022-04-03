import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3TwoLevelTreemapChartComponent } from './d3-two-level-treemap-chart.component';

describe('D3TwoLevelTreemapChartComponent', () => {
  let component: D3TwoLevelTreemapChartComponent;
  let fixture: ComponentFixture<D3TwoLevelTreemapChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3TwoLevelTreemapChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TwoLevelTreemapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
