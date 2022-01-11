import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CreateOrder } from 'src/app/model/order';
import { ProductQuantity } from '../product-quantity/product-quantity.component';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {

  displayedColumns: string[] = [
    'product',
    'quantityPhoenix',
    'quantity',
  ];
  dataSource: MatTableDataSource<ProductQuantity>;
  constructor(
    public dialogRef: MatDialogRef<ConfirmOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public order: CreateOrder,
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.order.products);
  }

  onNoClick(){
    this.dialogRef.close();
  }

}
