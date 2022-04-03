import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ChordChartComponent } from './d3-chord-chart.component';

describe('D3ChordChartComponent', () => {
  let component: D3ChordChartComponent;
  let fixture: ComponentFixture<D3ChordChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ChordChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ChordChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
