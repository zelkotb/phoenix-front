import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Register } from '../model/register';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/internal/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      })
  };

  register(register: Register) {
    let url = environment.host + '/api/account/register';
    return this.http.post(url, register, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400 && err.error.responseMessage === "email already exist") {
            return throwError("cette adresse mail est déja utilisée");
          }
          else if (err.error.httpStatusCode == 400 && err.error.responseMessage === "phone already exist") {
            return throwError("ce numéro de téléphone est déja utilisé");
          }
          else if (err.error.httpStatusCode == 400) {
            return throwError("un paramètre incorrect");
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
}
