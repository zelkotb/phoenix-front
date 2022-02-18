import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF, { CellConfig } from 'jspdf';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from 'src/app/components/common/snack-bar-success/snack-bar-success.component';
import { ProductQuantity } from 'src/app/components/merchant/order/product-quantity/product-quantity.component';
import { OrderDocumentResponse } from 'src/app/model/document';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/services/order.service';
import { OrderPickedUpValidationDetailsComponent } from '../order-picked-up-validation-details/order-picked-up-validation-details.component';

@Component({
  selector: 'app-order-picked-up',
  templateUrl: './order-picked-up.component.html',
  styleUrls: ['./order-picked-up.component.css']
})
export class OrderPickedUpComponent implements OnInit {

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
  operations: number[] = [];
  data : { [key: string]: string }[] = [];
  cellConfig: CellConfig[] = [
    {
      name: "id",
      prompt:"N°",
      align:"center",
      padding:3,
      width:65
    },
    {
      name: "phone",
      prompt:"Téléphone",
      align:"center",
      padding:3,
      width:65
    },          
    {
      name: "city",
      prompt:"Ville",
      align:"center",
      padding:3,
      width:65
    },          
    {
      name: "price",
      prompt:"Prix",
      align:"center",
      padding:3,
      width:65
    }
  ];
  constructor(private orderService: OrderService,
    private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.orderService.listOrderDocumentPickedUp().subscribe(
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


  openSnackBarSuccess(message: string) {
    this._snackBar.openFromComponent(SnackBarSuccessComponent, {
      data: message,
      panelClass: 'app-snack-bar-success',
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
    this.orderService.listOrderDocumentPickedUp().subscribe(
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

  uploadDocument(orderDocument: OrderDocumentResponse){
    this.orderService.listOrdersDetailsInDocumentInWait(orderDocument.id).subscribe(
      result => {
        this.createPage(orderDocument,result);
      },
      error => {
        this.openSnackBarFailure(error);
      }
    )
  }

  openValidationPopUp(id: number){
    const dialogRef = this.dialog.open(OrderPickedUpValidationDetailsComponent, {
      width: '900px',
      data: {
        id: id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  createPage(orderDocument: OrderDocumentResponse, selectedOrders: Order []){
    var doc = new jsPDF('p', 'mm', 'a4');
    // logo
    var img = new Image()
    img.src = '../../../../../assets/images/logo.png'
    doc.addImage(img,'png',150, 10, 60, 40);

    //title
    doc.setFont('courier','bold')
    doc.setFontSize(32);
    doc.text('Bon De Livraison',20, 30);

    //separation line
    doc.setLineWidth(0.5);
    doc.line(10, 50, 200, 50);

    //phoenix info title
    doc.setFont('helvetica','bold')
    doc.setFontSize(11);
    doc.text("INFORMATION DU CLIENT"
    ,20, 70);

    //phoenix info
    doc.setFont('courier','normal')
    doc.text("Email : "+orderDocument.email
    ,20, 75);
    doc.text("Nom Complet : "+orderDocument.name
    ,20, 79);
    doc.text("Téléphone: "+orderDocument.phone
    ,20, 83);

    //bon info title
    doc.setFont('helvetica','bold')
    doc.text('INFORMATION DU BON'
    ,130, 70);

    //bon info
    doc.setFont('courier','normal')
    doc.text("Numéro : "+orderDocument.id
    ,130, 75);
    doc.text("Nomber de colis : "+selectedOrders.length
    ,130, 79);
    doc.text("Prix Total : "+selectedOrders.reduce((x,y) => x + y.price,0)+" Dhs"
    ,130, 83);

    this.getTableList(selectedOrders);
    //first page
    let end = this.data.length>15? 15 : this.data.length;
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
      for(let i = 0; i<pages; i++){
        doc.addPage()
        doc.addImage(img,'png',150, 10, 60, 40);
        //title
        doc.setFont('courier','bold')
        doc.setFontSize(32);
        doc.text('Bon De Livraison',20, 30);
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
    doc.save('Bon_De_Livraison_N°_'+orderDocument.id+'.pdf');
  }

  isOuiOrNon(value : boolean){
    return value? "Oui":"Non";
  }

  isComment(comment: string){
    return (comment===undefined||comment===null)?"":comment
  }

  getTableList(orders : Order[]){
    this.data = [];
    for(let order of orders){
      this.data.push(
        {
          id:order.id.toString(),
          phone:order.phone,
          city:order.city,
          price:order.price.toString()+" Dhs"
        }
      )
    }
  }
}
