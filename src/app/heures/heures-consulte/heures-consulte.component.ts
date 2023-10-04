import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/serveur/server.service';
import { heureDecToStr } from '@fabricekopf/date-france';
import { HoursService } from 'src/app/services/hours/hours.service';
import { CookieService } from 'ngx-cookie-service';
import { formatDate } from '@fabricekopf/date-france';




@Component({
  selector: 'app-heures-consulte',
  templateUrl: './heures-consulte.component.html',
  styleUrls: ['./heures-consulte.component.css']
})
export class HeuresConsulteComponent implements OnInit {
  tobOfCurrentsHours = [];
  tobOfHoursNotValidated = [];
  totalCompteurNotValidated: number = 0;
  date_debut: string = '';
  date_fin: string = '';
  // Pour l'arbitrage en cours 
  heures_supplementaires: string = '0h00';
  recuperation: string = '0h00';
  solidarite: string = '0h00';
  aPayer: string = '0h00';
  commutateurAffichage: boolean;
  // Solde en cours
  heures_supplementaires_avant: string = '0h00';
  recuperation_avant: string = '0h00';
  solidarite_avant: string = '0h00';
  aPayer_avant: string = '0h00';

  constructor(
    private apiBDD: ServerService,
    private mesCompteurs: HoursService,
    private cookieService: CookieService,

  ) { }

  ngOnInit(): void {
    this.upDateData();
    this.upDateDataValidated();
    this.getBornes();
    this.getArbitrageEnCours();
    this.getSoldes()
    
  }

  /**
   * Supprime l'heure selectionnée par son id
   * @param id string: c'est l'id de l'heure à supprimer
   */
  async deleteHour(id: string) {
    try {
      await this.apiBDD.deleteHourFromWeek(id);
      this.upDateData();
    } catch (error) {
      console.log(error);
    }

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
   * met à jour le détail et le total des heures non validées
   */
  upDateData() {
    this.mesCompteurs.getWeekHours()
      .then((fetchData) => {
        this.tobOfCurrentsHours = fetchData['detail'].filter((hour: any) => hour.valide === 0);
        this.totalCompteurNotValidated = 0;
        this.tobOfCurrentsHours.forEach((hour) => {
          this.totalCompteurNotValidated += hour.duree
        })
      })
  }
  upDateDataValidated() {
    this.mesCompteurs.getWeekHours()
      .then((fetchData) => {
        this.tobOfHoursNotValidated = fetchData['detail'].filter((hour: any) => hour.valide === 1 && hour.bornes === this.date_debut + " au " + this.date_fin);
      })
  }

  getBornes() { // Il y a un service pour faire ça !! => TODO : remplacer
    const mesBornes = this.cookieService.get('bornes');
    const mesBornesJson = JSON.parse(mesBornes) || null;
    this.date_debut = formatDate(mesBornesJson['date_debut']).dateCourte
    this.date_fin = formatDate(mesBornesJson['date_fin']).dateCourte
  }

  getArbitrageEnCours() {
    this.apiBDD.getArbitrageDuProfil()
      .then((data: any) => {
        this.heures_supplementaires = heureDecToStr(data.data.heuresSupMajoree);
        this.recuperation = heureDecToStr(data.data.recuperation);
        this.solidarite = heureDecToStr(data.data.solidarite);
        this.aPayer = heureDecToStr(data.data.heureAPayer);
        if(data.data.heuresSupMajoree+data.data.recuperation+data.data.solidarite+data.data.heureAPayer === 0){
          this.commutateurAffichage = false
        }else{
          this.commutateurAffichage = true
        }
      });

  }

  getSoldes() {
    this.apiBDD.getSoldesDuProfil()
      .then((data: any) => {
        this.heures_supplementaires_avant = heureDecToStr(data.data.heuresSupMajoree);
        this.recuperation_avant = heureDecToStr(data.data.recuperation);
        this.solidarite_avant = heureDecToStr(data.data.solidarite);
        this.aPayer_avant = heureDecToStr(data.data.heureAPayer);
      });
  }


}
