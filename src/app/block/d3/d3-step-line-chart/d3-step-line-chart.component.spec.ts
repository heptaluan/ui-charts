import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3StepLineChartComponent } from './d3-step-line-chart.component';

describe('D3StepLineChartComponent', () => {
  let component: D3StepLineChartComponent;
  let fixture: ComponentFixture<D3StepLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3StepLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3StepLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
