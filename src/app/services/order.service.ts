import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { CommentResponse, CreateOrder, Order, RefuseOrderRequest } from '../model/order';
import { OrderDocument, OrderDocumentResponse } from '../model/document';

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

  listOrders() : Observable<Order[]>{
    let url = environment.host + '/api/orders';
    return this.http.get<Order[]>(url, this.httpOptions).pipe(
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

  deleteOrder(id: number){
    let url = environment.host + '/api/orders/'+id;
    return this.http.delete(url, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Cannot delete order with status not in wait") {
            return throwError("La commande est déja en attente de ramassage");
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

  saveOrderDocument(document: OrderDocument): Observable<OrderDocumentResponse>{
    let url = environment.host + '/api/order/documents';
  return this.http.post<OrderDocumentResponse>(url, document, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400 && err.error.responseMessage === "operation list is empty") {
            return throwError("La liste des opérations est vide");
          }
          else if (err.error.httpStatusCode == 400 && err.error.responseMessage === "only on hold status is accepted") {
            return throwError("Status doit être en attente");
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

  listOrderDocumentByStatus(url: string){
    return this.http.get<OrderDocumentResponse[]>(url, this.httpOptions).pipe(
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

  listOrderDocumentInWait() : Observable<OrderDocumentResponse[]>{
    let url = environment.host + '/api/order/documents';
    return this.listOrderDocumentByStatus(url);
  }

  listOrdersDetailsInDocumentInWait(id: number) : Observable<Order[]>{
    let url = environment.host + '/api/order/documents/'+id;
    return this.http.get<Order[]>(url, this.httpOptions).pipe(
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

  moveFromInWaiteToInWaiteForPickup(id: number){
    let url = environment.host + '/api/order/documents/wait/'+id;
    return this.http.post(url, this.httpOptions).pipe(
        catchError(
          err => {
            if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Status must be EN ATTENTE") {
              return throwError("Les status doit être en attente");
            }
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

  listOrderDocumentInWaitForPickUp() : Observable<OrderDocumentResponse[]>{
    let url = environment.host + '/api/order/documents/wait/pickup';
    return this.listOrderDocumentByStatus(url);
  }

  deleteOrderDocumentInWaitForPickUp(id: number){
    let url = environment.host + '/api/order/documents/wait/pickup/'+id;
    return this.http.delete(url, this.httpOptions).pipe(
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

  moveFromWaiteToPickedup(id: number){
    let url = environment.host + '/api/order/documents/pickedup/'+id;
    return this.http.post(url, this.httpOptions).pipe(
        catchError(
          err => {
            if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Status must be EN ATTENTE_RAMASSAGE") {
              return throwError("Les status doit être en attente de ramassage");
            }
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

  listOrderDocumentPickedUp() : Observable<OrderDocumentResponse[]>{
    let url = environment.host + '/api/order/documents/pickedup';
    return this.listOrderDocumentByStatus(url);
  }

  moveOrderToShipped(id: number){
    let url = environment.host + '/api/orders/shipped/'+id;
    return this.http.get(url, this.httpOptions).pipe(
        catchError(
          err => {
            if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Status must be RAMASSAGE") {
              return throwError("La status doit être en ramassage");
            }
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

  listOrdersByStatus(url: string){
    return this.http.get<Order[]>(url, this.httpOptions).pipe(
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

  listShippedOrders() : Observable<Order[]>{
    let url = environment.host + '/api/orders/shipped';
    return this.listOrdersByStatus(url);
  }

  putOrderToInDistribution(id: number){
    let url = environment.host + '/api/orders/inDistribution/'+id;
    return this.http.get(url, this.httpOptions).pipe(
        catchError(
          err => {
            if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Status must be EXPEDITE") {
              return throwError("La status doit être expédité ");
            }
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

  listInDistributionOrders() : Observable<Order[]>{
    let url = environment.host + '/api/orders/inDistribution';
    return this.listOrdersByStatus(url);
  }

  listHistoryOrderDocument() : Observable<OrderDocumentResponse[]>{
    let url = environment.host + '/api/order/documents/history'
    return this.http.get<OrderDocumentResponse[]>(url, this.httpOptions).pipe(
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

  listCitiesWithOrderExpidite(): Observable<string[]>{
    let url = environment.host + '/api/orders/expedite/cities';
    return this.http.get<string[]>(url, this.httpOptions).pipe(
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

  listShippedOrdersByCity(city : string) : Observable<Order[]>{
    let url = environment.host + '/api/orders/expidite/cities/'+city
    return this.listOrdersByStatus(url);
  }

  moveOrderToValidate(id: number){
    let url = environment.host + '/api/orders/validate/'+id;
    return this.http.get(url, this.httpOptions).pipe(
        catchError(
          err => {
            if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Status must be IN_DISTRIBUTION") {
              return throwError("La status doit être en IN_DISTRIBUTION");
            }
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

  moveOrderToRefuse(id: number, orderRefuse: RefuseOrderRequest){
    let url = environment.host + '/api/orders/refuse/'+id;
    return this.http.post(url, orderRefuse, this.httpOptions).pipe(
        catchError(
          err => {
            if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Status must be IN_DISTRIBUTION") {
              return throwError("La status doit être en IN_DISTRIBUTION");
            }
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

  moveOrderToCancel(id: number, orderRefuse: RefuseOrderRequest){
    let url = environment.host + '/api/orders/cancel/'+id;
    return this.http.post(url, orderRefuse, this.httpOptions).pipe(
        catchError(
          err => {
            if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Status must be IN_DISTRIBUTION") {
              return throwError("La status doit être en IN_DISTRIBUTION");
            }
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

  listValidatedOrders() : Observable<Order[]>{
    let url = environment.host + '/api/orders/validated';
    return this.listOrdersByStatus(url);
  }

  listRefusedOrCanceledOrders() : Observable<Order[]>{
    let url = environment.host + '/api/orders/refuse/canceled';
    return this.listOrdersByStatus(url);
  }

  listReturedOrders() : Observable<Order[]>{
    let url = environment.host + '/api/orders/returned';
    return this.listOrdersByStatus(url);
  }

  getCommentByOrderId(orderId: number) : Observable<CommentResponse>{
    let url = environment.host + '/api/orders/comment/'+orderId;
    return this.http.get<CommentResponse>(url, this.httpOptions).pipe(
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


  getComment(orderId: number) : Observable<CommentResponse>{
    let url = environment.host + '/api/orders/distribution/comment/'+orderId;
    return this.http.get<CommentResponse>(url, this.httpOptions).pipe(
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

  returnOrder(orderId: number){
    let url = environment.host + '/api/orders/return/'+orderId;
    return this.http.get(url, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Status must be ANNULE ou REFUSE") {
            return throwError("La status doit être en Annulé/refusé");
          }
          else if (err.error.httpStatusCode == 400 && err.error.responseMessage.contains("Product deleted can't retourn")) {
            return throwError("un produit est supprimé");
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

  createComment(orderId: number, orderComment: CommentResponse) : Observable<CommentResponse>{
    let url = environment.host + '/api/orders/comment/'+orderId;
    return this.http.post<CommentResponse>(url, orderComment,this.httpOptions).pipe(
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

  updateComment(orderId: number, orderComment: CommentResponse) : Observable<CommentResponse>{
    let url = environment.host + '/api/orders/comment/'+orderId;
    return this.http.put<CommentResponse>(url, orderComment,this.httpOptions).pipe(
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
