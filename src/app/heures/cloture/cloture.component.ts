import { Component, OnInit } from '@angular/core';
import { heureDecToStr } from '@fabricekopf/date-france';
import { HoursService } from 'src/app/services/hours/hours.service';
import { ServerService } from 'src/app/services/serveur/server.service';

@Component({
  selector: 'app-cloture',
  templateUrl: './cloture.component.html',
  styleUrls: ['./cloture.component.css']
})
export class ClotureComponent implements OnInit {
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
  affectationAP: number = 0;
  //commutateur
  modifiVentillation: boolean = false;

  constructor(
    private mesCompteurs: HoursService,
    private apiBDD: ServerService,
  ) { }


  ngOnInit(): void {
    this.mesCompteurs.getWeekHours()
      .then((fetchData) => {
        this.monTableauDHeure = fetchData['detail'].filter((hour: any) => hour.valide === 0);
        this.monTableauDHeure.forEach((hour) => {
          this.totalDesHeuresValidees += hour.duree
        })
      })
    this.getSoldes();

  }

  getSoldes() {
    this.apiBDD.getSoldesDuProfil()
      .then((data: any) => {
        this.heures_supplementaires = heureDecToStr(data.data.heures_supplementaires);
        this.heures_supplementairesDec = data.data.heures_supplementaires;
        this.recuperation = heureDecToStr(data.data.recuperation);
        this.recuperationDec = data.data.recuperation;
        this.solidarite = heureDecToStr(data.data.solidarite);
        this.solidariteDec = data.data.solidarite;
        this.aPayerDec = data.data.apayer;
        this.aPayer = heureDecToStr(data.data.apayer);
        this.calculSoldeAVentiller()
      });
  }
  calculSoldeAVentiller() {
    this.modifiVentillation = false;
    this.resteAVentiller = this.totalDesHeuresValidees - this.affectationAP - this.affectationHS - this.affectationJS - this.affectationRecup
  }


  /**
   * Valide l'heure selectionnée par son id
   * @param id string: c'est l'id de l'heure à valider
   */
  validateHour() {
    try {
      this.apiBDD.validateHour();
      
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

  commute() {
    this.modifiVentillation = !this.modifiVentillation
  }

}

