import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environnement';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/userModel';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

const axiosInstance = axios.create({
  withCredentials : false,
})


@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private apiUrl = environment.apiUrl;
  constructor(
    private cookieService:  CookieService,
    private router: Router,
  ) { }

  /**
   * Gère la demande de connexion auprès du serveur
   * @param userMatricule saisi par l'utilisateur
   * @param userPassword saisi par l'utilisateur
   * @returns le message du serveur
   */
  getLogin(userMatricule: string, userPassword: string): Observable<string> {
    const credential = { userMatricule, userPassword }
    return new Observable<string>((observable => {
      axiosInstance.post(`${this.apiUrl}/connexion/login`, { credential })
        .then((response) => {
          const msg = response.data.message
          const token = response.data.token;
          this.cookieService.set('session',token, null,'/',null, true, 'Strict');
          observable.next(msg);
          observable.complete();
        }).catch(err=>{
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

  getAllUsers() {
    //fournit la liste de tous les utilisateurs
    return axios.get(`${this.apiUrl}/allusers`);
  }

  getUserProfil(): Observable<any> {
    const user = new User()
    return new Observable<any>((observable)=>{
      axios.get(`${this.apiUrl}/profil`)
      .then((userData) => { 
        user.nom = userData.data.Nom;
        user.prenom=  userData.data.Prenom ;
        user.matricule=userData.data.Matricule;
        user.type = userData.data.Type;
        user.responsable = userData.data.Mat_Resp;
        user.present = userData.data.Present;
        user.id = userData.data._id
        observable.next(user);
        observable.complete();
      })
    })
    
    
  }

  getUserById(id: string) {
    //Fournit les données de l'utilisateur selon sont id
    return axios.get(`${this.apiUrl}/find_user_by_id/${id}`)
  }

  putPresenceToggle(matricule: string, presence: number) {
    //change le status de la présence (true si false et vis et versa)
    return axios.put(`${this.apiUrl}/user/update/presence/${matricule}/${presence}`)
  }
}
