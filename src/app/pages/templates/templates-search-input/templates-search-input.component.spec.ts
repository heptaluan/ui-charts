import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesSearchInputComponent } from './templates-search-input.component';

describe('TemplatesSearchInputComponent', () => {
  let component: TemplatesSearchInputComponent;
  let fixture: ComponentFixture<TemplatesSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesSearchInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
