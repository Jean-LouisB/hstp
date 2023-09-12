import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { LoginComponent } from './users/login/login.component';
import { UserListComponent } from './users/user-list/user-list.component';

const routes: Routes = [
  {path: 'accueil', component: AccueilComponent},
  {path: 'login', component: LoginComponent},
  {path: 'users', component: UserListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
