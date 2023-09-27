import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { LoginComponent } from './users/login/login.component';
import { HeuresComponent } from './heures/heures.component';
import { ServiceComponent } from './service/service.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { UserPageComponent } from './users/user-page/user-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserAddComponent } from './users/user-add/user-add.component';
import { HeuresDeclareComponent } from './heures/heures-declare/heures-declare.component';
import { HeuresConsulteComponent } from './heures/heures-consulte/heures-consulte.component';
import { HeuresArchivesComponent } from './heures/heures-archives/heures-archives.component';
import { ClotureComponent } from './heures/cloture/cloture.component';


const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'heures', component: HeuresComponent, children: [
      { path: 'declarer', component: HeuresDeclareComponent },
      { path: 'cloturer', component: ClotureComponent },
      { path: 'consulter', component: HeuresConsulteComponent },
      { path: 'archives', component: HeuresArchivesComponent },
    ]
  },
  { path: 'service', component: ServiceComponent },
  { path: 'entreprise', component: EntrepriseComponent },
  {
    path: 'users', component: UserPageComponent, children: [
      { path: 'liste', component: UserListComponent },
      { path: 'ajout', component: UserAddComponent },
    ]
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
