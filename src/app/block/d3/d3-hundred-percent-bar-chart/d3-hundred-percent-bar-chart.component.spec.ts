import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3HundredPercentBarChartComponent } from './d3-hundred-percent-bar-chart.component';

describe('D3HundredPercentBarChartComponent', () => {
  let component: D3HundredPercentBarChartComponent;
  let fixture: ComponentFixture<D3HundredPercentBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3HundredPercentBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3HundredPercentBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
