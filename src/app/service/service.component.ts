import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/models/userModel';
import { SessionState } from 'src/app/core/state/session/session.reducers';
import { setUser } from 'src/app/core/state/session/session.actions';
import { UserService } from 'src/app/core/services/users.service';

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
    private userService: UserService,

  ){}
  ngOnInit(): void {
    this.getNameUserState();
    if (this.user == null) {
      this.userService.getUserProfil().subscribe((data) => {
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
      .subscribe((userData: User | null ) => {
        if (userData.type<3) {
          this.router.navigate(['/accueil'])
        }else{
          this.user = userData;
        }
      });

  }

}
