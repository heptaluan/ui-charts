import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleChartComponent } from './toggle-chart.component';

describe('ToggleChartComponent', () => {
  let component: ToggleChartComponent;
  let fixture: ComponentFixture<ToggleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
