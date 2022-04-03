import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3IconPieChartComponent } from './d3-icon-pie-chart.component';

describe('D3IconPieChartComponent', () => {
  let component: D3IconPieChartComponent;
  let fixture: ComponentFixture<D3IconPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3IconPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3IconPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
