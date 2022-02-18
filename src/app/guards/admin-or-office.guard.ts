import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AdminOrOfficeGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.loginService.isAdmin() && !this.loginService.isBackOffice) {
      this.router.navigate([environment.base + '/login']); // go to login if not authenticated
      return false;
    }
    return true;
  }
  
}
