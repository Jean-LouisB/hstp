import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { ServerService } from '../../services/serveur/server.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as bcrypt from 'bcryptjs';
import { ConnexionService } from 'src/app/services/connexion/connexion.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  userList = [];
  id_User = "";
  identifiant_saisi: string = "";
  password_saisi: string = "";
  errorMsg = null;


  constructor(
    private apiBDD: ServerService,
    private router: Router,
    private cookieService: CookieService,
    private authService: ConnexionService
    ) {
  }

  ngOnInit(): void {
   
  }

/*   async encrypt(wordToHach: string){
    const salt = bcrypt.genSalt(10);
    let pass = bcrypt.hashSync(wordToHach,10);
    return pass;
  } */

  connectIsValid() {

    this.apiBDD.getPassForConnect(this.identifiant_saisi)
      .then(response => {
        let mdpToCheck = response.data.pass;
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
