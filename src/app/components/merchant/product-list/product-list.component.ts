import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../../../model/product';
import { ProductService } from '../../../services/product.service';
import {SnackBarSuccessComponent} from '../../common/snack-bar-success/snack-bar-success.component';
import {SnackBarFailureComponent} from '../../common/snack-bar-failure/snack-bar-failure.component';
import { ConfirmationComponent } from '../../common/confirmation/confirmation.component';
import { UpdateAccountComponent } from '../../update-account/update-account.component';
import { UpdateProductComponent } from '../update-product/update-product.component';
import { UpdateQuantityComponent } from '../update-quantity/update-quantity.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  loading: boolean;
  displayedColumns: string[] = [
    'id',
    'name',
    'reference',
    'quantity',
    'category',
    'actions'
  ];
  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  products: Product[];


  constructor(private _snackBar: MatSnackBar, private productService: ProductService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = true;
    this.productService.listProducts(undefined).subscribe(
      result => {
        this.products = result;
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    )
  }

  refresh(){
    this.productService.listProducts(undefined).subscribe(
      result => {
        this.products = result;
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  deleteProduct(row){
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        text:
          "Êtes-Vous sûr de supprimer ce Produit avec nom : "
          + row.name + "?",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "confirmed") {
        this.productService.deleteProduct(row.id).subscribe(
          result => {
            let index = this.products.indexOf(row);
            this.products.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.products);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error => {
            this.openSnackBarFailure(error);
          }
        )
      }
    });
  }

  updateProductPopup(id){
    this.dialog.open(UpdateProductComponent, {
      data: {
        id: id,
      },
    });
  }

  updateQuantityPopup(id){
    this.dialog.open(UpdateQuantityComponent, {
      data: {
        id: id,
        quantity: this.products.filter(p=>p.id==id).map(p=>p.quantity),
        type: "local"
      },
    });
  }

  openSnackBarSuccess(message: string) {
    this._snackBar.openFromComponent(SnackBarSuccessComponent, {
      data: message,
      panelClass: 'app-snack-bar-success',
      duration: 5000
    });
  }

  openSnackBarFailure(message: string) {
    this._snackBar.openFromComponent(SnackBarFailureComponent, {
      data: message,
      panelClass: 'app-snack-bar-failure',
      duration: 5000
    });
  }

}
