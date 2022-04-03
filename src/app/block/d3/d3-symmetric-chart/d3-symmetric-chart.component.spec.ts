import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3SymmetricChartComponent } from './d3-symmetric-chart.component';

describe('D3SymmetricChartComponent', () => {
  let component: D3SymmetricChartComponent;
  let fixture: ComponentFixture<D3SymmetricChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3SymmetricChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SymmetricChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
