import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConnexionService } from '../services/connexion/connexion.service';
import { Store, select } from '@ngrx/store';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  isConnected = false;
  user = null;
  constructor(
    private router: Router,
    private cookiesService: CookieService,
    private authService: ConnexionService,
  ) {

  }
  ngOnInit(): void {

  }




}
