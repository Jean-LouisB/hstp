import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { User } from '../models/userModel';
import { ServerService } from '../services/serveur/server.service';
import { setUser } from '../state/session/session.actions';
import { SessionState } from '../state/session/session.reducers';

@Component({
  selector: 'app-heures',
  templateUrl: './heures.component.html',
  styleUrls: ['./heures.component.css']
})
export class HeuresComponent implements OnInit {
  user: User | null = null;
  date_debut: Date = null;
  date_fin: Date = null;
  totalDesHeuresNonValidees: number = 0;

  constructor(
    private apiBDD: ServerService,
    private store: Store<{ session: SessionState }>,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.getNameUserState();
    if (this.user == null) {
      this.apiBDD.getUserProfil().subscribe((data) => {
        this.user = new User().deserialize(data)
        this.store.dispatch(setUser({ user: this.user }));
      })
    }
    this.countHourNotValidated() 

  }
  getNameUserState() {
    this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: { user: User | null }) => {
        this.user = userData.user;
      });
  }

  countHourNotValidated() {
    this.apiBDD.getHeureHebdoUser()
      .then((data: any) => {
        const fetchTabHeure = JSON.parse(data.data);
        let monTableauDHeure = fetchTabHeure.filter((hour: any) => hour.valide === 0)
        monTableauDHeure.forEach((item: any) => {
          this.totalDesHeuresNonValidees += item.duree;
        })
      })
  }
}
