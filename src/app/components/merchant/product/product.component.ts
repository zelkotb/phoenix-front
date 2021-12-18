import { Component, OnInit, ViewChild } from '@angular/core';
import { HistoriquePhoenixComponent } from '../historique-phoenix/historique-phoenix.component';
import { HistoriqueComponent } from '../historique/historique.component';
import { ProductListPhoenixComponent } from '../product-list-phoenix/product-list-phoenix.component';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor() { }

  @ViewChild(ProductListPhoenixComponent) productListPhoenixComponent;
  @ViewChild(ProductListComponent) productListComponent;
  @ViewChild(HistoriqueComponent) historiqueComponent;
  @ViewChild(HistoriquePhoenixComponent) historiquePhoenixComponent;

  selected : number;

  ngOnInit(): void {
    let index = localStorage.getItem("tabndex");
    if(index){
      this.selected = Number(index);
    }
  }

  saveIndex(event){
    localStorage.setItem("tabndex",event.toString());
    if(event === 0){
      this.productListComponent.refresh();
    }
    if(event === 1){
      this.historiqueComponent.refresh();
    }
    if(event === 2){
      this.productListPhoenixComponent.refresh();
    }
    if(event === 3){
      this.historiquePhoenixComponent.refresh();
    }
  }

}
