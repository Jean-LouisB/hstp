import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { User } from '../core/models/userModel';
import { UserService } from '../core/services/users.service';
import { setUser } from '../core/state/session/session.actions';
import { SessionState } from '../core/state/session/session.reducers';



@Component({
  selector: 'app-heures',
  templateUrl: './heures.component.html',
  styleUrls: ['./heures.component.css']
})
export class HeuresComponent implements OnInit {
  user: User | null = null;

  constructor(
    private userService: UserService,
    private store: Store<{ session: SessionState }>,
  ) { }

  ngOnInit(): void {
    this.getNameUserState(); //récupération du profil de l'utilisateur
    if (this.user == null) {
      this.userService.getUserProfil().subscribe((data) => {
        this.user = new User().deserialize(data)
        this.store.dispatch(setUser({ user: this.user }));
      })
    }

  }
  getNameUserState() {
    this.store.pipe(select(state => state.session.userState))
      .subscribe((userData: User | null ) => {
        this.user = userData;
      });
  }


}
