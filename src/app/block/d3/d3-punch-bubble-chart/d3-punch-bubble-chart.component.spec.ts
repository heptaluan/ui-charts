import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PunchBubbleChartComponent } from './d3-punch-bubble-chart.component';

describe('D3PunchBubbleChartComponent', () => {
  let component: D3PunchBubbleChartComponent;
  let fixture: ComponentFixture<D3PunchBubbleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PunchBubbleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PunchBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
