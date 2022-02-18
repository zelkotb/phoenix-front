import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { Order, OrderStatus } from 'src/app/model/order';
import { OrderService } from 'src/app/services/order.service';
import { Id } from '../order-in-wait-details/order-in-wait-details.component';

@Component({
  selector: 'app-order-picked-up-validation-details',
  templateUrl: './order-picked-up-validation-details.component.html',
  styleUrls: ['./order-picked-up-validation-details.component.css']
})
export class OrderPickedUpValidationDetailsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OrderPickedUpValidationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Id,
    private orderService: OrderService,
    private _snackBar: MatSnackBar) { }

    loading : boolean = false;
    loadingValidation : boolean = false;
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
  
    shipOrder(order: Order){
      this.loadingValidation = true;
      this.orderService.moveOrderToShipped(order.id).subscribe(
        result => {
          this.loadingValidation = false;
          this.orders[this.orders.indexOf(order)].status = OrderStatus.RAMASSE;
        },
        error => {
          this.openSnackBarFailure(error);
          this.loadingValidation = false;
        }
      )
    }

    isShipped(order : Order){
      return order.status.toString() === "RAMASSE";
    }

}
