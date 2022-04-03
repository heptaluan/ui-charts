import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleSettingsComponent } from './multiple-settings.component';

describe('MultipleSettingsComponent', () => {
  let component: MultipleSettingsComponent;
  let fixture: ComponentFixture<MultipleSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
