import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RoseChartComponent } from './d3-rose-chart.component';

describe('D3RoseChartComponent', () => {
  let component: D3RoseChartComponent;
  let fixture: ComponentFixture<D3RoseChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RoseChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RoseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
