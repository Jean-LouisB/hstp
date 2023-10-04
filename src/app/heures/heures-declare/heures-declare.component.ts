import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Heure } from 'src/app/models/heureModel';
import { formatDate } from '@fabricekopf/date-france';
import { ServerService } from 'src/app/services/serveur/server.service';
import { Store, select } from '@ngrx/store';
import { SessionState } from 'src/app/state/session/session.reducers';
import { User } from 'src/app/models/userModel';
import { HoursService } from 'src/app/services/hours/hours.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-heures-declare',
  templateUrl: './heures-declare.component.html',
  styleUrls: ['./heures-declare.component.css']
})
export class HeuresDeclareComponent implements OnInit {
  matricule: string = null;
  date_debut: Date = null;
  date_fin: Date = null;
  dateEvenement: Date = null;
  sens: string = null;
  heureDebut: string = null;
  heureFin: string = null;
  commentaire: string = null;
  msgErreurTemps: string = null;
  validationPossible: boolean = false;
  openMessageBoxValidation: boolean = false;

  constructor(
    private cookieService: CookieService,
    private apiDBB: ServerService,
    private store: Store<{ session: SessionState }>,
    private mesCompteurs: HoursService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.getAutorisation()
    this.getNameUserState();
    this.getDatesDeSaisie();
  }
  /**
   * récupère les bornes de saisie dans le cookie afin de brider le champs date.
   */
  getDatesDeSaisie() {
    const bornesDeSaisie = this.cookieService.get('bornes');
    const bornesDeSaisieJson = JSON.parse(bornesDeSaisie);
    this.date_debut = new Date(bornesDeSaisieJson['date_debut']);
    this.date_fin = new Date(bornesDeSaisieJson['date_fin']);
  }

  /**
   * Vérifie si le temps saisi n'est pas négatif (fin<début).
   * si oui, bloque la validation et affiche un message d'alerte.
   * @returns temps en décimale entre deux horaires.
   */
  getTemps() {
    const heureDebutDec = this.getHeureStrToDec(this.heureDebut);
    const heureFinDec = this.getHeureStrToDec(this.heureFin);
    const temps = heureFinDec - heureDebutDec;
    if (temps < 0) {
      this.msgErreurTemps = "L'heure de fin doit être postérieure à l'heure de début, vérifiez votre saisie"
      this.validationPossible = false;
    } else {
      this.msgErreurTemps = null
      this.validationPossible = true;
    }

    if (this.sens === "-1") {
      return temps * -1;
    } else {
      return temps;
    }

  }

  /**
   * Transforme une chaine '00h00' en décimale.
   * ex : 10h30 => 10,5
   * @param heure en chaine de caractère avec un h comme séparateur et sans espace
   * @returns un décimal
   */
  getHeureStrToDec(heure: string) {
    const heureMinuscule = heure.toLowerCase();
    const heureSplited = heureMinuscule.split('h');
    const heureValueDec = parseInt(heureSplited[0]);
    let minutesValueDec= 0;
    if(heureSplited[1]){
      minutesValueDec = parseInt(heureSplited[1]) / 60;
    }

    return heureValueDec + minutesValueDec;
  }

  /**
   * Envoie la nouvelle heure à la bdd.
   */
  sendNewHour() {
    const debutPourBornes = formatDate(this.date_debut).dateCourte;
    const finPourBornes = formatDate(this.date_fin).dateCourte;
    const bornes = debutPourBornes + " au " + finPourBornes;
    const duree = this.getTemps();
    const dateEv = formatDate(this.dateEvenement).dateCourte
    const commentaireComplete = "De " + this.heureDebut + " à " + this.heureFin + " => " + this.commentaire
    const newHour = new Heure(this.matricule, bornes, duree, commentaireComplete, dateEv)
    this.apiDBB.putHeureHebdo(newHour);
    this.dateEvenement = this.sens = this.heureDebut = this.heureFin = this.commentaire = this.msgErreurTemps = null;
    this.validationPossible = false;
    this.openMessageBoxValidation = true;
  }

  /**
   * Après la saisie du champ 'heure de fin' verifie si la différence entre les deux horaires n'est pas négative.
   * Sinon affiche l'alerte.
   * Puis contrôle la validation du formulaire (en cas de correction apportée)
   */
  controleSaisie() {
    this.getTemps();
    this.accepteLaSasie();
  }

  /**
   * A chaque sortie de champs, vérifi si tous les champs sont remplis et qu'il n'y ai pas d'erreur. Si oui l'attribut validationPossible active le bouton 'valider' du formulaire.
   * 
   */
  accepteLaSasie() {
    if (this.dateEvenement != null && this.sens != null && this.heureDebut != null && this.heureFin != null && this.commentaire != null && this.msgErreurTemps == null) {
      this.validationPossible = true;
    }
  }

  toggelMsgBox() {
    this.openMessageBoxValidation = !this.openMessageBoxValidation;
  }

  getNameUserState() {
    this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: { user: User | null }) => {
        this.matricule = userData.user.matricule;
      });

  }
  getAutorisation(){
    this.mesCompteurs.autorisationSaisie$
    .subscribe((auto)=>{
      if(auto === false){
        this.router.navigate(['/heures/consulter'])
      }
    })
  }
  

}
