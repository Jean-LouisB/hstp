import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/users.service';
import { heureDecToStr } from'@fabricekopf/date-france';

@Component({
  selector: 'app-service-consulter',
  templateUrl: './service-consulter.component.html',
  styleUrls: ['./service-consulter.component.css']
})
export class ServiceConsulterComponent implements OnInit {
  mesArbitrages: any;
  errorMsg: string;
  vide:boolean = false;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {

  }

  /**
   * Cette fonction récupère l'ensemble des arbitrages à valider pour l'utilisateur responsable.
   * Elle alimente l'attribut 'mesArbitrages
   * 
   */
  getMesArbitrages() {
    this.userService.mesArbitrageAValider().then((data) => {
      const monTab = data.data;
      const taille = monTab.length
      if(taille === 0){
        this.mesArbitrages = []
        this.vide = true;
      }else{
        this.mesArbitrages = data.data;
      }
      
    })
    this.getNames();
  }

  /**
   * Cette fonction permet de récupèrer le nom et le prénom des salariés.
   * elle l'intègre dans le tableau mesArbitrage.
   */
  getNames() {
    this.userService.getAllUsers()
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
