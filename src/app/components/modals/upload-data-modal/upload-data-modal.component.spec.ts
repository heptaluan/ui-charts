import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDataModalComponent } from './upload-data-modal.component';

describe('UploadDataModalComponent', () => {
  let component: UploadDataModalComponent;
  let fixture: ComponentFixture<UploadDataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDataModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
