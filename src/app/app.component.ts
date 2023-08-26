import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConnexionService } from './services/connexion/connexion.service';
import { ServerService } from './services/serveur/server.service';
import { User } from './models/userModel';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TOMPRESS | Gestion des heures';
  connected = false;

  constructor(
    private router: Router,
    private cookiesService: CookieService,
    private authService: ConnexionService,
    private apiBDD: ServerService,
  ) { }


  getIsLoggedIn(){
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    if (this.cookiesService.get('session')) {
      const matricule = this.cookiesService.get('whoswho');
      const userGet = this.apiBDD.getUserById(matricule)
      const user = new User()
      user.deserialize(userGet);
      this.authService.login(user);
    } else {
      this.router.navigate(['/login']);
    }
  }


}
