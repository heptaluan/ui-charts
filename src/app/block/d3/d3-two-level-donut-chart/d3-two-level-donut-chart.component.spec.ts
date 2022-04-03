import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3TwoLevelDonutChartComponent } from './d3-two-level-donut-chart.component';

describe('D3TwoLevelDonutChartComponent', () => {
  let component: D3TwoLevelDonutChartComponent;
  let fixture: ComponentFixture<D3TwoLevelDonutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3TwoLevelDonutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TwoLevelDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
