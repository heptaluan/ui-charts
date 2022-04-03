import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3StackedAreaChartComponent } from './d3-stacked-area-chart.component';

describe('D3StackedAreaChartComponent', () => {
  let component: D3StackedAreaChartComponent;
  let fixture: ComponentFixture<D3StackedAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3StackedAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3StackedAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
