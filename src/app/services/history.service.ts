import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { History } from '../model/history';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      })
  };

  listHistory() : Observable<History[]>{
    let url = environment.host + '/api/histories';
    return this.http.get<History[]>(url, this.httpOptions).pipe(
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

  listHistoryPhoenix() : Observable<History[]>{
    let url = environment.host + '/api/histories/phoenix';
    return this.http.get<History[]>(url, this.httpOptions).pipe(
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
