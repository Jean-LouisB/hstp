import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/userModel';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { configureAxios } from './config.axios';
import { Heure } from 'src/app/core/models/heureModel';
import { Arbitrage } from 'src/app/core/models/arbitrage.model';
import { SessionState } from 'src/app/core/state/session/session.reducers';
import { Store } from '@ngrx/store';
import { changeOneUser, setListOfAllUsers } from 'src/app/core/state/session/session.actions';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private axiosInstance: any;
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private store: Store<{ session: SessionState }>,
  ) {
    this.axiosInstance = configureAxios(cookieService)
  }

  /**
   * Gère la demande de connexion auprès du serveur
   * @param userMatricule saisi par l'utilisateur
   * @param userPassword saisi par l'utilisateur
   * @returns le message du serveur
   * le serveur retourne 3 messages possibles:
   * "Mot de passe incorrect", "Utilisateur introuvable" et "Authentification réussie"
   * Les deux messages d'erreur sont transmis à l'utilisateur
   * C'est le front qui gère le l'identifiant au mauvais format (length !== 4).
   */
  getLogin(userMatricule: string, userPassword: string): Observable<string> {
    const credential = { userMatricule, userPassword }
    return new Observable<string>((observable => {
      this.axiosInstance.post(`/connexion/login`, { credential })
        .then((response) => {
          const msg = response.data.message
          if (msg === "Mot de passe incorrect" || msg === "Utilisateur introuvable") {
            observable.next(msg);//permet à la requête appelante de surveiller le message de retour et réagir en fonction.
            observable.complete();
          } else {
            const token = response.data.token; //token de sécurité
            this.cookieService.set('session', token, null, '/', null, false, 'Lax');
            observable.next(msg);//permet à la requête appelante de surveiller le message de retour et réagir en fonction.
            observable.complete();
          }
        }).catch(err => {
          const msg = "Le serveur ne répond pas, il y a eu une erreur";
          observable.next(msg);//permet à la requête appelante de surveiller le message de retour et réagir en fonction.
        })
    }))

  }

 

  /**
   * Gère la déconnexion.
   * Supprime le cookie local et informe le serveur
   * TODO : La redirection est déjà gérée par le bouton 'deconnexion' il faut vérifier si ce n'est pas un doublon supprimable
   */
  getLogout() {
    this.axiosInstance.get('/connexion/logout');
    this.router.navigate(['/login']); //Doublon !!! à vérifier avec le bouton déconnexion
    this.cookieService.delete('session', '/', null, true, 'Strict');

  }

  /**
   * Axios récupère le cookie qui contient le token pour demander le détail du profil connecté au serveur.
   * @returns le profil de l'utilisateur
   */
  getUserProfil(): Observable<any> {
    let user = new User;
    return new Observable<any>((observable) => {
      this.axiosInstance.get('/users/profil')
        .then((response) => {
          user.saisieAutorisee = response.data.saisieAutorisee;
          user.nom = response.data.Nom;
          user.prenom = response.data.Prenom;
          user.matricule = response.data.Matricule;
          user.type = response.data.Type;
          user.responsable = response.data.Mat_Resp;
          user.present = response.data.Present;
          user.id = response.data._id
          observable.next(user);
          observable.complete();
        })
        .catch((error) => {
          console.log("Erreur dans la récupération du profil");
          observable.error(error);
        });
    });
  }
  /**
   * Demande à la BDD si l'utilisateur a le status de saisie sur false ou true
   * @returns l'autorisation de saisie (boolean)
   */
  getAutorisationSaisie() {
    return this.axiosInstance.get('/users/autorisationDeSaisie')
      .then((autorisation: any) => {
        return autorisation.data
      })
  }


  /**
   * 
   * @returns la liste de tous les utilisateurs
   */
  getAllUsers() {
   this.axiosInstance.get(`/users/allusers`)
   .then((fetchData: any)=>{
    const tabOfDataRaw = fetchData.data;
    let listOfUsers: Array<User> = [];
    tabOfDataRaw.forEach((item: any)=>{
      const userItem = new User().deserialize(item)
      listOfUsers.push(userItem);
    })
    listOfUsers.sort((a, b) => a.nom.localeCompare(b.nom));
    this.store.dispatch(setListOfAllUsers({ listOfAllUsers: listOfUsers }));
   }
   );
    return this.axiosInstance.get(`/users/allusers`);
  }

  /**
   *  EST-ELLE UTILISEE ?? => A SUPPRIMER
   * @param id 
   * @returns 
   */
/*   getUserById(id: string) {
    //Fournit les données de l'utilisateur selon son id
    return this.axiosInstance.get(`/find_user_by_id/${id}`)
  } */

  putPresenceToggle(id: string, presence: boolean) {
    //change le status de la présence (true si false et vice et versa)
    return this.axiosInstance.put(`/users/update/presence/${id}/${presence}`)
  }

  /**
   * 
   * Modification d'une fiche d'utilisateur
   * 
   */
  putModifyUser(user: User) {
    this.axiosInstance.put('/users/update', user);
  }
  /**
   * 
   * Ajout d'une fiche
   * 
   */
  putAddUser(user: User) {
    this.axiosInstance.post('/users/addUser', user);
  }

  /**
   * 
   * @returns Récupère les soldes de tous les salariés;
   */
  getSoldes() {   
    return this.axiosInstance.get('/compteurs/soldes');
  }

  /**
   * 
   * @returns Récupère les soldes du salarié connecté.
   */
  getSoldesDuProfil() {
    return this.axiosInstance.get('/compteurs/soldes/user');
  }
/**
 * Récupère les arbitrage du profil responsable 
 * @returns Liste des arbitrages de la semaine à faire
 */
  getArbitrageDuProfil() {
    return this.axiosInstance.get('/compteurs/arbitrage/user');
  }

  /**
   * Ajoute une heure dans la semaine du salarié.
   */
  putHeureHebdo(hour: Heure) {
    this.axiosInstance.put("/heures/ajouter", hour)
  }
  /**
   * 
   * @returns Consulte les heures en cours de la semaine
   */
  getHeureHebdoUser() {
    return this.axiosInstance.get("/heures/consulter");
  }

  /**
   * Supprime une heure de la semaine
   * @param idHour: string => id de l'heure à supprimer
   * 
   */
  deleteHourFromWeek(idHour: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.axiosInstance.delete("/heures/supprimer", { params: { idHour: idHour } })
        .then((reponse: any) => {
          resolve();
        }).catch((erreur: any) => {
          console.error('Erreur lors de la suppression : ', erreur);
          reject(erreur);
        }
        )
    })

  }
  /**
   * Est appelée par la clôture pour créer l"arbitrage à valider par le responsable.
   * @param arbitrage 
   */
  validateHour(arbitrage: Arbitrage) {
    try {
      this.axiosInstance.put("/heures/valider", arbitrage)
    } catch (error) {
      console.log("Erreur");

    }

  }

  mesArbitrageAValider(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.axiosInstance.get("/responsable/consulter/arbitrages")
        .then((response: any) => {
          resolve(response);
        }).catch((error: any) => {
          console.log(error);
          reject(error);
        })
    }
    )
  }

  valideArbitrage(id: string, heure: number) {
    console.log("id : " + id);

    this.axiosInstance.put('/responsable/valider/arbitrages', { 'id': id, 'heure': heure })
      .then((reponse: any) => {
        console.log(reponse.data);
      })
  }
  

}

