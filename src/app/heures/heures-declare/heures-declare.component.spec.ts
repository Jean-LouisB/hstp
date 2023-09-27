import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import * as formSession from '../../state/index'
import { HeuresDeclareComponent } from './heures-declare.component';

describe('HeuresDeclareComponent', () => {
  let component: HeuresDeclareComponent;
  let fixture: ComponentFixture<HeuresDeclareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeuresDeclareComponent ],
      imports:[
        StoreModule.forRoot(formSession.reducers)
      ]
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
