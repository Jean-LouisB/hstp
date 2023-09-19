import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeuresArchivesComponent } from './heures-archives.component';

describe('HeuresArchivesComponent', () => {
  let component: HeuresArchivesComponent;
  let fixture: ComponentFixture<HeuresArchivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeuresArchivesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeuresArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
