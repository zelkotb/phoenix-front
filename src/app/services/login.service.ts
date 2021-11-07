import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { LoginResponse } from '../model/loginResponse';
import { Login } from '../model/login';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/internal/operators';


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
}
