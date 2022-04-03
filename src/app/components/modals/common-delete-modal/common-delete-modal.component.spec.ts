import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDeleteModalComponent } from './common-delete-modal.component';

describe('CommonDeleteModalComponent', () => {
  let component: CommonDeleteModalComponent;
  let fixture: ComponentFixture<CommonDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
