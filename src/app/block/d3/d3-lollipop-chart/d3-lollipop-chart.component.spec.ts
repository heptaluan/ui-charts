import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3LollipopChartComponent } from './d3-lollipop-chart.component';

describe('D3LollipopChartComponent', () => {
  let component: D3LollipopChartComponent;
  let fixture: ComponentFixture<D3LollipopChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3LollipopChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3LollipopChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
