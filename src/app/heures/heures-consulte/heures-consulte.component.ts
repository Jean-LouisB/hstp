import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/users.service';
import { heureDecToStr } from '@fabricekopf/date-france';
import { formatDate } from '@fabricekopf/date-france';
import { Heure } from 'src/app/core/models/heureModel';
import { Store } from '@ngrx/store';
import { getBornes } from 'src/app/core/state/session/session.selectors';
import { SessionState } from 'src/app/core/state/session/session.reducers';




@Component({
  selector: 'app-heures-consulte',
  templateUrl: './heures-consulte.component.html',
  styleUrls: ['./heures-consulte.component.css']
})
export class HeuresConsulteComponent implements OnInit {
  tabOfCurrentsHours = [];
  tabOfHoursNotValidated = [];
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
    private userService: UserService,
    private store: Store<{ session: SessionState }>,

  ) { }

  ngOnInit(): void {
    this.getCurrentsHours();
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
      await this.userService.deleteHourFromWeek(id);
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

  }
  upDateDataValidated() {

  }

  getBornes() { 
    this.store.select(getBornes).subscribe((bornes) => {
      this.date_debut = formatDate(bornes[0]).dateCourte
      this.date_fin = formatDate(bornes[0]).dateCourte
    })

  }

  getArbitrageEnCours() {
    this.userService.getArbitrageDuProfil()
      .then((data: any) => {
        this.heures_supplementaires = heureDecToStr(data.data.heuresSupMajoree);
        this.recuperation = heureDecToStr(data.data.recuperation);
        this.solidarite = heureDecToStr(data.data.solidarite);
        this.aPayer = heureDecToStr(data.data.heureAPayer);
        if (data.data.heuresSupMajoree + data.data.recuperation + data.data.solidarite + data.data.heureAPayer === 0) {
          this.commutateurAffichage = false
        } else {
          this.commutateurAffichage = true
        }
      });

  }

  getSoldes() {
    this.userService.getSoldesDuProfil()
      .then((data: any) => {
        this.heures_supplementaires_avant = heureDecToStr(data.data.heuresSupMajoree);
        this.recuperation_avant = heureDecToStr(data.data.recuperation);
        this.solidarite_avant = heureDecToStr(data.data.solidarite);
        this.aPayer_avant = heureDecToStr(data.data.heureAPayer);
      });
  }
  /**
   * Pour obtenir les heures non ventillées du salarié et leur total
   */
  getCurrentsHours() {
    this.userService.getHeureHebdoUser()
      .then((data: any) => {
        let sum = 0
        const fetchData = JSON.parse(data.data);
        fetchData.forEach((heure: Heure) => {
          sum += heure.duree
          this.tabOfCurrentsHours.push(heure)
        });
        this.totalCompteurNotValidated = sum;
      })
  }

}
