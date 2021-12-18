import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateProduct } from 'src/app/model/product';
import { ProductService } from '../../../services/product.service';
import { DatePipe } from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarFailureComponent } from '../../common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from '../../common/snack-bar-success/snack-bar-success.component';
import { CategoryService } from '../../../services/category.service';
import { Category } from 'src/app/model/category';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  mode: string = ""
  loading: boolean = false;
  createProductForm = new FormGroup({
    name: new FormControl('', Validators.required),
    reference: new FormControl('', Validators.required),
    description: new FormControl(''),
    price: new FormControl('', [Validators.required]),
    weight: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    category: new FormControl(''),
  });
  isChecked: boolean;
  createProduct: CreateProduct = new CreateProduct();
  categories: Category[];


  constructor(
    private router: Router, 
    private productService: ProductService,
    public datepipe: DatePipe, 
    private _snackBar: MatSnackBar,
    private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loading = true;
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

  get name() { return this.createProductForm.get('name'); }
  get reference() { return this.createProductForm.get('reference'); }
  get description() { return this.createProductForm.get('description'); }
  get price() { return this.createProductForm.get('price'); }
  get weight() { return this.createProductForm.get('weight'); }
  get quantity() { return this.createProductForm.get('quantity'); }
  get category() { return this.createProductForm.get('category'); }


  onSubmit() {
    this.mode = "indeterminate";
    this.loading = true;
    this.createProduct.name = this.name.value;
    this.createProduct.reference = this.reference.value;
    this.createProduct.description = this.description.value;
    this.createProduct.price = +this.price.value;
    this.createProduct.weight = +this.weight.value;
    this.createProduct.quantity = +this.quantity.value;
    this.createProduct.date = this.datepipe.transform(new Date(), 'dd-MM-yyyy HH:mm').toString();
    if(this.category.value != undefined && this.category.value != ''){
      this.createProduct.category = this.category.value;
    }
    
    this.productService.createProduct(this.createProduct).subscribe(
      result => {
        setTimeout(function(){location.reload()}, 2000);
        this.openSnackBarSuccess("Produit créé avec succès")
      },
      error => {
        this.mode = "";
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    )
  }

  isQuantityPhoenixValid(): boolean{
    if(this.isChecked){
      if(
        this.createProduct.operationQuantity!= undefined &&
        this.createProduct.operationQuantity!= null &&
        this.createProduct.operationQuantity.toString().match("^(0|[1-9][0-9]*)$")
        ){
          return true;
      }
      return false;
    }return true;
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
