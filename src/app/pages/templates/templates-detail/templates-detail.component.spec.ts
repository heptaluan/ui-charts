import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesDetailComponent } from './templates-detail.component';

describe('TemplatesDetailComponent', () => {
  let component: TemplatesDetailComponent;
  let fixture: ComponentFixture<TemplatesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
