import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { Category, CategoryRequest } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      })
  };

  listCategories() : Observable<Category[]>{
    let url = environment.host + '/api/categories';
    return this.http.get<Category[]>(url, this.httpOptions).pipe(
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

  createCategory(category: CategoryRequest){
    let url = environment.host + '/api/categories/';
  return this.http.post(url, category, this.httpOptions).pipe(
    catchError(
      err => {
        if (err.error.httpStatusCode == 400 && err.error.responseMessage === "category with the same name already exist") {
          return throwError("Le nom du category existe déja");
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
