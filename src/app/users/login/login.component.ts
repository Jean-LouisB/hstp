import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { ServerService } from '../../services/serveur/server.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as bcrypt from 'bcryptjs';
import { ConnexionService } from 'src/app/services/connexion/connexion.service';
import { Observable } from 'rxjs';
import { dataUserConnected } from '../../state/session/session.actions';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/userModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  session$: Observable<any>
  userList = [];
  id_User = "";
  identifiant_saisi: string = "";
  password_saisi: string = "";
  errorMsg = null;


  constructor(
    private apiBDD: ServerService,
    private router: Router,
    private cookieService: CookieService,
    private authService: ConnexionService,
    private store: Store
    ) {
  }

  ngOnInit(): void {
   
  }

  connectIsValid() {

    this.apiBDD.getPassForConnect(this.identifiant_saisi)
      .then(response => {
        let mdpToCheck = response.data.pass;
        const user = new User().deserialize(response.data.user)
        if (bcrypt.compareSync(this.password_saisi,mdpToCheck)) {
          this.authService.login(response.data.user)
          this.cookieService.set('session',response.data.user['matricule'])
          this.cookieService.set('whoswho',response.data.user['id'])
          this.router.navigate(['/accueil']);
        } else {
          this.loginForm.reset();
          this.errorMsg = 'Mot de passe erroné.' 
        }
      }).catch((err) => {
        //console.log("Une erreur s'est produite ici: " + err.response.data);
        if(err.response.data == "Utilisateur introuvable"){
          this.errorMsg = 'Identifiant non reconnu.' 
        }
      })
  }

}


