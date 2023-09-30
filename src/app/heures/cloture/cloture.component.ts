import { Component, OnInit } from '@angular/core';
import { heureDecToStr } from '@fabricekopf/date-france';
import { HoursService } from 'src/app/services/hours/hours.service';
import { ServerService } from 'src/app/services/serveur/server.service';
import { Arbitrage } from 'src/app/models/arbitrage.model';

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
  heuresSuppAffecteeMajoree: number = 0
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
   * Valide l'heure selectionnée par son id
   * @param id string: c'est l'id de l'heure à valider
   */
  validateHour() {
    this.majoreHeuresSupp()
    let arbitrage = new Arbitrage();
    let statusPaiement = 0;
    if(this.affectationAP>0){
      statusPaiement = 1
    }
    let ventillation = {
      matricule: "S058",
      date: new Date(),
      commentaire: "Arbitrage de la semaine du BORNE1 à BORNE2",
      solidarite: this.affectationJS,
      recuperation: this.affectationRecup,
      heuresSupMajoree: this.heuresSuppAffecteeMajoree,
      heureAPayer: this.affectationAP,
      respValidationStatus: 0,
      respDateValidation:null,
      paiementStatus:statusPaiement,
      datePaiement:null,
    }
    arbitrage.deserialize(ventillation);


    try {
      this.apiBDD.validateHour(arbitrage);

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

  majoreHeuresSupp(){
    if(this.affectationHS>0){
      if(this.affectationHS<=8){
        this.heuresSuppAffecteeMajoree = this.affectationJS * 1.25;
      }else{
        this.heuresSuppAffecteeMajoree = (8*1.25)+((this.affectationJS-8)*1.5);
      }
    }else{
      this.heuresSuppAffecteeMajoree = this.affectationHS;
    }
  }
}

