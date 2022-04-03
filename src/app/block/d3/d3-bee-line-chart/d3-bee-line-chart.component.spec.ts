import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3BeeLineChartComponent } from './d3-bee-line-chart.component';

describe('D3BeeLineChartComponent', () => {
  let component: D3BeeLineChartComponent;
  let fixture: ComponentFixture<D3BeeLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3BeeLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3BeeLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
