import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3RankingChangeChartComponent } from './d3-ranking-change-chart.component';

describe('D3RankingChangeChartComponent', () => {
  let component: D3RankingChangeChartComponent;
  let fixture: ComponentFixture<D3RankingChangeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3RankingChangeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3RankingChangeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
