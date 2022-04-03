import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteTemplateComponent } from './favorite-template.component';

describe('FavoriteTemplateComponent', () => {
  let component: FavoriteTemplateComponent;
  let fixture: ComponentFixture<FavoriteTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
