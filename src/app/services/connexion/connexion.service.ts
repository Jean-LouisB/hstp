import { Injectable } from '@angular/core';
import { User } from 'src/app/models/userModel';

@Injectable({
  providedIn: 'root'
})
export class ConnexionService {
  private connected: boolean = false;
  private userConnected: User | null;
  constructor() { }

    isConnected(){
      return this.connected;
    }
    connection(){
      this.connected=true;
    }
    disConnection(){
      this.connected=false;
    }
}
