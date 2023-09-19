import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeuresConsulteComponent } from './heures-consulte.component';

describe('HeuresConsulteComponent', () => {
  let component: HeuresConsulteComponent;
  let fixture: ComponentFixture<HeuresConsulteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeuresConsulteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeuresConsulteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
