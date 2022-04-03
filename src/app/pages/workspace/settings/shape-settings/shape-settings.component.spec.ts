import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeSettingsComponent } from './shape-settings.component';

describe('ShapeSettingsComponent', () => {
  let component: ShapeSettingsComponent;
  let fixture: ComponentFixture<ShapeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
