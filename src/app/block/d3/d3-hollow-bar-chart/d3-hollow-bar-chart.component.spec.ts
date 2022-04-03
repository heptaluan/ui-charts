import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3HollowBarChartComponent } from './d3-hollow-bar-chart.component';

describe('D3HollowBarChartComponent', () => {
  let component: D3HollowBarChartComponent;
  let fixture: ComponentFixture<D3HollowBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3HollowBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3HollowBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
