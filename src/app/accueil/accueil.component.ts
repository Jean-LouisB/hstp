import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/serveur/server.service';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  isConnected = false;
  user = null;
  constructor(
    private apiBDD: ServerService,
  ) {

  }
  ngOnInit(): void {
    this.apiBDD.getUserProfil().subscribe((data)=>{
      this.user= data;
    })
  }



}
