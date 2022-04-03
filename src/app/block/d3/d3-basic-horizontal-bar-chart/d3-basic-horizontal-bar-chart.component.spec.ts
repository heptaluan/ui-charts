import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3BasicHorizontalBarChartComponent } from './d3-basic-horizontal-bar-chart.component';

describe('D3BasicHorizontalBarChartComponent', () => {
  let component: D3BasicHorizontalBarChartComponent;
  let fixture: ComponentFixture<D3BasicHorizontalBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3BasicHorizontalBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3BasicHorizontalBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
