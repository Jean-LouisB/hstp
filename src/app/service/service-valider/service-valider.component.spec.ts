import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceValiderComponent } from './service-valider.component';

describe('ServiceValiderComponent', () => {
  let component: ServiceValiderComponent;
  let fixture: ComponentFixture<ServiceValiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceValiderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceValiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
