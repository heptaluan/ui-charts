import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3SlopeChartComponent } from './d3-slope-chart.component';

describe('D3SlopeChartComponent', () => {
  let component: D3SlopeChartComponent;
  let fixture: ComponentFixture<D3SlopeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3SlopeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SlopeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
