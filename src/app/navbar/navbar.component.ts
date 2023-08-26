import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ConnexionService } from '../services/connexion/connexion.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  constructor(
    private cookiesService: CookieService,
    private router: Router,
    private authService: ConnexionService
    ) { }
  
  ngOnInit(): void {
    console.log(this.getIsLoggedIn());
    
  }
   handleOnLoout(){
    this.cookiesService.delete('session');
    this.authService.logout();
    this.router.navigate(['login']);
   }

   getIsLoggedIn(){
    return this.authService.isLoggedIn()
   }
}

