import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { OrderDocumentComponent } from '../order-document/order-document.component';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {

  loading: boolean;
  displayedColumns: string[] = [
    'id',
    'name',
    'phone',
    'city',
    'date',
    'status',
    'actions'
  ];
  dataSource: MatTableDataSource<Order>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  orders: Order[] = [];

  constructor(private orderService: OrderService, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = true;
    this.orderService.listOrders().subscribe(
      result => {
        this.orders = result;
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sort.sort(<MatSortable>{
          id: 'id',
          start: 'desc'
        });
        this.loading = false;
      },
      error => {
        this.loading = false;
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
    this.orderService.listOrders().subscribe(
      result => {
        this.orders = result;
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sort.sort(<MatSortable>{
          id: 'id',
          start: 'desc'
        });
        this.loading = false;
      },
      error => {
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

  deleteOrder(row){
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        text:
          "Êtes-Vous sûr de supprimer cette commande pour M/Mme : "
          + row.name + "?",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "confirmed") {
        this.orderService.deleteOrder(row.id).subscribe(
          result => {
            this.openSnackBarSuccess("historique supprimé");
            let index = this.orders.indexOf(row);
            this.orders.splice(index, 1)
            this.dataSource = new MatTableDataSource(this.orders);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error => {
            this.openSnackBarFailure(error);
          }
        );
      }
    });
  }

  openGenerateDocPopup(){
    this.dialog.open(OrderDocumentComponent);
  }

}
