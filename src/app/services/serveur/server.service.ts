import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/userModel';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { configureAxios } from './config.axios';


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
          this.cookieService.set('session', token, null, '/', null, true, 'Strict');
          observable.next(msg);
          observable.complete();
        }).catch(err => {
          const msg = "Le serveur ne répond pas";
          observable.next(msg);
          console.log("Le serveur ne répond pas");
        })
    }))

  }

  getLogout() {
    this.router.navigate(['/login']);
    this.cookieService.delete('session', '/', null, true, 'Strict');

  }


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



  //************************************************** plus tard ************************************* */

   getAllUsers() {
    //fournit la liste de tous les utilisateurs
    return axios.get(`/allusers`);
  }
  getUserById(id: string) {
    //Fournit les données de l'utilisateur selon sont id
    return axios.get(`/find_user_by_id/${id}`)
  }

  putPresenceToggle(matricule: string, presence: number) {
    //change le status de la présence (true si false et vis et versa)
    return axios.put(`/user/update/presence/${matricule}/${presence}`)
  } 
}
