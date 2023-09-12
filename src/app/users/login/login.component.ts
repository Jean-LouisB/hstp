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
  userMatricule: string = "";
  userPassWord: string = "";
  errorMsg = null;
  waiting=false;


  constructor(
    private apiBDD: ServerService,
     private router: Router,
     private store: Store,
    ) {
  }

  ngOnInit(): void {
   
  }
/**
 * 
 * @returns un message
 */
  connectIsValid() {
    if (this.userMatricule.length!=4){
      this.errorMsg = "Identifiant incorrect"
      return
    }
    this.toggleWaiting();
    this.apiBDD.getLogin(this.userMatricule, this.userPassWord)
    .subscribe((response)=>{
      if(response == "Authentification réussie" ){
        this.store.dispatch(toggleConnected())
        this.router.navigate(['accueil']);
      }else{
        this.toggleWaiting();
        this.errorMsg = response
      }
    })
    }

    toggleWaiting(){
    this.waiting=!this.waiting;
      
    }
}


