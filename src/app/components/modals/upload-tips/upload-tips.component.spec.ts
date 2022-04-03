import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTipsComponent } from './upload-tips.component';

describe('UploadTipsComponent', () => {
  let component: UploadTipsComponent;
  let fixture: ComponentFixture<UploadTipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadTipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
