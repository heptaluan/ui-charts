import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3IconBarChartComponent } from './d3-icon-bar-chart.component';

describe('D3IconBarChartComponent', () => {
  let component: D3IconBarChartComponent;
  let fixture: ComponentFixture<D3IconBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3IconBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3IconBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
