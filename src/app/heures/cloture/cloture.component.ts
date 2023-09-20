import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/serveur/server.service';
import { heureDecToStr } from '@fabricekopf/date-france';
import { formatDate } from '@fabricekopf/date-france';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cloture',
  templateUrl: './cloture.component.html',
  styleUrls: ['./cloture.component.css']
})
export class ClotureComponent implements OnInit {
  monTableauDHeure = [];
  totalDesHeuresValidees: number = 0;
  bornes: string = null;
  constructor(
    private apiBDD: ServerService,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.getHoursValidated();
    this.getBornes();
  }

  getHoursValidated() {
    this.apiBDD.getHeureHebdoUser()
      .then((data: any) => {
        const fetchTabHeure = JSON.parse(data.data);
        this.monTableauDHeure = fetchTabHeure.filter((hour: any) => hour.valide === 1 && hour.bornes === this.bornes)
        console.log(this.monTableauDHeure);
        this.monTableauDHeure.sort((a: any,b: any)=>{
          const dateA = new Date(a.date_evenement.split('/').reverse().join('/')).getTime();
          const dateB = new Date(b.date_evenement.split('/').reverse().join('/')).getTime();
          return dateA - dateB;
        })
        this.monTableauDHeure.forEach((item) => {
          this.totalDesHeuresValidees += item.duree;
        })
      })
  }
  getBornes() {
    const bornesDeSaisie = this.cookieService.get('bornes');
    const bornesDeSaisieJson = JSON.parse(bornesDeSaisie);
    const date_debut = new Date(bornesDeSaisieJson['date_debut']);
    const date_fin = new Date(bornesDeSaisieJson['date_fin']);
    const debutPourBornes = formatDate(date_debut).dateCourte;
    const finPourBornes = formatDate(date_fin).dateCourte;
    const bornes = debutPourBornes + " au " + finPourBornes;
    this.bornes = bornes;
    return bornes;
  }


  /**
   * Pour pouvoir l'utiliser dans le template
   * @param decimale 
   * @returns 
   */
  heureDecimaleEnStr(decimale: number) {
    return heureDecToStr(decimale);
  }



}

