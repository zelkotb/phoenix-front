import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.css']
})
export class ProductQuantityComponent implements OnInit {

  form = new FormArray([]);
  form2 = new FormArray([]);
  constructor(
    public dialogRef: MatDialogRef<ProductQuantityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductQuantity[],
  ) { }
  ngOnInit(): void {
    for(let product of this.data){
      this.form.push(new FormControl('', Validators.required))
    }
    for(let product of this.data){
      this.form2.push(new FormControl('', Validators.required))
    }
  }

  isValid(): boolean{
    for(let productQuantity of this.data){
      if(productQuantity.quantity === 0 && productQuantity.quantityPhoenix === 0){
        return false;
      }
    }
    return true;
  }
}

export class ProductQuantity {
  id: number;
  product: string;
  quantityPhoenix: number;
  quantity: number;
}
