import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCard2Component } from './user-card2.component';

describe('UserCard2Component', () => {
  let component: UserCard2Component;
  let fixture: ComponentFixture<UserCard2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCard2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
