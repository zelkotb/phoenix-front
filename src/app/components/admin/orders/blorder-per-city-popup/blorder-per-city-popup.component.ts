import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF, { CellConfig } from 'jspdf';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { SnackBarSuccessComponent } from 'src/app/components/common/snack-bar-success/snack-bar-success.component';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-blorder-per-city-popup',
  templateUrl: './blorder-per-city-popup.component.html',
  styleUrls: ['./blorder-per-city-popup.component.css']
})
export class BLOrderPerCityPopupComponent implements OnInit {

  city: string = "";
  cities: City[];
  data : { [key: string]: string }[] = [];
  cellConfig: CellConfig[] = [
    {
      name: "id",
      prompt:"N°",
      align:"center",
      padding:3,
      width:40
    },
    {
      name: "phone",
      prompt:"Téléphone",
      align:"center",
      padding:3,
      width:60
    },          
    {
      name: "city",
      prompt:"Ville",
      align:"center",
      padding:3,
      width:50
    },          
    {
      name: "price",
      prompt:"Prix",
      align:"center",
      padding:3,
      width:50
    }
    ,          
    {
      name: "signature",
      prompt:"Commentaire",
      align:"center",
      padding:3,
      width:55
    }
  ];
  constructor(public dialogRef: MatDialogRef<BLOrderPerCityPopupComponent>,
    private orderService: OrderService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.orderService.listCitiesWithOrderExpidite().subscribe(
      result => {
        this.cities = result.map(city => {let cityObject = new City();cityObject.name=city;return cityObject});
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

  generateDocument(){
    this.orderService.listShippedOrdersByCity(this.city).subscribe(
      result => {
        this.createPage(result);
      },
      error => {
        this.openSnackBarFailure(error);
      }
    )
  }

  createPage(selectedOrders: Order []){
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
    doc.text('INFORMATION DU BON'
    ,130, 70);

    //bon info
    doc.setFont('courier','normal')
    doc.text("Nomber de colis : "+selectedOrders.length
    ,130, 75);
    doc.text("Prix Total : "+selectedOrders.reduce((x,y) => x + y.price,0)+" Dhs"
    ,130, 79);

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
    doc.save('Bon_De_Livraison_N°_'+selectedOrders[0].city+'.pdf');
  }


  getTableList(orders : Order[]){
    this.data = [];
    for(let order of orders){
      this.data.push(
        {
          id:order.id.toString(),
          phone:order.phone,
          city:order.city,
          price:order.price.toString()+" Dhs",
          signature:"      "
        }
      )
    }
  }


}

export class City {
  name: string;
}
