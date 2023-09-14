import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Store } from '@ngrx/store';
import { toggleConnected } from './state/session/session.actions';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isConnected$: Observable<boolean>;
  title = 'TOMPRESS | Gestion des heures';

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private store: Store<{ session : any}> //session = le nom donné dans app.module
  ) {
    this.isConnected$ = store.select(state=>state.session.isConnected);//récupère la valeur dans le store pour l'affichage de la nav-barre
    
  }
  

  ngOnInit(): void {
    this.checkSession()
    
  }

/**
 * A chaque refraichissement, app.componant vérifie la présence du cookie de session.
 * Si oui, il repasse isConnected sur true dans le store pour l'affichage de la nav-barre
 * Si non, il redirige vers la page de connexion.
 */
  checkSession() {
    if (this.cookieService.get('session')) {
      this.store.dispatch(toggleConnected());
    }else{
      this.router.navigate(['/login']);
    }
  }

}