import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/userModel';
import { ServerService } from 'src/app/services/serveur/server.service';
import { changeOneUser, togglePresence } from 'src/app/state/session/session.actions';
import { SessionState } from 'src/app/state/session/session.reducers';
import { heureDecToStr } from '@fabricekopf/date-france';

@Component({
  selector: 'app-user-card2',
  templateUrl: './user-card2.component.html',
  styleUrls: ['./user-card2.component.css']
})
export class UserCard2Component implements OnInit {
  @Input() user: User | undefined;
  @Input() allUsers: User[] | undefined;
  @Output() presenceUpdated = new EventEmitter();
  idToModify: string = null;
  nameToModify: string = null;
  firstNameToModify: string = null;
  droitsToModify: number = null;
  respToModify: string = null;


  constructor(
    private apiBDD: ServerService,
    private store: Store<{ session: SessionState }>,
  ) { }

  ngOnInit() {

  }


  /**
   * okToModify = commutateur qui fait apparaitre le bouton "modifier" si une modification est à faire
   */
  commuteModify(user: User) {
    this.idToModify = user.id;
    this.nameToModify = user.nom;
    this.firstNameToModify = user.prenom;
    this.respToModify = user.responsable;
    this.droitsToModify = user.type;
  }

  cancelModification() {
    this.idToModify = null;
  }

  handleOnModify(user: User) {
    const updatedUser = {
      ...user,
      nom: this.nameToModify,
      prenom: this.firstNameToModify,
      responsable: this.respToModify,
      type: this.droitsToModify,
    }
    const userUpdatedToSend = new User().deserialize(updatedUser)
    this.store.dispatch(changeOneUser({ user: userUpdatedToSend }));
    this.apiBDD.putModifyUser(userUpdatedToSend);
    this.idToModify = null;
  }

  /**
   * Cette fonction sert dans les carte à récupèrer le nom du responsable de service de chaque salarié.
   * @param matricule du salarié recherché
   * @returns le prénom et nom du salarié
   */
  findUserByMatricule(mat: string) {
    const userToFind = this.allUsers.find(user => user.matricule === mat)
    return userToFind.prenom + " " + userToFind.nom
  }

  afficheHeureToStr(heureDec: number) {
    return heureDecToStr(heureDec);
  }

  handleOnChangePresent(id: string, presence: boolean) {
    this.store.dispatch(togglePresence({ id, presence }))
    this.apiBDD.putPresenceToggle(id, presence).then(
      () => {
        // Émettre l'événement pour informer le composant parent de la mise à jour
        this.presenceUpdated.emit();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la présence :', error);
      }
    );
  }


}
