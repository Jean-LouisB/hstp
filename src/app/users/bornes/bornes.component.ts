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
  date_debut: Date | null;
  date_fin: Date | null;
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
        }
      })
  }

  ngOnDestroy(): void {
    if(this.bornesSubscription){
      this.bornesSubscription.unsubscribe()
    }
  }
}
