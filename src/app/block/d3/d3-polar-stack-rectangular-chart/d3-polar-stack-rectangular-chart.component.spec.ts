/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { D3PolarStackRectangularChartComponent } from './d3-polar-stack-rectangular-chart.component';

describe('D3PolarStackRectangularChartComponent', () => {
  let component: D3PolarStackRectangularChartComponent;
  let fixture: ComponentFixture<D3PolarStackRectangularChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PolarStackRectangularChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PolarStackRectangularChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
