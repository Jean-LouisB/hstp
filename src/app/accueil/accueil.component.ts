import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServerService } from '../services/serveur/server.service';
import { Store, select } from '@ngrx/store';
import { setUser } from '../state/session/session.actions';
import { SessionState } from '../state/session/session.reducers';
import { User } from '../models/userModel';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { heureDecToStr, formatDate } from '@fabricekopf/date-france';



@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, OnDestroy {
  isConnected = false;
  user: User | null = null;
  heures_supplementaires: string = '';
  recuperation: string = '';
  solidarite: string = '';
  aPayer: string = "";
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
    this.getNameUserState(); //je vais chercher les données de l'utilisateur dans le store ou dans l'api
    this.getUserSoldes(); //je récupère ses soldes (uniquement pour affichage, ne sont pas ajouté au store)
    this.getBornes();

  }


  private getBornes() {
    const mesBornes = this.cookieService.get('bornes');
    const mesBornesJson = JSON.parse(mesBornes) || null;
    this.date_debut = new Date(mesBornesJson['date_debut']);
    this.date_fin = new Date(mesBornesJson['date_fin']);
  }

  private getUserSoldes() {
    this.apiBDD.getSoldesDuProfil() //Je récupère les soldes pour les afficher.
      .then((data: any) => {
        this.heures_supplementaires = heureDecToStr(data.data.heuresSupMajoree);
        this.recuperation = heureDecToStr(data.data.recuperation);
        this.solidarite = heureDecToStr(data.data.solidarite);
        this.aPayer = heureDecToStr(data.data.heureAPayer);
      });
  }

  getNameUserState() {

    this.userSubscription = this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: { user: User | null }) => {
        if (userData) {
          this.user = userData.user;
        } else {
          this.apiBDD.getUserProfil().subscribe((data) => {
            this.user = new User().deserialize(data)
            this.store.dispatch(setUser({ user: this.user }));
          })
        }
      });

  }

  useFormatDate(date): string{
    return formatDate(date).dateToStringWithoutHour
  }

  ngOnDestroy() {
    if (!this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
