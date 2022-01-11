import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { CreateOrder } from '../model/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      })
  };

  createOrder(createOrder: CreateOrder){
    let url = environment.host + '/api/orders/';
  return this.http.post(url, createOrder, this.httpOptions).pipe(
    catchError(
      err => {
        if (err.error.httpStatusCode == 400 && err.error.responseMessage === "product list must not be empty") {
          return throwError("La List des produit doit contenir au moin 1 élément");
        }
        else if (err.error.httpStatusCode == 400 && err.error.responseMessage === "quantity must be > 0") {
          return throwError("Les quantitées doivent être strictement positives");
        }
        else if (err.error.httpStatusCode == 400 && err.error.responseMessage === "product name doesn't exist") {
          return throwError("Le nom du produit n'existe pas");
        }
        else if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Quantity is short in the stock") {
          return throwError("quantité dans le stock n'est suffisante");
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
