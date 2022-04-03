import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3MultipleBarChartComponent } from './d3-multiple-bar-chart.component';

describe('D3MultipleBarChartComponent', () => {
  let component: D3MultipleBarChartComponent;
  let fixture: ComponentFixture<D3MultipleBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3MultipleBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3MultipleBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
