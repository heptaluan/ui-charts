import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneTemplateItemComponent } from './scene-template-item.component';

describe('SceneTemplateItemComponent', () => {
  let component: SceneTemplateItemComponent;
  let fixture: ComponentFixture<SceneTemplateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneTemplateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneTemplateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
