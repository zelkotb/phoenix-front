import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from 'src/app/components/common/snack-bar-success/snack-bar-success.component';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/services/order.service';
import { OrderCommentInDistributionComponent } from '../order-comment-in-distribution/order-comment-in-distribution.component';
import { OrderCommentPopupComponent } from '../order-comment-popup/order-comment-popup.component';
import { DialogDataExampleDialog } from '../order-refused-or-canceled/order-refused-or-canceled.component';

@Component({
  selector: 'app-order-in-distribution',
  templateUrl: './order-in-distribution.component.html',
  styleUrls: ['./order-in-distribution.component.css']
})
export class OrderInDistributionComponent implements OnInit {

  loading = false;
  displayedColumns: string[] = [
    'id',
    'name',
    'phone',
    'city',
    'date',
    'documentId',
    'actions'
  ];
  dataSource: MatTableDataSource<Order>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  orders: Order[] = [];
  constructor(private orderService: OrderService, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.orderService.listInDistributionOrders().subscribe(
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
    this.orderService.listInDistributionOrders().subscribe(
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

  validate(order: Order){
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        text:
          "Êtes-Vous sûr de valider cette commande avec id : "
          + order.id + "?",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "confirmed") {
        this.loading = true;
        this.orderService.moveOrderToValidate(order.id).subscribe(
          result => {
            this.loading = false;
            this.openSnackBarSuccess("Commande est validé");
            this.orders.splice(this.orders.indexOf(order),1);
            this.dataSource = new MatTableDataSource(this.orders);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error => {
            this.openSnackBarFailure(error);
            this.loading = false;
          }
        )
      }
    });
  }

  refuse(order: Order){
    const dialogRef = this.dialog.open(OrderCommentPopupComponent, {
      data: {
        id:order.id,
        type: "refuse"
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  cancel(order: Order){
    const dialogRef = this.dialog.open(OrderCommentPopupComponent, {
      data: {
        id:order.id,
        type: "cancel"
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  openCommentPopup(id: number){
    const dialogRef = this.dialog.open(OrderCommentInDistributionComponent, {
      data: {
        id:id,
        type: "comment"
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

}
