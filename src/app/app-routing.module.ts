import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { LoginComponent } from './users/login/login.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { HeuresComponent } from './heures/heures.component';
import { ServiceComponent } from './service/service.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { UserPageComponent } from './users/user-page/user-page.component';

const routes: Routes = [
  {path: 'accueil', component: AccueilComponent},
  {path: 'login', component: LoginComponent},
  {path: 'heures', component: HeuresComponent},
  {path: 'service', component: ServiceComponent},
  {path: 'entreprise', component: EntrepriseComponent},
  {path: 'users', component: UserPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
