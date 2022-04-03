import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3DynamicBarChartComponent } from './d3-dynamic-bar-chart.component';

describe('D3DynamicBarChartComponent', () => {
  let component: D3DynamicBarChartComponent;
  let fixture: ComponentFixture<D3DynamicBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3DynamicBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3DynamicBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
