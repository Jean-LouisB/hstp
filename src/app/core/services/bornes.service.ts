import { Injectable } from '@angular/core';
//Pour axios :
import { configureAxios } from './config.axios';
//Pour les outils de stokage locaux
import { CookieService } from 'ngx-cookie-service';
// le store :
import { Store } from '@ngrx/store';
import { SessionState } from '../state/session/session.reducers';
import { setBornes } from '../state/session/session.actions';

@Injectable({
  providedIn: 'root'
})

export class BornesService {

  private axiosInstance: any;
  constructor(
    private cookieService: CookieService,
    private store: Store<{ session: SessionState }>,
  ) {
    this.axiosInstance = configureAxios(cookieService)
  }
  /**
   * Il faut appeller cette fonction dans un try/catch
   * getBornes interroge la bdd via le back-end afin de récupérer les dates de saisies courrantes.
   * Dans l'App. ces dates sont appelées 'Bornes'
   * Une fois récupérées les bornes sont placées dans le store.
   */
  getBornes(): Promise<Date[] | null> {
    return this.axiosInstance.get('/bornes/bornes')
      .then((response: any) => {
        if (response.data.bornes && response.data.bornes.length) {
          const date_debut = new Date(response.data.bornes[0]['date_debut']);
          const date_fin = new Date(response.data.bornes[0]['date_fin']);
          this.store.dispatch(setBornes({ bornes: [date_debut, date_fin] }));
          return [date_debut, date_fin];
        } else {
          console.log(response.data.message);
          return null
        }
      })
      .catch (error=>{
        console.error(error);
        throw error;
      })
  }

  /**
   * Il faut appeller cette fonction dans un try/catch
   * @param bornes tableau de dates dans l'ordre croissant
   */
  upDateBornes(bornes: Date[]): Promise<any> {
    if (bornes.length != 2) {
      return Promise.reject(new Error("la liste des dates n'est pas complète"))
    } else {
      return this.axiosInstance.put('/bornes/update', { bornes: bornes })
      .then((response)=>{
        return response.data;
      })
      .catch (error=>{
        throw error //voir serveur pour réponses possibles
      })

    }
  }

}

