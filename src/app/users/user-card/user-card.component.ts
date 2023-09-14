import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ServerService } from 'src/app/services/serveur/server.service';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit , OnChanges{
  @Input() users: any[] | undefined;
  @Input() filter: boolean | undefined;
  @Output() presenceUpdated = new EventEmitter();
  constructor(
    private apiBDD: ServerService
  ){
    
  }
    ngOnChanges(changes: SimpleChanges): void {
  
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

}
