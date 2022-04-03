import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3MultipleBubbleChartComponent } from './d3-multiple-bubble-chart.component';

describe('D3MultipleBubbleChartComponent', () => {
  let component: D3MultipleBubbleChartComponent;
  let fixture: ComponentFixture<D3MultipleBubbleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3MultipleBubbleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3MultipleBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
