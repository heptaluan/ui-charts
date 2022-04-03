import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexIntroduceRegisterComponent } from './index-introduce-register.component';

describe('IndexIntroduceRegisterComponent', () => {
  let component: IndexIntroduceRegisterComponent;
  let fixture: ComponentFixture<IndexIntroduceRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexIntroduceRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexIntroduceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
