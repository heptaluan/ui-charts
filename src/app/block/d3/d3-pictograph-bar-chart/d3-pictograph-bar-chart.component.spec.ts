import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PictographBarChartComponent } from './d3-pictograph-bar-chart.component';

describe('D3PictographBarChartComponent', () => {
  let component: D3PictographBarChartComponent;
  let fixture: ComponentFixture<D3PictographBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PictographBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PictographBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
