import { Component, OnInit } from '@angular/core';
import { heureDecToStr } from '@fabricekopf/date-france';
import { HoursService } from 'src/app/services/hours/hours.service';
import { ServerService } from 'src/app/services/serveur/server.service';
import { Arbitrage } from 'src/app/models/arbitrage.model';
import { CookieService } from 'ngx-cookie-service';
import { formatDate } from '@fabricekopf/date-france';
import { Store, select } from '@ngrx/store';
import { SessionState } from 'src/app/state/session/session.reducers';
import { User } from 'src/app/models/userModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cloture',
  templateUrl: './cloture.component.html',
  styleUrls: ['./cloture.component.css']
})
export class ClotureComponent implements OnInit {
  date_debut: Date = null;
  date_debut_str: string = '';
  date_fin: Date = null;
  date_fin_str: string = '';
  matricule: string = '';
  monTableauDHeure = [];
  totalDesHeuresValidees: number = 0;
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
  constructor(
    private mesCompteurs: HoursService,
    private apiBDD: ServerService,
    private cookieService: CookieService,
    private store: Store<{ session: SessionState }>,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.getAutorisation()
    this.mesCompteurs.getWeekHours()
      .then((fetchData) => {
        this.monTableauDHeure = fetchData['detail'].filter((hour: any) => hour.valide === 0);
        this.monTableauDHeure.forEach((hour) => {
          this.totalDesHeuresValidees += hour.duree
        })
      })
    this.getSoldes();
    this.getBornes();
    this.getNameUserState();
  }

  getSoldes() {
    this.apiBDD.getSoldesDuProfil()
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
    this.resteAVentiller = this.totalDesHeuresValidees - this.affectationAP - this.affectationHS - this.affectationJS - this.affectationRecup
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

    try {
      this.apiBDD.validateHour(arbitrage);
      this.mesCompteurs.setAutorisationSaisie(false); //une fois l'arbitrage enregistré, l'autorisation passe sur false
    } catch (error) {
      console.log(error);
    }
    this.mesCompteurs.getWeekHours()
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
   * récupère les bornes dans le cookie pour l'arbitrage
   */
  getBornes() {
    const mesBornes = this.cookieService.get('bornes');
    const mesBornesJson = JSON.parse(mesBornes) || null;
    this.date_debut = new Date(mesBornesJson['date_debut']);
    this.date_debut_str = formatDate(mesBornesJson['date_debut']).dateCourte
    this.date_fin = new Date(mesBornesJson['date_fin']);
    this.date_fin_str = formatDate(mesBornesJson['date_fin']).dateCourte
  }

  /**
   * Récupère le matricule du salarié connecté pour l'arbitrage
   */
  getNameUserState() {
    this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: { user: User | null }) => {
        this.matricule = userData.user.matricule;
        this.responsable = userData.user.responsable;
      });

  }

  /**
   * Si le salarié a déjà cloturé sa semaine, il n'a plus le droit de saisir en attendant la semaine suivante.
   * Cette requête permet de contrôler cet etat et de le rediriger si besoin.
   */
  getAutorisation() {
    this.mesCompteurs.autorisationSaisie$
      .subscribe((autorisation) => {
        if (autorisation === false) {
          this.router.navigate(['/heures/consulter'])
        }
      })
  }


}

