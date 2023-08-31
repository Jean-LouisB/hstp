import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environnement';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private apiUrl = environment.apiUrl;
  constructor() { }

  getAllUsers() {
    //fournit la liste de tous les utilisateurs
    return axios.get(`${this.apiUrl}/allusers`);
  }

  getPassForConnect(identifiant_saisi: string) {
    //fournit le mot de passe à contrôler à la connexion
    return axios.get(`${this.apiUrl}/find_user/${identifiant_saisi}`);
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
