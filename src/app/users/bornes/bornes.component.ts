import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ServerService } from 'src/app/services/serveur/server.service';
import { SessionState } from 'src/app/state/session/session.reducers';
import { formatDate} from '@fabricekopf/date-france';

@Component({
  selector: 'app-bornes',
  templateUrl: './bornes.component.html',
  styleUrls: ['./bornes.component.css']
})
export class BornesComponent implements OnInit, OnDestroy {
  date_debut: string | null;
  new_date_debut: Date | null;
  date_fin: string | null;
  new_date_fin: Date | null;
  isChanging: boolean = false;
  message: string | null;

  private bornesSubscription: Subscription | undefined;
  constructor(
    private apiBDD: ServerService,
    private store: Store<{ session: SessionState }>
  ) { }


  ngOnInit(): void {
    this.getBornes()
  }

  private getBornes() {
    this.apiBDD.getBornes();
    this.bornesSubscription = this.store.pipe(select(state => state.session.bornes))
      .subscribe((bornes: Date[]) => {
        if (bornes) {
          this.date_debut = formatDate(bornes[0]).dateToStringWithoutHour;
          this.date_fin = formatDate(bornes[1]).dateToStringWithoutHour;
          this.new_date_debut = bornes[0];
          this.new_date_fin = bornes[1];
        }
      })
  }

  toggleIsChanging(){
    this.isChanging=!this.isChanging;
  }

  upDateBornes(){
    const bornes = [this.new_date_debut, this.new_date_fin]
    this.apiBDD.upDateBornes(bornes);
    this.message = "dates mises à jour";
    console.log(this.message);

    this.toggleIsChanging();
  }

  ngOnDestroy(): void {
    if(this.bornesSubscription){
      this.bornesSubscription.unsubscribe()
    }
  }
}
