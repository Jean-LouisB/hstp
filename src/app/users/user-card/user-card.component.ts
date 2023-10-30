import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { User } from 'src/app/models/userModel';
import { ServerService } from 'src/app/services/serveur/server.service';
import { heureDecToStr } from '@fabricekopf/date-france';
import { SessionState } from 'src/app/state/session/session.reducers';
import { Store } from '@ngrx/store';
import { changeOneUser, togglePresence } from 'src/app/state/session/session.actions';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() users: any[] | undefined;
  @Input() filter: boolean | undefined;
  @Input() allUsers: any[] | undefined;
  @Output() presenceUpdated = new EventEmitter();
  @Output() userUpdated = new EventEmitter();


  /**
   * okToModify = commutateur qui fait apparaitre le bouton "modifier" si une modification est à faire
   */
  idToModify: string = null;
  nameToModify: string = null;
  firstNameToModify: string = null;
  droitsToModify: number = null;
  respToModify: string = null


  constructor(
     private apiBDD: ServerService,
     private store: Store<{ session: SessionState }>,
  ) {

  }

  ngOnInit() {
    //console.log(this.users);
    
  }
  /**
   * Au clic sur le bouton, 
   * @param matricule de la carte selectionnée
   * @param presence état de la présence en cours 0 ou 1 
   * Demande au serveur de modifier la présence du salarié 1 à 0 ou 0 à 1 selon l'état courant.
   */
  handleOnChangePresent(id: string, presence: number) {
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
  testLogListe() {
    this.users.forEach(user => console.log(user.nom))
  }
  /**
   * commute l'attribut okToModify qui gère l'affichage des champs
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


  /**
   * 
   * Modifier la fiche:
   */
  handleOnModify(user: User) {
    const updatedUser = {
      ...user,
      nom: this.nameToModify,
      prenom: this.firstNameToModify,
      responsable: this.respToModify,
      type: this.droitsToModify,
    }
    const userUpdatedToSend = new User().deserialize(updatedUser)
    this.store.dispatch(changeOneUser({user: userUpdatedToSend}));
    this.apiBDD.putModifyUser(userUpdatedToSend);
    this.idToModify = null;
    this.userUpdated.emit();
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

  afficheHeureToStr(heureDec: number){
    return heureDecToStr(heureDec);
  }
}
