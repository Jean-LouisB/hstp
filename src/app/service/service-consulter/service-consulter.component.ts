import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/serveur/server.service';
import { heureDecToStr } from'@fabricekopf/date-france';

@Component({
  selector: 'app-service-consulter',
  templateUrl: './service-consulter.component.html',
  styleUrls: ['./service-consulter.component.css']
})
export class ServiceConsulterComponent implements OnInit {
  mesArbitrages: any;
  errorMsg: string;
  constructor(
    private apiBDD: ServerService
  ) { }

  ngOnInit(): void {
    this.getMesArbitrages();
    this.getNames();
  }

  /**
   * Cette fonction récupère l'ensemble des arbitrages à valider pour l'utilisateur responsable.
   * Elle alimente l'attribut 'mesArbitrages
   * 
   */
  getMesArbitrages() {
    this.apiBDD.mesArbitrageAValider().then((data) => {
      console.log(data.data);
      this.mesArbitrages = data.data;
    })
  }

  /**
   * Cette fonction permet de récupèrer le nom et le prénom des salariés.
   * elle l'intègre dans le tableau mesArbitrage.
   */
  getNames() {
    this.apiBDD.getAllUsers()
      .then((allUsers: any) => {
        this.mesArbitrages.forEach((item: any) => {
            allUsers.data.forEach((salarie: any) => {
              if (item.matricule === salarie.matricule) {
                item.nom = salarie.nom;
                item.prenom = salarie.prenom;
              }
            })
        });
      });
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
