import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-heures-declare',
  templateUrl: './heures-declare.component.html',
  styleUrls: ['./heures-declare.component.css']
})
export class HeuresDeclareComponent implements OnInit {
  date_debut: Date = null;
  date_fin: Date = null;
  dateEvenement: Date = null;
  sens: string = null;
  heureDebut: string = null;
  heureFin: string = null;
  commentaire: string = null;

  constructor(
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.getDatesDeSaisie();
  }

  getDatesDeSaisie() {
    const bornesDeSaisie = this.cookieService.get('bornes');
    const bornesDeSaisieJson = JSON.parse(bornesDeSaisie);
    this.date_debut = new Date(bornesDeSaisieJson['date_debut']);
    this.date_fin = new Date(bornesDeSaisieJson['date_fin']);
  }

  getTemps(){
    const heureDebutDec = this.getHeureStrToDec(this.heureDebut);
    const heureFinDec = this.getHeureStrToDec(this.heureFin);
    console.log(heureFinDec-heureDebutDec);
    
    return heureFinDec-heureDebutDec;
  }
  getHeureStrToDec(heure: string){
    const heureMinuscule = heure.toLowerCase();
    const heureSplited = heureMinuscule.split('h');
    const heureValueDec = parseInt(heureSplited[0]);
    const minutesValueDec = parseInt(heureSplited[1])/60;
    return heureValueDec +minutesValueDec;
  }
}
