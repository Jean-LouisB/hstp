import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/serveur/server.service';
import { heureDecToStr } from '@fabricekopf/date-france';
import { HoursService } from 'src/app/services/hours/hours.service';
import { Observable, Subject } from 'rxjs';




@Component({
  selector: 'app-heures-consulte',
  templateUrl: './heures-consulte.component.html',
  styleUrls: ['./heures-consulte.component.css']
})
export class HeuresConsulteComponent implements OnInit {
  tabOfHoursNotValidated = [];
  totalCompteurNotValidated: number = 0;
  constructor(
    private apiBDD: ServerService,
    private mesCompteurs: HoursService,
  ) { }

  ngOnInit(): void {
    this.upDateData();
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
        console.log(fetchData);
        this.tabOfHoursNotValidated = fetchData['detail'].filter((hour: any)=> hour.valide === 0 );
        this.totalCompteurNotValidated = 0;
        this.tabOfHoursNotValidated.forEach((hour)=>{
          this.totalCompteurNotValidated += hour.duree
        })
      })
  }


}
