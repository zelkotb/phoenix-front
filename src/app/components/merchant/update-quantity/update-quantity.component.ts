import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Operation } from 'src/app/model/history';
import { UpdateQuantity } from 'src/app/model/product';
import { ProductService } from 'src/app/services/product.service';
import { SnackBarFailureComponent } from '../../common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from '../../common/snack-bar-success/snack-bar-success.component';
import { UpdateProductData } from '../update-product/update-product.component';

@Component({
  selector: 'app-update-quantity',
  templateUrl: './update-quantity.component.html',
  styleUrls: ['./update-quantity.component.css']
})
export class UpdateQuantityComponent implements OnInit {

  loading: boolean = false;
  mode: string = ""
  updateQuantity: UpdateQuantity = new UpdateQuantity();
  updateQuantityForm = new FormGroup({
    quantity: new FormControl('', Validators.required),
    operation: new FormControl('', Validators.required),
  });
  operations : string[] = ["RETOURNER","ALIMENTER"];
  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateQuantityComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: UpdateProductData,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
  }

  get quantity() { return this.updateQuantityForm.get('quantity'); }
  get operation() { return this.updateQuantityForm.get('operation'); }

  onSubmit(){
    this.mode = "indeterminate";
    this.loading = true;
    this.updateQuantity.quantity = this.quantity.value;
    this.updateQuantity.date = this.datepipe.transform(new Date(), 'dd-MM-yyyy HH:mm').toString();
    if(this.operation.value==="RETOURNER"){
      this.updateQuantity.operation = Operation.RETOURNER;
    }else{
      this.updateQuantity.operation = Operation.ALIMENTER;
    }
    this.productService.updateQuantity(this.updateQuantity,this.data.id,this.data.type).subscribe(
      result => {
        setTimeout(function(){location.reload()}, 2000);
        this.openSnackBarSuccess("Quantité modifié avec succès")
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
