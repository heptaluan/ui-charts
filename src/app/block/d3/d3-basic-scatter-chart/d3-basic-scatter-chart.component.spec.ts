import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3BasicScatterChartComponent } from './d3-basic-scatter-chart.component';

describe('D3BasicScatterChartComponent', () => {
  let component: D3BasicScatterChartComponent;
  let fixture: ComponentFixture<D3BasicScatterChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3BasicScatterChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3BasicScatterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
