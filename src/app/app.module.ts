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


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    UserListComponent,
    LoginComponent,
    AccueilComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    StateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
