import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ReverseOverlapAreaChartComponent } from './d3-reverse-overlap-area-chart.component';

describe('D3ReverseOverlapAreaChartComponent', () => {
  let component: D3ReverseOverlapAreaChartComponent;
  let fixture: ComponentFixture<D3ReverseOverlapAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ReverseOverlapAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ReverseOverlapAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
