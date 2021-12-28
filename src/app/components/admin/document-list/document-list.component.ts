import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentResponse, ValidateDocumentRequest } from 'src/app/model/document';
import { DocumentService } from 'src/app/services/document.service';
import { SnackBarFailureComponent } from '../../common/snack-bar-failure/snack-bar-failure.component';
import { History } from '../../../model/history';
import { SnackBarSuccessComponent } from '../../common/snack-bar-success/snack-bar-success.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  loading : boolean;
  documents: DocumentResponse[];
  @ViewChild(MatAccordion) accordion: MatAccordion;
  displayedColumns: string[] = [
    'select',
    'reference',
    'name',
    'quantity',
    'operation',
    'status',
    'date'
  ];
  dataSource : MatTableDataSource<History>;
  selection : SelectionModel<History>;
  validateDocumentRequest: ValidateDocumentRequest = new ValidateDocumentRequest();
  constructor(
    private documentService: DocumentService,
    private _snackBar: MatSnackBar,
    ){ }

  ngOnInit(): void {
    this.loading = true;
    this.documentService.listProducts().subscribe(
      result => {
        this.documents = result;
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

  openSnackBarSuccess(message: string) {
    this._snackBar.openFromComponent(SnackBarSuccessComponent, {
      data: message,
      panelClass: 'app-snack-bar-success',
      duration: 5000
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
 isAllSelected() {
  const numSelected = this.selection?.selected.length;
  const numRows = this.dataSource?.data.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }
  this.selection.select(...this.dataSource.data);
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: History): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
}

onOpened(document: DocumentResponse){
  this.dataSource = new MatTableDataSource<History>(document.operations);
  this.selection = new SelectionModel<History>(true, []);
}

validate(document,valide){
  this.validateDocumentRequest.id = document.id;
  this.validateDocumentRequest.validate = valide;
  this.documentService.validateDocument(this.validateDocumentRequest).subscribe(
    result => {
      let index = this.documents.indexOf(document);
      this.documents.splice(index,1);
      if(valide){
        this.openSnackBarSuccess("Le Bon est validé");
      }else{
        this.openSnackBarSuccess("Le Bon est Rejeté");
      }
    },
    error => {
      this.openSnackBarFailure(error);
    }
  )
}

}
