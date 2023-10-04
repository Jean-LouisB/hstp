import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/userModel';
import { SessionState } from 'src/app/state/session/session.reducers';
import { setUser } from 'src/app/state/session/session.actions';
import { ServerService } from 'src/app/services/serveur/server.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit{
  private userSubscription: Subscription | undefined;
  user: User | null = null;
  constructor(
    private store: Store<{ session: SessionState }>,
    private router: Router,
    private apiBDD: ServerService,
    private cookieService: CookieService,
  ){}
  ngOnInit(): void {
    this.getNameUserState();
    if (this.user == null) {
      this.apiBDD.getUserProfil().subscribe((data) => {
        this.user = new User().deserialize(data)
        //console.log(this.user);
        this.store.dispatch(setUser({ user: this.user }));
      })
    }
  }
/**
 * récupère le salarié connecté et vérifie les droits d'accés.
 * Sinon redirige à l'accueil
 */
  getNameUserState() {
    this.userSubscription = this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: { user: User | null }) => {
        if (userData.user.type<3) {
          this.router.navigate(['/accueil'])
        }else{
          this.user = userData.user;
        }
      });

  }

}
