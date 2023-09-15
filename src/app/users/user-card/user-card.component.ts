import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { User } from 'src/app/models/userModel';
import { ServerService } from 'src/app/services/serveur/server.service';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() users: any[] | undefined;
  @Input() filter: boolean | undefined;
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
  ){
    
  }

  ngOnInit(){
 
  }
  /**
   * Au clic sur le bouton, 
   * @param matricule de la carte selectionnée
   * @param presence état de la présence en cours 0 ou 1 
   * Demande au serveur de modifier la présence du salarié 1 à 0 ou 0 à 1 selon l'état courant.
   */
  handleOnChangePresent(matricule, presence) {
    this.apiBDD.putPresenceToggle(matricule, presence).then(
      () => {
        // Émettre l'événement pour informer le composant parent de la mise à jour
        this.presenceUpdated.emit();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la présence :', error);
      }
    );
  }

  /**
   * commute l'attribut okToModify qui gère l'affichage des champs
   */
  commuteModify(user: User){
    this.idToModify = user.id;
    this.nameToModify = user.nom;
    this.firstNameToModify = user.prenom;
    this.respToModify = user.responsable;
    this.droitsToModify = user.type;
  }

  cancelModification(){
    this.idToModify = null;

  }

  
  /**
   * 
   * Modifier la fiche:
   */
  handleOnModify(user: User){
    const updatedUser = {
      ...user,
      nom:this.nameToModify,
      prenom:this.firstNameToModify,
      responsable:this.respToModify,
      type:this.droitsToModify,
    }
    const userUpdatedToSend = new User().deserialize(updatedUser)
    this.apiBDD.putModifyUser(userUpdatedToSend);
    this.idToModify = null;
    this.userUpdated.emit();
  }

  /**
   * Cette fonction sert dans les carte à récupèrer le nom du responsable de service de chaque salarié.
   * @param matricule du salarié recherché
   * @returns le prénom et nom du salarié
   */
  findUserByMatricule(mat: string){
    const userToFind = this.users.find(user=>
      user.matricule === mat
    )
    return userToFind.prenom+" "+userToFind.nom
  }
}
