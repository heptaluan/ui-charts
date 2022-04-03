import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3StackBarChartComponent } from './d3-stack-bar-chart.component';

describe('D3StackBarChartComponent', () => {
  let component: D3StackBarChartComponent;
  let fixture: ComponentFixture<D3StackBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3StackBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3StackBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
