import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Account, GetAccountResponse, UpdateAccountRequest, UpdateAccountResponse } from '../model/account';
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

  updateAccount(account: UpdateAccountRequest, id: number) {
    let url: string;
    url = environment.host + '/api/account/' + id;
    return this.http.put<UpdateAccountResponse>(url, account, this.httpOptions).pipe(
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

  getAccount(id: number) {
    let url: string;
    url = environment.host + '/api/account/' + id;
    return this.http.get<GetAccountResponse>(url).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 500) {
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
