import { Component, OnInit } from '@angular/core';
import { HoursService } from 'src/app/services/hours/hours.service';
import { heureDecToStr } from '@fabricekopf/date-france'
import { ServerService } from 'src/app/services/serveur/server.service';



@Component({
  selector: 'app-sidebar-heures',
  templateUrl: './sidebar-heures.component.html',
  styleUrls: ['./sidebar-heures.component.css']
})
export class SidebarHeuresComponent implements OnInit {
  totalCompteurNotValidated: string = '00h00'; // nombre d'heure non validées pour affichage de la pastille d'alerte
  interupteurPastille: boolean = false;
  autoriseLaSaisie:boolean;
  constructor(
    private mesCompteurs: HoursService,
    private apiBDD: ServerService,
  ) {

  }

  ngOnInit(): void {
    this.mesCompteurs.getWeekHours();//lance la mise à jour du nombre d'heures non validées
    this.mesCompteurs.total$.subscribe((total) => {//s'abonne à l'obeservable du service dont il vient de lancer la mise à jour
      
      // si le nombre d'heure en cours est > 0 la pastille apparait dans le menu avec le nombre d'heures :
      if(total != 0){
        this.interupteurPastille = true;
      }else{
        this.interupteurPastille = false;
      }
      this.totalCompteurNotValidated = heureDecToStr(total);
    })
    //Demande l'autorisation d'apparaitre
    this.getAutorisation();
  }


  getAutorisation(){
    this.mesCompteurs.autorisationSaisie$
    .subscribe((autorisation)=>{
      this.autoriseLaSaisie = autorisation
    })
  }

  
}

