import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConsulterComponent } from './service-consulter.component';

describe('ServiceConsulterComponent', () => {
  let component: ServiceConsulterComponent;
  let fixture: ComponentFixture<ServiceConsulterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceConsulterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceConsulterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
