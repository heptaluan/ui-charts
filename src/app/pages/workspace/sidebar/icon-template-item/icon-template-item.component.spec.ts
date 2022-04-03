import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTemplateItemComponent } from './icon-template-item.component';

describe('IconTemplateItemComponent', () => {
  let component: IconTemplateItemComponent;
  let fixture: ComponentFixture<IconTemplateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconTemplateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconTemplateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
