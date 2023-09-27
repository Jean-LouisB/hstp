import { Component, OnInit } from '@angular/core';
import { HoursService } from 'src/app/services/hours/hours.service';



@Component({
  selector: 'app-sidebar-heures',
  templateUrl: './sidebar-heures.component.html',
  styleUrls: ['./sidebar-heures.component.css']
})
export class SidebarHeuresComponent implements OnInit {
  totalCompteurNotValidated: number = 0; // nombre d'heure non validées pour affichage de la pastille d'alerte
  constructor(
    private mesCompteurs: HoursService,
  ) {

  }

  ngOnInit(): void {
    this.mesCompteurs.getHoursValidated();//lance la mise à jour du nombre d'heures non validées
    this.mesCompteurs.total$.subscribe((total) => {//s'abonne à l'obeservable du service
      this.totalCompteurNotValidated = total;
    })
  }


}

