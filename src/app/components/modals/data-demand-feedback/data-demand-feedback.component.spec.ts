import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDemandFeedbackComponent } from './data-demand-feedback.component';

describe('DataDemandFeedbackComponent', () => {
  let component: DataDemandFeedbackComponent;
  let fixture: ComponentFixture<DataDemandFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataDemandFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDemandFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
