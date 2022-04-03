import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ReverseLineChartComponent } from './d3-reverse-line-chart.component';

describe('D3ReverseLineChartComponent', () => {
  let component: D3ReverseLineChartComponent;
  let fixture: ComponentFixture<D3ReverseLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ReverseLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ReverseLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
