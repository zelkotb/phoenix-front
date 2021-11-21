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

  constructor(
    public loginService: LoginService,
    private router: Router
  ) { }

  logout() {
    this.loginService.logout();
    this.router.navigate([this.pathToLogin]);
  }
}
