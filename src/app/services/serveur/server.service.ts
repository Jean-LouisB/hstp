import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/userModel';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { configureAxios } from './config.axios';
import { formatDate } from '@fabricekopf/date-france';



@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private axiosInstance: any;
  constructor(
    private cookieService: CookieService,
    private router: Router,
  ) {
    this.axiosInstance = configureAxios(cookieService)
  }

  /**
   * Gère la demande de connexion auprès du serveur
   * @param userMatricule saisi par l'utilisateur
   * @param userPassword saisi par l'utilisateur
   * @returns le message du serveur
   */
  getLogin(userMatricule: string, userPassword: string): Observable<string> {
    const credential = { userMatricule, userPassword }
    return new Observable<string>((observable => {
      this.axiosInstance.post(`/connexion/login`, { credential })
        .then((response) => {
          const msg = response.data.message
          const token = response.data.token;

          //récupèration de la date des bornes
          const bornes = response.data.bornes;
          const date_debut = formatDate(bornes['0']['date_debut']);
          const date_fin = formatDate(bornes['0']['date_fin']);
          const bornesPourCookies = {
           'date_debut':date_debut.normalDate,
           'date_fin':date_fin.normalDate
          }
          const bornesJSON = JSON.stringify(bornesPourCookies);
          this.cookieService.set('session', token, null, '/', null, true, 'Strict');
          this.cookieService.set('bornes', bornesJSON, null, '/', null, true, 'Strict');

          observable.next(msg);
          observable.complete();
        }).catch(err => {
          const msg = "Le serveur ne répond pas";
          observable.next(msg);
          console.log("Le serveur ne répond pas");
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
          user.nom = response.data.Nom;
          user.prenom=  response.data.Prenom ;
          user.matricule=response.data.Matricule;
          user.type = response.data.Type;
          user.responsable = response.data.Mat_Resp;
          user.present = response.data.Present;
          user.id = response.data._id
          observable.next(user); 
          observable.complete();
        })
        .catch((error) => {
          console.log("Erreur dans la réucpération du profil");
          observable.error(error);
        });
    });
  }

  /**
   * 
   * @returns la liste de tous les utilisateurs
   */
   getAllUsers() {
    return this.axiosInstance.get(`/users/allusers`);
  }
  getUserById(id: string) {
    //Fournit les données de l'utilisateur selon son id
    return this.axiosInstance.get(`/find_user_by_id/${id}`)
  }

  putPresenceToggle(matricule: string, presence: number) {
    //change le status de la présence (true si false et vis et versa)
    return this.axiosInstance.put(`/users/update/presence/${matricule}/${presence}`)
  } 

  /**
   * 
   * Modification d'une fiche d'utilisateur
   * 
   */
  putModifyUser(user: User){
    this.axiosInstance.put('/users/update',user);
  }
  /**
   * 
   * Ajout d'une fiche
   * 
   */
  putAddUser(user: User){
    this.axiosInstance.post('/users/addUser',user);
  }

  getSoldes(){
    return this.axiosInstance.get('/compteurs/soldes');
  }

  getSoldesDuProfil(){
    return this.axiosInstance.get('/compteurs/soldes/user');
  }


}

