import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { History, Operation, Status } from 'src/app/model/history';
import { HistoryService } from 'src/app/services/history.service';
import { Document } from '../../../../model/document';
import { DocumentService } from '../../../../services/document.service';
import { GenerateDocumentComponent } from '../../generate-document/generate-document.component';

@Component({
  selector: 'app-delivary-note',
  templateUrl: './delivary-note.component.html',
  styleUrls: ['./delivary-note.component.css']
})
export class DelivaryNoteComponent implements OnInit {

  historiesPhoenix: History[] = [];
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
  document: Document = new Document();
  operations: number[] = [];
  loading: boolean;

  @Input() operation: Operation;
  constructor(
    private _snackBar: MatSnackBar, 
    private historyService: HistoryService,
    private documentService: DocumentService,
    public dialogRef: MatDialogRef<GenerateDocumentComponent>
  ) { }

  ngOnInit(): void {
    this.historyService.listHistoryPhoenix().subscribe(
      result => {
        this.historiesPhoenix = result
        .filter(r => r.operation === this.operation)
        .filter(r => r.status.toString() == "EN_ATTENTE");
        this.dataSource = new MatTableDataSource<History>(this.historiesPhoenix);
        this.selection = new SelectionModel<History>(true, []);
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

  uploadDocuments(){
    this.loading = true;
    for(let selected of this.selection.selected){
      this.operations.push(selected.id);
    }
    this.document.operations = this.operations;
    this.document.type = this.operation;
    this.documentService.saveDocument(this.document).subscribe(
      result => {
        this.loading = false;
        this.dialogRef.close();
      },
      error => {
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    )
    this.operations = [];
  }

  isReturn(): boolean{
    return this.operation.toString() == "RETOURNER";
  }

}
