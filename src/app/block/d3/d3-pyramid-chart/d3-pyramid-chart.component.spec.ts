import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PyramidChartComponent } from './d3-pyramid-chart.component';

describe('D3PyramidChartComponent', () => {
  let component: D3PyramidChartComponent;
  let fixture: ComponentFixture<D3PyramidChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PyramidChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PyramidChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
