import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeuresDeclareComponent } from './heures-declare.component';

describe('HeuresDeclareComponent', () => {
  let component: HeuresDeclareComponent;
  let fixture: ComponentFixture<HeuresDeclareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeuresDeclareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeuresDeclareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
