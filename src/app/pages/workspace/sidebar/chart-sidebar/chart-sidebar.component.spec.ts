import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSidebarComponent } from './chart-sidebar.component';

describe('ChartSidebarComponent', () => {
  let component: ChartSidebarComponent;
  let fixture: ComponentFixture<ChartSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
