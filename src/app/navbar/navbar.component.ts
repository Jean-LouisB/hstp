import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../services/serveur/server.service';
import { User } from '../models/userModel';
import { toggleConnected } from '../state/session/session.actions';
import { Store, select } from '@ngrx/store';
import { SessionState } from '../state/session/session.reducers';
import { Subscription } from 'rxjs';
import { setUser } from '../state/session/session.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  @Output() toggle : EventEmitter<void> = new EventEmitter()
  connected:boolean = false;
  user: User = new User;
  private userSubscription: Subscription | undefined;
  constructor(
    private router: Router,
    private apiBDD: ServerService,
    private store: Store<{ session: SessionState }>

    ) { }
  
  ngOnInit(): void {
    this.getNameUserState();
  }
  
   handleOnLoout(){
    this.store.dispatch(toggleConnected());
    this.store.dispatch(setUser(null));
    this.apiBDD.getLogout();
    this.router.navigate(['/login']);
   }
   toggleConnected() {
    this.toggle.emit();
  }
  getNameUserState() {
    this.userSubscription = this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: { user: User | null }) => {
        if(userData && userData.user){
          this.user = userData.user;
        }
      });
  }

}

