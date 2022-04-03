import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3StackedLinearChartComponent } from './d3-stacked-linear-chart.component';

describe('D3StackedLinearChartComponent', () => {
  let component: D3StackedLinearChartComponent;
  let fixture: ComponentFixture<D3StackedLinearChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3StackedLinearChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3StackedLinearChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
