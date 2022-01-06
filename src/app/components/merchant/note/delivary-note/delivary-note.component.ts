import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF, { CellConfig } from 'jspdf';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { History, Operation, Status } from 'src/app/model/history';
import { HistoryService } from 'src/app/services/history.service';
import { LoginService } from 'src/app/services/login.service';
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
  data : { [key: string]: string }[] = [];
  cellConfig: CellConfig[] = [
    {
      name: "id",
      prompt:"ID",
      align:"center",
      padding:3,
      width:50
    },
    {
      name: "reference",
      prompt:"RÉFÉRENCE",
      align:"center",
      padding:3,
      width:50
    },
    {
      name: "name",
      prompt:"NOM",
      align:"center",
      padding:3,
      width:50
    },          {
      name: "quantity",
      prompt:"QUANTITÉ",
      align:"center",
      padding:3,
      width:40
    },          {
      name: "date",
      prompt:"DATE D'OPÉRATION",
      align:"center",
      padding:3,
      width:60
    },
  ];

  @Input() operation: Operation;
  constructor(
    private _snackBar: MatSnackBar, 
    private historyService: HistoryService,
    private documentService: DocumentService,
    public dialogRef: MatDialogRef<GenerateDocumentComponent>,
    private loginService: LoginService,
    public datepipe: DatePipe,
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
      this.data.push(
        {
          id:selected.id.toString(),
          reference:selected.reference,
          name:selected.name,
          quantity:selected.quantity.toString(),
          date:selected.date
        }
      )
    }
    this.document.operations = this.operations;
    this.document.type = this.operation;
    this.documentService.saveDocument(this.document).subscribe(
      result => {
        this.loading = false;
        this.dialogRef.close();
        this.createPage(Number(result));
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

  createPage(id: number){
    var doc = new jsPDF('p', 'mm', 'a4');

        // logo
        var img = new Image()
        img.src = '../../../../../assets/images/logo.png'
        doc.addImage(img,'png',150, 10, 60, 40);

        //title
        doc.setFont('courier','bold')
        doc.setFontSize(32);
        doc.text(this.isReturn()
        ? 'Bon De Retour'
        : 'Bon De Livraison'
        ,20, 30);

        //separation line
        doc.setLineWidth(0.5);
        doc.line(10, 50, 200, 50);

        //phoenix info title
        doc.setFont('helvetica','bold')
        doc.setFontSize(11);
        doc.text("PHOENIX FULFILLMENT"
        ,20, 70);

        //phoenix info
        doc.setFont('courier','normal')
        doc.text("14° Avenue Hassan 2"
        ,20, 75);
        doc.text("22000 Casablanca Maroc"
        ,20, 79);
        doc.text("Téléphone: +212 606416930"
        ,20, 83);

        //bon info title
        doc.setFont('helvetica','bold')
        doc.text(this.isReturn()
        ? 'Bon De Retour N°: '+id
        : 'Bon De Livraison N°: '+id
        ,100, 70);

        //bon info
        doc.setFont('courier','normal')
        doc.text("Date d'extraction: "+this.datepipe.transform(new Date(), 'dd-MM-yyyy HH:mm').toString()
        ,100, 75);
        doc.text("Lieu: Maroc"
        ,100, 79);
        doc.text("Email du Client: "+this.loginService.getEmail()
        ,100, 83);

        //first page
        let end = this.data.length>15? 15 : this.data.length
          doc.table(10,100,
            this.data.slice(0,end),
            this.cellConfig,
          {
            headerBackgroundColor: "#F6B853",
            fontSize: 11,
          });
        this.data = this.data.slice(end,this.data.length);
        if(this.data.length != 0){
          let pages = Math.floor(this.data.length/20)+1;
          for(let i =0; i<pages; i++){
            doc.text("Page: "+(i+1)+"/"+(pages+1)
            ,160, 290);
            doc.addPage()

            doc.addImage(img,'png',150, 10, 60, 40);

            //title
            doc.setFont('courier','bold')
            doc.setFontSize(32);
            doc.text(this.isReturn()
            ? 'Bon De Retour'
            : 'Bon De Livraison'
            ,20, 30);

            //separation line
            doc.setLineWidth(0.5);
            doc.line(10, 50, 200, 50);

            end = this.data.length>20? 20 : this.data.length

            doc.table(10,60,
              this.data.slice(0,end),
              this.cellConfig,
            {
              headerBackgroundColor: "#F6B853",
              fontSize: 11,
            });
            this.data = this.data.slice(end,this.data.length);
          }
          doc.text("Page: "+(pages+1)+"/"+(pages+1)
          ,160, 290);
        }

        // Signature
        doc.setFont('helvetica','bold');
        doc.text("Signature"
        ,20, 280);
        doc.text("Signature"
        ,130, 280);
        doc.setFont('courier','normal')
        doc.text("Représentant Phoenix: ........"
        ,20, 284);
        doc.text("Client: ........"
        ,130, 284);

        // Save the PDF
        doc.save(this.isReturn()
        ? 'Bon_De_Retour_N°_'+id+'.pdf'
        : 'Bon_De_Livraison_N°_'+id+'.pdf');
  }

}
