import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { LoginResponse } from '../model/loginResponse';
import { Login } from '../model/login';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/internal/operators';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      })
  };

  login(login: Login): Observable<LoginResponse> {
    let url = environment.host + '/api/account/login';
    return this.http.post<LoginResponse>(url, login, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 403) {
            return throwError("email ou mot de passe incorrect");
          }
          else if (err.error.httpStatusCode == 401 && err.error.responseMessage === "User is blocked") {
            return throwError("Cet Utilisateur est bloqué ou supprimé");
          }
          else if (err.error.httpStatusCode == 500) {
            return throwError("Erreur Interne");
          }
          else {
            return throwError("Erreur Inconnue");
          }
        }
      )
    );
  }

  isLoggedIn() {
    let token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  setToken(token: string, email: string, roles: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('roles', roles);
  }

  updateToken(token: string, email: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.isRole('ADMIN');
  }
  isMerchant(): boolean {
    return this.isRole('E_MERCHANT');
  }

  isBackOffice(): boolean {
    return this.isRole('BACK_OFFICE');
  }

  isRole(role: string): boolean {
    let tokenInfo = this.getDecodedAccessToken(this.getToken());
    let roles: string[] = tokenInfo.roles;
    if (roles.includes(role)) {
      return true;
    } return false;
  }
}
