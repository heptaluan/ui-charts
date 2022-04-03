import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSidebarComponent } from './image-sidebar.component';

describe('ImageSidebarComponent', () => {
  let component: ImageSidebarComponent;
  let fixture: ComponentFixture<ImageSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
