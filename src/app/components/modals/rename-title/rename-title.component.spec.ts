import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameTitleComponent } from './rename-title.component';

describe('RenameTitleComponent', () => {
  let component: RenameTitleComponent;
  let fixture: ComponentFixture<RenameTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
