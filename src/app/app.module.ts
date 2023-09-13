import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './users/user/user.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { LoginComponent } from './users/login/login.component';
import { FormsModule } from '@angular/forms';
import { AccueilComponent } from './accueil/accueil.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StateModule } from './state/state.module';
import { StoreModule } from '@ngrx/store';
import { sessionReducer } from './state/session/session.reducers';
import { HeuresComponent } from './heures/heures.component';
import { ServiceComponent } from './service/service.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    UserListComponent,
    LoginComponent,
    AccueilComponent,
    NavbarComponent,
    HeuresComponent,
    ServiceComponent,
    EntrepriseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    StateModule,
    StoreModule.forRoot({session:sessionReducer})
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
