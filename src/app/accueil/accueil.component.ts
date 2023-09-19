import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/serveur/server.service';
import { Store, select } from '@ngrx/store';
import { setUser } from '../state/session/session.actions';
import { SessionState } from '../state/session/session.reducers';
import { User } from '../models/userModel';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { heureDecToStr } from '@fabricekopf/date-france';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  isConnected = false;
  user: User | null = null;
  heures_supplementaires: string = '';
  recuperation: string = '';
  solidarite: string = '';
  date_debut: Date = null;
  date_fin: Date = null;

  private userSubscription: Subscription | undefined;
  constructor(
    private apiBDD: ServerService,
    private store: Store<{ session: SessionState }>,
    private cookieService: CookieService,
  ) {
  }
  ngOnInit(): void {
    this.getNameUserState();
    if (this.user == null) {
      this.apiBDD.getUserProfil().subscribe((data) => {
        this.user = new User().deserialize(data)
        this.store.dispatch(setUser({ user: this.user }));
      })
    }
    this.apiBDD.getSoldesDuProfil()
      .then((data) => {
        this.heures_supplementaires = heureDecToStr(data.data.heures_supplementaires);
        this.recuperation = heureDecToStr(data.data.recuperation);
        this.solidarite = heureDecToStr(data.data.solidarite);
      });
    const mesBornes = this.cookieService.get('bornes');
    const mesBornesJson = JSON.parse(mesBornes);
    //const date_minimum = formatDate(mesBornesJson['date_debut'])
    this.date_debut = new Date(mesBornesJson['date_debut']);
    this.date_fin = new Date(mesBornesJson['date_fin']);

  }


  getNameUserState() {
    this.userSubscription = this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: { user: User | null }) => {
        this.user = userData.user;
      });

  }


}
