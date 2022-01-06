import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { Document, DocumentHistory, DocumentResponse, ValidateDocumentRequest } from '../model/document';
import { History } from '../model/history';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      })
  };

  saveDocument(document: Document): Observable<number>{
      let url = environment.host + '/api/documents/';
    return this.http.post<number>(url, document, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400 && err.error.responseMessage === "only on hold status is accepted") {
            return throwError("status doit être en attente, refreshir la page");
          }
          else if (err.error.httpStatusCode == 400 && err.error.responseMessage === "operation list is empty") {
            return throwError("Sélectionner au moin une opération");
          }
          else if (err.error.httpStatusCode == 400 && err.error.responseMessage === "status must match the provided type") {
            return throwError("type envoié doit être le meme avec celui de l'opération");
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

  listProducts() : Observable<DocumentResponse[]>{
    let url = environment.host + '/api/documents';
    return this.http.get<DocumentResponse[]>(url, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400) {
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

  validateDocument(validateDocumentRequest: ValidateDocumentRequest){
    let url = environment.host + '/api/documents/validate';
    return this.http.post(url, validateDocumentRequest, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Id not Correct") {
            return throwError("Le document contient des produits qui n'existent pas");
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

  listDocumentHistory(): Observable<DocumentHistory[]>{
    let url = environment.host + '/api/documents/history';
    return this.http.get<DocumentHistory[]>(url, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400) {
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


  getDocumentHistory(id: number): Observable<History[]>{
    let url = environment.host + '/api/documents/history/'+id;
    return this.http.get<History[]>(url, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400) {
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
