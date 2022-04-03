import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ChangeWaterfallChartComponent } from './d3-change-waterfall-chart.component';

describe('D3ChangeWaterfallChartComponent', () => {
  let component: D3ChangeWaterfallChartComponent;
  let fixture: ComponentFixture<D3ChangeWaterfallChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ChangeWaterfallChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ChangeWaterfallChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
