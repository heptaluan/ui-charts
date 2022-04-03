import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3BarProgressChartComponent } from './d3-bar-progress-chart.component';

describe('D3BarProgressChartComponent', () => {
  let component: D3BarProgressChartComponent;
  let fixture: ComponentFixture<D3BarProgressChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3BarProgressChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3BarProgressChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
