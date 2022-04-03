import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexIntroduceComponent } from './index-introduce.component';

describe('IndexIntroduceComponent', () => {
  let component: IndexIntroduceComponent;
  let fixture: ComponentFixture<IndexIntroduceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexIntroduceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexIntroduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
