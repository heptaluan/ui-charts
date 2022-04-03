import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesItemComponent } from './templates-item.component';

describe('TemplatesItemComponent', () => {
  let component: TemplatesItemComponent;
  let fixture: ComponentFixture<TemplatesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
