import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../core/services/users.service';
import { User } from '../core/models/userModel';
import { toggleConnected } from '../core/state/session/session.actions';
import { Store, select } from '@ngrx/store';
import { SessionState } from '../core/state/session/session.reducers';
//import { Subscription } from 'rxjs';
import { setUser } from '../core/state/session/session.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  @Output() toggle : EventEmitter<void> = new EventEmitter()
  /**
   * connected précise si l'utilisateur est connecté
   * ne sert plus A SUPPRIMER !!!
   */
  //connected:boolean = false;
  /**
   * user doit recevoir les informations de l'utilisateur.
   * Son prénom et nom pour personnaliser l'affichage.
   * Son niveau de droit1, 2 ou 3 pour définir les menus à afficher.
   */
  user: User = new User;

   /**
   * userSubscription
   * ne sert plus A SUPPRIMER !!!
   */
  //private userSubscription: Subscription | undefined;
  constructor(
    private router: Router, //gère les redirection (si pas connecté ...)
    private userService: UserService, // accès au service local pour interroger le serveur (et donc la BDD)
    private store: Store<{ session: SessionState }>  //accès au store pour récupèrer les données utilisateurs

    ) { }
  
  ngOnInit(): void {
    this.getNameUserState();
  }
  
  /**
   * Par le clic sur "deconnexion" cette fonction 'handleOnLoout' détruit toutes les traces de l'utilisateur :
   * le profil enregistré sur le store,
   * isConnected du store (affichage de la navbar),
   * appelle la route logout qui va détruire le cookie et informer le serveur
   * redirige vers la page de connexion.
   * 
   */
   handleOnLoout(){
    this.store.dispatch(toggleConnected());
    this.store.dispatch(setUser(null));
    this.userService.getLogout();
    this.router.navigate(['/login']);
   }

   /**
    * A SUPPRIMER ???
    */
   /* toggleConnected() {
    this.toggle.emit();
  } */

  /**
   * Chaque page a la responsabilité de vérifier si l'utilisateur est enregistré dans le store, et de le faire avec le token 
   * si il ne l'est pas.
   * Donc la navbar récupère les données de l'utilisateur par cette fonction getNameUserState qui les affecte à l'attribut local.
   * Ainsi elle peut contrôler le niveau de droit pour l'affichage spécifique, et afficher le prénom et nom.
   */
  getNameUserState() {
    this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: User | null ) => {
        if(userData && userData){
          this.user = userData;
        }
      });
  }

}

