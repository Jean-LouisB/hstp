import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/userModel';
import { ServerService } from 'src/app/services/serveur/server.service';
import { setUser } from 'src/app/state/session/session.actions';
import { SessionState } from 'src/app/state/session/session.reducers';

@Component({
  selector: 'app-heures-declare',
  templateUrl: './heures-declare.component.html',
  styleUrls: ['./heures-declare.component.css']
})
export class HeuresDeclareComponent implements OnInit{
  private userSubscription: Subscription | undefined;
  user: User | null = null;
  date_debut: Date = null;
  date_fin: Date = null;
  constructor( 
    private apiBDD: ServerService,
    private store: Store<{ session: SessionState }>,
    private cookieService: CookieService,
    ){}

  ngOnInit(): void {
    this.getNameUserState();
    if (this.user == null) {
      this.apiBDD.getUserProfil().subscribe((data) => {
        this.user = new User().deserialize(data)
        this.store.dispatch(setUser({ user: this.user }));
      })
    }
    const bornesDeSaisie = this.cookieService.get('bornes');
    const bornesDeSaisieJson = JSON.parse(bornesDeSaisie);
    //const date_minimum = formatDate(mesBornesJson['date_debut'])
    this.date_debut = new Date(bornesDeSaisieJson['date_debut']);
    this.date_fin = new Date(bornesDeSaisieJson['date_fin']);
  }

  getNameUserState() {
    this.userSubscription = this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: { user: User | null }) => {
        this.user = userData.user;
      });
    }

}
