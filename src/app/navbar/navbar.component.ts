import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../services/serveur/server.service';
import { User } from '../models/userModel';
import { toggleConnected } from '../state/session/session.actions';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  @Output() toggle : EventEmitter<void> = new EventEmitter()
  connected:boolean = false;
  user: User = new User;
  constructor(
    private router: Router,
    private apiBDD: ServerService,
    private store: Store,


    ) { }
  
  ngOnInit(): void {

  }
   handleOnLoout(){
    this.store.dispatch(toggleConnected());
    this.apiBDD.getLogout();
    this.router.navigate(['/login']);
   }
   toggleConnected() {
    this.toggle.emit();
  }



}

