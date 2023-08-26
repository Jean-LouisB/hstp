import { Injectable } from '@angular/core';
import { User } from 'src/app/models/userModel';

@Injectable({
  providedIn: 'root'
})
export class ConnexionService {
  private isAuthenticated: boolean = false;
  private userConnected: User | null;
  constructor() { }

  login(userIsConnecting: User){
    this.isAuthenticated = true;
    this.userConnected = userIsConnecting;
  }

  logout(){
    this.isAuthenticated = false;
    this.userConnected = null
  }

  isLoggedIn(){
    return this.isAuthenticated;
  }
  UserConnected():User{
      return this.userConnected;
  }
}
