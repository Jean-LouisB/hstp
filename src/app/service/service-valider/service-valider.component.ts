import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/users.service';
import { heureDecToStr } from '@fabricekopf/date-france';
import { User } from 'src/app/core/models/userModel';

@Component({
  selector: 'app-service-valider',
  templateUrl: './service-valider.component.html',
  styleUrls: ['./service-valider.component.css']
})
export class ServiceValiderComponent implements OnInit {
  mesArbitrages: any;
  errorMsg: string;
  isReady: boolean = false;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getMesArbitrages();
  }

  /**
   * Cette fonction récupère l'ensemble des arbitrages à valider pour l'utilisateur responsable.
   * Elle alimente l'attribut 'mesArbitrages
   * 
   */
  getMesArbitrages() {
    this.userService.mesArbitrageAValider()
      .then((data) => {
        this.mesArbitrages = data.data;
      })
      .then(() => {
        this.getNames()
      })
  }

  /**
   * Cette fonction permet de récupèrer le nom et le prénom des salariés.
   * elle l'intègre dans le tableau mesArbitrage.
   */
  getNames() {
    this.userService.getAllUsers()
      .then((allUsers: any) => {
        const userMap = new Map();
        allUsers.data.forEach((user: User) => {
          userMap.set(user.matricule, user)
        })
        this.mesArbitrages.forEach((arbitrage: any) => {
          const user = userMap.get(arbitrage.matricule);
          if (user) {
            arbitrage.nom = user.nom;
            arbitrage.prenom = user.prenom;
          }
        })
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

valideArbitrage(id: string, aPayer: number){
  this.userService.valideArbitrage(id, aPayer);
  this.getMesArbitrages();
  // this.getNames()
}

annulerArbitrage(id: string){
  alert("Annulation de l'arbitrage " + id + " pas encore possible")
}

}
