import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ReverseStackedAreaChartComponent } from './d3-reverse-stacked-area-chart.component';

describe('D3ReverseStackedAreaChartComponent', () => {
  let component: D3ReverseStackedAreaChartComponent;
  let fixture: ComponentFixture<D3ReverseStackedAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ReverseStackedAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ReverseStackedAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
