import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from 'src/app/components/common/snack-bar-success/snack-bar-success.component';
import { CommentResponse } from 'src/app/model/order';
import { OrderService } from 'src/app/services/order.service';
import { CommentData } from '../order-comment-popup/order-comment-popup.component';

@Component({
  selector: 'app-order-comment-in-distribution',
  templateUrl: './order-comment-in-distribution.component.html',
  styleUrls: ['./order-comment-in-distribution.component.css']
})
export class OrderCommentInDistributionComponent implements OnInit {

  comment: string;
  response: CommentResponse = new CommentResponse();
  constructor(public dialogRef: MatDialogRef<OrderCommentInDistributionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommentData,
    private _snackBar: MatSnackBar,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getComment(this.data.id).subscribe(
      result => {
          this.comment = result.comment === null ? "" : result.comment;
          this.response = result;
          console.log(result);
      },
      error => {
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

  isCommentValid(){
    if(this.comment === undefined || this.comment.length < 5){
      return false;
    }
    return true;
  }

  createOrUpdateComment(){
    this.response.comment = this.comment;
    if(this.response.id === undefined || this.response.id === null){
      this.orderService.createComment(this.data.id,this.response).subscribe(
        result => {
          this.openSnackBarSuccess("commentaire est crée");
          this.dialogRef.close();
        },
        error => {
          this.openSnackBarFailure(error);
        }
      )
    }else{
      this.orderService.updateComment(this.data.id,this.response).subscribe(
        result => {
          this.openSnackBarSuccess("commentaire est mis à jours");
          this.dialogRef.close();
        },
        error => {
          this.openSnackBarFailure(error);
        }
      )
    }
  }

}
