import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AccountListComponent } from './components/admin/account-list/account-list.component';
import { RegisterBackOfficeComponent } from './components/admin/register-back-office/register-back-office.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UpdateAccountComponent } from './components/update-account/update-account.component';

const routes: Routes = [
  { path: '', redirectTo: '/' + environment.base + 'login', pathMatch: 'full' },
  { path: environment.base + 'login', component: LoginComponent },
  { path: environment.base + 'register', component: RegisterComponent },
  {
    path: environment.base + 'accounts', component: AccountListComponent
    , canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: environment.base + 'register/backoffice', component: RegisterBackOfficeComponent
    , canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: environment.base + 'accounts/:id', component: UpdateAccountComponent
    , canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
