import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RoseDonutChartComponent } from './d3-rose-donut-chart.component';

describe('D3RoseDonutChartComponent', () => {
  let component: D3RoseDonutChartComponent;
  let fixture: ComponentFixture<D3RoseDonutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RoseDonutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RoseDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
