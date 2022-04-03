/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { D3DescartesHeatmapChartComponent } from './d3-descartes-heatmap-chart.component';

describe('D3DescartesHeatmapChartComponent', () => {
  let component: D3DescartesHeatmapChartComponent;
  let fixture: ComponentFixture<D3DescartesHeatmapChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3DescartesHeatmapChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3DescartesHeatmapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
