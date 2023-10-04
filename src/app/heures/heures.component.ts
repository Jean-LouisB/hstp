import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { User } from '../models/userModel';
import { ServerService } from '../services/serveur/server.service';
import { setUser } from '../state/session/session.actions';
import { SessionState } from '../state/session/session.reducers';
import { HoursService } from '../services/hours/hours.service';


@Component({
  selector: 'app-heures',
  templateUrl: './heures.component.html',
  styleUrls: ['./heures.component.css']
})
export class HeuresComponent implements OnInit {
  user: User | null = null;

  constructor(
    private apiBDD: ServerService,
    private store: Store<{ session: SessionState }>,
    private hoursService: HoursService,
  ) { }

  ngOnInit(): void {
    this.getAutorisation()
    this.getNameUserState(); //récupération du profil de l'utilisateur
    if (this.user == null) {
      this.apiBDD.getUserProfil().subscribe((data) => {
        this.user = new User().deserialize(data)
        this.store.dispatch(setUser({ user: this.user }));
      })
    }

  }
  getNameUserState() {
    this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: { user: User | null }) => {
        this.user = userData.user;
      });
  }

  getAutorisation(){
    this.apiBDD.getAutorisationSaisie().then((autorisation: any)=>{
      this.hoursService.setAutorisationSaisie(autorisation);
    })
  }



}
