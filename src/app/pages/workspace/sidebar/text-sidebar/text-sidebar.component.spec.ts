import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSidebarComponent } from './text-sidebar.component';

describe('TextSidebarComponent', () => {
  let component: TextSidebarComponent;
  let fixture: ComponentFixture<TextSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
