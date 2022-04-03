import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneSidebarComponent } from './scene-sidebar.component';

describe('SceneSidebarComponent', () => {
  let component: SceneSidebarComponent;
  let fixture: ComponentFixture<SceneSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
