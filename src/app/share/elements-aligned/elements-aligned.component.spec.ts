import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementsAlignedComponent } from './elements-aligned.component';

describe('ElementsAlignedComponent', () => {
  let component: ElementsAlignedComponent;
  let fixture: ComponentFixture<ElementsAlignedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementsAlignedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementsAlignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
