import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/serveur/server.service';
import { ConnexionService } from 'src/app/services/connexion/connexion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit{
  userList = [];
  filtreAbsent = true;
  titreBtnFiltre = "Voir les absents";


  constructor(
    private apiBDD : ServerService,
    private authService: ConnexionService,
    private router: Router
     ){}

  ngOnInit(){
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['login'])
    }
    this.apiBDD.getAllUsers()
      .then(response => {
        const list = response.data;
        list.sort((a, b)=>a.nom.localeCompare(b.nom))
        this.userList = list;
      })
      .catch(error => {
        console.log("Une erreur s'est produite : "+error);
      })
  }
  handelOnFilter(){
   
    this.filtreAbsent = !this.filtreAbsent
    this.titreBtnFiltre = this.filtreAbsent === true ? "Voir les absents" : "Masquer les absents"

  }


  fetchUsers() {
    this.apiBDD.getAllUsers().then(
      (data) => {
        const list = data.data;
        list.sort((a, b)=>a.nom.localeCompare(b.nom))
        this.userList = list;
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    );
  }
  

}
