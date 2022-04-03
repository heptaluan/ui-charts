import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3WordCloudChartComponent } from './d3-word-cloud-chart.component';

describe('D3WordCloudChartComponent', () => {
  let component: D3WordCloudChartComponent;
  let fixture: ComponentFixture<D3WordCloudChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3WordCloudChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3WordCloudChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
