import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3MixLineBarChartComponent } from './d3-mix-line-bar-chart.component';

describe('D3MixLineBarChartComponent', () => {
  let component: D3MixLineBarChartComponent;
  let fixture: ComponentFixture<D3MixLineBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3MixLineBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3MixLineBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
