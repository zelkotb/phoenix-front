import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AccountListComponent } from './components/admin/account-list/account-list.component';
import { RegisterBackOfficeComponent } from './components/admin/register-back-office/register-back-office.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
const routes: Routes = [
  { path: '', redirectTo: '/' + environment.base + 'login', pathMatch: 'full' },
  { path: environment.base + 'login', component: LoginComponent },
  { path: environment.base + 'register', component: RegisterComponent },
  { path: environment.base + 'accounts', component: AccountListComponent },
  { path: environment.base + 'register/backoffice', component: RegisterBackOfficeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
