import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3TreeChartComponent } from './d3-tree-chart.component';

describe('D3TreeChartComponent', () => {
  let component: D3TreeChartComponent;
  let fixture: ComponentFixture<D3TreeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3TreeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TreeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
