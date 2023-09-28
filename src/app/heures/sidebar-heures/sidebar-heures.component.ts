import { Component, OnInit } from '@angular/core';
import { HoursService } from 'src/app/services/hours/hours.service';
import { heureDecToStr } from '@fabricekopf/date-france'



@Component({
  selector: 'app-sidebar-heures',
  templateUrl: './sidebar-heures.component.html',
  styleUrls: ['./sidebar-heures.component.css']
})
export class SidebarHeuresComponent implements OnInit {
  totalCompteurNotValidated: string = '00h00'; // nombre d'heure non validées pour affichage de la pastille d'alerte
  interupteurPastille: boolean = false
  constructor(
    private mesCompteurs: HoursService,
  ) {

  }

  ngOnInit(): void {
    this.mesCompteurs.getWeekHours();//lance la mise à jour du nombre d'heures non validées
    this.mesCompteurs.total$.subscribe((total) => {//s'abonne à l'obeservable du service
      if(total != 0){
        this.interupteurPastille = true;
      }else{
        this.interupteurPastille = false;
      }
      this.totalCompteurNotValidated = heureDecToStr(total);
    })
  }


}

