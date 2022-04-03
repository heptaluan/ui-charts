import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageTemplateItemComponent } from './image-template-item.component';

describe('ImageTemplateItemComponent', () => {
  let component: ImageTemplateItemComponent;
  let fixture: ComponentFixture<ImageTemplateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageTemplateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageTemplateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
