import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from 'src/app/model/category';
import { Product, UpdateProduct } from 'src/app/model/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackBarFailureComponent } from '../../common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from '../../common/snack-bar-success/snack-bar-success.component';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

  product : Product;
  loading: boolean = false;
  updateProduct: UpdateProduct = new UpdateProduct();
  categories: Category[];
  mode: string = ""
  updateProductForm = new FormGroup({
    name: new FormControl('', Validators.required),
    reference: new FormControl('', Validators.required),
    description: new FormControl(''),
    price: new FormControl('', [Validators.required]),
    weight: new FormControl('', [Validators.required]),
    category: new FormControl(''),
  });
  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateProductComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: UpdateProductData,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.productService.getProduct(this.data.id).subscribe(
      result => {
        this.product = result;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    );
    this.categoryService.listCategories().subscribe(
      result => {
        this.categories = result;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    )
  }

  get name() { return this.updateProductForm.get('name'); }
  get reference() { return this.updateProductForm.get('reference'); }
  get description() { return this.updateProductForm.get('description'); }
  get price() { return this.updateProductForm.get('price'); }
  get weight() { return this.updateProductForm.get('weight'); }
  get category() { return this.updateProductForm.get('category'); }

  onSubmit() {
    this.mode = "indeterminate";
    this.loading = true;
    this.updateProduct.name = this.name.value;
    this.updateProduct.reference = this.reference.value;
    this.updateProduct.description = this.description.value;
    this.updateProduct.price = +this.price.value;
    this.updateProduct.weight = +this.weight.value;
    if(this.category.value != undefined && this.category.value != ''){
      this.updateProduct.category = this.category.value;
    }
    this.productService.updateProduct(this.updateProduct, this.data.id).subscribe(
      result => {
        setTimeout(function(){location.reload()}, 2000);
        this.openSnackBarSuccess("Produit modifié avec succès");
      },
      error => {
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    )
  }

  openSnackBarSuccess(message: string) {
    this._snackBar.openFromComponent(SnackBarSuccessComponent, {
      data: message,
      panelClass: 'app-snack-bar-success',
      duration: 5000
    });
  }

  openSnackBarFailure(message: string) {
    this._snackBar.openFromComponent(SnackBarFailureComponent, {
      data: message,
      panelClass: 'app-snack-bar-failure',
      duration: 5000
    });
  }

}

export class UpdateProductData {
  id: number;
  quantity: number;
  type: string
}
