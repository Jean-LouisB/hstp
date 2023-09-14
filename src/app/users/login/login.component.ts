import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../services/serveur/server.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { toggleConnected } from 'src/app/state/session/session.actions';
import { Store } from '@ngrx/store';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  /**
   * userMatricule est lié au formulaire de connexion par ngModel.
   * C'est le matricule saisi par l'utilisateur qui souhaite se connecter pour être envoyé au serveur.
   */
  userMatricule: string = "";
  /**
   * userPassword est lié au formulaire de connexion par ngModel.
   * C'est le mot de passe saisi par l'utilisateur qui souhaite se connecter pour être envoyé au serveur.
   */
  userPassWord: string = "";

  /**
   * L'initialisation de errorMsg est la condition d'affichage ngIf.
   * Sa valeur dépend de ma ré^ponse du serveur
   */
  errorMsg = null;
  waiting=false; // Valeur booléen qui, sur true, fait apparaitre une roue tournante pendant que le serveur vérifie les données de connexion.
  
/**
 * 
 * @param apiBDD C'est la connexion au service local. C'est lui qui interroge le serveur.
 * @param router Il gère les redirection
 * @param store L'accés au store NGRX pour mettre à jour la valeur booléenne 'isConnected'
 */
  constructor(
     private apiBDD: ServerService,
     private router: Router,
     private store: Store,
    ) {
  }

  ngOnInit(): void {
   
  }
/**
 * Lors de l'appuie sur le bouton 'connexion' cette fonction interroge le service local qui va lui même interroger le serveur
 * pour valider les identifiant/ mot de passe saisis.
 * @returns un message qui valide la connexion ou stipule l'erreur.
 */
  connectIsValid() {
    if (this.userMatricule.length!=4){
      /* Le matricule saisi a une longueur différente de 4 :
          Alors le message d'erreur est initialisé et donc apparait.
      */
      this.errorMsg = "Identifiant incorrect"
      return
    }
    this.toggleWaiting();// Change la valeur booléen qui fait apparaitre la roue tournante idicant un processus en cours.
    //On fait appel au service local (apiBDD) qui interroge le seveur avec le matricule saisi et le mot de passe saisi.
    this.apiBDD.getLogin(this.userMatricule, this.userPassWord)
    .subscribe((response)=>{
      if(response == "Authentification réussie" ){
        /*Si le serveur répond "Authentification réussie" 
        toggleConnected (valeur booléenne) pemet d'afficher la barre de navigation
        L'utilisateur ainsi connecté est redirigé vers sa page d'accueil
        un token crypté est déposé dans les cookies par AXIOS
        */
        this.store.dispatch(toggleConnected())
        this.router.navigate(['accueil']);
      }else{
        // Sinon le message d'erreur du serveur est transmis à l'attribut local 'errorMsg' qui apparait dès qu'il est initié.
        this.toggleWaiting();
        this.errorMsg = response
      }
    })
    }

    /**
     * Cette fonction fait basculer une valeur booléenne de true à false et vice versa.
     * Cette valeur est la condition d'affichage de la roue tournante pendant l'attente du processus.
     */
    toggleWaiting(){
    this.waiting=!this.waiting;
      
    }
}


