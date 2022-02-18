import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF, { CellConfig } from 'jspdf';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/services/order.service';
import { ProductQuantity } from '../product-quantity/product-quantity.component';
import { OrderDocument, OrderDocumentResponse } from 'src/app/model/document';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-order-document',
  templateUrl: './order-document.component.html',
  styleUrls: ['./order-document.component.css']
})
export class OrderDocumentComponent implements OnInit {

  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'phone',
    'city',
    'date'
  ];
  dataSource : MatTableDataSource<Order>;
  selection : SelectionModel<Order>;
  orders: Order[] = [];
  operations: number[] = [];
  data : { [key: string]: string }[] = [];
  orderDocument = new OrderDocument();
  selectedOrders : Order[] = [];
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
  constructor(public dialogRef: MatDialogRef<OrderDocumentComponent>, private orderService: OrderService,
    private _snackBar: MatSnackBar, public datepipe: DatePipe,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.orderService.listOrders().subscribe(
      result => {
        this.orders = result
        .filter(r => r.status.toString() == "EN_ATTENTE");
        this.dataSource = new MatTableDataSource<Order>(this.orders);
        this.selection = new SelectionModel<Order>(true, []);
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
  checkboxLabel(row?: Order): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  uploadDocuments(){
    for(let selected of this.selection.selected){
      this.operations.push(selected.id);
      this.selectedOrders.push(selected)
    }
    this.orderDocument.operations = this.operations;
    this.orderService.saveOrderDocument(this.orderDocument).subscribe(
      result => {
        this.dialogRef.close();
        this.createPage(result,this.selectedOrders);
      },
      error => {
        this.openSnackBarFailure(error);
      }
    )
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
