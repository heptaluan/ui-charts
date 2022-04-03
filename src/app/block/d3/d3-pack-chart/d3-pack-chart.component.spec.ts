import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PackChartComponent } from './d3-pack-chart.component';

describe('D3PackChartComponent', () => {
  let component: D3PackChartComponent;
  let fixture: ComponentFixture<D3PackChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PackChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PackChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
