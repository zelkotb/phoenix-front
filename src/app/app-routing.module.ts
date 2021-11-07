import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

const base: string = "phoenix/";
const routes: Routes = [
  { path: '', redirectTo: '/' + base + 'login', pathMatch: 'full' },
  { path: base + 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
