import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environnement';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private apiUrl = environment.apiUrl;
  constructor() { }

  getAllUsers(){
    return axios.get(`${this.apiUrl}/allusers`);
  }

  getPassForConnect(identifiant_saisi: string){
    return axios.get(`${this.apiUrl}/find_user/${identifiant_saisi}`);
  }

  getUserById(id: string){
    return axios.get(`${this.apiUrl}/find_user_by_id/${id}`)
  }
}
