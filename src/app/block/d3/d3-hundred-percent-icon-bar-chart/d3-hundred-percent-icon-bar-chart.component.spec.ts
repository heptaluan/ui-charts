import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3HundredPercentIconBarChartComponent } from './d3-hundred-percent-icon-bar-chart.component';

describe('D3HundredPercentIconBarChartComponent', () => {
  let component: D3HundredPercentIconBarChartComponent;
  let fixture: ComponentFixture<D3HundredPercentIconBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3HundredPercentIconBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3HundredPercentIconBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
