import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { LoginComponent } from './users/login/login.component';
import { HeuresComponent } from './heures/heures.component';
import { ServiceComponent } from './service/service.component';
import { UserPageComponent } from './users/user-page/user-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserAddComponent } from './users/user-add/user-add.component';
import { HeuresDeclareComponent } from './heures/heures-declare/heures-declare.component';
import { HeuresConsulteComponent } from './heures/heures-consulte/heures-consulte.component';
import { HeuresArchivesComponent } from './heures/heures-archives/heures-archives.component';
import { ClotureComponent } from './heures/cloture/cloture.component';
import { ServiceConsulterComponent } from './service/service-consulter/service-consulter.component';
import { ServiceValiderComponent } from './service/service-valider/service-valider.component';
import { BornesComponent } from './users/bornes/bornes.component';


const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'heures', component: HeuresComponent, children: [
      { path: '', redirectTo: 'consulter', pathMatch: 'full'},
      { path: 'consulter', component: HeuresConsulteComponent },
      { path: 'declarer', component: HeuresDeclareComponent },
      { path: 'cloturer', component: ClotureComponent },
      { path: 'archives', component: HeuresArchivesComponent },
    ]
  },
  {
    path: 'service', component: ServiceComponent, children: [
      { path: '', redirectTo: 'valider', pathMatch: 'full'},
      { path: 'consulter', component: ServiceConsulterComponent },
      { path: 'valider', component: ServiceValiderComponent }
    ]
  },
  {
    path: 'users', component: UserPageComponent, children: [
      { path: '', redirectTo: 'liste', pathMatch: 'full'},
      { path: 'liste', component: UserListComponent },
      { path: 'ajout', component: UserAddComponent },
      { path: 'bornes', component: BornesComponent },
    ]
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
