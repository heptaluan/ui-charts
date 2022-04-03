import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoCollectModalComponent } from './user-info-collect-modal.component';

describe('UserInfoCollectModalComponent', () => {
  let component: UserInfoCollectModalComponent;
  let fixture: ComponentFixture<UserInfoCollectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInfoCollectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoCollectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
