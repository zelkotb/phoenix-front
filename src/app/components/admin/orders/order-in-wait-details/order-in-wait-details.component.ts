import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-in-wait-details',
  templateUrl: './order-in-wait-details.component.html',
  styleUrls: ['./order-in-wait-details.component.css']
})
export class OrderInWaitDetailsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OrderInWaitDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Id,
    private orderService: OrderService,
    private _snackBar: MatSnackBar) { }

  loading : boolean = false;
  orders: Order[] = []  

  ngOnInit(): void {
    this.loading = true;
    this.orderService.listOrdersDetailsInDocumentInWait(this.data.id).subscribe(
      result => {
        this.orders = result;
        this.loading = false;

      },
      error => {
        this.openSnackBarFailure(error);
        this.loading = false;
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

  validateDocument(){
    this.orderService.moveFromInWaiteToInWaiteForPickup(this.data.id).subscribe(
      result => {
        this.dialogRef.close();
      },
      error => {
        this.openSnackBarFailure(error);
      }
    )
  }

}

export class Id {
  id: number;
}
