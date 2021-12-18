import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryRequest } from '../../../model/category';
import { CategoryService } from '../../../services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarFailureComponent } from '../../common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from '../../common/snack-bar-success/snack-bar-success.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  mode: string = ""
  loading: boolean = false;
  createCategoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  category : CategoryRequest = new CategoryRequest();
  constructor(private categoryService: CategoryService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  get name() { return this.createCategoryForm.get('name'); }

  onSubmit() {
    this.mode = "indeterminate";
    this.loading = true;
    this.category.name = this.name.value;
    
    this.categoryService.createCategory(this.category).subscribe(
      result => {
        setTimeout(function(){location.reload()}, 2000);
        this.openSnackBarSuccess("Categorie créé avec succès")
      },
      error => {
        this.mode = "";
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    )
  }

  openSnackBarFailure(message: string) {
    this._snackBar.openFromComponent(SnackBarFailureComponent, {
      data: message,
      panelClass: 'app-snack-bar-failure',
      duration: 5000
    });
  }

  openSnackBarSuccess(message: string) {
    this._snackBar.openFromComponent(SnackBarSuccessComponent, {
      data: message,
      panelClass: 'app-snack-bar-success',
      duration: 5000
    });
  }


}
