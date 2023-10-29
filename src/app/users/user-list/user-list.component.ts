import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/serveur/server.service';
import { Store, select } from '@ngrx/store';
import { listOfAllUsers } from '../../state/session/session.selectors';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/userModel';
import { SessionState } from 'src/app/state/session/session.reducers';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  /**
   * userList : contient une copie brute et complète  de la liste des utilisateurs et leur profil
   */
  userListRaw= [];
  userList$: Observable<Array<User> | null>;
  /**
   * filtreAbsent est un booléen activé sur true par défaut pour masquer les absents. 
   * titreBtnFiltre modififie le titre du bouton pour afficher/masquer les absents
   */
  filtreAbsent = true;
  titreBtnFiltre = "Voir les absents";
  /**
   * filterByName récupère la saisie dans l'Input de recherche.
   * Il est utilisé par la fonction de recherche par nom 'filtreLaListe'
   */
  filterByName = "*";
  /**
   * filteredList contient la liste filtrée qui est affichée par le composant.
   */
  filteredList = [];
  /**
   * comme son nom l'indique, c'est l'attribut local qui est mis à jour avec le nombre de salariés présents
   */
  nbSalaries = 0;


  constructor(
    private apiBDD: ServerService,
    private store: Store<{ session: SessionState }>,
  ) { }
  /**
   * A l'initialisation, le composant récupère l'ensemble des profils, les trie par nom de famille,
   * puis le met dans l'attribut local
   * puis lance la fonction qui initialise la liste affichée 'filtreLaListe().
   * Enfin lance la fonction qui compte les présents.
   */
  async ngOnInit() {

    await this.getList();
    this.countEmployees();

  }

  private async getList() {
    this.store.select(state => state.session).pipe(select(listOfAllUsers)).subscribe(data => {
      this.userListRaw = data;
    });
    if (!this.userListRaw || this.userListRaw.length === 0) {
      await this.apiBDD.getAllUsers();
    }
    try {
      await this.gettingSoldes().then(()=>this.filteredList = this.userListRaw);
    } catch (erreur) {
      console.log("Erreur dans la récupération des soldes", erreur);
    }
    try{
      await this.filtreLaListe()
    }catch(error){
      console.log(error);
    }
  }

  /**
   * Cette fonction ajoute les soldes par salarié dans le tableau filteredList
   * @returns Une promesse
   */
  private gettingSoldes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiBDD.getSoldes()
        .then((response: any) => {
          const tableauDesSoldes = response.data;
          this.userListRaw = this.userListRaw.map((salarie) => {
            const newSalarie = { ...salarie };
            if (!tableauDesSoldes[salarie.matricule]) {
              newSalarie.soldes = {
                'heuresSupMajoree': 0,
                'recuperation': 0,
                'solidarite': 0,
                'heureAPayer': 0,
              };
            } else {
              newSalarie.soldes = tableauDesSoldes[salarie.matricule];
            }
            return newSalarie;
          });
          resolve();
        })
        .catch((erreur: Error) => {
          console.log("Erreur dans la récupèreation des soldes");
          console.log(erreur);
          reject(erreur);
        });
    });
  }

  /**
   * Cette fonction bascule le booléen qui gère l'affichage des absents
   * et change le nom du bouton.
   */
  handelOnFilter() {
    this.filtreAbsent = !this.filtreAbsent
    this.titreBtnFiltre = this.filtreAbsent === true ? "Voir les absents" : "Masquer les absents"
  }

  /**
   * Récupère l'ensemble des profils, les met dans l'attribut local userList
   * puis lance la fonction de filtre.
   */
  fetchUsers() {
    this.getList()
  }
  /**
   * Cette fonction récupère l'attribut local contenant la chaine saisie par l'utilisateur.
   * Puis dans la liste vérifie si cette chaine fait partie de l'ensemble nom+prenom
   * Tout est mis en majuscule pour homogénéiser les casses.
   */
 filtreLaListe() {
    if (this.filterByName !== "*" && this.filterByName !== "") {
        this.filteredList = this.userListRaw.filter((user) => {
          const userNameUpperCase = user.nom.toUpperCase()
          const userFirstNameUpperCase = user.prenom.toUpperCase()
          const nameSearched = this.filterByName.toUpperCase()
          const nomPrenom = userNameUpperCase + userFirstNameUpperCase
          return nomPrenom.includes(nameSearched)
        });
        //console.log(this.filteredList);
      }
  }
  /**
   * 
   * @param event Cet attribut est envoyer par l'évènement (Input) du champs de saisi.
   * A chaque charactère saisi il se met à jour.
   * Puis il initialise l'attribut local avec sa valeur.
   * Enfin il filtre la liste affichée de façon dynamique.
   */
  handleOnSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filterByName = inputElement.value
    this.filtreLaListe();
  }

  /**
   * 
   * @returns ...le nombre d'employés présent
   */
  countEmployees() {
    let count = 0;
    this.filteredList.map((user) => {
      if (user.present == 1) {
        count++
      }
    })
    this.nbSalaries = count;
    return count
  }

}
