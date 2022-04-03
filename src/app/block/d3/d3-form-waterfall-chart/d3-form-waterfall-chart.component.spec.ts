import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3FormWaterfallChartComponent } from './d3-form-waterfall-chart.component';

describe('D3FormWaterfallChartComponent', () => {
  let component: D3FormWaterfallChartComponent;
  let fixture: ComponentFixture<D3FormWaterfallChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3FormWaterfallChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3FormWaterfallChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
