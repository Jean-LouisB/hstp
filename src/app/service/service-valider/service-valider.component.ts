import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/users.service';
import { heureDecToStr } from'@fabricekopf/date-france';

@Component({
  selector: 'app-service-valider',
  templateUrl: './service-valider.component.html',
  styleUrls: ['./service-valider.component.css']
})
export class ServiceValiderComponent implements OnInit {
  mesArbitrages: any;
  errorMsg: string;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getMesArbitrages();
//    this.getNames();
  }

  /**
   * Cette fonction récupère l'ensemble des arbitrages à valider pour l'utilisateur responsable.
   * Elle alimente l'attribut 'mesArbitrages
   * 
   */
  getMesArbitrages() {
    this.userService.mesArbitrageAValider().then((data) => {
      this.mesArbitrages = data.data;
    })
    this.getNames()
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
   * @param l'heure en decimale 
   * @returns l'heure au format str hhhmm
   */
  heureDecimaleEnStr(decimale: number) {
    return heureDecToStr(decimale);
  }

  valideArbitrage(id:string, aPayer: number){
    this.userService.valideArbitrage(id,aPayer);
    this.getMesArbitrages();
   // this.getNames()
  }

  annulerArbitrage(id:string){
    alert("Annulation de l'arbitrage "+id+" pas encore possible")
  }

}
