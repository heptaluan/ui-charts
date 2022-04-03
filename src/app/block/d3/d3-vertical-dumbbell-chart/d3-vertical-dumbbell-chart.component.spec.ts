import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3VerticalDumbbellChartComponent } from './d3-vertical-dumbbell-chart.component';

describe('D3VerticalDumbbellChartComponent', () => {
  let component: D3VerticalDumbbellChartComponent;
  let fixture: ComponentFixture<D3VerticalDumbbellChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3VerticalDumbbellChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3VerticalDumbbellChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
