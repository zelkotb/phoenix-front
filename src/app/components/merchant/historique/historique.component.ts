import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HistoryService } from '../../../services/history.service';
import { SnackBarFailureComponent } from '../../common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from '../../common/snack-bar-success/snack-bar-success.component';
import { History} from '../../../model/history';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {

  loading: boolean;
  displayedColumns: string[] = [
    'id',
    'reference',
    'name',
    'quantity',
    'operation',
    'date'
  ];
  dataSource: MatTableDataSource<History>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  histories: History[];


  constructor(private _snackBar: MatSnackBar, private historyService: HistoryService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = true;
    this.historyService.listHistory().subscribe(
      result => {
        this.histories = result;
        this.dataSource = new MatTableDataSource(this.histories);
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
    this.historyService.listHistory().subscribe(
      result => {
        this.histories = result;
        this.dataSource = new MatTableDataSource(this.histories);
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
