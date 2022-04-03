import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeTemplateItemComponent } from './shape-template-item.component';

describe('ShapeTemplateItemComponent', () => {
  let component: ShapeTemplateItemComponent;
  let fixture: ComponentFixture<ShapeTemplateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeTemplateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeTemplateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
