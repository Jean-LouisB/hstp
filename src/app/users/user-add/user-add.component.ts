import { Component, OnInit, ViewChild } from '@angular/core';
import * as bcryptjs from 'bcryptjs';
import { User } from 'src/app/models/userModel';
import { environment } from 'src/app/environnement';
import { ServerService } from 'src/app/services/serveur/server.service';
import { Router } from '@angular/router';
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
    this.newUser.present = 1;
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
        this.router.navigate(['/users/liste']);
    }
    )
  }

}
