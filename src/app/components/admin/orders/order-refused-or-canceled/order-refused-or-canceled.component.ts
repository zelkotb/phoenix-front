import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogData } from 'src/app/components/change-password/change-password.component';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from 'src/app/components/common/snack-bar-success/snack-bar-success.component';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-refused-or-canceled',
  templateUrl: './order-refused-or-canceled.component.html',
  styleUrls: ['./order-refused-or-canceled.component.css']
})
export class OrderRefusedOrCanceledComponent implements OnInit {

  loading = false;
  displayedColumns: string[] = [
    'id',
    'name',
    'phone',
    'city',
    'date',
    'documentId',
    'status',
    'actions'
  ];
  dataSource: MatTableDataSource<Order>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  orders: Order[] = [];
  constructor(private orderService: OrderService, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.orderService.listRefusedOrCanceledOrders().subscribe(
      result => {
        this.orders = result;
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.openSnackBarFailure(error);
      }
    )
  }

  ngAfterViewInit() {
    if (this.dataSource != undefined) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refresh(){
    this.orderService.listRefusedOrCanceledOrders().subscribe(
      result => {
        this.orders = result;
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  openCommentPopup(id: number){
    this.orderService.getCommentByOrderId(id).subscribe(
      result => {
        this.dialog.open(DialogDataExampleDialog, {
          data: {
            id: id,
            comment: result.comment
          },
        });
      },
      error => {
        this.openSnackBarFailure(error);
      }
    )
  }

  returnOrder(id: number){
    this.orderService.returnOrder(id).subscribe(
      result => {
        this.openSnackBarSuccess("l'order est retourné")
      },
      error => {
        this.openSnackBarFailure(error);
      }
    )
  }

}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
