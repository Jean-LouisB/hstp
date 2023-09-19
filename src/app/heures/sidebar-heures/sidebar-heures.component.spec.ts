import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarHeuresComponent } from './sidebar-heures.component';

describe('SidebarHeuresComponent', () => {
  let component: SidebarHeuresComponent;
  let fixture: ComponentFixture<SidebarHeuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarHeuresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarHeuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
