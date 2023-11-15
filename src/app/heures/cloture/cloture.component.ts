import { Component, OnDestroy, OnInit } from '@angular/core';
import { heureDecToStr } from '@fabricekopf/date-france';
import { UserService } from 'src/app/core/services/users.service';
import { Arbitrage } from 'src/app/core/models/arbitrage.model';
import { formatDate } from '@fabricekopf/date-france';
import { Store, select } from '@ngrx/store';
import { SessionState } from 'src/app/core/state/session/session.reducers';
import { getBornes } from 'src/app/core/state/session/session.selectors';
import { User } from 'src/app/core/models/userModel';
import { Heure } from 'src/app/core/models/heureModel';
import { Subscription } from 'rxjs';
import { BornesService } from 'src/app/core/services/bornes.service';
import { setBornes } from 'src/app/core/state/session/session.actions';
import { ArbitrageService } from 'src/app/core/services/arbitrage.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-cloture',
  templateUrl: './cloture.component.html',
  styleUrls: ['./cloture.component.css']
})
export class ClotureComponent implements OnInit, OnDestroy{
  date_debut: Date = null;
  date_debut_str: string = '';
  date_fin: Date = null;
  date_fin_str: string = '';
  matricule: string = '';
  monTableauDHeure = [];
  totalDesHeuresAVentillees: number = 0;
  bornes: string = null;
  //soldes en str et dec: 
  heures_supplementaires: string = '';
  heures_supplementairesDec: number = 0;
  recuperation: string = '';
  recuperationDec: number = 0;
  solidarite: string = '';
  solidariteDec: number = 0;
  aPayer: string = '';
  aPayerDec: number = 0;
  //pour calcul de la ventillation :
  resteAVentiller: number = 0;
  affectationJS: number = 0;
  affectationRecup: number = 0;
  affectationHS: number = 0;
  heuresSuppAffecteeMajoree: number = 0
  affectationAP: number = 0;
  //commutateur
  modifiVentillation: boolean = false;
  //Nom du responsable
  responsable: string = ''
  //message d'erreur:
  errorMessage: string | null = null


  private bornesSubscription: Subscription | undefined;
  constructor(
    private userService: UserService,
    private store: Store<{ session: SessionState }>,
    private borneService: BornesService,
    private arbitrageService: ArbitrageService
  ) { }



  ngOnInit(): void {
    this.getSoldes();
    this.getBornes();
    this.getNameUserState();
    this.getCurrentHoursToBeAllocate();
  }

  /**
   * getSoldes va chercher les soldes dans la collection 'compteurs_heures' (donc les arbitrages validés)
   * 
   */
  getSoldes() {
    this.userService.getSoldesDuProfil()
      .then((data: any) => {
        this.heures_supplementaires = heureDecToStr(data.data.heuresSupMajoree);
        this.heures_supplementairesDec = data.data.heuresSupMajoree;
        this.recuperation = heureDecToStr(data.data.recuperation);
        this.recuperationDec = data.data.recuperation;
        this.solidarite = heureDecToStr(data.data.solidarite);
        this.solidariteDec = data.data.solidarite;
        this.aPayerDec = data.data.heureAPayer;
        this.aPayer = heureDecToStr(data.data.heureAPayer);
        this.calculSoldeAVentiller()
      });
  }

  calculSoldeAVentiller() {
    this.modifiVentillation = false;
    this.resteAVentiller = this.totalDesHeuresAVentillees - this.affectationAP - this.affectationHS - this.affectationJS - this.affectationRecup
  }


  /**
   * Valide la ventilation. Crée un arbitrage et l'envoi en paramètre au serveur
   * @param id string: c'est l'id de l'heure à valider
   */
  validateHour() {
    this.majoreHeuresSupp()
    let arbitrage = new Arbitrage();
    let statusPaiement = 0;
    if (this.affectationAP > 0) {
      statusPaiement = 1
    }
    const commentaire_avec_dates = "Arbitrage de la semaine du " + this.date_debut_str + " au " + this.date_fin_str
    let ventillation = {
      matricule: this.matricule,
      date: new Date(),
      commentaire: commentaire_avec_dates,
      solidarite: this.affectationJS,
      recuperation: this.affectationRecup,
      heuresSupMajoree: this.heuresSuppAffecteeMajoree,
      heureAPayer: this.affectationAP,
      respValidationStatus: 0,
      respDateValidation: null,
      paiementStatus: statusPaiement,
      datePaiement: null,
      responsable: this.responsable,
    }
    arbitrage.deserialize(ventillation);
    const reponse = this.arbitrageService.putNewArbitrage(arbitrage, this.monTableauDHeure)
   
  }


  /**
   * Pour pouvoir l'utiliser dans le template
   * @param decimale 
   * @returns 
   */
  heureDecimaleEnStr(decimale: number) {
    return heureDecToStr(decimale);
  }

  /**
   * Commutateur d'affichage.
   * Fait apparaitre ou non les boutons lorsque la répartition est complète.
   */
  commute() {
    this.modifiVentillation = !this.modifiVentillation
  }

  /**
   * Calcul le temps majoré pour l'arbitrage
   */
  majoreHeuresSupp() {
    if (this.affectationHS > 0) {
      if (this.affectationHS <= 8) {
        this.heuresSuppAffecteeMajoree = this.affectationHS * 1.25;
      } else {
        this.heuresSuppAffecteeMajoree = (8 * 1.25) + ((this.affectationHS - 8) * 1.5);
      }
    } else {
      this.heuresSuppAffecteeMajoree = this.affectationHS;
    }
  }

  /**
   * récupère les bornes pour l'arbitrage
   */
  private getBornes() {
    this.bornesSubscription = this.store.pipe(select(state => state.session.bornes))
      .subscribe((bornes: Date[]) => {
        if (bornes && bornes.length === 2) {
          this.date_debut = formatDate(bornes[0]).dateToStringWithoutHour;
          this.date_debut_str = formatDate(bornes[0]).dateCourte;
          this.date_fin = formatDate(bornes[1]).dateToStringWithoutHour;
          this.date_fin_str = formatDate(bornes[1]).dateCourte;
        }else{
          // Si le store a été rafraichi, je renvoie une requête au serveur
          this.borneService.getBornes()
          .then((bornes: Date[])=>{
            if(bornes){
              this.date_debut = formatDate(bornes[0]).dateToStringWithoutHour;
              this.date_fin = formatDate(bornes[1]).dateToStringWithoutHour;
              this.store.dispatch(setBornes({bornes:[bornes[0], bornes[1]]}));
            }
          })
          .catch((error)=>{
            this.errorMessage = error
            console.error(error)
          })
        }
      })
    
  }
  /**
   * Récupère le matricule du salarié connecté pour l'arbitrage
   */
  getNameUserState() {
    this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: User | null) => {
        this.matricule = userData.matricule;
        this.responsable = userData.responsable;
      });

  }

  getCurrentHoursToBeAllocate() {
    this.userService.getHeureHebdoUser().then((data: any) => {
      const fetchData = JSON.parse(data.data);
      fetchData.forEach((heure: Heure) => {
        if (heure.valide === 0) {
          this.monTableauDHeure.push(heure)
          this.totalDesHeuresAVentillees += heure.duree
        }
      });

    })
  }
  ngOnDestroy(): void {
    if(this.bornesSubscription){
      this.bornesSubscription.unsubscribe();
    }
  }
}

