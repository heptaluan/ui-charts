import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3StackHorizontalBarChartComponent } from './d3-stack-horizontal-bar-chart.component';

describe('D3StackHorizontalBarChartComponent', () => {
  let component: D3StackHorizontalBarChartComponent;
  let fixture: ComponentFixture<D3StackHorizontalBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3StackHorizontalBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3StackHorizontalBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
