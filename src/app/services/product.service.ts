import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { Product, CreateProduct, UpdateProduct, UpdateQuantity} from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      })
  };

  listProducts(category: string) : Observable<Product[]>{
    let url = environment.host + '/api/products';
    if(category){
      url = url+"?category="+category
    }
    return this.http.get<Product[]>(url, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Category Name is incorrect") {
            return throwError("Le nom du category fourni n'existe pas");
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

  getProduct(id: number) : Observable<Product>{
    let url = environment.host + '/api/products/'+id;
    return this.http.get<Product>(url).pipe(
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

  createProduct(createProduct: CreateProduct){
      let url = environment.host + '/api/products/';
    return this.http.post(url, createProduct, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Category Name is incorrect") {
            return throwError("Le nom du category fourni n'existe pas");
          }
          else if (err.error.httpStatusCode == 400 && err.error.responseMessage === "the quantity should be positive") {
            return throwError("La quantité doit étre positive");
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

  updateProduct(updateProduct: UpdateProduct, id: number){
    let url = environment.host + '/api/products/'+id;
  return this.http.put(url, updateProduct, this.httpOptions).pipe(
    catchError(
      err => {
        if (err.error.httpStatusCode == 400 && err.error.responseMessage === "Category Name is incorrect") {
          return throwError("Le nom du category fourni n'existe pas");
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


  updateQuantity(updateQuantity: UpdateQuantity, id: number,type: string){
    let url;
    if(type === "local"){
      url = environment.host + '/api/products/quantity/'+id;
    }else{
      url = environment.host + '/api/products/quantity/phoenix/'+id;
    }
    return this.http.put(url, updateQuantity, this.httpOptions).pipe(
      catchError(
        err => {
          if (err.error.httpStatusCode == 400 && err.error.responseMessage === "the quantity should be positive") {
            return throwError("La quantité doit étre positive");
          }
          if (err.error.httpStatusCode == 400 && err.error.responseMessage === "the quantity to be retourned needs to be less than the store") {
            return throwError("Quantité supérieur à celle du stock");
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

  deleteProduct(id: number){
    let url = environment.host + '/api/products/'+id;
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

}
