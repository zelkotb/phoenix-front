import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  pathToLogin = environment.base + "login";
  pathToRegister = environment.base + "register";
  baseUrl = environment.base;

  constructor(
    public loginService: LoginService,
    private router: Router
  ) { }

  logout() {
    this.loginService.logout();
    this.router.navigate([this.pathToLogin]);
  }

  goToProfile(){
    this.router.navigate([environment.base + '/accounts/'+this.loginService.getId()]);
  }

  isActive(url: string, exact: boolean): boolean {
    return this.router.isActive(environment.base + url, exact);
  }

  isActiveWithId(url: string, exact: boolean): boolean {
    return this.router.isActive(environment.base + url + this.loginService.getId(), exact);
  }

  goToUrl(url : string){
    this.router.navigate([environment.base + url]);
  }
  
}
