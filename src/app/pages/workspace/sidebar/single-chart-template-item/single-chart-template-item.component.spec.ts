import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChartTemplateItemComponent } from './single-chart-template-item.component';

describe('SingleChartTemplateItemComponent', () => {
  let component: SingleChartTemplateItemComponent;
  let fixture: ComponentFixture<SingleChartTemplateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleChartTemplateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleChartTemplateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
