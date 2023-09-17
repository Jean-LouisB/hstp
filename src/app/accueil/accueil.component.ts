import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/serveur/server.service';
import { Store, select } from '@ngrx/store';
import { setUser } from '../state/session/session.actions';
import { SessionState } from '../state/session/session.reducers';
import { User } from '../models/userModel';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  isConnected = false;
  user: User | null = null;
  heures_supplementaires: number = 0;
  recuperation:number = 0;
  solidarite: number = 0;

  private userSubscription: Subscription | undefined;
  constructor(
    private apiBDD: ServerService,
    private store: Store<{ session: SessionState }>
  ) {
  }
  ngOnInit(): void {
    this.getNameUserState();
    if (this.user == null) {
      this.apiBDD.getUserProfil().subscribe((data) => {
        this.user = new User().deserialize(data)
        //console.log(this.user);
        this.store.dispatch(setUser({ user: this.user }));
      })
    }
    this.apiBDD.getSoldesDuProfil()
    .then((data)=>{
      console.log(data.data);
      this.heures_supplementaires = data.data.heures_supplementaires;
      this.recuperation = data.data.recuperation;
      this.solidarite = data.data.solidarite;
    });
    
    
  }


  getNameUserState() {
    this.userSubscription = this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: { user: User | null }) => {
        this.user = userData.user;
      });

  }


}
