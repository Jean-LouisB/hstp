import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
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
  private userSubscription: Subscription | undefined;
  user: User | null = null;
  constructor(
    private store: Store<{ session: SessionState }>,
    private router: Router,
    private apiBDD: ServerService,
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
