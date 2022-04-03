import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipLoadingComponent } from './zip-loading.component';

describe('ZipLoadingComponent', () => {
  let component: ZipLoadingComponent;
  let fixture: ComponentFixture<ZipLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZipLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZipLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
