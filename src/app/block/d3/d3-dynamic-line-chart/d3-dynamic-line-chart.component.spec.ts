import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3DynamicLineChartComponent } from './d3-dynamic-line-chart.component';

describe('D3DynamicLineChartComponent', () => {
  let component: D3DynamicLineChartComponent;
  let fixture: ComponentFixture<D3DynamicLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3DynamicLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3DynamicLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
