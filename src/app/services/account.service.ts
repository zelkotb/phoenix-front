import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Account } from '../model/account';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      })
  };

  accountList(): Observable<Account[]> {
    let url = environment.host + '/api/account';
    return this.http.get<Account[]>(url, this.httpOptions);
  }

  deleteAccount(id: number) {
    let url = environment.host + '/api/account/' + id;
    return this.http.delete(url, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 500) {
            return throwError("Erreur Interne");
          }
          else if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Account does not exist") {
            return throwError("Le compte que vous voulez supprimer n'existe pas");
          }
          else if (err.error.httpStatusCode == 400 && err.error.responseMessage === "cannot delete admin or merchant") {
            return throwError("Vous ne pouvez pas supprimer ce compte");
          }
          else {
            return throwError("Erreur Inconnue");
          }
        }
      )
    );
  }
}
