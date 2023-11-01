import { Component, OnInit, ViewChild } from '@angular/core';
import * as bcryptjs from 'bcryptjs';
import { User } from 'src/app/models/userModel';
import { environment } from 'src/app/environnement';
import { ServerService } from 'src/app/services/serveur/server.service';
import { Router } from '@angular/router';
import { Arbitrage } from 'src/app/models/arbitrage.model';

const salt = environment.salt;

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  matricule: string = null;
  prenom: string = null;
  nom: string = null;
  niveauDeDroit: number = null;
  matResponsable: string = null;
  passwordRaw = null;
  passwordHash = null;
  newUser: User = new User();
  solidariteDeDepart: number = 0;
  msgErreurSolidarite:String = null;

  constructor(
    private apiBDD: ServerService,
    private router: Router,
  ){}
  /**
   * TODO :
   * 
   * envoyer le user à appBDD
   * 
   */
  ngOnInit(): void {

  }

   onSubmit() {
    this.newUser.matricule = this.matricule.toLocaleUpperCase();
    this.newUser.prenom = this.prenom;
    this.newUser.nom = this.nom.toLocaleUpperCase();
    this.newUser.responsable = this.matResponsable.toLocaleUpperCase();
    this.newUser.type = this.niveauDeDroit;
    this.newUser.id = 'new';
    this.newUser.present = true;
    this.addFirstSolidarite();
    this.saveNewUser();
    
  }

  /**
   * pour crypter le mot de passe avant de l'envoyer.
   */
  async saveNewUser() {
    await bcryptjs.hash(this.passwordRaw, salt).then(
      (pass) => {
        this.newUser.password = pass;
        this.apiBDD.putAddUser(this.newUser);
        this.apiBDD.getAllUsers();
        this.router.navigate(['/users/liste']);
    }
    )
  }

  addFirstSolidarite(){
    let arbitrage = new Arbitrage();
    const commentaire = "Initialisation de la journée de solidarité"
    let ventillation = {
      matricule: this.matricule,
      date: new Date(),
      commentaire: commentaire,
      solidarite: this.solidariteDeDepart,
      recuperation: 0,
      heuresSupMajoree: 0,
      heureAPayer: 0,
      respValidationStatus: 0,
      respDateValidation: new Date(),
      paiementStatus: 0,
      datePaiement: null,
      responsable: "Init", 
    }
    arbitrage.deserialize(ventillation);

    try {
      this.apiBDD.validateHour(arbitrage);
    } catch (error) {
      console.log(error);
    }
  }
  ctrlSolidarite(){
    if(this.solidariteDeDepart <-7 || this.solidariteDeDepart >0){
      this.msgErreurSolidarite = "La solidarité de départ doit être comprise entre -7 et 0. Vérifiez votre saisie." 
    }else{
      this.msgErreurSolidarite = null;
    }
  }
}
