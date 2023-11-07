import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../core/services/users.service';
import { Store, select } from '@ngrx/store';
import { setBornes, setUser } from '../core/state/session/session.actions';
import { SessionState } from '../core/state/session/session.reducers';
import { User } from '../core/models/userModel';
import { Subscription } from 'rxjs';
import { heureDecToStr, formatDate } from '@fabricekopf/date-france';
import { BornesService } from '../core/services/bornes.service';



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
  errorMessage: string | null = null
  private userSubscription: Subscription | undefined;
  private bornesSubscription: Subscription | undefined;

  constructor(
    private userService: UserService,
    private borneService: BornesService,
    private store: Store<{ session: SessionState }>,

  ) {
  }
  ngOnInit(): void {
    this.getNameUserState(); //je vais chercher les données de l'utilisateur dans le store ou dans l'api
    this.getUserSoldes(); //je récupère ses soldes (uniquement pour affichage, ne sont pas ajouté au store)
    this.getBornes();

  }

/**
 * Cette requête récupère les bornes auprés du store, et le cas échéant redemande au serveur.
 * Elle donne les valeurs de :
 * this.date_debut
 * et
 * this.date_fin
 */
  private getBornes() {
    this.bornesSubscription = this.store.pipe(select(state => state.session.bornes))
      .subscribe((bornes: Date[]) => {
        if (bornes && bornes.length === 2) {
          this.date_debut = bornes[0];
          this.date_fin = bornes[1];
        }else{
          // Si le store a été rafraichi, je renvoie une requête au serveur
          this.borneService.getBornes()
          .then((bornes: Date[])=>{
            if(bornes){
              this.date_debut = bornes[0];
              this.date_fin = bornes[1];
              this.store.dispatch(setBornes({bornes:[this.date_debut, this.date_fin]}));
            }
          })
          .catch((error)=>{
            this.errorMessage = error
            console.error(error)
          })
        }
      })
    
  }


  private getUserSoldes() {
    this.userService.getSoldesDuProfil() //Je récupère les soldes pour les afficher.
      .then((data: any) => {
        this.heures_supplementaires = heureDecToStr(data.data.heuresSupMajoree);
        this.recuperation = heureDecToStr(data.data.recuperation);
        this.solidarite = heureDecToStr(data.data.solidarite);
        this.aPayer = heureDecToStr(data.data.heureAPayer);
      });
  }

  getNameUserState() {

    this.userSubscription = this.store.pipe(select(state => state.session.userState))
      .subscribe((userData:User | null ) => {
        if (userData) {
          this.user = userData;
        } else {
          this.userService.getUserProfil().subscribe((data) => {
            this.user = new User().deserialize(data)
            this.store.dispatch(setUser({ user: this.user }));
          })
        }
      });

  }

  useFormatDate(date): string {
    return formatDate(date).dateToStringWithoutHour
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.bornesSubscription) {
      this.bornesSubscription.unsubscribe();
    }
  }

}
