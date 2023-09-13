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
  filterByName = "*";
  filteredList=[];


  constructor(
    private apiBDD : ServerService,
    private authService: ConnexionService,
    private router: Router
     ){}

  ngOnInit(){
    
    this.apiBDD.getAllUsers()
      .then(response => {
        const list = response.data;
        list.sort((a, b)=>a.nom.localeCompare(b.nom))
        this.userList = list;
        this.filtreLaListe()
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
  
  filtreLaListe(){
    if (this.filterByName === "*" || this.filterByName === "" ){
      this.filteredList = this.userList;
    }else{
      this.filteredList = this.userList.filter((user)=>{
      const userNameUpperCase = user.nom.toUpperCase()
      const userFirstNameUpperCase = user.prenom.toUpperCase()
      const nameSearched = this.filterByName.toUpperCase()
      const nomPrenom = userNameUpperCase+userFirstNameUpperCase
      return nomPrenom.includes(nameSearched) 
    })
    }
   
  }

  handleOnSearch(event: Event){
    const inputElement = event.target as HTMLInputElement;
    this.filterByName = inputElement.value
    this.filtreLaListe();
  }

}
