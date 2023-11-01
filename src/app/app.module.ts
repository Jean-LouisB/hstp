import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { UserPageComponent } from './users/user-page/user-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SideBarComponent } from './users/user-page/side-bar/side-bar.component';
import { UserAddComponent } from './users/user-add/user-add.component';
import { SidebarHeuresComponent } from './heures/sidebar-heures/sidebar-heures.component';
import { HeuresDeclareComponent } from './heures/heures-declare/heures-declare.component';
import { HeuresConsulteComponent } from './heures/heures-consulte/heures-consulte.component';
import { HeuresArchivesComponent } from './heures/heures-archives/heures-archives.component';
import { ClotureComponent } from './heures/cloture/cloture.component';
import { SidebarServiceComponent } from './service/sidebar-service/sidebar-service.component';
import { ServiceConsulterComponent } from './service/service-consulter/service-consulter.component';
import { ServiceValiderComponent } from './service/service-valider/service-valider.component';
import { UserCard2Component } from './users/user-card2/user-card2.component';



@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    LoginComponent,
    AccueilComponent,
    NavbarComponent,
    HeuresComponent,
    ServiceComponent,
    EntrepriseComponent,
    UserPageComponent,
    NotFoundPageComponent,
    SideBarComponent,
    UserAddComponent,
    SidebarHeuresComponent,
    HeuresDeclareComponent,
    HeuresConsulteComponent,
    HeuresArchivesComponent,
    ClotureComponent,
    SidebarServiceComponent,
    ServiceConsulterComponent,
    ServiceValiderComponent,
    UserCard2Component,
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
