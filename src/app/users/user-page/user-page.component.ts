import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { User } from 'src/app/models/userModel';
import { SessionState } from 'src/app/state/session/session.reducers';
import { setUser } from 'src/app/state/session/session.actions';
import { ServerService } from 'src/app/services/serveur/server.service';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit{

  /**
   * user récupère le profil de l'utilisateur connecté
   */
  user: User | null = null;
  constructor(
    private store: Store<{ session: SessionState }>,
    private router: Router,
    private apiBDD: ServerService, //Service local qui interroge le serveur et donc la BDD
  ){}
 /**
  * this.getNameUserState() affecte un profil à l'attribut local.
  * Si le store a été rafraichi, donc réinitialisé, user == null
  * donc ngOnInit interroge le serveur pour récupérer les infos avec le token.
  * Puis les réaffecte à l'attribut local et au store.
  * 
  */
  ngOnInit(): void {
    this.getNameUserState();
    if (this.user == null) {
        this.apiBDD.getUserProfil().subscribe((data) => {
        this.user = new User().deserialize(data)
        this.store.dispatch(setUser({ user: this.user }));
      })
    }

  }

/**
 * getNameUserState() est lancée par ngOnInit()
 * Cette fonction récupère le profil de l'utilisateur dans le store.
 * Si les droit du profil récupèré sont < 3 alors l'utilisateur n'a pas le droit d'être là.
 * Il est redirigé vers sa page d'accueil.
 * sinon le profil est récupéré sur l'attribut local.
 * 
 * */
  getNameUserState() {
    this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: { user: User | null }) => {
        if (userData.user.type<3) {
          this.router.navigate(['/accueil'])
        }else{
          this.user = userData.user;
        }
      });
  }

}
