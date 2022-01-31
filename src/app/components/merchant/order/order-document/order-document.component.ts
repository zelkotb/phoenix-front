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
import { OrderDocument } from 'src/app/model/document';
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
      name: "product",
      prompt:"NOM DU PRODUIT",
      align:"center",
      padding:3,
      width:80
    },
    {
      name: "quantityPhoenix",
      prompt:"QUANTITÉ PHOENIX",
      align:"center",
      padding:3,
      width:80
    },          
    {
      name: "quantity",
      prompt:"QUANTITÉ CHEZ LE CLIENT",
      align:"center",
      padding:3,
      width:80
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
        this.createPage(Number(result),this.selectedOrders);
      },
      error => {
        this.openSnackBarFailure(error);
      }
    )
  }

  getTablePerProductList(products : ProductQuantity[]){
    this.data = [];
    for(let product of products){
      this.data.push(
        {
          product:product.product,
          quantity:product.quantity.toString(),
          quantityPhoenix:product.quantityPhoenix.toString(),
        }
      )
    }
  }

  createPage(id: number, selectedOrders: Order []){
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

    for(let order of selectedOrders){
      doc.addImage(img,'png',150, 10, 60, 40);
      //title
      doc.setFont('courier','bold')
      doc.setFontSize(32);
      doc.text('Bon De Livraison',20, 30);

      //separation line
      doc.setLineWidth(0.5);
      doc.line(10, 50, 200, 50);

      doc.setFontSize(11);
      doc.setFont('courier','normal')
      doc.text("Nom Complet : "+order.name,10, 60);
      doc.text("Numèro Téléphone : "+order.phone,10, 64);
      doc.text("Ville : "+order.city,10, 68);
      doc.text("Adresse : "+order.address,10, 72);
      doc.text("Prix : "+order.price+" Dhs",10, 76);
      doc.text("Date de livraison : "+order.date,10, 80);
      doc.text("Fragile : "+this.isOuiOrNon(order.brittle),10, 84);
      doc.text("Ouvrable : "+this.isOuiOrNon(order.open),100, 84);
      doc.text("Commentaire : "+order.comment,10, 88);

      this.getTablePerProductList(order.products);
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
      if(this.orders.indexOf(order) !== this.orders.length-1){
        doc.addPage();
      }
    }

    doc.save('Bon_De_Livraison_N°_'+id+'.pdf');
  }

  isOuiOrNon(value : boolean){
    return value? "Oui":"Non";
  }
}
