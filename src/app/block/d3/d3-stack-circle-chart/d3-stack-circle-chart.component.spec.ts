import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3StackCircleChartComponent } from './d3-stack-circle-chart.component';

describe('D3StackCircleChartComponent', () => {
  let component: D3StackCircleChartComponent;
  let fixture: ComponentFixture<D3StackCircleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3StackCircleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3StackCircleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
