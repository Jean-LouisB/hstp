import { Injectable } from '@angular/core';
import { ServerService } from '../serveur/server.service';
import { formatDate } from '@fabricekopf/date-france';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';

/**
 * Ce service fourni les observables contenant les compteurs
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class HoursService {
  //totalSubject et total$=> c'est le total d'heures enregistrées mais non validées par l'utilisateur
  private totalSubject: Subject<any> = new Subject<any>();
  total$: Observable<any> = this.totalSubject.asObservable();
  //----------------------

  constructor(
    private apiBDD: ServerService,
    private cookieService: CookieService,
  ) { }
/**
 * getWeekHours récupère les heures non validées par l'utilisateur et contenus dans les bornes.
 * Elle met à jour l'observable en plus de retourner les données.
 * Elle est utilisée dans heures-consulte.component.ts
 * @returns détail des heures non validées par l'utilisateur et le total
 */
  async getWeekHours(): Promise<any> {
    return this.apiBDD.getHeureHebdoUser()
      .then((data: any) => {
        const fetchTabHeure = JSON.parse(data.data);
        const bornesEnCours = this.getBornes()
        let monTableauDHeure = fetchTabHeure.filter((hour: any) => hour.bornes === bornesEnCours)
        monTableauDHeure.sort((a: any, b: any) => {
          const dateA = new Date(a.date_evenement.split('/').reverse().join('/')).getTime();
          const dateB = new Date(b.date_evenement.split('/').reverse().join('/')).getTime();
          return dateA - dateB;
        })
        let totalDesHeuresNonValidees = 0;
        monTableauDHeure.forEach((item: any) => {
          if(item.valide === 0){
            totalDesHeuresNonValidees += item.duree;
          }
        })
        this.totalSubject.next(totalDesHeuresNonValidees);
        return { detail: monTableauDHeure, total: totalDesHeuresNonValidees }
      })

  }


  /**
   * permet de récupérer les bornes de validations de saisie de la semaine en cours.
   * sert au filtrage
   * @returns string: les bornes en cours (bdd : bornes)
   */
  getBornes() {
    const bornesDeSaisie = this.cookieService.get('bornes');
    const bornesDeSaisieJson = JSON.parse(bornesDeSaisie);
    const date_debut = new Date(bornesDeSaisieJson['date_debut']);
    const date_fin = new Date(bornesDeSaisieJson['date_fin']);
    const debutPourBornes = formatDate(date_debut).dateCourte;
    const finPourBornes = formatDate(date_fin).dateCourte;
    const bornes = debutPourBornes + " au " + finPourBornes;
    return bornes;
  }
}