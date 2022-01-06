import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HistoryService } from 'src/app/services/history.service';
import { SnackBarFailureComponent } from '../../common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from '../../common/snack-bar-success/snack-bar-success.component';
import { History} from '../../../model/history';
import { GenerateDocumentComponent } from '../generate-document/generate-document.component';


@Component({
  selector: 'app-historique-phoenix',
  templateUrl: './historique-phoenix.component.html',
  styleUrls: ['./historique-phoenix.component.css']
})
export class HistoriquePhoenixComponent implements OnInit {

  loading: boolean; 
  displayedColumns: string[] = [
    'id',
    'reference',
    'name',
    'quantity',
    'operation',
    'status',
    'date'
  ];
  dataSource: MatTableDataSource<History>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  historiesPhoenix: History[];

  constructor(
    private _snackBar: MatSnackBar, private historyService: HistoryService, public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.historyService.listHistoryPhoenix().subscribe(
      result => {
        this.historiesPhoenix = result;
        this.dataSource = new MatTableDataSource(this.historiesPhoenix);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sort.sort(<MatSortable>{
          id: 'id',
          start: 'desc'
        }
        );
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    )
  }

  refresh(){
    this.historyService.listHistoryPhoenix().subscribe(
      result => {
        this.historiesPhoenix = result;
        this.dataSource = new MatTableDataSource(this.historiesPhoenix);
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

  openGenerateDocPopup(){
    this.dialog.open(GenerateDocumentComponent);
  }

}
