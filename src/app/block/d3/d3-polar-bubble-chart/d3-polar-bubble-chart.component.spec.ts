import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PolarBubbleChartComponent } from './d3-polar-bubble-chart.component';

describe('D3PolarBubbleChartComponent', () => {
  let component: D3PolarBubbleChartComponent;
  let fixture: ComponentFixture<D3PolarBubbleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PolarBubbleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PolarBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
