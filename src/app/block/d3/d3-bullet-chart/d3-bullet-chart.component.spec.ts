import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3BulletChartComponent } from './d3-bullet-chart.component';

describe('D3BulletChartComponent', () => {
  let component: D3BulletChartComponent;
  let fixture: ComponentFixture<D3BulletChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3BulletChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3BulletChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
