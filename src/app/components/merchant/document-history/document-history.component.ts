import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF, { CellConfig } from 'jspdf';
import { DocumentHistory } from 'src/app/model/document';
import { Operation } from 'src/app/model/history';
import { DocumentService } from 'src/app/services/document.service';
import { LoginService } from 'src/app/services/login.service';
import { SnackBarFailureComponent } from '../../common/snack-bar-failure/snack-bar-failure.component';

@Component({
  selector: 'app-document-history',
  templateUrl: './document-history.component.html',
  styleUrls: ['./document-history.component.css']
})
export class DocumentHistoryComponent implements OnInit {

  loading: boolean;
  displayedColumns: string[] = [
    'id',
    'type',
    'date',
    'actions'
  ];
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
  dataSource: MatTableDataSource<DocumentHistory>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  histories : DocumentHistory[];
  constructor(private _snackBar: MatSnackBar, private documentService: DocumentService, public dialog: MatDialog,
    public datepipe: DatePipe,
    private loginService: LoginService,) { }

  ngOnInit(): void {
    this.loading = true;
    this.documentService.listDocumentHistory().subscribe(
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
    this.documentService.listDocumentHistory().subscribe(
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

  openSnackBarFailure(message: string) {
    this._snackBar.openFromComponent(SnackBarFailureComponent, {
      data: message,
      panelClass: 'app-snack-bar-failure',
      duration: 5000
    });
  }

  uploadDocument(row: DocumentHistory){
    this.documentService.getDocumentHistory(Number(row.id)).subscribe(
      result => {
        for(let selected of result){
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
        this.createPage(row);
      },
      error => {
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    )
    this.data = [];
  }

  isReturn(row: DocumentHistory): boolean{
    return row.type.toString() == "RETOURNER";
  }

  createPage(row: DocumentHistory){
    var doc = new jsPDF('p', 'mm', 'a4');

        // logo
        var img = new Image()
        img.src = '../../../../../assets/images/logo.png'
        doc.addImage(img,'png',150, 10, 60, 40);

        //title
        doc.setFont('courier','bold')
        doc.setFontSize(32);
        doc.text(this.isReturn(row)
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
        doc.text(this.isReturn(row)
        ? 'Bon De Retour N°: '+row.id
        : 'Bon De Livraison N°: '+row.id
        ,100, 70);

        //bon info
        doc.setFont('courier','normal')
        doc.text("Date de Validation: "+row.date
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
            doc.text(this.isReturn(row)
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
        doc.save(this.isReturn(row)
        ? 'Bon_De_Retour_N°_'+row.id+'.pdf'
        : 'Bon_De_Livraison_N°_'+row.id+'.pdf');
  }



}
