import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { configureAxios } from './config.axios';
import { Arbitrage } from '../models/arbitrage.model';
import { Heure } from '../models/heureModel';


@Injectable({
  providedIn: 'root'
})
export class ArbitrageService {
  private axiosInstance: any;
  constructor(
    private cookieService: CookieService,
  ) {
    this.axiosInstance = configureAxios(cookieService)
  }

  putNewArbitrage(arbitrage: Arbitrage, hoursTab: Heure[]) {
    return this.axiosInstance.post('/compteurs/ventiler', { arbitrage: arbitrage, hoursTab: hoursTab })
  }

}
