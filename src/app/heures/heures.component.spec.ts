import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeuresComponent } from './heures.component';

describe('HeuresComponent', () => {
  let component: HeuresComponent;
  let fixture: ComponentFixture<HeuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeuresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
