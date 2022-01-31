import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarFailureComponent } from 'src/app/components/common/snack-bar-failure/snack-bar-failure.component';
import { ProductService } from 'src/app/services/product.service';
import { Region } from '../../../../model/region';
import { CreateOrder } from '../../../../model/order';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProductQuantity, ProductQuantityComponent } from '../product-quantity/product-quantity.component';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/internal/operators';
import { OrderService } from '../../../../services/order.service';
import { SnackBarSuccessComponent } from 'src/app/components/common/snack-bar-success/snack-bar-success.component';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {

  mode: string = ""
  loading: boolean = false;
  createOrderForm = new FormGroup({
    name: new FormControl('', Validators.required),
    tel: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    city: new FormControl('', Validators.required),
    region: new FormControl(''),
    address: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    brittle: new FormControl(''),
    open: new FormControl(''),
    description: new FormControl(''),
    product: new FormControl('', Validators.required),
  });
    myFilter = (d: Date | null): boolean => {
    const day = d?.getDay();
    const currentDate = new Date();
    let isAfterToday : boolean;
    if(day === 0){
      isAfterToday = d?.getTime() > (currentDate.getTime()+2*86400000);
    }else{
      isAfterToday = d?.getTime() > (currentDate.getTime()+86400000);
    }
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && isAfterToday;
  };
  cities : string [] = [];
  regions : Region [] = [
    {
      name: "Grande Casablanca",
      cities: [
        "Casablanca",
        "Gara"
      ]
    },
    {
      name: "Rabat Salé El Jadida",
      cities: [
        "Rabat",
        "Salé",
        "El Jadida",
      ]
    },
  ];
  products : string [] = [];
  order: CreateOrder = new CreateOrder();
  productQuantity : ProductQuantity[] = [];
  filteredOptions: Observable<string[]>;
  constructor(
    private productService: ProductService,
    private _snackBar: MatSnackBar,
    public datepipe: DatePipe, 
    public dialog: MatDialog,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    for(let region of this.regions){
      for(let city of region.cities){
        this.cities.push(city);
      }
    }
    this.filteredOptions = this.city.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    this.productService.listProducts(undefined).subscribe(
      result => {
        this.products = result.map(p => p.name);
      },
      error => {
        this.openSnackBarFailure(error);
      }
    )
  }

  get name() { return this.createOrderForm.get('name'); }
  get tel() { return this.createOrderForm.get('tel'); }
  get city() { return this.createOrderForm.get('city'); }
  get region() { return this.createOrderForm.get('region'); }
  get address() { return this.createOrderForm.get('address'); }
  get price() { return this.createOrderForm.get('price'); }
  get date() { return this.createOrderForm.get('date'); }
  get brittle() { return this.createOrderForm.get('brittle'); }
  get open() { return this.createOrderForm.get('open'); }
  get description() { return this.createOrderForm.get('description'); }
  get product() { return this.createOrderForm.get('product'); }


  onSubmit() {
    this.mode = "indeterminate";
    this.loading = true;
    this.order.name = this.name.value;
    this.order.phone = this.tel.value;
    this.order.city = this.city.value;
    this.order.address = this.address.value;
    this.order.price = parseFloat(this.price.value.replace(",",".") );
    this.order.date = this.datepipe.transform(this.date.value, 'dd-MM-yyyy HH:mm').toString();
    this.order.brittle = this.brittle.value == '' ? false : this.brittle.value;
    this.order.open = this.open.value == '' ? false : this.open.value;
    this.order.comment = this.description.value;
    if(!this.isCityValid()){
      this.openSnackBarFailure("La livraison vers "+this.order.city+" non autorisé");
      this.loading = false;
      return;
    }
    if(!this.isQuatityProductValid()){
      this.openSnackBarFailure("Vous avez oublié d'ajouter les quantités pour les produits");
      this.loading = false;
    }
    else{
      this.order.products = this.productQuantity;
      this.openConfirmation(this.order);
    }
  }

  changeCities(event: Region){
    this.cities = event.cities;
    if(this.cities.indexOf(this.city.value) === -1){
      this.city.reset();
    }
    this.filteredOptions = this.city.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  isQuatityProductValid(): boolean{
    if(this.productQuantity.length !== this.product.value.length){
      return false;
    }
    for(let productQuantity of this.productQuantity){
      if(productQuantity.quantity === 0 && productQuantity.quantityPhoenix === 0){
        return false
      }
    }
    return true;
  }

  isCityValid(): boolean{
    if(this.cities.indexOf(this.city.value) === -1){
      return false;
    }
    return true;
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

  openDialog(): void {
      for(let pro of this.productQuantity){
        if(this.product.value.indexOf(pro.product) === -1){
          this.productQuantity.splice(this.productQuantity.indexOf(pro),1);
        }
      }
      for(let pro of this.product.value){
        if(this.productQuantity.map(pq => pq.product).indexOf(pro) === -1){
          this.productQuantity.push({
            product: pro,
            quantity: 0,
            quantityPhoenix: 0
          });
        }
      }
    const dialogRef = this.dialog.open(ProductQuantityComponent, {
      width: '750px',
      data: this.productQuantity,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.productQuantity = result
      }
    });
  }

  openConfirmation(order : CreateOrder): void {
    const dialogRef = this.dialog.open(ConfirmOrderComponent, {
      width: '900px',
      data: order,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.orderService.createOrder(order).subscribe(
          result => {
            this.loading = false;
            this.refresh();
            this.openSnackBarSuccess("commande créé avec succès")
          },
          error => {
            this.openSnackBarFailure(error);
            this.loading = false;
          }
        )
      }
    });
    this.loading = false;
  }

  private _filter(value: string): string[] {
    const filterValue = value?.toLowerCase();
    return this.cities.filter(option => option?.toLowerCase().includes(filterValue));
  }

  refresh(){
    this.name.reset();
    this.tel.reset();
    this.city.reset();
    this.address.reset();
    this.price.reset();
    this.date.reset();
    this.brittle.reset();
    this.open.reset();
    this.description.reset();
    this.product.reset();
    this.region.reset();
  }
}
