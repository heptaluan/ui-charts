import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTemplateItemComponent } from './text-template-item.component';

describe('TextTemplateItemComponent', () => {
  let component: TextTemplateItemComponent;
  let fixture: ComponentFixture<TextTemplateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextTemplateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTemplateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
