import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeuresValideComponent } from './heures-valide.component';

describe('HeuresValideComponent', () => {
  let component: HeuresValideComponent;
  let fixture: ComponentFixture<HeuresValideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeuresValideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeuresValideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
