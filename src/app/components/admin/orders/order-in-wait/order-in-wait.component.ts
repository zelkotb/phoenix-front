import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { OrderDocument, OrderDocumentResponse } from 'src/app/model/document';
import { OrderService } from 'src/app/services/order.service';
import { OrderInWaitDetailsComponent } from '../order-in-wait-details/order-in-wait-details.component';

@Component({
  selector: 'app-order-in-wait',
  templateUrl: './order-in-wait.component.html',
  styleUrls: ['./order-in-wait.component.css']
})
export class OrderInWaitComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'email',
    'name',
    'phone',
    'actions'
  ];
  dataSource: MatTableDataSource<OrderDocumentResponse>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  orderDocuments : OrderDocumentResponse[] = [];
  constructor(private orderService: OrderService,
    private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.orderService.listOrderDocumentInWait().subscribe(
      result => {
        this.orderDocuments = result;
        this.dataSource = new MatTableDataSource(this.orderDocuments);
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
    this.orderService.listOrderDocumentInWait().subscribe(
      result => {
        this.orderDocuments = result;
        this.dataSource = new MatTableDataSource(this.orderDocuments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.openSnackBarFailure(error);
      }
    )
  }

  openDetailsPopUp(id){
    const dialogRef = this.dialog.open(OrderInWaitDetailsComponent, {
      width: '900px',
      data: {
        id: id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

}
