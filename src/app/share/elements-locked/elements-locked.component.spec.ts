import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementsLockedComponent } from './elements-locked.component';

describe('ElementsLockedComponent', () => {
  let component: ElementsLockedComponent;
  let fixture: ComponentFixture<ElementsLockedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementsLockedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementsLockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
