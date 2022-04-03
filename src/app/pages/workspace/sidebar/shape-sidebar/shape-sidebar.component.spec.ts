import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeSidebarComponent } from './shape-sidebar.component';

describe('ShapeSidebarComponent', () => {
  let component: ShapeSidebarComponent;
  let fixture: ComponentFixture<ShapeSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
