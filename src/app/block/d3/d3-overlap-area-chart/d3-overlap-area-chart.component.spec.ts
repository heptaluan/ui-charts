import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3OverlapAreaChartComponent } from './d3-overlap-area-chart.component';

describe('D3OverlapAreaChartComponent', () => {
  let component: D3OverlapAreaChartComponent;
  let fixture: ComponentFixture<D3OverlapAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3OverlapAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3OverlapAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
