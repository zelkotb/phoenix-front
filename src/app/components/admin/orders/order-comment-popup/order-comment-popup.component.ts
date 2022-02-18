import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from 'src/app/components/common/snack-bar-success/snack-bar-success.component';
import { RefuseOrderRequest } from 'src/app/model/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-comment-popup',
  templateUrl: './order-comment-popup.component.html',
  styleUrls: ['./order-comment-popup.component.css']
})
export class OrderCommentPopupComponent implements OnInit {

  refuseOrderRequest: RefuseOrderRequest = new RefuseOrderRequest();
  comment: string;
  constructor(public dialogRef: MatDialogRef<OrderCommentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommentData,
    private _snackBar: MatSnackBar,
    private orderService: OrderService) { }

  ngOnInit(): void {
  }

  refuseOrCancel(){
    this.refuseOrderRequest.comment = this.comment;
    if(this.data.type === "refuse"){
      this.orderService.moveOrderToRefuse(this.data.id, this.refuseOrderRequest).subscribe(
        result => {
          this.openSnackBarSuccess("La commande est refusée");
          this.dialogRef.close();
        },
        erro => {
          this.openSnackBarFailure(erro);
        }
      )
    }else if(this.data.type === "cancel"){
      this.orderService.moveOrderToCancel(this.data.id, this.refuseOrderRequest).subscribe(
        result => {
          this.openSnackBarSuccess("La commande est annulée");
          this.dialogRef.close();
        },
        erro => {
          this.openSnackBarFailure(erro);
        }
      )
    }
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

  isCommentValid(){
    if(this.comment === undefined || this.comment.length < 5){
      return false;
    }
    return true;
  }

}

export class CommentData{
  id: number;
  type: string
}
