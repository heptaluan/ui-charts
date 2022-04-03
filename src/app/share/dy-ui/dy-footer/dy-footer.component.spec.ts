import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyFooterComponent } from './dy-footer.component';

describe('DyFooterComponent', () => {
  let component: DyFooterComponent;
  let fixture: ComponentFixture<DyFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
