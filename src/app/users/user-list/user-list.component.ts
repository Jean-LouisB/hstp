import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServerService } from '../../services/serveur/server.service';
import { Store, select } from '@ngrx/store';
import { listOfAllUsers } from '../../state/session/session.selectors';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/userModel';
import { SessionState } from 'src/app/state/session/session.reducers';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  /**
   * userList : contient une copie brute et complète  de la liste des utilisateurs et leur profil
   */
  userListRaw: User[] = [];
  userList$: Observable<Array<User> | null>;
  userListSubscription: Subscription | null;
  /**
   * filtreAbsent est un booléen activé sur true par défaut pour masquer les absents. 
   * titreBtnFiltre modififie le titre du bouton pour afficher/masquer les absents
   */
  isFilterAbsent = true;
  titreBtnFiltre = "Voir les absents";
  /**
   * filterByName récupère la saisie dans l'Input de recherche.
   * Il est utilisé par la fonction de recherche par nom 'filtreLaListe'
   */
  filterByName = "*";
  /**
   * filteredList contient la liste filtrée qui est affichée par le composant.
   */
  filteredList: User[] = [];
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
    this.userListSubscription = this.store.select(state => state.session)
      .pipe(select(listOfAllUsers))
      .subscribe(data => {
        this.userListRaw = data;
      });
    if (!this.userListRaw || this.userListRaw.length === 0) {
      await this.apiBDD.getAllUsers();//Ici je récupère la liste depuis la bdd et la place dans le store
    }
    try {
      await this.gettingSoldes()
    } catch (erreur) {
      console.log("Erreur dans la récupération des soldes", erreur);
    }
    try {
      this.filtreLaListe();
    } catch (error) {
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
            const newSalarie = new User().deserialize(salarie);
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
    this.isFilterAbsent = !this.isFilterAbsent;
    this.titreBtnFiltre = this.isFilterAbsent === true ? "Voir les absents" : "Masquer les absents";
    this.filtreLaListe();
  }

  /**
   * Récupère l'ensemble des profils, les met dans l'attribut local userList
   * puis lance la fonction de filtre.
   */
  async fetchUsers() {
    await this.getList()
  }


  //----------------------Filtrage---------------------

  filterUserByPresence(userList: User[]): User[] {
    return userList.filter((user) => user.present === true);
  }

  filterUserByName(userList: User[], nameSearched: string): User[] {
    const upperNameSearched = nameSearched.toUpperCase();
    return userList.filter((user) => {
      const upperNameFirstname = this.formatSearch(user.nom, user.prenom);
      return upperNameFirstname.includes(upperNameSearched);
    })
  }

  /**
   * Cette fonction récupère l'attribut local contenant la chaine saisie par l'utilisateur.
   * Puis dans la liste vérifie si cette chaine fait partie de l'ensemble nom+prenom
   * Tout est mis en majuscule pour homogénéiser les casses.
   */
  filtreLaListe() {
    let filtered = this.userListRaw;
    if (this.isFilterAbsent === true) {
      filtered = this.filterUserByPresence(filtered);
    console.log(filtered);

    }
    if (this.filterByName !== "*" && this.filterByName !== "") {
      filtered = this.filterUserByName(filtered, this.filterByName);
    }
    this.filteredList = filtered;
  }



  /**
   * @param userName Concatène et met en majuscule pour comparer dans la fonction de recherche
   * 
   * @param userFirstName: string => le prénom de l'utilisateur
   * @param userName: string => le nom de l'utilisateur
   * @returns NOMPRENOM (nom+prenom en majuscule): string
   */
  formatSearch(userName: string, userFirstName: string) {
    const userNameAndFirstNameUpper = (userName + userFirstName).toUpperCase();
    return userNameAndFirstNameUpper;
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
      if (user.present === true) {
        count++
      }
    })
    this.nbSalaries = count;
    return count
  }

  ngOnDestroy(): void {
    if (this.userListSubscription) {
      this.userListSubscription.unsubscribe();
    }
  }

}
